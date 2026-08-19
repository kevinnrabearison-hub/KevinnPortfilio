import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import webpush from "web-push";

import {
  initDb,
  getOrCreateVisitor,
  updateVisitorPseudo,
  updateVisitorLastSeen,
  getAllVisitors,
  saveMessage,
  getMessages,
  markMessagesAsRead,
  savePushSubscription,
  getPushSubscriptions,
  removePushSubscription,
} from "./db.js";

// ============================================================
// ENVIRONMENT
// ============================================================

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Frontend Render/Vercel
const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:5173";

// Origines autorisées
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
  "https://kevinn-portfilio.vercel.app",
  frontendUrl,
].filter(Boolean);

// Supprimer les doublons
const uniqueOrigins = [...new Set(allowedOrigins)];

const pushConfigured = Boolean(
  process.env.VAPID_PUBLIC_KEY &&
  process.env.VAPID_PRIVATE_KEY &&
  process.env.VAPID_SUBJECT
);

if (pushConfigured) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

console.log("🌐 Origines CORS autorisées :", uniqueOrigins);

// ============================================================
// CORS
// ============================================================

const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans Origin
    // (tests backend, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (uniqueOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("❌ CORS bloqué pour :", origin);

    return callback(
      new Error(`Origin ${origin} not allowed by CORS`)
    );
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
  ],
};

app.use(cors(corsOptions));

// Preflight
app.options("*", cors(corsOptions));

app.use(express.json());

// ============================================================
// HTTP SERVER
// ============================================================

const server = http.createServer(app);

// ============================================================
// SOCKET.IO
// ============================================================

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (uniqueOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("❌ Socket.IO CORS bloqué :", origin);

      return callback(
        new Error(`Socket origin ${origin} not allowed`)
      );
    },

    methods: ["GET", "POST"],

    credentials: true,
  },

  transports: ["websocket", "polling"],
});

// ============================================================
// ADMIN SOCKETS
// ============================================================

const adminSockets = new Set();

let adminOnline = false;

// ============================================================
// JWT
// ============================================================

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET manquant dans les variables Render");
  }

  return process.env.JWT_SECRET;
};

const verifyAdminToken = (token) => {
  try {
    if (!token) {
      return null;
    }

    return jwt.verify(token, getJwtSecret());
  } catch (err) {
    return null;
  }
};

// ============================================================
// ADMIN STATUS
// ============================================================

const emitAdminStatus = () => {
  const status = {
    isAdminOnline: adminOnline,
  };

  io.emit("admin_status_changed", status);
};

// ============================================================
// VISITORS LIST
// ============================================================

const notifyVisitorsList = async () => {
  if (!adminOnline) {
    return;
  }

  try {
    const visitors = await getAllVisitors();

    io.to("admin_room").emit(
      "visitors_list_updated",
      visitors
    );
  } catch (error) {
    console.error(
      "❌ Erreur notifyVisitorsList:",
      error
    );
  }
};

const notifyVisitorOfAdminReply = async (sessionId, message) => {
  if (!pushConfigured) return;

  const subscriptions = await getPushSubscriptions(sessionId);
  const payload = JSON.stringify({
    title: "Nouvelle réponse de Kevinn",
    body: message.content,
    url: `${frontendUrl}/?chat=open`,
  });

  await Promise.all(subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification(subscription, payload);
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        await removePushSubscription(subscription.endpoint);
      } else {
        console.error("❌ Notification Push impossible:", error.message);
      }
    }
  }));
};

// ============================================================
// ADMIN CONNECT
// ============================================================

const handleAdminConnect = async (socket) => {
  adminSockets.add(socket.id);

  adminOnline = true;

  socket.data.role = "admin";

  socket.join("admin_room");

  socket.emit("admin_auth_success");

  emitAdminStatus();

  await notifyVisitorsList();

  console.log(
    `👑 Admin connecté : ${socket.id}`
  );
};

// ============================================================
// ADMIN DISCONNECT
// ============================================================

const handleAdminDisconnect = () => {
  adminOnline = adminSockets.size > 0;

  emitAdminStatus();
};

// ============================================================
// SOCKET.IO CONNECTION
// ============================================================

io.on("connection", (socket) => {
  console.log(
    `🔌 Socket connecté : ${socket.id}`
  );

  // ==========================================================
  // VISITOR SESSION
  // ==========================================================

  socket.on(
    "join_session",
    async ({ sessionId, pseudo }) => {
      try {
        if (!sessionId) {
          return;
        }

        const visitor = await getOrCreateVisitor(
          sessionId,
          pseudo || "Visiteur"
        );

        if (
          pseudo &&
          visitor.pseudo !== pseudo
        ) {
          await updateVisitorPseudo(
            sessionId,
            pseudo
          );
        }

        await updateVisitorLastSeen(
          sessionId
        );

        socket.data.role = "visitor";
        socket.data.sessionId = sessionId;

        socket.join(
          `session_${sessionId}`
        );

        socket.join("visitor_room");

        const history =
          await getMessages(sessionId);

        socket.emit(
          "session_initialized",
          {
            visitor,
            history,
            isAdminOnline: adminOnline,
          }
        );

        if (adminOnline) {
          emitAdminStatus();
        }

        console.log(
          `👤 Visiteur connecté : ${sessionId}`
        );
      } catch (error) {
        console.error(
          "❌ join_session error:",
          error
        );
      }
    }
  );

  // ==========================================================
  // ADMIN JOIN
  // ==========================================================

  socket.on(
    "admin_join",
    async ({ token }) => {
      try {
        if (!token) {
          socket.emit(
            "admin_auth_error"
          );

          return;
        }

        const payload =
          verifyAdminToken(token);

        if (
          !payload ||
          payload.role !== "admin"
        ) {
          socket.emit(
            "admin_auth_error"
          );

          return;
        }

        await handleAdminConnect(
          socket
        );
      } catch (error) {
        console.error(
          "❌ admin_join error:",
          error
        );

        socket.emit(
          "admin_auth_error"
        );
      }
    }
  );

  // ==========================================================
  // SEND MESSAGE
  // ==========================================================

  socket.on(
    "send_message",
    async (data) => {
      try {
        const {
          sessionId,
          sender,
          content,
          token,
        } = data || {};

        if (
          !sessionId ||
          !sender ||
          !content ||
          !content.trim()
        ) {
          return;
        }

        // ------------------------------------------------------
        // VISITOR MESSAGE
        // ------------------------------------------------------

        if (sender === "visitor") {
          const msg =
            await saveMessage(
              sessionId,
              "visitor",
              content.trim()
            );

          io.to(
            `session_${sessionId}`
          ).emit(
            "receive_message",
            msg
          );

          if (adminOnline) {
            io.to("admin_room").emit(
              "receive_message",
              msg
            );

            await notifyVisitorsList();
          }

          console.log(
            `📨 Message visiteur → ${sessionId}`
          );

          return;
        }

        // ------------------------------------------------------
        // ADMIN MESSAGE
        // ------------------------------------------------------

        if (sender === "admin") {
          const payload =
            verifyAdminToken(token);

          if (
            !payload ||
            payload.role !== "admin"
          ) {
            socket.emit(
              "admin_auth_error"
            );

            return;
          }

          const msg =
            await saveMessage(
              sessionId,
              "admin",
              content.trim()
            );

          io.to(
            `session_${sessionId}`
          ).emit(
            "receive_message",
            msg
          );

          io.to("admin_room").emit(
            "receive_message",
            msg
          );

          await notifyVisitorOfAdminReply(
            sessionId,
            msg
          );

          await notifyVisitorsList();

          console.log(
            `📤 Message admin → ${sessionId}`
          );

          return;
        }
      } catch (error) {
        console.error(
          "❌ send_message error:",
          error
        );
      }
    }
  );

  // ==========================================================
  // TYPING
  // ==========================================================

  socket.on(
    "typing",
    ({
      sessionId,
      sender,
      isTyping,
    }) => {
      try {
        if (!sessionId || !sender) {
          return;
        }

        if (sender === "visitor") {
          io.to("admin_room").emit(
            "visitor_typing",
            {
              sessionId,
              isTyping,
            }
          );
        }

        if (sender === "admin") {
          io.to(
            `session_${sessionId}`
          ).emit(
            "admin_typing",
            {
              isTyping,
            }
          );
        }
      } catch (error) {
        console.error(
          "❌ typing error:",
          error
        );
      }
    }
  );

  // ==========================================================
  // MARK AS READ
  // ==========================================================

  socket.on(
    "mark_as_read",
    async ({
      sessionId,
      role,
    }) => {
      try {
        if (!sessionId || !role) {
          return;
        }

        await markMessagesAsRead(
          sessionId,
          role
        );

        if (adminOnline) {
          await notifyVisitorsList();
        }
      } catch (error) {
        console.error(
          "❌ mark_as_read error:",
          error
        );
      }
    }
  );

  // ==========================================================
  // DISCONNECT
  // ==========================================================

  socket.on("disconnect", () => {
    console.log(
      `🔌 Socket déconnecté : ${socket.id}`
    );

    if (socket.data.role === "admin") {
      adminSockets.delete(
        socket.id
      );

      handleAdminDisconnect();
    }
  });
});

// ============================================================
// ADMIN LOGIN
// ============================================================

app.post(
  "/api/admin/login",
  async (req, res) => {
    try {
      const { password } =
        req.body || {};

      const adminPassword =
        process.env.ADMIN_PASSWORD || "";

      const adminPasswordHash =
        process.env.ADMIN_PASSWORD_HASH ||
        "";

      if (!password) {
        return res.status(400).json({
          success: false,
          error: "Mot de passe requis",
        });
      }

      let valid = false;

      // Hash bcrypt prioritaire
      if (adminPasswordHash) {
        valid = await bcrypt.compare(
          password,
          adminPasswordHash
        );
      } else {
        valid =
          password === adminPassword;
      }

      if (!valid) {
        return res.status(401).json({
          success: false,
          error: "Mot de passe invalide",
        });
      }

      const token = jwt.sign(
        {
          role: "admin",
        },
        getJwtSecret(),
        {
          expiresIn: "7d",
        }
      );

      console.log(
        "✅ Connexion admin réussie"
      );

      return res.json({
        success: true,
        token,
      });
    } catch (error) {
      console.error(
        "❌ POST /api/admin/login:",
        error
      );

      return res.status(500).json({
        success: false,
        error: "Erreur interne",
      });
    }
  }
);

// ============================================================
// WEB PUSH
// ============================================================

app.get("/api/push/public-key", (req, res) => {
  if (!pushConfigured) {
    return res.status(503).json({
      success: false,
      error: "Notifications Push non configurées",
    });
  }

  return res.json({
    success: true,
    publicKey: process.env.VAPID_PUBLIC_KEY,
  });
});

app.post("/api/push/subscribe", async (req, res) => {
  try {
    const { sessionId, subscription } = req.body || {};

    if (!sessionId || !subscription?.endpoint || !subscription?.keys) {
      return res.status(400).json({
        success: false,
        error: "Abonnement Push invalide",
      });
    }

    await getOrCreateVisitor(sessionId);
    await savePushSubscription(sessionId, subscription);

    return res.json({ success: true });
  } catch (error) {
    console.error("❌ POST /api/push/subscribe:", error);
    return res.status(500).json({
      success: false,
      error: "Impossible d'enregistrer les notifications",
    });
  }
});

// ============================================================
// ADMIN VISITORS
// ============================================================

app.get(
  "/api/admin/visitors",
  async (req, res) => {
    try {
      const authHeader =
        req.headers.authorization ||
        "";

      const token =
        authHeader
          .replace(
            /^Bearer\s+/i,
            ""
          )
          .trim();

      const payload =
        verifyAdminToken(token);

      if (
        !payload ||
        payload.role !== "admin"
      ) {
        return res.status(401).json({
          success: false,
          error: "Token invalide",
        });
      }

      const visitors =
        await getAllVisitors();

      return res.json({
        success: true,
        visitors,
      });
    } catch (error) {
      console.error(
        "❌ GET /api/admin/visitors:",
        error
      );

      return res.status(500).json({
        success: false,
        error: "Erreur interne",
      });
    }
  }
);

// ============================================================
// CHAT HISTORY
// ============================================================

app.get(
  "/api/chat/history/:sessionId",
  async (req, res) => {
    try {
      const {
        sessionId,
      } = req.params;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: "SessionId manquant",
        });
      }

      const messages =
        await getMessages(
          sessionId
        );

      return res.json({
        success: true,
        messages,
      });
    } catch (error) {
      console.error(
        "❌ GET /api/chat/history:",
        error
      );

      return res.status(500).json({
        success: false,
        error: "Erreur interne",
      });
    }
  }
);

// ============================================================
// CONTACT
// ============================================================

app.post(
  "/api/contact",
  async (req, res) => {
    try {
      const {
        name,
        email,
        message,
      } = req.body || {};

      if (
        !name ||
        !email ||
        !message
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Tous les champs sont requis",
        });
      }

      const mailOptions = {
        from: `${name} <${email}>`,
        to:
          process.env.EMAIL_USER ||
          process.env.ADMIN_EMAIL ||
          "",
        subject:
          `Nouveau message de contact de ${name}`,
        text:
          `Nom: ${name}\n` +
          `Email: ${email}\n\n` +
          `Message:\n${message}`,
        html:
          `<p><strong>Nom:</strong> ${name}</p>` +
          `<p><strong>Email:</strong> ${email}</p>` +
          `<p><strong>Message:</strong><br/>` +
          `${message.replace(
            /\n/g,
            "<br/>"
          )}</p>`,
      };

      if (!mailOptions.to) {
        console.warn(
          "⚠️ SMTP non configuré"
        );

        return res.json({
          success: true,
          message:
            "Message reçu, mais l’e-mail n’a pas été envoyé car la configuration SMTP est manquante.",
        });
      }

      if (!process.env.EMAIL_PASS) {
        console.warn(
          "⚠️ EMAIL_PASS manquant"
        );

        return res.json({
          success: true,
          message:
            "Message reçu, mais l’e-mail n’a pas été envoyé car la configuration SMTP est incomplète.",
        });
      }

      const transporter =
        nodemailer.createTransport(
          {
            service: "gmail",
            auth: {
              user:
                process.env.EMAIL_USER,
              pass:
                process.env.EMAIL_PASS,
            },
          }
        );

      await transporter.sendMail(
        mailOptions
      );

      return res.json({
        success: true,
        message:
          "Message envoyé avec succès.",
      });
    } catch (error) {
      console.error(
        "❌ POST /api/contact:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          "Impossible d'envoyer le message",
      });
    }
  }
);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Portfolio backend is running",
  });
});

// ============================================================
// START SERVER
// ============================================================

const boot = async () => {
  try {
    console.log(
      "⏳ Initialisation PostgreSQL..."
    );

    await initDb();

    console.log(
      "✅ PostgreSQL initialisé"
    );

    server.listen(
      port,
      "0.0.0.0",
      () => {
        console.log(
          "========================================"
        );

        console.log(
          `🚀 Backend démarré sur le port ${port}`
        );

        console.log(
          `🌐 Frontend principal : ${frontendUrl}`
        );

        console.log(
          `🔐 CORS autorisé : ${uniqueOrigins.join(
            ", "
          )}`
        );

        console.log(
          "========================================"
        );
      }
    );
  } catch (err) {
    console.error(
      "❌ Erreur au démarrage du backend:",
      err
    );

    process.exit(1);
  }
};

boot();