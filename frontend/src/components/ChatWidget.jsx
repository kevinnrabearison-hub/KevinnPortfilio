import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { MessageSquare, X, Send, User, Sparkles, Circle, ShieldCheck, Edit3, Check } from "lucide-react";

export default function ChatWidget() {
  const {
    isOpen,
    toggleChat,
    unreadCount,
    messages,
    sendMessage,
    isAdminOnline,
    isAdminTyping,
    emitTyping,
    pseudo,
    setPseudo,
    setShowAdminModal
  } = useChat();

  const [inputMessage, setInputMessage] = useState("");
  const [isEditingPseudo, setIsEditingPseudo] = useState(false);
  const [tempPseudo, setTempPseudo] = useState(pseudo);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isAdminTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage("");
    emitTyping(false);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    emitTyping(e.target.value.length > 0);
  };

  const handleSavePseudo = (e) => {
    e.preventDefault();
    if (tempPseudo.trim()) {
      setPseudo(tempPseudo.trim());
    }
    setIsEditingPseudo(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* --- FLOATING CHAT BUTTON --- */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="relative group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20 backdrop-blur-md"
          title="Discuter en direct avec Kevinn"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-white" />
            <span
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                isAdminOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-400"
              }`}
            />
          </div>
          <span className="font-medium text-sm hidden sm:inline-block">
            {isAdminOnline ? "Chat Direct (En Ligne)" : "Laisser un Message"}
          </span>

          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce shadow-lg">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* --- EXPANDABLE CHAT WINDOW --- */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 text-slate-100">
          {/* HEADER */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[2px] shadow-md">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-blue-400">
                    KR
                  </div>
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                    isAdminOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                  }`}
                />
              </div>

              <div>
                <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                  Kevinn Rabearison
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Circle
                    className={`w-2 h-2 fill-current ${
                      isAdminOnline ? "text-emerald-400" : "text-slate-500"
                    }`}
                  />
                  {isAdminOnline ? "En ligne - Répond en direct" : "Hors ligne (Répondra sous peu)"}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowAdminModal(true)}
                className="p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-amber-400 transition-colors"
                title="Accès Propriétaire (Admin)"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
              <button
                onClick={toggleChat}
                className="p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PSEUDO BAR */}
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/50 flex items-center justify-between text-xs text-slate-400">
            {isEditingPseudo ? (
              <form onSubmit={handleSavePseudo} className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={tempPseudo}
                  onChange={(e) => setTempPseudo(e.target.value)}
                  className="bg-slate-800 text-slate-200 px-2 py-1 rounded text-xs outline-none border border-blue-500/50 w-full"
                  placeholder="Ton prénom / pseudo"
                  autoFocus
                />
                <button type="submit" className="text-emerald-400 hover:text-emerald-300 p-1">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <>
                <span className="flex items-center gap-1.5 truncate">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Connecté en tant que : <strong className="text-slate-200">{pseudo}</strong>
                </span>
                <button
                  onClick={() => setIsEditingPseudo(true)}
                  className="text-slate-400 hover:text-blue-400 flex items-center gap-1 hover:underline"
                >
                  <Edit3 className="w-3 h-3" /> Modifier
                </button>
              </>
            )}
          </div>

          {/* MESSAGES FEED */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400 mb-1 border border-blue-500/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-200">Bienvenue sur mon Portfolio !</p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Pose-moi une question sur mes projets, mes compétences ou mes disponibilités. Je te réponds instantanément.
                </p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isVisitor = msg.sender === "visitor";
                const dateStr = new Date(msg.created_at || Date.now()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={msg.id || index}
                    className={`flex flex-col ${isVisitor ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-end gap-2 max-w-[85%]">
                      {!isVisitor && (
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mb-1">
                          KR
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed break-words shadow-md ${
                          isVisitor
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none border border-blue-400/20"
                            : "bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/60"
                        }`}
                      >
                        <p>{msg.content}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{dateStr}</span>
                  </div>
                );
              })
            )}

            {/* TYPING INDICATOR */}
            {isAdminTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic bg-slate-800/40 p-2 rounded-xl w-fit border border-slate-700/30 animate-pulse">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  KR
                </div>
                <span>Kevinn est en train d'écrire...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Écris ton message ici..."
              className="flex-1 bg-slate-900 border border-slate-700/80 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all shadow-md flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
