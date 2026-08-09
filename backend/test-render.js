import { io } from "socket.io-client";

const BACKEND_URL = "https://portfolio-backend-bwcd.onrender.com";

const sessionId =
  "test_render_" + Date.now();

console.log("Connexion à :", BACKEND_URL);
console.log("Session :", sessionId);

const socket = io(BACKEND_URL, {
  transports: ["websocket", "polling"],
  timeout: 30000,
});

socket.on("connect", () => {
  console.log("✅ Socket.IO connecté");
  console.log("Socket ID :", socket.id);

  socket.emit("join_session", {
    sessionId,
    pseudo: "Test Render"
  });
});

socket.on("session_initialized", (data) => {
  console.log("\n✅ SESSION INITIALISÉE");
  console.log("Visiteur :", data.visitor);
  console.log("Historique :", data.history);
  console.log("Admin en ligne :", data.isAdminOnline);

  console.log("\n📨 Envoi d'un message test...");

  socket.emit("send_message", {
    sessionId,
    sender: "visitor",
    content: "Message de test depuis Render 🚀"
  });
});

socket.on("receive_message", (message) => {
  console.log("\n✅ MESSAGE REÇU");
  console.log(message);

  console.log("\n🎉 TEST BACKEND + NEON RÉUSSI !");

  setTimeout(() => {
    socket.disconnect();
    process.exit(0);
  }, 1000);
});

socket.on("connect_error", (error) => {
  console.error("\n❌ Erreur Socket.IO");
  console.error(error.message);
});

socket.on("disconnect", (reason) => {
  console.log("\nSocket déconnecté :", reason);
});
