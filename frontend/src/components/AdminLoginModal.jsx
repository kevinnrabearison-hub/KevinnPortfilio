import React, { useState } from "react";
import { useChat } from "../context/ChatContext";
import { ShieldCheck, Lock, X, KeyRound, AlertCircle } from "lucide-react";

export default function AdminLoginModal() {
  const { showAdminModal, setShowAdminModal, loginAdmin, isAdminLoggedIn } = useChat();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showAdminModal && !isAdminLoggedIn) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError("");

    const result = await loginAdmin(password);
    setLoading(false);

    if (result.success) {
      setPassword("");
      setShowAdminModal(false);
    } else {
      setError(result.error || "Mot de passe erroné.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-[#1f3864]/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#5ab3d5]/10 border border-[#5ab3d5]/20 rounded-xl text-[#5ab3d5]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Espace Propriétaire (Kevinn)</h2>
              <p className="text-xs text-slate-400">Entre ton mot de passe administrateur</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdminModal(false)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                placeholder="Entrez le mot de passe (ex: admin123)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-[#5ab3d5] rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-slate-600 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAdminModal(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-[#0065a9] via-[#0098ff] to-[#5ab3d5] hover:opacity-90 text-white font-bold rounded-xl text-xs shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Vérification..." : "Déverrouiller"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
