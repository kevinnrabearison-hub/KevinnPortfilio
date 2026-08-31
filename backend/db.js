import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
import pg from "pg";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";


dotenv.config();

const { Pool } = pg;

let pool = null;
let usePg = false;

const VISITOR_RETENTION_DAYS = 180;
const MESSAGE_RETENTION_DAYS = 90;

// Résilience pour Render gratuit
const DB_RETRY_ATTEMPTS = 3;
const DB_RETRY_DELAY = 1000; // 1 seconde

const dataFilePath = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "data.json"
);

const memoryStore = {
  visitors: new Map(),
  messages: new Map(),
  pushSubscriptions: new Map(),
  messageIdCounter: 1
};

// Utilitaire: retry avec backoff exponentiel
const withRetry = async (fn, attempts = DB_RETRY_ATTEMPTS, delay = DB_RETRY_DELAY) => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};


const saveMemoryStore = async () => {
  try {
    const data = {
      visitors: Array.from(memoryStore.visitors.entries()),
      messages: Array.from(memoryStore.messages.entries()),
      pushSubscriptions: Array.from(memoryStore.pushSubscriptions.entries()),
      messageIdCounter: memoryStore.messageIdCounter
    };

    await fs.writeFile(
      dataFilePath,
      JSON.stringify(data, null, 2),
      "utf8"
    );

  } catch (err) {
    console.warn(
      "Erreur sauvegarde mémoire:",
      err.message
    );
  }
};


const loadMemoryStore = async () => {
  try {

    const raw = await fs.readFile(
      dataFilePath,
      "utf8"
    );

    const data = JSON.parse(raw);

    memoryStore.visitors =
      new Map(data.visitors || []);

    memoryStore.messages =
      new Map(data.messages || []);

    memoryStore.pushSubscriptions =
      new Map(data.pushSubscriptions || []);

    memoryStore.messageIdCounter =
      data.messageIdCounter || 1;


  } catch (err) {

    if (err.code !== "ENOENT") {
      console.warn(
        "Erreur chargement mémoire:",
        err.message
      );
    }

  }
};



export async function initDb() {

  if (!process.env.DATABASE_URL) {
    console.warn(
      "⚠️ DATABASE_URL absente → démarrage en mode mémoire (données non persistantes)"
    );

    await loadMemoryStore();

    return;
  }


  try {

    const databaseUrl = (() => {
      if (!process.env.DATABASE_URL) return undefined;
      const url = new URL(process.env.DATABASE_URL);
      const params = url.searchParams;
      if (params.get("sslmode") === "require") {
        params.delete("sslmode");
      }
      url.search = params.toString();
      return url.toString();
    })();

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: true,
      },
      max: 5,
      connectionTimeoutMillis: 30000,
    });


    const test = await pool.query(
      "SELECT NOW()"
    );


    console.log(
      "✅ PostgreSQL connecté:",
      test.rows[0]
    );


    usePg = true;



    await pool.query(`

      CREATE TABLE IF NOT EXISTS visitors (

        session_id VARCHAR(100)
        PRIMARY KEY,

        pseudo VARCHAR(100)
        NOT NULL,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        last_seen TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        unread_admin INTEGER
        DEFAULT 0,

        unread_visitor INTEGER
        DEFAULT 0

      );

      CREATE TABLE IF NOT EXISTS push_subscriptions (

        session_id VARCHAR(100)
        REFERENCES visitors(session_id)
        ON DELETE CASCADE,

        endpoint TEXT PRIMARY KEY,

        subscription JSONB NOT NULL,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

      );


      CREATE TABLE IF NOT EXISTS messages (

        id SERIAL PRIMARY KEY,

        session_id VARCHAR(100)
        REFERENCES visitors(session_id)
        ON DELETE CASCADE,

        sender VARCHAR(20)
        NOT NULL,

        content TEXT
        NOT NULL,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        is_read BOOLEAN
        DEFAULT FALSE

      );

    `);

    await pool.query(`
      ALTER TABLE visitors
      ADD COLUMN IF NOT EXISTS push_enabled BOOLEAN DEFAULT FALSE
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS messages_session_id_idx
      ON messages (session_id)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS messages_created_at_idx
      ON messages (created_at)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS visitors_last_seen_idx
      ON visitors (last_seen)
    `);


    console.log(
      "✅ Tables visitors/messages créées"
    );


  } catch (err) {

    console.error(
      "❌ PostgreSQL erreur:",
      err.code,
      err.message
    );

    console.warn(
      "⚠️ Impossible de connecter PostgreSQL → fallback mode mémoire"
    );

    usePg = false;

    if (pool) {
      await pool.end().catch(() => {});
      pool = null;
    }

    // Charger le stockage en mémoire en fallback
    await loadMemoryStore();

  }

}

export async function purgeExpiredData() {
  if (usePg) {
    await pool.query(
      `DELETE FROM messages
       WHERE created_at < NOW() - ($1 * INTERVAL '1 day')`,
      [MESSAGE_RETENTION_DAYS]
    );

    await pool.query(
      `DELETE FROM visitors
       WHERE last_seen < NOW() - ($1 * INTERVAL '1 day')`,
      [VISITOR_RETENTION_DAYS]
    );

    await pool.query(
      `DELETE FROM push_subscriptions subscription
       WHERE created_at < NOW() - ($1 * INTERVAL '1 day')
          OR NOT EXISTS (
         SELECT 1
         FROM visitors
         WHERE visitors.session_id = subscription.session_id
       )`,
      [VISITOR_RETENTION_DAYS]
    );

    return;
  }

  const visitorCutoff = Date.now() - VISITOR_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const messageCutoff = Date.now() - MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000;

  for (const [sessionId, messages] of memoryStore.messages) {
    const retainedMessages = messages.filter(
      (message) => new Date(message.created_at).getTime() >= messageCutoff
    );

    if (retainedMessages.length) {
      memoryStore.messages.set(sessionId, retainedMessages);
    } else {
      memoryStore.messages.delete(sessionId);
    }
  }

  for (const [sessionId, visitor] of memoryStore.visitors) {
    if (new Date(visitor.last_seen).getTime() < visitorCutoff) {
      memoryStore.visitors.delete(sessionId);
      memoryStore.messages.delete(sessionId);
    }
  }

  for (const [endpoint, subscription] of memoryStore.pushSubscriptions) {
    const createdAt = new Date(subscription.created_at).getTime();
    if (
      !memoryStore.visitors.has(subscription.session_id) ||
      createdAt < visitorCutoff
    ) {
      memoryStore.pushSubscriptions.delete(endpoint);
    }
  }

  await saveMemoryStore();
}



export async function getOrCreateVisitor(
  sessionId,
  defaultPseudo = "Visiteur"
) {


  if (usePg) {


    const result = await pool.query(
      "SELECT * FROM visitors WHERE session_id=$1",
      [sessionId]
    );


    if (result.rows.length) {

      return result.rows[0];

    }



    const insert = await pool.query(

      `INSERT INTO visitors
      (
        session_id,
        pseudo,
        created_at,
        last_seen
      )

      VALUES
      ($1,$2,NOW(),NOW())

      RETURNING *`,

      [
        sessionId,
        defaultPseudo
      ]

    );


    return insert.rows[0];


  }



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


  memoryStore.visitors.set(
    sessionId,
    visitor
  );


  memoryStore.messages.set(
    sessionId,
    []
  );


  await saveMemoryStore();


  return visitor;

}

export async function updateVisitorPseudo(
  sessionId,
  newPseudo
) {

  if (usePg) {

    const result = await pool.query(

      `UPDATE visitors
       SET pseudo=$1,
           last_seen=NOW()
       WHERE session_id=$2
       RETURNING *`,

      [
        newPseudo,
        sessionId
      ]

    );


    return result.rows[0];

  }



  const visitor =
    memoryStore.visitors.get(sessionId);



  if (visitor) {

    visitor.pseudo = newPseudo;

    visitor.last_seen = new Date();

    await saveMemoryStore();

  }


  return visitor;

}





export async function updateVisitorLastSeen(
  sessionId
) {


  if (usePg) {

    await pool.query(

      `UPDATE visitors
       SET last_seen=NOW()
       WHERE session_id=$1`,

      [sessionId]

    );


    return;

  }



  const visitor =
    memoryStore.visitors.get(sessionId);



  if (visitor) {

    visitor.last_seen = new Date();

    await saveMemoryStore();

  }

}





export async function getAllVisitors() {


  if (usePg) {


    const result = await pool.query(

      `SELECT session_id,
              pseudo,
              created_at,
              last_seen,
              unread_admin,
              unread_visitor,
              push_enabled
       FROM visitors
       ORDER BY last_seen DESC`

    );


    return result.rows;


  }



  return Array
    .from(memoryStore.visitors.values())
    .sort(
      (a,b)=>
      new Date(b.last_seen)
      -
      new Date(a.last_seen)
    );

}

export async function getVisitorCount() {
  if (usePg) {
    const result = await pool.query(
      "SELECT COUNT(*)::integer AS count FROM visitors"
    );
    return result.rows[0].count;
  }

  return memoryStore.visitors.size;
}

export async function savePushSubscription(sessionId, subscription) {
  if (usePg) {
    await pool.query(
      `INSERT INTO push_subscriptions (session_id, endpoint, subscription)
       VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (endpoint) DO UPDATE SET
         session_id = EXCLUDED.session_id,
         subscription = EXCLUDED.subscription`,
      [sessionId, subscription.endpoint, JSON.stringify(subscription)]
    );

    await pool.query(
      `UPDATE visitors SET push_enabled=TRUE WHERE session_id=$1`,
      [sessionId]
    );

    return;
  }

  memoryStore.pushSubscriptions.set(subscription.endpoint, {
    session_id: sessionId,
    subscription,
    created_at: new Date()
  });

  const visitor = memoryStore.visitors.get(sessionId);
  if (visitor) visitor.push_enabled = true;
  await saveMemoryStore();
}

export async function getPushSubscriptions(sessionId) {
  if (usePg) {
    const result = await pool.query(
      `SELECT subscription FROM push_subscriptions WHERE session_id=$1`,
      [sessionId]
    );
    return result.rows.map((row) => row.subscription);
  }

  return Array.from(memoryStore.pushSubscriptions.values())
    .filter((entry) => entry.session_id === sessionId)
    .map((entry) => entry.subscription);
}

export async function removePushSubscription(endpoint) {
  if (usePg) {
    await pool.query(
      `DELETE FROM push_subscriptions WHERE endpoint=$1`,
      [endpoint]
    );
    return;
  }

  memoryStore.pushSubscriptions.delete(endpoint);
  await saveMemoryStore();
}





export async function saveMessage(
  sessionId,
  sender,
  content
) {


  if (usePg) {


    const result = await pool.query(

      `INSERT INTO messages
      (
        session_id,
        sender,
        content,
        created_at,
        is_read
      )

      VALUES
      ($1,$2,$3,NOW(),FALSE)

      RETURNING *`,

      [
        sessionId,
        sender,
        content
      ]

    );



    if(sender==="visitor") {


      await pool.query(

        `UPDATE visitors
         SET
         unread_admin = unread_admin + 1,
         last_seen = NOW()

         WHERE session_id=$1`,

        [sessionId]

      );


    } else {


      await pool.query(

        `UPDATE visitors
         SET
         unread_visitor = unread_visitor + 1,
         last_seen = NOW()

         WHERE session_id=$1`,

        [sessionId]

      );


    }



    return result.rows[0];

  }





  const message = {

    id:
      memoryStore.messageIdCounter++,

    session_id:
      sessionId,

    sender,

    content,

    created_at:
      new Date(),

    is_read:
      false

  };



  if(!memoryStore.messages.has(sessionId)) {

    memoryStore.messages.set(
      sessionId,
      []
    );

  }



  memoryStore.messages
    .get(sessionId)
    .push(message);



  const visitor =
    memoryStore.visitors.get(sessionId);



  if(visitor) {


    visitor.last_seen =
      new Date();



    if(sender==="visitor") {

      visitor.unread_admin++;

    }
    else {

      visitor.unread_visitor++;

    }

  }



  await saveMemoryStore();



  return message;

}





export async function getMessages(
  sessionId
) {


  if(usePg) {


    const result = await pool.query(

      `SELECT *
       FROM messages
       WHERE session_id=$1
       ORDER BY created_at ASC`,

      [sessionId]

    );


    return result.rows;


  }



  return (
    memoryStore.messages.get(sessionId)
    ||
    []
  );

}

export async function markMessagesAsRead(
  sessionId,
  readerRole
) {


  if (usePg) {


    if (readerRole === "admin") {


      await pool.query(

        `UPDATE messages
         SET is_read=TRUE
         WHERE session_id=$1
         AND sender='visitor'`,

        [sessionId]

      );



      await pool.query(

        `UPDATE visitors
         SET unread_admin=0
         WHERE session_id=$1`,

        [sessionId]

      );


    } else {



      await pool.query(

        `UPDATE messages
         SET is_read=TRUE
         WHERE session_id=$1
         AND sender='admin'`,

        [sessionId]

      );



      await pool.query(

        `UPDATE visitors
         SET unread_visitor=0
         WHERE session_id=$1`,

        [sessionId]

      );

    }



    return;

  }





  const messages =
    memoryStore.messages.get(sessionId)
    ||
    [];



  messages.forEach(message => {


    if (
      readerRole === "admin"
      &&
      message.sender === "visitor"
    ) {

      message.is_read = true;

    }



    if (
      readerRole === "visitor"
      &&
      message.sender === "admin"
    ) {

      message.is_read = true;

    }


  });




  const visitor =
    memoryStore.visitors.get(sessionId);



  if(visitor) {


    if(readerRole==="admin") {

      visitor.unread_admin = 0;

    }


    if(readerRole==="visitor") {

      visitor.unread_visitor = 0;

    }


  }



  await saveMemoryStore();

}