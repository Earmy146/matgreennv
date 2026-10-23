import React, { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, MessageSquare, Paperclip, Send, User, X } from "lucide-react";
import { chatApi, uploadApi, type ChatAttachment, type ChatConversation, type ChatMessage } from "@/services/api";
import { useAuthStore } from "@/stores/auth.store";

const PAGE_SIZE = 30;

function getSocketUrl() {
  const configuredApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (configuredApiUrl?.startsWith("http")) {
    return configuredApiUrl.replace(/\/api\/?$/, "");
  }
  return window.location.origin;
}

function isCurrentConversation(message: ChatMessage, userId: string, partnerId: string, materialId?: string) {
  const isBetweenUsers =
    (message.sender._id === userId && message.receiver._id === partnerId) ||
    (message.sender._id === partnerId && message.receiver._id === userId);
  return isBetweenUsers && (!materialId || message.material === materialId);
}

export const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const partnerId = searchParams.get("partnerId");
  const materialId = searchParams.get("materialId") || undefined;
  const { user, token } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<ChatAttachment | null>(null);
  const [uploading, setUploading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(Boolean(partnerId));
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const shouldScrollToBottom = useRef(true);

  const appendMessage = useCallback((message: ChatMessage) => {
    if (!user?.id || !partnerId || !isCurrentConversation(message, user.id, partnerId, materialId)) return;
    setMessages((current) => (current.some((item) => item._id === message._id) ? current : [...current, message]));
    shouldScrollToBottom.current = true;
  }, [materialId, partnerId, user?.id]);

  useEffect(() => {
    if (partnerId || !token) return;
    chatApi.getConversations().then(setConversations).catch(() => setError("Không thể tải danh sách cuộc trò chuyện."));
  }, [partnerId, token]);

  useEffect(() => {
    if (!partnerId || !user?.id || !token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    chatApi.getMessages({ partnerId, materialId, page: 1, limit: PAGE_SIZE })
      .then((result) => {
        if (cancelled) return;
        setMessages(result.items);
        setHasMore(result.pagination.hasMore);
        setPage(1);
        shouldScrollToBottom.current = true;
        return chatApi.markRead({ partnerId, materialId });
      })
      .catch(() => {
        if (!cancelled) setError("Không thể tải lịch sử trò chuyện.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [materialId, partnerId, token, user?.id]);

  useEffect(() => {
    if (!partnerId || !token) return;
    const socket = io(getSocketUrl(), { auth: { token }, transports: ["websocket"] });
    socketRef.current = socket;
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setConnected(false));
    socket.on("new_message", appendMessage);
    socket.on("message_sent", appendMessage);
    socket.on("typing", (data: { senderId: string; materialId?: string; isTyping: boolean }) => {
      if (data.senderId === partnerId && data.materialId === materialId) setTyping(data.isTyping);
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [appendMessage, partnerId, token]);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    if (shouldScrollToBottom.current) {
      container.scrollTop = container.scrollHeight;
      shouldScrollToBottom.current = false;
    }
  }, [messages]);

  const loadOlderMessages = async () => {
    const container = messagesRef.current;
    if (!partnerId || !container || loadingOlder || !hasMore) return;
    setLoadingOlder(true);
    const previousHeight = container.scrollHeight;
    try {
      const result = await chatApi.getMessages({ partnerId, materialId, page: page + 1, limit: PAGE_SIZE });
      setMessages((current) => [...result.items.filter((item) => !current.some((old) => old._id === item._id)), ...current]);
      setPage((current) => current + 1);
      setHasMore(result.pagination.hasMore);
      requestAnimationFrame(() => {
        container.scrollTop += container.scrollHeight - previousHeight;
      });
    } catch {
      setError("Không thể tải thêm tin nhắn cũ.");
    } finally {
      setLoadingOlder(false);
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (event.currentTarget.scrollTop <= 80) void loadOlderMessages();
  };

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = input.trim();
    if (!partnerId || !user?.id || sending || (!content && !attachment)) return;
    setSending(true);
    setError(null);
    try {
      const payload = { receiverId: partnerId, materialId, content, attachments: attachment ? [attachment] : [] };
      if (socketRef.current?.connected) {
        socketRef.current.emit("send_message", payload);
      } else {
        appendMessage(await chatApi.sendMessage(payload));
      }
      setInput("");
      setAttachment(null);
    } catch {
      setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (value: string) => {
    setInput(value);
    if (!partnerId || !socketRef.current?.connected) return;
    socketRef.current.emit("typing", { receiverId: partnerId, materialId, isTyping: Boolean(value.trim()) });
  };

  const handleAttachment = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      setAttachment(await uploadApi.uploadAttachment(file));
    } catch {
      setError("Không thể tải file lên. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  if (!partnerId) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h1 className="font-black text-slate-900">Tin nhắn</h1>
            <p className="text-xs text-slate-500 mt-1">Trao đổi trực tiếp với bên cho hoặc bên nhận vật liệu.</p>
          </div>
          {conversations.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <MessageSquare className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="text-sm">Chưa có cuộc trò chuyện nào.</p>
            </div>
          ) : conversations.map((conversation) => (
            <Link
              key={conversation.partner._id}
              to={`/chat?partnerId=${conversation.partner._id}${conversation.materialId ? `&materialId=${conversation.materialId}` : ""}`}
              className="flex items-center gap-3 p-4 border-b border-slate-100 hover:bg-slate-50"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                {conversation.partner.avatar ? <img src={conversation.partner.avatar} alt="" className="w-10 h-10 rounded-full object-cover" /> : conversation.partner.name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <span className="font-bold text-sm text-slate-800 truncate">{conversation.partner.name}</span>
                  <span className="text-[10px] text-slate-400">{new Date(conversation.lastMessage.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-1">{conversation.lastMessage.content}</p>
              </div>
              {conversation.unreadCount > 0 && <span className="min-w-5 h-5 px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">{conversation.unreadCount}</span>}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const partner = messages.find((message) => message.sender._id === partnerId)?.sender
    || messages.find((message) => message.receiver._id === partnerId)?.receiver;

  return (
    <div className="max-w-3xl mx-auto py-2">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[min(700px,calc(100vh-140px))]">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
              {partner?.avatar ? <img src={partner.avatar} alt="" className="w-10 h-10 rounded-full object-cover" /> : <User className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm truncate">{partner?.name || "Cuộc trò chuyện"}</div>
              <div className="text-xs text-emerald-400">{connected ? "Đang trực tuyến" : "Đang kết nối lại..."}</div>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full ${connected ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-300"}`}>
            {connected ? "Realtime" : "Ngoại tuyến"}
          </span>
        </div>

        <div ref={messagesRef} onScroll={handleScroll} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {loadingOlder && <div className="flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-emerald-600" /></div>}
          {loading ? (
            <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>
          ) : messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">Chưa có tin nhắn. Hãy bắt đầu trao đổi.</div>
          ) : messages.map((message) => {
            const isMe = message.sender._id === user?.id;
            return (
              <div key={message._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm ${isMe ? "bg-emerald-600 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs"}`}>
                  {message.content && <p className="whitespace-pre-wrap break-words">{message.content}</p>}
                  {message.attachments?.map((file) => (
                    file.mimetype.startsWith("image/")
                      ? <a key={file.url} href={file.url} target="_blank" rel="noreferrer"><img src={file.url} alt={file.name} className="max-w-full max-h-48 rounded-lg mt-1 object-contain" /></a>
                      : <a key={file.url} href={file.url} target="_blank" rel="noreferrer" className="block mt-1 underline break-all">{file.name}</a>
                  ))}
                  <span className={`block text-[10px] mt-1 text-right ${isMe ? "text-emerald-200" : "text-slate-400"}`}>
                    {new Date(message.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {error && <div className="px-4 py-2 text-xs text-rose-700 bg-rose-50 border-t border-rose-100">{error}</div>}
        {typing && <div className="px-4 py-1 text-[11px] text-slate-400 bg-white">Đối tác đang nhập...</div>}
        {attachment && <div className="px-3 py-2 bg-emerald-50 text-xs flex items-center gap-2"><span className="truncate flex-1">{attachment.name}</span><button type="button" onClick={() => setAttachment(null)}><X className="w-4 h-4" /></button></div>}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <label className="p-2.5 rounded-xl border border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-50">
            <Paperclip className="w-4 h-4" />
            <input type="file" accept="image/*,.pdf,.txt,.zip" className="hidden" onChange={(event) => handleAttachment(event.target.files?.[0])} disabled={uploading} />
          </label>
          <input
            type="text"
            maxLength={2000}
            placeholder="Nhập tin nhắn trao đổi về vật liệu, thời gian bốc vác..."
            value={input}
            onChange={(event) => handleTyping(event.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button type="submit" disabled={sending || uploading || (!input.trim() && !attachment)} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-50">
            {sending || uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
