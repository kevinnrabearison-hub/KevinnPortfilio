import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL est absente.");
  process.exit(1);
}

const { Pool } = pg;

const databaseUrl = (() => {
  const url = new URL(process.env.DATABASE_URL);
  const params = url.searchParams;
  params.delete("sslmode");
  url.search = params.toString();
  return url.toString();
})();

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: true,
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
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

testDatabase();