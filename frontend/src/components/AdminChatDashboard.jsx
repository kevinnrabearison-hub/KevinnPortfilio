import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import {
  Users,
  MessageSquare,
  Send,
  LogOut,
  X,
  Search,
  Circle,
  Clock,
  ShieldCheck,
  CheckCheck
} from "lucide-react";

export default function AdminChatDashboard({ fullPage = false }) {
  const {
    isAdminLoggedIn,
    logoutAdmin,
    visitorsList,
    selectedSessionId,
    selectVisitorThread,
    activeAdminMessages,
    sendAdminMessage,
    isVisitorTyping,
    emitTyping,
    fetchVisitorsList
  } = useChat();

  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchVisitorsList();
    }
  }, [isAdminLoggedIn, fetchVisitorsList]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeAdminMessages, isVisitorTyping]);

  if (!isAdminLoggedIn) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedSessionId) return;
    sendAdminMessage(inputMessage);
    setInputMessage("");
    emitTyping(false);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    emitTyping(e.target.value.length > 0);
  };

  const filteredVisitors = visitorsList.filter(
    (v) =>
      v.pseudo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.session_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedVisitor = visitorsList.find((v) => v.session_id === selectedSessionId);

  // Pleine page sur /admin, overlay flottant sinon (non utilisé maintenant)
  const containerClass = fullPage
    ? "w-full h-screen bg-slate-950 flex flex-col overflow-hidden text-slate-100 font-sans"
    : "fixed inset-4 sm:inset-10 z-[90] bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans";

  return (
    <div className={containerClass}>

      {/* TOP HEADER */}
      <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0065a9] to-[#5ab3d5] flex items-center justify-center text-white font-bold shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Tableau de Bord Chat - Kevinn Rabearison
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5ab3d5]/20 text-[#5ab3d5] border border-[#5ab3d5]/30">
                PROPRIÉTAIRE
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Réponds en direct à tous les visiteurs de ton portfolio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              logoutAdmin();
              if (fullPage) window.location.href = "/";
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </div>

      {/* DASHBOARD CONTENT BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: VISITORS LIST */}
        <div className="w-80 sm:w-96 bg-slate-900/60 border-r border-slate-800 flex flex-col">
          {/* SEARCH BAR */}
          <div className="p-4 border-b border-slate-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un visiteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-[#5ab3d5] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* LIST OF VISITORS */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
            {filteredVisitors.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center space-y-2">
                <Users className="w-8 h-8 opacity-40" />
                <p>Aucun visiteur trouvé pour l'instant.</p>
              </div>
            ) : (
              filteredVisitors.map((visitor) => {
                const isSelected = visitor.session_id === selectedSessionId;
                const lastSeenTime = new Date(visitor.last_seen || Date.now()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <button
                    key={visitor.session_id}
                    onClick={() => selectVisitorThread(visitor.session_id)}
                    className={`w-full p-4 flex items-center justify-between text-left transition-all hover:bg-slate-800/50 ${
                      isSelected ? "bg-[#5ab3d5]/10 border-l-4 border-[#5ab3d5]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[#5ab3d5] text-sm">
                          {visitor.pseudo.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-slate-200 truncate">
                          {visitor.pseudo}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {lastSeenTime}
                        </p>
                      </div>
                    </div>

                    {/* Unread badge */}
                    {visitor.unread_admin > 0 && (
                      <span className="bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full flex-shrink-0">
                        {visitor.unread_admin} non-lus
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CONVERSATION THREAD */}
        <div className="flex-1 bg-slate-950 flex flex-col">
          {selectedVisitor ? (
            <>
              {/* THREAD HEADER */}
              <div className="p-4 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#5ab3d5]/20 text-[#5ab3d5] font-bold flex items-center justify-center text-sm border border-[#5ab3d5]/30">
                    {selectedVisitor.pseudo.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">
                      Discussion avec {selectedVisitor.pseudo}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono">
                      ID Session : {selectedVisitor.session_id}
                    </p>
                  </div>
                </div>
              </div>

              {/* MESSAGES LOG */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {activeAdminMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                    Aucun message échangé pour le moment.
                  </div>
                ) : (
                  activeAdminMessages.map((msg, index) => {
                    const isAdmin = msg.sender === "admin";
                    const timeStr = new Date(msg.created_at || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={msg.id || index}
                        className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-end gap-2 max-w-[75%]">
                          {!isAdmin && (
                            <div className="w-7 h-7 rounded-full bg-slate-800 text-[#5ab3d5] font-bold text-xs flex items-center justify-center border border-slate-700 flex-shrink-0 mb-1">
                              {selectedVisitor.pseudo.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed break-words shadow-lg ${
                              isAdmin
                                ? "bg-gradient-to-r from-[#0065a9] to-[#0098ff] text-white font-medium rounded-br-none"
                                : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700"
                            }`}
                          >
                            <p>{msg.content}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 px-1 flex items-center gap-1">
                          {timeStr} {isAdmin && <CheckCheck className="w-3 h-3 text-[#5ab3d5]" />}
                        </span>
                      </div>
                    );
                  })
                )}

                {/* Visitor Typing status */}
                {isVisitorTyping && (
                  <div className="flex items-center gap-2 text-xs text-[#5ab3d5] italic bg-[#5ab3d5]/10 p-2.5 rounded-xl w-fit border border-[#5ab3d5]/20 animate-pulse">
                    <span>{selectedVisitor.pseudo} est en train d'écrire...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* INPUT FORM FOR ADMIN */}
              <form
                onSubmit={handleSend}
                className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center gap-3"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={handleInputChange}
                  placeholder={`Répondre à ${selectedVisitor.pseudo}...`}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-[#5ab3d5] rounded-xl px-4 py-3 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-5 py-3 bg-gradient-to-r from-[#0065a9] via-[#0098ff] to-[#5ab3d5] hover:opacity-90 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl text-xs transition-all shadow-lg flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Envoyer
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 space-y-3">
              <MessageSquare className="w-12 h-12 opacity-30 text-[#5ab3d5]" />
              <p className="text-sm font-medium text-slate-300">Sélectionne un visiteur à gauche</p>
              <p className="text-xs text-slate-500 max-w-xs text-center">
                Clique sur n'importe quel visiteur pour consulter sa conversation et lui répondre en temps réel.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
