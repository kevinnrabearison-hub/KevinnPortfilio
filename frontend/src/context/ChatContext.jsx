import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  fetchVisitors,
  fetchChatHistory,
  loginAdminRequest,
} from "./chatApi";
import { useChatSocket } from "./useChatSocket";
import {
  getOrCreateSessionId,
  getStoredPseudo,
  storePseudo,
  getStoredAdminToken,
  storeAdminToken,
  clearStoredAdminToken,
} from "./chatStorage";

const ChatContext = createContext();

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const ChatProvider = ({ children }) => {
  // Visitor Session Identification
  const [sessionId] = useState(getOrCreateSessionId);

  const [pseudo, setPseudoState] = useState(getStoredPseudo);

  const setPseudo = (newPseudo) => {
    storePseudo(newPseudo);
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
  const [adminToken, setAdminToken] = useState(getStoredAdminToken);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!getStoredAdminToken());
  const [visitorsList, setVisitorsList] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [activeAdminMessages, setActiveAdminMessages] = useState([]);
  const [isVisitorTyping, setIsVisitorTyping] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Refs to read latest state inside socket callbacks (avoids stale closures)
  const selectedSessionIdRef = useRef(null);
  const isOpenRef = useRef(false);
  const adminTokenRef = useRef(adminToken);
  const pseudoRef = useRef(pseudo);

  useEffect(() => { selectedSessionIdRef.current = selectedSessionId; }, [selectedSessionId]);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);
  useEffect(() => { adminTokenRef.current = adminToken; }, [adminToken]);
  useEffect(() => { pseudoRef.current = pseudo; }, [pseudo]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("chat") === "open") {
      setIsOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const fetchVisitorsListWithToken = useCallback(async (token) => {
    if (!token) return;
    try {
      const data = await fetchVisitors(BACKEND_URL, token);
      if (data.success) setVisitorsList(data.visitors);
    } catch (err) {
      console.error("Erreur récupération visiteurs:", err);
    }
  }, []);

  const fetchVisitorsList = useCallback(
    () => fetchVisitorsListWithToken(adminTokenRef.current),
    [fetchVisitorsListWithToken]
  );

  const selectVisitorThread = async (sessId) => {
    setSelectedSessionId(sessId);
    selectedSessionIdRef.current = sessId;
    try {
      const data = await fetchChatHistory(
        BACKEND_URL,
        sessId,
        adminTokenRef.current
      );
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
    } catch {
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
      const data = await loginAdminRequest(BACKEND_URL, password);
      if (data.success) {
        storeAdminToken(data.token);
        setAdminToken(data.token); // triggers useEffect → single admin_join emit
        setIsAdminLoggedIn(true);
        return { success: true };
      }
      return { success: false, error: data.error || "Mot de passe erroné" };
    } catch {
      return { success: false, error: "Impossible de joindre le serveur." };
    }
  };

  const logoutAdmin = () => {
    clearStoredAdminToken();
    setAdminToken(null);
    setIsAdminLoggedIn(false);
  };

  useChatSocket({
    backendUrl: BACKEND_URL,
    sessionId,
    pseudoRef,
    isOpen,
    adminToken,
    selectedSessionIdRef,
    isOpenRef,
    adminTokenRef,
    setSocket,
    setMessages,
    setIsAdminOnline,
    setUnreadCount,
    setActiveAdminMessages,
    setIsAdminLoggedIn,
    setVisitorsList,
    setIsAdminTyping,
    setIsVisitorTyping,
    fetchVisitorsListWithToken,
    logoutAdmin,
    playNotificationSound,
  });

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
