import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, User, MessageSquare } from "lucide-react";

export const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const partnerId = searchParams.get("partnerId") || "default-partner";

  const [messages, setMessages] = useState([
    {
      sender: "partner",
      text: "Chào bạn, vật liệu thép và xà bần bên mình vẫn còn nhé. Bạn có xe đến tự chở được không?",
      time: "10:15",
    },
    {
      sender: "me",
      text: "Dạ em có xe ba gác ạ, chiều nay tầm 2h em qua bốc được không anh?",
      time: "10:17",
    },
    {
      sender: "partner",
      text: "Được em nhé, đến số 45 ngõ 12 Đội Cấn thì alo anh mở cổng cho xe vào ngõ.",
      time: "10:18",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        sender: "me",
        text: input,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInput("");
  };

  return (
    <div className="max-w-3xl mx-auto py-2">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">Anh Nam (Chủ nhà A)</div>
              <div className="text-xs text-emerald-400">Đang trao đổi về: Thép phi cũ & Xà bần</div>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-emerald-300">
            Realtime Socket.IO
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m, idx) => {
            const isMe = m.sender === "me";
            return (
              <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm ${
                    isMe
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs"
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      isMe ? "text-emerald-200" : "text-slate-400"
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <input
            type="text"
            placeholder="Nhập tin nhắn trao đổi về vật liệu, thời gian bốc vác..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
