from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger("matgreen.ai.proxy_llm")


class ProxyLLMError(RuntimeError):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.body = message
        super().__init__(f"Proxy LLM returned {status_code}: {message[:600]}")


@dataclass
class ToolCallItem:
    id: str
    name: str
    arguments: str
    extra_content: dict[str, Any] | None = None

    def to_openai_dict(self) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "id": self.id,
            "type": "function",
            "function": {"name": self.name, "arguments": self.arguments},
        }
        if self.extra_content:
            payload["extra_content"] = self.extra_content
        return payload


@dataclass
class CompletionResult:
    content: str | None
    tool_calls: list[ToolCallItem]
    model: str | None
    usage: dict[str, int]
    finish_reason: str | None = None


class CLIProxyClient:
    """
    Async OpenAI-compatible client targeting local VPS CLIProxyAPI (cli-proxy-public).
    Supports text completions, JSON outputs, function/tool calling, and multimodal vision.
    """

    def is_chat_configured(self) -> bool:
        return bool(
            settings.effective_chat_proxy_base_url
            and settings.effective_chat_proxy_api_key
        )

    def is_vision_configured(self) -> bool:
        return bool(
            settings.effective_vision_proxy_base_url
            and settings.effective_vision_proxy_api_key
        )

    async def _post_completion(
        self,
        *,
        base_url: str,
        api_key: str,
        model: str,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
        temperature: float = 0.4,
        max_tokens: int = 2048,
        timeout_seconds: float = 45.0,
        json_mode: bool = False,
    ) -> CompletionResult:
        if not base_url or not api_key:
            raise ProxyLLMError(
                503,
                "Dịch vụ AI chưa được cấu hình khóa kết nối cli-proxy-public.",
            )

        endpoint = f"{base_url.rstrip('/')}/chat/completions"
        body: dict[str, Any] = {
            "model": model.removeprefix("models/"),
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if tools:
            body["tools"] = tools
            body["tool_choice"] = "auto"
        if json_mode and not tools:
            body["response_format"] = {"type": "json_object"}

        try:
            async with httpx.AsyncClient(timeout=max(5.0, float(timeout_seconds))) as client:
                response = await client.post(
                    endpoint,
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json",
                    },
                    json=body,
                )
        except httpx.TimeoutException as exc:
            raise ProxyLLMError(504, "AI proxy phản hồi quá chậm (timeout).") from exc
        except httpx.HTTPError as exc:
            raise ProxyLLMError(503, f"Không thể kết nối cli-proxy-public: {exc}") from exc

        if response.status_code >= 400:
            raise ProxyLLMError(response.status_code, response.text)

        try:
            payload = response.json()
        except ValueError as exc:
            raise ProxyLLMError(502, "CLIProxyAPI trả về JSON không hợp lệ.") from exc

        choices = payload.get("choices") or []
        if not choices:
            raise ProxyLLMError(502, "CLIProxyAPI không trả về câu trả lời nào.")

        choice = choices[0]
        msg = choice.get("message") or {}

        parsed_tool_calls: list[ToolCallItem] = []
        for idx, tc in enumerate(msg.get("tool_calls") or []):
            fn = tc.get("function") or {}
            name = fn.get("name")
            if not isinstance(name, str) or not name:
                continue
            args = fn.get("arguments", "{}")
            if not isinstance(args, str):
                args = json.dumps(args, ensure_ascii=False)
            extra = tc.get("extra_content") if isinstance(tc.get("extra_content"), dict) else None
            parsed_tool_calls.append(
                ToolCallItem(
                    id=str(tc.get("id") or f"call_{idx + 1}"),
                    name=name,
                    arguments=args,
                    extra_content=extra,
                )
            )

        raw_usage = payload.get("usage") or {}
        usage: dict[str, int] = {}
        for k in ("prompt_tokens", "completion_tokens", "total_tokens"):
            val = raw_usage.get(k)
            if isinstance(val, int) and val >= 0:
                usage[k] = val

        content = msg.get("content")
        if isinstance(content, list):
            # Handle OpenAI-style structured content arrays if returned by proxy
            content = "".join(
                part.get("text", "")
                for part in content
                if isinstance(part, dict) and isinstance(part.get("text"), str)
            )

        return CompletionResult(
            content=content if isinstance(content, str) else None,
            tool_calls=parsed_tool_calls,
            model=payload.get("model") or model,
            usage=usage,
            finish_reason=choice.get("finish_reason"),
        )

    async def chat_completion(
        self,
        *,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
        temperature: float = 0.4,
        max_tokens: int | None = None,
        json_mode: bool = False,
        operation: str = "chat",
    ) -> CompletionResult:
        models_to_try = [settings.ai_chat_model]
        if (
            settings.ai_fallback_model
            and settings.ai_fallback_model.strip()
            and settings.ai_fallback_model.strip() != settings.ai_chat_model.strip()
        ):
            models_to_try.append(settings.ai_fallback_model.strip())

        last_err: Exception | None = None
        for idx, model in enumerate(models_to_try):
            try:
                result = await self._post_completion(
                    base_url=settings.effective_chat_proxy_base_url,
                    api_key=settings.effective_chat_proxy_api_key,
                    model=model,
                    messages=messages,
                    tools=tools,
                    temperature=temperature,
                    max_tokens=max_tokens or settings.chat_max_completion_tokens,
                    timeout_seconds=settings.ai_chat_timeout_seconds,
                    json_mode=json_mode,
                )
                logger.info(
                    "ai_proxy_chat_ok operation=%s model=%s prompt_tokens=%s completion_tokens=%s",
                    operation,
                    result.model,
                    result.usage.get("prompt_tokens"),
                    result.usage.get("completion_tokens"),
                )
                return result
            except ProxyLLMError as exc:
                last_err = exc
                # Retry with fallback model on rate-limit, transient 5xx, or unsupported response_format
                if idx + 1 < len(models_to_try) and exc.status_code in {400, 429, 500, 502, 503, 504}:
                    logger.warning(
                        "ai_proxy_fallback operation=%s failed_model=%s status=%s next_model=%s",
                        operation,
                        model,
                        exc.status_code,
                        models_to_try[idx + 1],
                    )
                    continue
                raise

        if last_err:
            raise last_err
        raise ProxyLLMError(503, "Không có model AI khả dụng.")

    async def vision_completion(
        self,
        *,
        messages: list[dict[str, Any]],
        temperature: float = 0.2,
        max_tokens: int = 2400,
        operation: str = "vision",
    ) -> CompletionResult:
        result = await self._post_completion(
            base_url=settings.effective_vision_proxy_base_url,
            api_key=settings.effective_vision_proxy_api_key,
            model=settings.ai_vision_model,
            messages=messages,
            tools=None,
            temperature=temperature,
            max_tokens=max_tokens,
            timeout_seconds=settings.ai_vision_timeout_seconds,
            json_mode=False,
        )
        logger.info(
            "ai_proxy_vision_ok operation=%s model=%s prompt_tokens=%s completion_tokens=%s",
            operation,
            result.model,
            result.usage.get("prompt_tokens"),
            result.usage.get("completion_tokens"),
        )
        return result

    async def probe_proxy(self) -> tuple[bool, str]:
        """Lightweight reachability check against CLIProxyAPI /v1/models."""
        if not self.is_chat_configured():
            return False, "missing_api_key"
        endpoint = f"{settings.effective_chat_proxy_base_url}/models"
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(
                    endpoint,
                    headers={"Authorization": f"Bearer {settings.effective_chat_proxy_api_key}"},
                )
            if res.status_code < 400:
                return True, "connected"
            return False, f"http_{res.status_code}"
        except Exception as exc:
            return False, f"unreachable:{type(exc).__name__}"


proxy_llm = CLIProxyClient()
