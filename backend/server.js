import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  initDb,
  getOrCreateVisitor,
  updateVisitorPseudo,
  updateVisitorLastSeen,
  getAllVisitors,
  saveMessage,
  getMessages,
  markMessagesAsRead,
} from "./db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    methods: ["GET", "POST"],
  },
});

const adminSockets = new Set();
let adminOnline = false;

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET manquant dans .env");
  }
  return process.env.JWT_SECRET;
};

const verifyAdminToken = (token) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (err) {
    return null;
  }
};

const emitAdminStatus = () => {
  const status = { isAdminOnline: adminOnline };
  io.emit("admin_status_changed", status);
};

const notifyVisitorsList = async () => {
  if (!adminOnline) return;
  const visitors = await getAllVisitors();
  io.to("admin_room").emit("visitors_list_updated", visitors);
};

const handleAdminConnect = async (socket) => {
  adminSockets.add(socket.id);
  adminOnline = true;
  socket.join("admin_room");
  socket.emit("admin_auth_success");
  emitAdminStatus();
  await notifyVisitorsList();
};

const handleAdminDisconnect = () => {
  adminSockets.delete(socket.id);
  adminOnline = adminSockets.size > 0;
  emitAdminStatus();
};

io.on("connection", (socket) => {
  socket.on("join_session", async ({ sessionId, pseudo }) => {
    try {
      if (!sessionId) return;
      const visitor = await getOrCreateVisitor(sessionId, pseudo || "Visiteur");
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
        visitor: visitor,
        history,
        isAdminOnline: adminOnline,
      });

      if (adminOnline) {
        emitAdminStatus();
      }
    } catch (error) {
      console.error("join_session error:", error);
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
      await handleAdminConnect(socket);
    } catch (error) {
      console.error("admin_join error:", error);
      socket.emit("admin_auth_error");
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const { sessionId, sender, content, token } = data || {};
      if (!sessionId || !sender || !content || !content.trim()) return;

      if (sender === "visitor") {
        const msg = await saveMessage(sessionId, sender, content.trim());
        io.to(`session_${sessionId}`).emit("receive_message", msg);
        if (adminOnline) {
          io.to("admin_room").emit("receive_message", msg);
          await notifyVisitorsList();
        }
        return;
      }

      if (sender === "admin") {
        const payload = verifyAdminToken(token);
        if (!payload || payload.role !== "admin") {
          socket.emit("admin_auth_error");
          return;
        }
        const msg = await saveMessage(sessionId, sender, content.trim());
        io.to(`session_${sessionId}`).emit("receive_message", msg);
        io.to("admin_room").emit("receive_message", msg);
        await notifyVisitorsList();
        return;
      }
    } catch (error) {
      console.error("send_message error:", error);
    }
  });

  socket.on("typing", ({ sessionId, sender, isTyping }) => {
    try {
      if (!sessionId || !sender) return;
      if (sender === "visitor") {
        io.to("admin_room").emit("visitor_typing", { sessionId, isTyping });
      }
      if (sender === "admin") {
        io.to(`session_${sessionId}`).emit("admin_typing", { isTyping });
      }
    } catch (error) {
      console.error("typing error:", error);
    }
  });

  socket.on("mark_as_read", async ({ sessionId, role }) => {
    try {
      if (!sessionId || !role) return;
      await markMessagesAsRead(sessionId, role);
      if (adminOnline) await notifyVisitorsList();
    } catch (error) {
      console.error("mark_as_read error:", error);
    }
  });

  socket.on("disconnect", () => {
    if (socket.data.role === "admin") {
      adminSockets.delete(socket.id);
      adminOnline = adminSockets.size > 0;
      emitAdminStatus();
    }
  });
});

app.post("/api/admin/login", async (req, res) => {
  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";

  if (!password) {
    return res.status(400).json({ success: false, error: "Mot de passe requis" });
  }

  let valid = false;
  if (adminPasswordHash) {
    valid = await bcrypt.compare(password, adminPasswordHash);
  } else {
    valid = password === adminPassword;
  }

  if (!valid) {
    return res.status(401).json({ success: false, error: "Mot de passe invalide" });
  }

  const token = jwt.sign({ role: "admin" }, getJwtSecret(), {
    expiresIn: "7d",
  });

  return res.json({ success: true, token });
});

app.get("/api/admin/visitors", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    const payload = verifyAdminToken(token);
    if (!payload || payload.role !== "admin") {
      return res.status(401).json({ success: false, error: "Token invalide" });
    }

    const visitors = await getAllVisitors();
    return res.json({ success: true, visitors });
  } catch (error) {
    console.error("GET /api/admin/visitors error:", error);
    return res.status(500).json({ success: false, error: "Erreur interne" });
  }
});

app.get("/api/chat/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ success: false, error: "SessionId manquant" });
    }
    const messages = await getMessages(sessionId);
    return res.json({ success: true, messages });
  } catch (error) {
    console.error("GET /api/chat/history error:", error);
    return res.status(500).json({ success: false, error: "Erreur interne" });
  }
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "Portfolio backend is running" });
});

const boot = async () => {
  await initDb();

  server.listen(port, "0.0.0.0", () => {
    console.log(`Backend démarré sur le port ${port}`);
    console.log(`Frontend autorisé : ${frontendUrl}`);
  });
};

boot().catch((err) => {
  console.error("Erreur au démarrage du backend:", err);
  process.exit(1);
});