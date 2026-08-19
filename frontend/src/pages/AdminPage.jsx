import React, { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import AdminChatDashboard from "../components/AdminChatDashboard";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  AlertCircle,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function AdminPage() {
  const { loginAdmin, logoutAdmin, isAdminLoggedIn } = useChat();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Change page title
  useEffect(() => {
    document.title = "Admin — Kevinn Portfolio";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    const result = await loginAdmin(password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Mot de passe erroné.");
    }
  };

  // Once logged in → show the full dashboard overlay
  if (isAdminLoggedIn) {
    return (
      <div className="relative min-h-screen bg-slate-950 font-sans">
        {/* Dashboard fills the full page */}
        <AdminChatDashboard fullPage />
      </div>
    );
  }

  // Login Screen
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#5ab3d5]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0065a9] to-[#5ab3d5] shadow-2xl shadow-[#0098ff]/30 text-white mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center justify-center gap-2">
            Espace Admin
            <Sparkles className="w-5 h-5 text-[#5ab3d5]" />
          </h1>
          <p className="text-sm text-slate-400">
            Tableau de bord privé — Kevinn Rabearison
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900/80 to-[#1f3864]/50 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-slate-200">
              Connexion Administrateur
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Entre ton mot de passe pour accéder à tes conversations en direct.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#5ab3d5]" />
                Mot de Passe Admin
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe secret..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#5ab3d5] rounded-xl px-4 py-3 pr-11 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-slate-600 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full py-3 bg-gradient-to-r from-[#0065a9] via-[#0098ff] to-[#5ab3d5] hover:opacity-90 text-white font-bold rounded-xl text-sm shadow-lg shadow-[#0065a9]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? "Vérification..." : "Accéder au Tableau de Bord"}
            </button>
          </form>

          <div className="px-6 pb-5 text-center">
            <a
              href="/"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
            >
              ← Retourner au portfolio
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Accès réservé — Kevinn Rabearison © 2026
        </p>
      </div>
    </div>
  );
}
