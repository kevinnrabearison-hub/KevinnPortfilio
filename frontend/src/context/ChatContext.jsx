import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const ChatContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (
  window.location.hostname === "localhost" ? "http://localhost:5000" : window.location.origin
);

export const ChatProvider = ({ children }) => {
  // Visitor Session Identification
  const [sessionId] = useState(() => {
    let id = localStorage.getItem("kevinn_chat_session_id");
    if (!id) {
      id = "visitor_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem("kevinn_chat_session_id", id);
    }
    return id;
  });

  const [pseudo, setPseudoState] = useState(() => {
    return localStorage.getItem("kevinn_chat_pseudo") || "Visiteur";
  });

  const setPseudo = (newPseudo) => {
    localStorage.setItem("kevinn_chat_pseudo", newPseudo);
    setPseudoState(newPseudo);
  };

  // Socket & Chat States
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);

  // Admin States
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("kevinn_admin_token") || null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem("kevinn_admin_token"));
  const [visitorsList, setVisitorsList] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [activeAdminMessages, setActiveAdminMessages] = useState([]);
  const [isVisitorTyping, setIsVisitorTyping] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Refs to read latest state inside socket callbacks (avoids stale closures)
  const selectedSessionIdRef = useRef(null);
  const isOpenRef = useRef(false);
  const adminTokenRef = useRef(adminToken);

  useEffect(() => { selectedSessionIdRef.current = selectedSessionId; }, [selectedSessionId]);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);
  useEffect(() => { adminTokenRef.current = adminToken; }, [adminToken]);

  // ─── Initialize Socket ONCE ────────────────────────────────────────────────
  useEffect(() => {
    const newSocket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
    });

    setSocket(newSocket);

    // Join visitor session
    newSocket.emit("join_session", { sessionId, pseudo });

    // Session Initialized
    newSocket.on("session_initialized", ({ visitor, history, isAdminOnline }) => {
      setMessages(history || []);
      setIsAdminOnline(isAdminOnline);
      if (visitor && visitor.unread_visitor) {
        setUnreadCount(visitor.unread_visitor);
      }
    });

    // ── SINGLE receive_message handler — handles both visitor and admin sides ──
    newSocket.on("receive_message", (msg) => {
      // Visitor side: append to visitor thread if session matches
      if (msg.session_id === sessionId) {
        setMessages((prev) => {
          // Deduplicate by id
          if (msg.id && prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        if (msg.sender === "admin" && !isOpenRef.current) {
          setUnreadCount((prev) => prev + 1);
          playNotificationSound();
        }
      }

      // Admin side: append to active conversation thread
      if (selectedSessionIdRef.current && msg.session_id === selectedSessionIdRef.current) {
        setActiveAdminMessages((prev) => {
          if (msg.id && prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }

      // Refresh admin visitors list
      if (adminTokenRef.current) {
        fetchVisitorsListWithToken(adminTokenRef.current);
      }
    });

    // Admin Status Changed
    newSocket.on("admin_status_changed", ({ isAdminOnline }) => {
      setIsAdminOnline(isAdminOnline);
    });

    // Typing (visitor side — admin is typing)
    newSocket.on("admin_typing", ({ isTyping }) => {
      setIsAdminTyping(isTyping);
    });

    // Admin auth results
    newSocket.on("admin_auth_success", () => {
      setIsAdminLoggedIn(true);
      if (adminTokenRef.current) {
        fetchVisitorsListWithToken(adminTokenRef.current);
      }
    });

    newSocket.on("admin_auth_error", () => {
      logoutAdmin();
    });

    // Visitors list pushed from server
    newSocket.on("visitors_list_updated", (updatedList) => {
      setVisitorsList(updatedList);
    });

    // Visitor typing (admin side)
    newSocket.on("visitor_typing", ({ sessionId: typingSessionId, isTyping }) => {
      if (selectedSessionIdRef.current === typingSessionId) {
        setIsVisitorTyping(isTyping);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps — runs once on mount

  // ─── Join admin room exactly once when token becomes available ────────────
  useEffect(() => {
    if (!socket || !adminToken) return;
    socket.emit("admin_join", { token: adminToken });
  }, [socket, adminToken]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const fetchVisitorsListWithToken = async (token) => {
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/visitors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setVisitorsList(data.visitors);
    } catch (err) {
      console.error("Erreur récupération visiteurs:", err);
    }
  };

  const fetchVisitorsList = () => fetchVisitorsListWithToken(adminTokenRef.current);

  const selectVisitorThread = async (sessId) => {
    setSelectedSessionId(sessId);
    selectedSessionIdRef.current = sessId;
    try {
      const res = await fetch(`${BACKEND_URL}/api/chat/history/${sessId}`);
      const data = await res.json();
      if (data.success) setActiveAdminMessages(data.messages);
      if (socket) socket.emit("mark_as_read", { sessionId: sessId, role: "admin" });
    } catch (err) {
      console.error("Erreur chargement messages:", err);
    }
  };

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio autoplay restriction
    }
  };

  const sendMessage = (content) => {
    if (!socket || !content.trim()) return;
    socket.emit("send_message", { sessionId, sender: "visitor", content });
  };

  const sendAdminMessage = (content) => {
    if (!socket || !selectedSessionId || !content.trim() || !adminToken) return;
    socket.emit("send_message", {
      sessionId: selectedSessionId,
      sender: "admin",
      content,
      token: adminToken
    });
  };

  const emitTyping = (isTyping) => {
    if (!socket) return;
    if (isAdminLoggedIn && selectedSessionId) {
      socket.emit("typing", { sessionId: selectedSessionId, sender: "admin", isTyping });
    } else {
      socket.emit("typing", { sessionId, sender: "visitor", isTyping });
    }
  };

  const toggleChat = () => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState && socket) {
        setUnreadCount(0);
        socket.emit("mark_as_read", { sessionId, role: "visitor" });
      }
      return nextState;
    });
  };

  // ─── Admin login — sets token, useEffect above emits admin_join once ──────
  const loginAdmin = async (password) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("kevinn_admin_token", data.token);
        setAdminToken(data.token); // triggers useEffect → single admin_join emit
        setIsAdminLoggedIn(true);
        return { success: true };
      }
      return { success: false, error: data.error || "Mot de passe erroné" };
    } catch (err) {
      return { success: false, error: "Impossible de joindre le serveur." };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem("kevinn_admin_token");
    setAdminToken(null);
    setIsAdminLoggedIn(false);
  };

  return (
    <ChatContext.Provider
      value={{
        sessionId, pseudo, setPseudo,
        messages, sendMessage,
        isOpen, toggleChat, setIsOpen,
        unreadCount, isAdminOnline, isAdminTyping, emitTyping,
        adminToken, isAdminLoggedIn, loginAdmin, logoutAdmin,
        visitorsList, fetchVisitorsList,
        selectedSessionId, selectVisitorThread,
        activeAdminMessages, sendAdminMessage,
        isVisitorTyping,
        showAdminModal, setShowAdminModal
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
