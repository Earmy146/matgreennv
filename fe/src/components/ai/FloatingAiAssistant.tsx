import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bot,
  Loader2,
  MapPin,
  RotateCcw,
  Send,
  Sparkles,
  X,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { aiMaterialsApi } from "@/services/api";
import { useLocationStore } from "@/stores/location.store";
import { useAiAssistantStore } from "@/stores/ai-assistant.store";
import { AiMarkdownText } from "./AiMarkdownText";
import { CATEGORY_LABELS, formatCurrency, formatDistance } from "@/lib/utils";
import type { AiChatMessage } from "@/types/ai.types";

const INITIAL_GREETING: AiChatMessage = {
  role: "assistant",
  content:
    "Xin chào! Mình là **MatGreen AI**. Bạn có thể hỏi mình tìm vật liệu tái sử dụng quanh vị trí GPS, thẩm định giá thanh lý, hoặc tư vấn bốc xếp & tháo dỡ công trình nhé.",
};

const QUICK_CHIPS = [
  "Tìm vật liệu cho tặng 0đ quanh tôi",
  "Trên sàn đang có sắt thép hoặc tôn cũ nào không?",
  "Giá sắt phế liệu và cửa nhôm kính cũ khoảng bao nhiêu?",
];

export const FloatingAiAssistant: React.FC = () => {
  const { pathname } = useLocation();
  const { latitude, longitude, radiusKm } = useLocationStore();
  const {
    isOpen,
    materialContext,
    pendingPrompt,
    openDrawer,
    closeDrawer,
    clearPendingPrompt,
    clearMaterialContext,
  } = useAiAssistantStore();

  const [messages, setMessages] = useState<AiChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Hide floating button on the dedicated AI Advisor page to avoid redundancy
  const isAdvisorPage = pathname === "/ai-advisor";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const nextMessages: AiChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setErrorMsg(null);
    setLoading(true);

    try {
      const apiMessages = nextMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-16)
        .map(({ role, content }) => ({ role, content }));

      const res = await aiMaterialsApi.chatAdvice({
        messages: apiMessages,
        latitude,
        longitude,
        radius_km: radiusKm || 10,
        material_id: materialContext?.materialId || undefined,
        context: materialContext
          ? `Người dùng đang xem trang chi tiết bài đăng "${materialContext.title}" (ID: ${materialContext.materialId}).`
          : `Người dùng đang ở trang ${pathname}.`,
      });

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: res.reply,
          recommended_materials: res.recommended_materials,
          tools_used: res.tools_used,
          model: res.model,
        },
      ]);
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Trợ lý AI tạm thời bận hoặc không kết nối được. Vui lòng thử lại sau.";
      setErrorMsg(detail);
    } finally {
      setLoading(false);
    }
  };

  // Auto-send when triggered with a prefilled prompt (e.g. from MaterialDetailPage)
  useEffect(() => {
    if (isOpen && pendingPrompt && !loading) {
      const prompt = pendingPrompt;
      clearPendingPrompt();
      void sendMessage(prompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, pendingPrompt]);

  if (isAdvisorPage && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => openDrawer()}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-700/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Mở trợ lý MatGreen AI"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Hỏi MatGreen AI</span>
        </button>
      )}

      {/* Drawer Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[min(620px,calc(100vh-5rem))] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold leading-tight flex items-center gap-1.5">
                  <span>MatGreen AI</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    Live
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {latitude && longitude
                    ? `GPS đang bật • Bán kính ${radiusKm} km`
                    : "Bật GPS để AI tìm vật liệu gần bạn"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Cuộc trò chuyện mới"
                onClick={() => {
                  setMessages([INITIAL_GREETING]);
                  setErrorMsg(null);
                  clearMaterialContext();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Đóng"
                onClick={closeDrawer}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Material Context Pill */}
          {materialContext && (
            <div className="px-3.5 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between gap-2 text-xs text-emerald-900 shrink-0">
              <span className="truncate">
                Đang thẩm định: <strong>{materialContext.title}</strong>
              </span>
              <button
                type="button"
                onClick={clearMaterialContext}
                className="text-emerald-700 hover:text-emerald-950 shrink-0"
                title="Bỏ ngữ cảnh bài đăng"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-xs"
                  }`}
                >
                  {m.role === "user" ? (
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  ) : (
                    <AiMarkdownText content={m.content} />
                  )}
                </div>

                {/* Live Recommended Material Cards from Tool Calling */}
                {m.recommended_materials && m.recommended_materials.length > 0 && (
                  <div className="mt-2 w-full max-w-[92%] space-y-1.5">
                    {m.recommended_materials.map((card) => (
                      <Link
                        key={card.id}
                        to={`/materials/${card.id}`}
                        onClick={closeDrawer}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition-all"
                      >
                        {card.image ? (
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-11 h-11 rounded-lg object-cover shrink-0 bg-slate-100"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 text-[10px] font-bold">
                            MG
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 truncate">{card.title}</div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <span
                              className={`font-bold ${
                                card.type === "free" ? "text-emerald-600" : "text-amber-600"
                              }`}
                            >
                              {card.type === "free" ? "0đ (Cho tặng)" : formatCurrency(card.price)}
                            </span>
                            <span>•</span>
                            <span className="truncate">
                              {CATEGORY_LABELS[card.category] || card.category}
                            </span>
                            {card.distance_km !== null && card.distance_km !== undefined && (
                              <>
                                <span>•</span>
                                <span className="inline-flex items-center gap-0.5 text-emerald-700 font-semibold shrink-0">
                                  <MapPin className="w-3 h-3" />
                                  {formatDistance(card.distance_km)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>MatGreen AI đang tra cứu & phân tích...</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Chips */}
          {messages.length <= 2 && !loading && (
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto shrink-0">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => sendMessage(chip)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap font-medium transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage(input);
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi tìm vật liệu, giá thanh lý, vận chuyển..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
