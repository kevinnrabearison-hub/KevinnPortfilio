import pg from "pg";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";

dotenv.config();

const { Pool } = pg;

let pool = null;
let usePg = false;

const dataFilePath = path.resolve(path.dirname(new URL(import.meta.url).pathname), "data.json");

// In-memory fallback if PostgreSQL is not connected locally
const memoryStore = {
  visitors: new Map(), // sessionId -> { session_id, pseudo, created_at, last_seen, unread_admin, unread_visitor }
  messages: new Map(), // sessionId -> Array of { id, session_id, sender, content, created_at, is_read }
  messageIdCounter: 1
};

const saveMemoryStore = async () => {
  try {
    const data = {
      visitors: Array.from(memoryStore.visitors.entries()),
      messages: Array.from(memoryStore.messages.entries()),
      messageIdCounter: memoryStore.messageIdCounter,
    };
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("Impossible de sauvegarder les données en mémoire sur disque:", err.message);
  }
};

const loadMemoryStore = async () => {
  try {
    const raw = await fs.readFile(dataFilePath, "utf8");
    const data = JSON.parse(raw);
    memoryStore.visitors = new Map(data.visitors || []);
    memoryStore.messages = new Map(data.messages || []);
    memoryStore.messageIdCounter = data.messageIdCounter || 1;
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.warn("Impossible de charger les données en mémoire depuis le disque:", err.message);
    }
  }
};

export async function initDb() {
  if (process.env.DATABASE_URL) {
    try {
      const isProduction = process.env.NODE_ENV === "production";
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction || process.env.DATABASE_URL.includes("render.com") || process.env.DATABASE_URL.includes("neon.tech") || process.env.DATABASE_URL.includes("supabase")
          ? { rejectUnauthorized: false }
          : false,
      });

      // Test connection
      await pool.query("SELECT NOW()");
      usePg = true;
      console.log(" Connecté avec succès à la base de données PostgreSQL !");

      // Create tables if they don't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS visitors (
          session_id VARCHAR(100) PRIMARY KEY,
          pseudo VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          unread_admin INTEGER DEFAULT 0,
          unread_visitor INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(100) REFERENCES visitors(session_id) ON DELETE CASCADE,
          sender VARCHAR(20) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_read BOOLEAN DEFAULT FALSE
        );
      `);
      console.log(" Tables PostgreSQL 'visitors' et 'messages' prêtes.");
    } catch (err) {
      console.warn(" Impossible de se connecter à PostgreSQL (DATABASE_URL fourni mais échoué). Bascule vers le stockage en mémoire.", err.message);
      usePg = false;
      await loadMemoryStore();
    }
  } else {
    console.log("ℹ️ Aucune variable DATABASE_URL détectée. Utilisation du stockage temporaire en mémoire.");
    usePg = false;
    await loadMemoryStore();
  }
}

export async function getOrCreateVisitor(sessionId, defaultPseudo = "Visiteur") {
  if (usePg) {
    const res = await pool.query("SELECT * FROM visitors WHERE session_id = $1", [sessionId]);
    if (res.rows.length > 0) {
      return res.rows[0];
    }
    const insertRes = await pool.query(
      "INSERT INTO visitors (session_id, pseudo, created_at, last_seen, unread_admin, unread_visitor) VALUES ($1, $2, NOW(), NOW(), 0, 0) RETURNING *",
      [sessionId, defaultPseudo]
    );
    return insertRes.rows[0];
  } else {
    if (memoryStore.visitors.has(sessionId)) {
      return memoryStore.visitors.get(sessionId);
    }
    const visitor = {
      session_id: sessionId,
      pseudo: defaultPseudo,
      created_at: new Date(),
      last_seen: new Date(),
      unread_admin: 0,
      unread_visitor: 0
    };
    memoryStore.visitors.set(sessionId, visitor);
    memoryStore.messages.set(sessionId, []);
    await saveMemoryStore();
    return visitor;
  }
}

export async function updateVisitorPseudo(sessionId, newPseudo) {
  if (usePg) {
    const res = await pool.query(
      "UPDATE visitors SET pseudo = $1, last_seen = NOW() WHERE session_id = $2 RETURNING *",
      [newPseudo, sessionId]
    );
    return res.rows[0];
  } else {
    const visitor = memoryStore.visitors.get(sessionId);
    if (visitor) {
      visitor.pseudo = newPseudo;
      visitor.last_seen = new Date();
      await saveMemoryStore();
    }
    return visitor;
  }
}

export async function updateVisitorLastSeen(sessionId) {
  if (usePg) {
    await pool.query("UPDATE visitors SET last_seen = NOW() WHERE session_id = $1", [sessionId]);
  } else {
    const visitor = memoryStore.visitors.get(sessionId);
    if (visitor) {
      visitor.last_seen = new Date();
      await saveMemoryStore();
    }
  }
}

export async function getAllVisitors() {
  if (usePg) {
    const res = await pool.query("SELECT * FROM visitors ORDER BY last_seen DESC");
    return res.rows;
  } else {
    const list = Array.from(memoryStore.visitors.values());
    return list.sort((a, b) => new Date(b.last_seen) - new Date(a.last_seen));
  }
}

export async function saveMessage(sessionId, sender, content) {
  if (usePg) {
    const res = await pool.query(
      "INSERT INTO messages (session_id, sender, content, created_at, is_read) VALUES ($1, $2, $3, NOW(), FALSE) RETURNING *",
      [sessionId, sender, content]
    );
    
    // Update unread count and last_seen in visitors table
    if (sender === "visitor") {
      await pool.query("UPDATE visitors SET last_seen = NOW(), unread_admin = unread_admin + 1 WHERE session_id = $1", [sessionId]);
    } else {
      await pool.query("UPDATE visitors SET last_seen = NOW(), unread_visitor = unread_visitor + 1 WHERE session_id = $1", [sessionId]);
    }

    return res.rows[0];
  } else {
    const msg = {
      id: memoryStore.messageIdCounter++,
      session_id: sessionId,
      sender,
      content,
      created_at: new Date(),
      is_read: false
    };

    if (!memoryStore.messages.has(sessionId)) {
      memoryStore.messages.set(sessionId, []);
    }
    memoryStore.messages.get(sessionId).push(msg);
    await saveMemoryStore();

    const visitor = memoryStore.visitors.get(sessionId);
    if (visitor) {
      visitor.last_seen = new Date();
      if (sender === "visitor") {
        visitor.unread_admin = (visitor.unread_admin || 0) + 1;
      } else {
        visitor.unread_visitor = (visitor.unread_visitor || 0) + 1;
      }
      await saveMemoryStore();
    }

    return msg;
  }
}

export async function getMessages(sessionId) {
  if (usePg) {
    const res = await pool.query("SELECT * FROM messages WHERE session_id = $1 ORDER BY created_at ASC", [sessionId]);
    return res.rows;
  } else {
    return memoryStore.messages.get(sessionId) || [];
  }
}

export async function markMessagesAsRead(sessionId, readerRole) {
  if (usePg) {
    if (readerRole === "admin") {
      await pool.query("UPDATE messages SET is_read = TRUE WHERE session_id = $1 AND sender = 'visitor'", [sessionId]);
      await pool.query("UPDATE visitors SET unread_admin = 0 WHERE session_id = $1", [sessionId]);
    } else {
      await pool.query("UPDATE messages SET is_read = TRUE WHERE session_id = $1 AND sender = 'admin'", [sessionId]);
      await pool.query("UPDATE visitors SET unread_visitor = 0 WHERE session_id = $1", [sessionId]);
    }
  } else {
    const messages = memoryStore.messages.get(sessionId) || [];
    messages.forEach(m => {
      if (readerRole === "admin" && m.sender === "visitor") {
        m.is_read = true;
      } else if (readerRole === "visitor" && m.sender === "admin") {
        m.is_read = true;
      }
    });

    const visitor = memoryStore.visitors.get(sessionId);
    if (visitor) {
      if (readerRole === "admin") visitor.unread_admin = 0;
      if (readerRole === "visitor") visitor.unread_visitor = 0;
      await saveMemoryStore();
    }
  }
}
