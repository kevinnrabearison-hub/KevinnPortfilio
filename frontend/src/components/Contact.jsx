import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  User,
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  Loader2,
  Terminal as TerminalIcon,
  Phone,
  MapPin,
  Clock,
  Github,
  Linkedin,
  Facebook
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const MotionSection = motion.section;
const MotionDiv = motion.div;
const MotionButton = motion.button;

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addLog = (msg, type = "info") => {
    setTerminalLogs((prev) => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    addLog(`POST /api/contact Payload: { name: "${formData.name}", email: "${formData.email}" }`, "info");

    try {
      const response = await axios.post(`${BACKEND_URL}/api/contact`, formData);
      if (!response.data?.success) {
        throw new Error(response.data?.error || "Impossible d'envoyer le message.");
      }

      addLog("HTTP 200 OK - Message transmis avec succès !", "success");
      setNotification({ type: "success", text: "Message envoyé avec succès 🎉" });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Impossible d'envoyer le message.";
      addLog(`Échec HTTP : ${errorMessage}`, "error");
      setNotification({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <MotionSection
      className="bg-vscode-editor text-vscode-foreground min-h-screen px-4 sm:px-8 py-8 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2 pb-6 border-b border-vscode-border">
          <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
            <span className="font-mono text-[#5ab3d5] tracking-wide">&lt;Construisons ensemble /&gt;</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Que vous ayez un projet en tête, un produit à lancer ou une idée à explorer, je suis prêt à en discuter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Details & Direct Cards */}
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-6 border border-vscode-border space-y-4">
              <h3 className="text-lg font-bold text-white mb-2 font-mono text-[#5ab3d5]">&lt;Contact /&gt;</h3>

              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="p-2.5 rounded-lg bg-[#1f3864]/80 text-[#5ab3d5] border border-[#2f5288]">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-mono">Email</div>
                  <a href="mailto:kevinnrabearison@gmail.com" className="font-semibold text-gray-200 hover:text-[#5ab3d5] hover:underline">
                    kevinnrabearison@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="p-2.5 rounded-lg bg-[#1f3864]/80 text-[#0098ff] border border-[#2f5288]">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-mono">Téléphone</div>
                  <span className="font-semibold text-gray-200">038 35 482 45</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="p-2.5 rounded-lg bg-[#1f3864]/80 text-[#5ab3d5] border border-[#2f5288]">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-mono">Localisation</div>
                  <span className="font-semibold text-gray-200">Antananarivo, Madagascar</span>
                </div>
              </div>

              {/* Social Media Redirection Buttons */}
              <div className="pt-4 border-t border-vscode-border/60">
                <div className="text-xs font-mono text-gray-400 mb-2.5">&lt;réseaux_sociaux /&gt;</div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="mailto:kevinnrabearison@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-vscode-editor border border-vscode-border hover:border-[#5ab3d5] text-xs font-mono text-gray-200 hover:text-white transition-all group"
                  >
                    <Mail size={15} className="text-[#5ab3d5] group-hover:scale-110 transition-transform" />
                    <span>Gmail</span>
                  </a>
                  <a
                    href="https://github.com/kevinnrabearison-hub"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-vscode-editor border border-vscode-border hover:border-[#5ab3d5] text-xs font-mono text-gray-200 hover:text-white transition-all group"
                  >
                    <Github size={15} className="text-[#0098ff] group-hover:scale-110 transition-transform" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-vscode-editor border border-vscode-border hover:border-[#5ab3d5] text-xs font-mono text-gray-200 hover:text-white transition-all group"
                  >
                    <Facebook size={15} className="text-[#5ab3d5] group-hover:scale-110 transition-transform" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-vscode-editor border border-vscode-border hover:border-[#5ab3d5] text-xs font-mono text-gray-200 hover:text-white transition-all group"
                  >
                    <Linkedin size={15} className="text-[#0098ff] group-hover:scale-110 transition-transform" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Live Terminal Log Box */}
            {terminalLogs.length > 0 && (
              <div className="glass-panel rounded-xl p-4 border border-vscode-border font-mono text-xs text-gray-300 space-y-2">
                <div className="flex items-center space-x-2 text-[#5ab3d5] font-semibold text-[11px] pb-2 border-b border-vscode-border/50">
                  <TerminalIcon size={14} />
                  <span className="font-mono">&lt;console /&gt;</span>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1 text-[11px]">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="flex space-x-2">
                      <span className="text-gray-500">[{log.time}]</span>
                      <span className={log.type === "success" ? "text-[#5ab3d5] font-semibold" : "text-[#0098ff]"}>
                        {log.msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Container */}
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-xl p-6 sm:p-8 border border-vscode-border space-y-4 shadow-xl"
          >
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-300">&lt;nom /&gt;</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: Jean Dupont"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 bg-vscode-editor text-white text-sm rounded-lg border border-vscode-border focus:outline-none focus:border-[#5ab3d5] focus:ring-1 focus:ring-[#5ab3d5] font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-300">&lt;email /&gt;</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="nom@exemple.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 bg-vscode-editor text-white text-sm rounded-lg border border-vscode-border focus:outline-none focus:border-[#5ab3d5] focus:ring-1 focus:ring-[#5ab3d5] font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-300">&lt;message /&gt;</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  name="message"
                  placeholder="Bonjour Kevinn, je souhaiterais échanger sur..."
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 bg-vscode-editor text-white text-sm rounded-lg border border-vscode-border focus:outline-none focus:border-[#5ab3d5] focus:ring-1 focus:ring-[#5ab3d5] resize-none font-sans"
                />
              </div>
            </div>

            <MotionButton
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(90,179,213,0.3)] transition-all font-mono ${isLoading
                  ? "bg-[#1f3864] text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#0065a9] via-[#0098ff] to-[#5ab3d5] hover:opacity-95 text-white border border-[#5ab3d5]/30"
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin text-white" size={18} />
                  <span>&lt;traitement_en_cours... /&gt;</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>&lt;envoyer_message /&gt;</span>
                </>
              )}
            </MotionButton>
          </form>
        </div>
      </div>

      {/* Glassmorphism Notification Toast */}
      <AnimatePresence>
        {notification && (
          <MotionDiv
            key="notif"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-6 z-[99999] flex items-center space-x-3 px-5 py-3.5 rounded-xl shadow-2xl glass-panel border border-[#5ab3d5]/50 bg-[#1f3864]/95 text-white text-xs font-semibold"
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} className="text-[#5ab3d5] shrink-0" />
            ) : (
              <XCircle size={20} className="text-red-400 shrink-0" />
            )}
            <span>{notification.text}</span>
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionSection>
  );
}
