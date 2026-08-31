import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import webpush from "web-push";
import { createAdminRouter } from "./routes/admin.js";
import { createContactRouter } from "./routes/contact.js";
import { createPublicRouter } from "./routes/public.js";
import { registerChatSocketHandlers } from "./sockets/chat.js";
import { createChatServices } from "./sockets/services.js";
import {
  verifyAdminToken,
  signAdminToken,
  escapeHtml,
  sanitizeHeaderValue,
} from "./security.js";

import {
  initDb,
  getOrCreateVisitor,
  updateVisitorPseudo,
  updateVisitorLastSeen,
  getAllVisitors,
  getVisitorCount,
  saveMessage,
  getMessages,
  markMessagesAsRead,
  savePushSubscription,
  getPushSubscriptions,
  removePushSubscription,
  purgeExpiredData,
} from "./db.js";

// ============================================================
// ENVIRONMENT
// ============================================================

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", 1);

// ============================================================
// KEEP-ALIVE: Éviter les cold starts Render gratuit
// ============================================================
const startKeepalive = () => {
  // Ping interne toutes les 14 min (avant le timeout Render ~15min)
  setInterval(() => {
    fetch(`http://localhost:${port}/api/health`)
      .catch(() => {}); // Ignore les erreurs
  }, 14 * 60 * 1000);

  console.log("⏰ Keep-alive activé pour Render gratuit");
};

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: "Trop de tentatives. Réessayez plus tard.",
  },
});

const visitorCountLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,  // Augmenté de 30 à 60 pour meilleure UX
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Trop de requêtes. Réessayez plus tard.",
  },
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,  // Augmenté de 5 à 10 pour meilleure UX
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Trop de messages. Réessayez plus tard.",
  },
});

const mailTransporter =
  process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    : null;

let publicVisitorCountCache = {
  value: null,
  expiresAt: 0,
  cacheTTL: 5 * 60 * 1000,  // Cache 5 minutes au lieu de instant expiry
};

const localOrigins = process.env.NODE_ENV === "production"
  ? []
  : [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:4173",
    ];

const frontendUrl = process.env.FRONTEND_URL || "";

const allowedOrigins = [
  ...localOrigins,
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
  origin: true, // Accepter TOUTES les origines (temporaire - à restreindre plus tard)
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

app.use(express.json({ limit: "10kb" }));

// ============================================================
// HTTP SERVER
// ============================================================

const server = http.createServer(app);

// ============================================================
// SOCKET.IO
// ============================================================

const io = new Server(server, {
  cors: {
    origin: true, // Accepter TOUTES les origines (temporaire)
    methods: ["GET", "POST"],
    credentials: true,
  },

  transports: ["websocket", "polling"],
});

const chatServices = createChatServices({
  io,
  getAllVisitors,
  getPushSubscriptions,
  removePushSubscription,
  webpush,
  pushConfigured,
  frontendUrl,
});

const {
  adminSockets,
  isAdminOnline,
  emitAdminStatus,
  notifyVisitorsList,
  notifyVisitorOfAdminReply,
} = chatServices;

registerChatSocketHandlers({
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
});

app.use(
  "/api",
  createAdminRouter({
    bcrypt,
    signAdminToken,
    verifyAdminToken,
    getAllVisitors,
    getMessages,
    loginLimiter: adminLoginLimiter,
  })
);

app.use(
  "/api",
  createPublicRouter({
    pushConfigured,
    visitorCountLimiter,
    getVisitorCount,
    getOrCreateVisitor,
    savePushSubscription,
    publicVisitorCountCache,
  })
);

app.use(
  "/api",
  createContactRouter({
    contactLimiter,
    mailTransporter,
    escapeHtml,
    sanitizeHeaderValue,
  })
);

// ============================================================
// HEALTH CHECK & KEEP-ALIVE
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Portfolio backend is running",
  });
});

// Route pour keep-alive (invisible, pas de logs)
app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
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

    await purgeExpiredData();

    // Purge quotidienne
    const retentionInterval = setInterval(() => {
      purgeExpiredData().catch((error) => {
        console.error("❌ Purge des données expirées:", error);
      });
    }, 24 * 60 * 60 * 1000);
    retentionInterval.unref?.();

    // Keep-alive pour Render gratuit
    startKeepalive();

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