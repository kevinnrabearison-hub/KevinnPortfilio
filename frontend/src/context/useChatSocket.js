import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useChatSocket = ({
  backendUrl,
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
}) => {
  const callbacksRef = useRef({
    fetchVisitorsListWithToken,
    logoutAdmin,
    playNotificationSound,
  });

  useEffect(() => {
    callbacksRef.current = {
      fetchVisitorsListWithToken,
      logoutAdmin,
      playNotificationSound,
    };
  }, [fetchVisitorsListWithToken, logoutAdmin, playNotificationSound]);

  useEffect(() => {
    if (!isOpen && !adminToken) {
      setSocket(null);
      return undefined;
    }

    const newSocket = io(backendUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join_session", {
        sessionId,
        pseudo: pseudoRef.current,
      });

      if (adminTokenRef.current) {
        newSocket.emit("admin_join", { token: adminTokenRef.current });
      }
    });

    newSocket.on("session_initialized", ({ visitor, history, isAdminOnline }) => {
      setMessages(history || []);
      setIsAdminOnline(isAdminOnline);
      if (visitor && visitor.unread_visitor) {
        setUnreadCount(visitor.unread_visitor);
      }
    });

    newSocket.on("receive_message", (msg) => {
      if (msg.session_id === sessionId) {
        setMessages((prev) => {
          if (msg.id && prev.some((item) => item.id === msg.id)) return prev;
          return [...prev, msg];
        });
        if (msg.sender === "admin" && !isOpenRef.current) {
          setUnreadCount((prev) => prev + 1);
          callbacksRef.current.playNotificationSound();
        }
      }

      if (
        selectedSessionIdRef.current &&
        msg.session_id === selectedSessionIdRef.current
      ) {
        setActiveAdminMessages((prev) => {
          if (msg.id && prev.some((item) => item.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }

      if (adminTokenRef.current) {
        callbacksRef.current.fetchVisitorsListWithToken(adminTokenRef.current);
      }
    });

    newSocket.on("admin_status_changed", ({ isAdminOnline }) => {
      setIsAdminOnline(isAdminOnline);
    });

    newSocket.on("admin_typing", ({ isTyping }) => {
      setIsAdminTyping(isTyping);
    });

    newSocket.on("admin_auth_success", () => {
      setIsAdminLoggedIn(true);
      if (adminTokenRef.current) {
        callbacksRef.current.fetchVisitorsListWithToken(adminTokenRef.current);
      }
    });

    newSocket.on("admin_auth_error", () => {
      callbacksRef.current.logoutAdmin();
    });

    newSocket.on("visitors_list_updated", (updatedList) => {
      setVisitorsList(updatedList);
    });

    newSocket.on("visitor_typing", ({ sessionId: typingSessionId, isTyping }) => {
      if (selectedSessionIdRef.current === typingSessionId) {
        setIsVisitorTyping(isTyping);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [
    backendUrl,
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
  ]);
};
