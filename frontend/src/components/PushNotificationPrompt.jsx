import { useEffect, useState } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { useChat } from "../context/ChatContext";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((character) => character.charCodeAt(0)));
}

export default function PushNotificationPrompt() {
  const { sessionId } = useChat();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window) ||
      Notification.permission === "denied"
    ) {
      return;
    }

    const dismissed = sessionStorage.getItem("push_prompt_dismissed");
    if (!dismissed && Notification.permission !== "granted") {
      setVisible(true);
    }
  }, []);

  const enableNotifications = async () => {
    setBusy(true);
    setError("");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setVisible(false);
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const keyResponse = await fetch(`${BACKEND_URL}/api/push/public-key`);
      const keyData = await keyResponse.json();
      if (!keyResponse.ok || !keyData.publicKey) {
        throw new Error("Notifications Push non configurées sur le serveur.");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(keyData.publicKey),
      });

      const saveResponse = await fetch(`${BACKEND_URL}/api/push/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, subscription }),
      });
      if (!saveResponse.ok) throw new Error("Impossible d'enregistrer l'abonnement.");

      setVisible(false);
    } catch (subscriptionError) {
      console.error("Erreur activation notifications:", subscriptionError);
      setError(subscriptionError.message || "Activation impossible.");
    } finally {
      setBusy(false);
    }
  };

  const dismiss = () => {
    sessionStorage.setItem("push_prompt_dismissed", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-md rounded-xl border border-blue-400/30 bg-slate-950/95 p-4 text-slate-100 shadow-2xl backdrop-blur-md sm:left-auto sm:right-6">
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex gap-3 pr-4">
        <Bell className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
        <div>
          <p className="text-sm font-semibold">Recevoir ma réponse</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            Active les notifications pour être averti même après avoir quitté le portfolio.
          </p>
          {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={enableNotifications}
              disabled={busy}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
            >
              <Bell className="h-3.5 w-3.5" />
              {busy ? "Activation..." : "Activer"}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-white"
            >
              <BellOff className="h-3.5 w-3.5" />
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
