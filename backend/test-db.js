import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 30000,
  max: 1,
});

async function testDatabase() {
  console.log("Connexion PostgreSQL...");
  
  try {
    const result = await pool.query("SELECT version(), NOW()");

    console.log("✅ PostgreSQL connecté !");
    console.log("Version :", result.rows[0].version);
    console.log("Heure serveur :", result.rows[0].now);
  } catch (error) {
    console.error("❌ Erreur PostgreSQL");
    console.error("CODE :", error.code);
    console.error("MESSAGE :", error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

testDatabase();