const BACKEND_URL = process.env.BACKEND_URL || "https://portfolio-backend-bwcd.onrender.com";
const password = process.env.ADMIN_PASSWORD || "";

if (!password) {
  console.error("❌ ADMIN_PASSWORD est absent. Définis-le dans ton environnement avant d’exécuter ce test.");
  process.exit(1);
}

console.log("🔐 Test connexion admin...");

try {
  const loginResponse = await fetch(
    `${BACKEND_URL}/api/admin/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    }
  );

  const loginData = await loginResponse.json();

  console.log("\nRéponse login :");
  console.log(loginData);

  if (!loginResponse.ok || !loginData.success || !loginData.token) {
    console.error("❌ Login admin échoué");
    process.exit(1);
  }

  console.log("✅ Login admin réussi");

  const token = loginData.token;

  const visitorsResponse = await fetch(
    `${BACKEND_URL}/api/admin/visitors`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const visitorsData = await visitorsResponse.json();

  if (!visitorsResponse.ok || !visitorsData.success) {
    console.error("❌ Lecture des visiteurs échouée");
    process.exit(1);
  }

  console.log("\n👥 Visiteurs :");
  console.log(JSON.stringify(visitorsData, null, 2));

  console.log("\n🎉 TEST ADMIN RÉUSSI !");
} catch (error) {
  console.error("❌ Erreur :", error);
  process.exitCode = 1;
}