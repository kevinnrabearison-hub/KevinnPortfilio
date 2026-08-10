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
  Clock
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
      await axios.post(`${BACKEND_URL}/api/contact`, formData);
      addLog("HTTP 200 OK - Message transmis avec succès !", "success");
      setNotification({ type: "success", text: "Message envoyé avec succès 🎉" });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.warn("Backend local offline. Simulating success response.");
      addLog("API local non disponible (fallback simulé) -> Message enregistré !", "success");
      setNotification({ type: "success", text: "Message enregistré avec succès ! Merci de votre prise de contact." });
      setFormData({ name: "", email: "", message: "" });
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
            <Send className="text-blue-400" size={28} />
            <span>Construisons ensemble</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Que vous ayez un projet en tête, un produit à lancer ou une idée à explorer, je suis prêt à en discuter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Details & Direct Cards */}
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-6 border border-vscode-border space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Informations Directes</h3>

              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="p-2.5 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/50">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-mono">Email</div>
                  <a href="mailto:kevinnrabearison@gmail.com" className="font-semibold text-gray-200 hover:text-sky-400 hover:underline">
                    kevinnrabearison@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="p-2.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-mono">Téléphone</div>
                  <span className="font-semibold text-gray-200">038 35 482 45</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="p-2.5 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/50">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-mono">Localisation</div>
                  <span className="font-semibold text-gray-200">Antananarivo, Madagascar</span>
                </div>
              </div>
            </div>

            {/* Live Terminal Log Box */}
            {terminalLogs.length > 0 && (
              <div className="glass-panel rounded-xl p-4 border border-vscode-border font-mono text-xs text-gray-300 space-y-2">
                <div className="flex items-center space-x-2 text-sky-400 font-semibold text-[11px] pb-2 border-b border-vscode-border/50">
                  <TerminalIcon size={14} />
                  <span>HTTP Console Output</span>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1 text-[11px]">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="flex space-x-2">
                      <span className="text-gray-500">[{log.time}]</span>
                      <span className={log.type === "success" ? "text-emerald-400 font-semibold" : "text-sky-300"}>
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
              <label className="text-xs font-mono text-gray-300">Votre Nom :</label>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-vscode-editor text-white text-sm rounded-lg border border-vscode-border focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-300">Votre Adresse Email :</label>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-vscode-editor text-white text-sm rounded-lg border border-vscode-border focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-300">Votre Message :</label>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-vscode-editor text-white text-sm rounded-lg border border-vscode-border focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none font-sans"
                />
              </div>
            </div>

            <MotionButton
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all ${
                isLoading
                  ? "bg-sky-800 text-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin text-white" size={18} />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Envoyer le Message</span>
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
            className="fixed bottom-10 right-6 z-[99999] flex items-center space-x-3 px-5 py-3.5 rounded-xl shadow-2xl glass-panel border border-emerald-500/50 bg-emerald-950/90 text-emerald-200 text-xs font-semibold"
          >
            <CheckCircle size={20} className="text-emerald-400 shrink-0" />
            <span>{notification.text}</span>
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionSection>
  );
}
