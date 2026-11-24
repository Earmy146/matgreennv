from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # CLIProxyAPI (local VPS cli-proxy-public via Docker network cliproxyapi_default)
    ai_proxy_base_url: str = "http://cli-proxy-public:8317/v1"
    ai_proxy_api_key: str = ""
    ai_chat_model: str = "gemini-3.1-flash-lite"
    ai_fallback_model: str = "gemini-3-flash"
    ai_chat_timeout_seconds: int = 45

    # Vision model (defaults to AI_PROXY_BASE_URL / AI_PROXY_API_KEY when unset)
    ai_vision_proxy_base_url: str = ""
    ai_vision_proxy_api_key: str = ""
    ai_vision_model: str = "gemini-3-flash"
    ai_vision_timeout_seconds: int = 90

    # Backend & Security
    backend_base_url: str = "http://backend:5000"
    jwt_secret: str = "matgreen_dev_secret_key_1234567890"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173,https://matgreen.vercel.app"
    request_timeout_seconds: int = 20

    # Redis & Rate limiting
    redis_url: str | None = None
    rate_limit_key_prefix: str = "matgreen:ai"
    max_requests_per_minute: int = 12
    max_daily_requests_user: int = 50
    max_requests_per_minute_guest: int = 4
    max_daily_requests_guest: int = 5
    max_global_requests_per_minute: int = 120
    ai_unlimited_roles: str = "admin,moderator,superadmin"

    # Tool calling & completion budgets
    max_tool_rounds: int = 6
    max_total_tool_calls: int = 15
    max_history_messages: int = 20
    chat_max_completion_tokens: int = 4096

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def effective_vision_proxy_base_url(self) -> str:
        return (self.ai_vision_proxy_base_url or self.ai_proxy_base_url).strip().rstrip("/")

    @property
    def effective_vision_proxy_api_key(self) -> str:
        return (self.ai_vision_proxy_api_key or self.ai_proxy_api_key).strip()

    @property
    def effective_chat_proxy_base_url(self) -> str:
        return self.ai_proxy_base_url.strip().rstrip("/")

    @property
    def effective_chat_proxy_api_key(self) -> str:
        return self.ai_proxy_api_key.strip()

    @property
    def unlimited_role_set(self) -> set[str]:
        return {
            r.strip().lower()
            for r in self.ai_unlimited_roles.replace(";", ",").split(",")
            if r.strip()
        }


settings = Settings()
