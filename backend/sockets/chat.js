export const registerChatSocketHandlers = ({
  io,
  adminSockets,
  verifyAdminToken,
  getOrCreateVisitor,
  updateVisitorPseudo,
  updateVisitorLastSeen,
  getMessages,
  saveMessage,
  markMessagesAsRead,
  isAdminOnline,
  emitAdminStatus,
  notifyVisitorsList,
  notifyVisitorOfAdminReply,
}) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connecté : ${socket.id}`);

    socket.on("join_session", async ({ sessionId, pseudo }) => {
      try {
        if (!sessionId) return;

        const visitor = await getOrCreateVisitor(
          sessionId,
          pseudo || "Visiteur"
        );

        if (pseudo && visitor.pseudo !== pseudo) {
          await updateVisitorPseudo(sessionId, pseudo);
        }

        await updateVisitorLastSeen(sessionId);

        socket.data.role = "visitor";
        socket.data.sessionId = sessionId;
        socket.join(`session_${sessionId}`);
        socket.join("visitor_room");

        const history = await getMessages(sessionId);

        socket.emit("session_initialized", {
          visitor,
          history,
          isAdminOnline: isAdminOnline(),
        });

        if (isAdminOnline()) {
          emitAdminStatus();
        }

        console.log(`👤 Visiteur connecté : ${sessionId}`);
      } catch (error) {
        console.error("❌ join_session error:", error);
      }
    });

    socket.on("admin_join", async ({ token }) => {
      try {
        if (!token) {
          socket.emit("admin_auth_error");
          return;
        }

        const payload = verifyAdminToken(token);
        if (!payload || payload.role !== "admin") {
          socket.emit("admin_auth_error");
          return;
        }

        adminSockets.add(socket.id);
        socket.data.role = "admin";
        socket.join("admin_room");
        socket.emit("admin_auth_success");
        emitAdminStatus();
        await notifyVisitorsList();

        console.log(`👑 Admin connecté : ${socket.id}`);
      } catch (error) {
        console.error("❌ admin_join error:", error);
        socket.emit("admin_auth_error");
      }
    });

    socket.on("send_message", async (data) => {
      try {
        const { sessionId, sender, content, token } = data || {};

        if (!sessionId || !sender || !content || !content.trim()) {
          return;
        }

        if (sender === "visitor") {
          if (
            socket.data.role !== "visitor" ||
            socket.data.sessionId !== sessionId
          ) {
            return;
          }

          const msg = await saveMessage(
            socket.data.sessionId,
            "visitor",
            content.trim()
          );

          io.to(`session_${socket.data.sessionId}`).emit("receive_message", msg);

          if (isAdminOnline()) {
            io.to("admin_room").emit("receive_message", msg);
            await notifyVisitorsList();
          }

          console.log(`📨 Message visiteur → ${sessionId}`);
          return;
        }

        if (sender === "admin") {
          const payload = verifyAdminToken(token);
          if (!payload || payload.role !== "admin") {
            socket.emit("admin_auth_error");
            return;
          }

          const msg = await saveMessage(sessionId, "admin", content.trim());
          io.to(`session_${sessionId}`).emit("receive_message", msg);
          io.to("admin_room").emit("receive_message", msg);
          await notifyVisitorOfAdminReply(sessionId, msg);
          await notifyVisitorsList();

          console.log(`📤 Message admin → ${sessionId}`);
        }
      } catch (error) {
        console.error("❌ send_message error:", error);
      }
    });

    socket.on("typing", ({ sessionId, sender, isTyping }) => {
      try {
        if (!sessionId || !sender) return;

        if (socket.data.role === "visitor") {
          if (
            sender !== "visitor" ||
            socket.data.sessionId !== sessionId
          ) {
            return;
          }

          io.to("admin_room").emit("visitor_typing", {
            sessionId: socket.data.sessionId,
            isTyping,
          });
        }

        if (socket.data.role === "admin" && sender === "admin") {
          io.to(`session_${sessionId}`).emit("admin_typing", { isTyping });
        }
      } catch (error) {
        console.error("❌ typing error:", error);
      }
    });

    socket.on("mark_as_read", async ({ sessionId }) => {
      try {
        if (!sessionId) return;

        let readerRole;
        let authorizedSessionId;

        if (socket.data.role === "visitor") {
          if (socket.data.sessionId !== sessionId) return;
          readerRole = "visitor";
          authorizedSessionId = socket.data.sessionId;
        } else if (socket.data.role === "admin") {
          readerRole = "admin";
          authorizedSessionId = sessionId;
        } else {
          return;
        }

        await markMessagesAsRead(authorizedSessionId, readerRole);
        if (isAdminOnline()) await notifyVisitorsList();
      } catch (error) {
        console.error("❌ mark_as_read error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Socket déconnecté : ${socket.id}`);

      if (socket.data.role === "admin") {
        adminSockets.delete(socket.id);
        emitAdminStatus();
      }
    });
  });
};
