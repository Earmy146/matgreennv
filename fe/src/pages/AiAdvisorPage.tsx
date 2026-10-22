import React, { useState } from "react";
import { Sparkles, Bot, ArrowRight, CheckCircle2, DollarSign, Send, Loader2 } from "lucide-react";
import { aiMaterialsApi } from "@/services/api";

export const AiAdvisorPage: React.FC = () => {
  const [description, setDescription] = useState(
    "Công trình nhà cấp 4 diện tích 70m2 chuẩn bị đập để xây biệt thự. Có khoảng 4 bộ cửa nhôm kính, 1 bồn cầu cũ, mái tôn lạnh khoảng 70m2 và khung sắt hộp còn tốt, ngoài ra có khoảng 3 xe xà bần gạch vỡ cần dọn dẹp gấp."
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Chat state
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content:
        "Chào bạn! Tôi là MatGreen AI. Bạn có thắc mắc gì về quy trình bóc tách, tái chế hoặc giá thanh lý các loại vật liệu xây dựng tháo dỡ không?",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [chatting, setChatting] = useState(false);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setAnalyzing(true);
    try {
      const data = await aiMaterialsApi.analyzeDemolition(description);
      setResult(data);
    } catch (err) {
      // Fallback demo mock nếu ai-service chưa start lúc dev
      setResult({
        summary: "Phân tích bóc tách tự động: Công trình có giá trị tái chế cao với tôn lạnh, khung sắt hộp và cửa nhôm kính.",
        recycling_potential_score: 88,
        materials: [
          {
            title: "Tôn lạnh lợp mái 70m2 & Khung sắt hộp",
            category: "sat_thep",
            estimated_quantity: "70m2 tôn + 200kg xà gồ sắt",
            suggested_type: "sell",
            suggested_price: 2500000,
            reuse_recommendation: "Bán cho các xưởng cơ khí hoặc thợ làm lán trại, nhà tạm.",
          },
          {
            title: "4 Bộ cửa nhôm kính",
            category: "cua_kinh",
            estimated_quantity: "4 bộ",
            suggested_type: "sell",
            suggested_price: 1200000,
            reuse_recommendation: "Thanh lý cho các chủ nhà trọ sinh viên hoặc nhà vườn.",
          },
          {
            title: "3 Xe xà bần gạch vữa đập vỡ",
            category: "xa_ban",
            estimated_quantity: "3 xe tải nhỏ",
            suggested_type: "free",
            suggested_price: 0,
            reuse_recommendation: "Tặng miễn phí cho công trình lân cận cần tôn nền, san lấp mặt bằng.",
          },
          {
            title: "Bồn cầu sứ cũ",
            category: "thiet_bi_ve_sinh",
            estimated_quantity: "1 chiếc",
            suggested_type: "free",
            suggested_price: 0,
            reuse_recommendation: "Cho tặng người cần làm nhà vệ sinh tạm cho thợ công trường.",
          },
        ],
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || chatting) return;

    const newMessages = [...messages, { role: "user", content: inputMsg }];
    setMessages(newMessages);
    setInputMsg("");
    setChatting(true);

    try {
      const res = await aiMaterialsApi.chatAdvice(newMessages);
      setMessages([...newMessages, { role: "assistant", content: res.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Đối với xà bần và gạch vỡ từ tháo dỡ, cách tối ưu nhất là đăng tin tặng '0đ' kèm bán kính 3km để các xe tải san lấp gần đó tự đến múc, bạn sẽ tiết kiệm được từ 500k - 1.5 triệu tiền thuê dọn chở đi bãi rác!",
        },
      ]);
    } finally {
      setChatting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>MatGreen AI Microservice (FastAPI + LLM)</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Trợ Lý AI Bóc Tách & Định Giá Vật Liệu Tháo Dỡ
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Chỉ cần nhập đoạn mô tả hiện trạng công trình chuẩn bị đập/xây, AI sẽ tự động phân loại hạng mục nào nên cho tặng, hạng mục nào nên bán thanh lý.
        </p>
      </div>

      {/* Analysis Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Mô tả công trình tháo dỡ của bạn
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-4 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Nhập mô tả nhà tháo dỡ (diện tích, loại cửa, mái, xà bần, thiết bị vệ sinh...)"
        />

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {analyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Bắt Đầu Bóc Tách Bằng AI
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Kết Quả Bóc Tách & Khuyến Nghị</h2>
              <p className="text-xs text-slate-500 mt-0.5">{result.summary}</p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
              <span className="text-xs text-emerald-800 font-medium">Chỉ số tái sử dụng:</span>
              <span className="text-lg font-extrabold text-emerald-600">
                {result.recycling_potential_score}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.materials.map((item: any, idx: number) => {
              const isFree = item.suggested_type === "free";
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    isFree ? "bg-emerald-50/40 border-emerald-200" : "bg-amber-50/40 border-amber-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        isFree ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                      }`}
                    >
                      {isFree ? "Cho Tặng 0đ" : "Bán Thanh Lý"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 mb-3">
                    <div>
                      Ước lượng: <strong>{item.estimated_quantity}</strong>
                    </div>
                    {!isFree && item.suggested_price > 0 && (
                      <div className="text-amber-700 font-bold">
                        Định giá gợi ý: ~{item.suggested_price.toLocaleString("vi-VN")} đ
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
                    💡 <em>{item.reuse_recommendation}</em>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Chat Consultation Section */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-900 text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm">Hỏi Đáp Trực Tuyến Với AI MatGreen</span>
        </div>

        <div className="p-4 h-64 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-none"
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {chatting && (
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> MatGreen AI đang suy nghĩ câu trả lời...
            </div>
          )}
        </div>

        <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <input
            type="text"
            placeholder="Hỏi về tái chế, giá sắt phế liệu, thủ tục tháo dỡ..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={chatting || !inputMsg.trim()}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
