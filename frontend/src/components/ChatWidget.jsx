import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { MessageSquare, X, Send, User, Sparkles, Circle, ShieldCheck, Edit3, Check, Mail, Github, Linkedin, Facebook } from "lucide-react";

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
  // floating button position and dragging refs
  const [btnPos, setBtnPos] = useState(null); // { x, y }
  const draggingRef = useRef(false);
  const dragOriginRef = useRef({ startX: 0, startY: 0, initX: 0, initY: 0, pointerType: null });

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isAdminTyping]);

  // load saved button position
  useEffect(() => {
    try {
      const raw = localStorage.getItem("chatFloatingBtnPos");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.x === "number" && typeof parsed.y === "number") {
          setBtnPos(parsed);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // global move / end handlers for mouse and touch while dragging
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - dragOriginRef.current.startX;
      const dy = e.clientY - dragOriginRef.current.startY;
      const newX = dragOriginRef.current.initX + dx;
      const newY = dragOriginRef.current.initY + dy;
      setBtnPos(clampPosition(newX, newY));
    };

    const onMouseUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      try {
        localStorage.setItem("chatFloatingBtnPos", JSON.stringify(btnPos || { x: 0, y: 0 }));
      } catch {
        // Ignore localStorage failures.
      }
    };

    const onTouchMove = (e) => {
      if (!draggingRef.current) return;
      const t = e.touches[0];
      const dx = t.clientX - dragOriginRef.current.startX;
      const dy = t.clientY - dragOriginRef.current.startY;
      const newX = dragOriginRef.current.initX + dx;
      const newY = dragOriginRef.current.initY + dy;
      setBtnPos(clampPosition(newX, newY));
      e.preventDefault();
    };

    const onTouchEnd = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      try {
        localStorage.setItem("chatFloatingBtnPos", JSON.stringify(btnPos || { x: 0, y: 0 }));
      } catch {
        // Ignore localStorage failures.
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [btnPos]);

  const clampPosition = (x, y) => {
    const padding = 8;
    const maxX = window.innerWidth - 80 - padding; // button width approx 80
    const maxY = window.innerHeight - 56 - padding; // button height approx 56
    return { x: Math.max(padding, Math.min(maxX, x)), y: Math.max(padding, Math.min(maxY, y)) };
  };

  const startDragWithMouse = (e) => {
    // start only on right-click (button === 2)
    if (e.button !== 2) return;
    e.preventDefault();
    draggingRef.current = true;
    dragOriginRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: btnPos ? btnPos.x : window.innerWidth - 24 - 120,
      initY: btnPos ? btnPos.y : window.innerHeight - 24 - 56,
      pointerType: "mouse",
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const startDragWithTouch = (e) => {
    const t = e.touches[0];
    draggingRef.current = true;
    dragOriginRef.current = {
      startX: t.clientX,
      startY: t.clientY,
      initX: btnPos ? btnPos.x : window.innerWidth - 24 - 120,
      initY: btnPos ? btnPos.y : window.innerHeight - 24 - 56,
      pointerType: "touch",
    };
  };

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
        <div
          style={
            btnPos
              ? { position: "fixed", left: btnPos.x, top: btnPos.y, zIndex: 60 }
              : { position: "fixed", right: 24, bottom: 24, zIndex: 60 }
          }
        >
          <button
            onClick={toggleChat}
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={startDragWithMouse}
            onTouchStart={startDragWithTouch}
            className="relative group flex items-center gap-3 px-4.5 py-3 bg-slate-900/90 hover:bg-slate-950/95 text-white rounded-2xl shadow-[0_0_25px_rgba(90,179,213,0.35)] transition-all duration-300 transform hover:scale-105 active:scale-95 border border-[#5ab3d5]/40 hover:border-[#5ab3d5] backdrop-blur-xl cursor-pointer select-none font-mono"
            title="Discuter en direct avec Kevinn (Glisser pour déplacer)"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0065a9] via-[#0098ff] to-[#5ab3d5] text-white shadow-md p-1.5">
              <MessageSquare className="w-5 h-5" />
              <span
                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950 ${isAdminOnline ? "bg-emerald-400 animate-pulse" : "bg-[#5ab3d5]"
                  }`}
              />
            </div>

            <span className="font-bold text-xs text-slate-100 hidden sm:inline-block font-mono">
              Laisser un message
            </span>

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce shadow-xl font-mono">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* --- EXPANDABLE CHAT WINDOW --- */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 text-slate-100">
          {/* HEADER */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-[#1f3864]/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0065a9] to-[#5ab3d5] p-[2px] shadow-md">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                    <img
                      src="/bas.png"
                      alt="Profile"
                      className="w-full h-full object-cover object-center rounded-full block"
                    />
                  </div>
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${isAdminOnline ? "bg-[#5ab3d5] animate-pulse" : "bg-slate-500"
                    }`}
                />
              </div>

              <div>
                <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                  Kevinn Rabearison

                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Circle
                    className={`w-2 h-2 fill-current ${isAdminOnline ? "text-[#5ab3d5]" : "text-slate-500"
                      }`}
                  />
                  {isAdminOnline ? "En ligne" : "Hors ligne "}
                </p>
              </div>
            </div>

            {/* Header Actions & Social Redirection Links */}
            <div className="flex items-center gap-1">
              <a
                href="mailto:kevinnrabearison@gmail.com"
                target="_blank"
                rel="noreferrer"
                title="Gmail"
                className="p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-[#5ab3d5] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/kevinnrabearison-hub"
                target="_blank"
                rel="noreferrer"
                title="GitHub"
                className="p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-[#0098ff] transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                title="Facebook"
                className="p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-[#5ab3d5] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
                className="p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-[#0098ff] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <div className="w-[1px] h-4 bg-slate-800 mx-1" />

              <button
                onClick={() => setShowAdminModal(true)}
                className="p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-[#5ab3d5] transition-colors"
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
                  className="bg-slate-800 text-slate-200 px-2 py-1 rounded text-xs outline-none border border-[#5ab3d5]/50 w-full"
                  placeholder="Ton prénom / pseudo"
                  autoFocus
                />
                <button type="submit" className="text-[#5ab3d5] hover:text-[#0098ff] p-1">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <>
                <span className="flex items-center gap-1.5 truncate">
                  <User className="w-3.5 h-3.5 text-[#5ab3d5]" />
                  Connecté en tant que : <strong className="text-slate-200">{pseudo}</strong>
                </span>
                <button
                  onClick={() => setIsEditingPseudo(true)}
                  className="text-slate-400 hover:text-[#5ab3d5] flex items-center gap-1 hover:underline"
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
                <div className="w-12 h-12 rounded-full bg-[#5ab3d5]/10 flex items-center justify-center text-[#5ab3d5] mb-1 border border-[#5ab3d5]/20">
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
                        <div className="w-7 h-7 rounded-full bg-[#0065a9] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mb-1">
                          KR
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed break-words shadow-md ${isVisitor
                          ? "bg-gradient-to-r from-[#0065a9] to-[#0098ff] text-white rounded-br-none border border-[#5ab3d5]/20"
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
                <div className="w-6 h-6 rounded-full bg-[#0065a9] text-white flex items-center justify-center font-bold text-[10px]">
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
              className="flex-1 bg-slate-900 border border-slate-700/80 focus:border-[#5ab3d5] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 bg-gradient-to-r from-[#0065a9] to-[#5ab3d5] hover:opacity-90 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all shadow-md flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
