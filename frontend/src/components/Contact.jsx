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
import "./Contact.css";

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

        <div className="contact-layout">
          <div className="contact-inner">
            <form onSubmit={handleSubmit} className="contact-form-panel">
              <div className="contact-field">
                <h3>Contactez-moi</h3>
                <p>Une idée, un projet ou une opportunité ? Écrivez-moi et je vous répondrai dès que possible.</p>
                <label htmlFor="contact-name">Nom</label>
                <div className="contact-input-wrap"><User size={17} /><input id="contact-name" type="text" name="name" placeholder="Votre nom" value={formData.name} onChange={handleChange} required disabled={isLoading} /></div>
                <label htmlFor="contact-email">Email</label>
                <div className="contact-input-wrap"><Mail size={17} /><input id="contact-email" type="email" name="email" placeholder="nom@exemple.com" value={formData.email} onChange={handleChange} required disabled={isLoading} /></div>
                <label htmlFor="contact-message">Message</label>
                <div className="contact-input-wrap contact-textarea-wrap"><MessageSquare size={17} /><textarea id="contact-message" name="message" placeholder="Parlez-moi de votre projet..." rows="4" value={formData.message} onChange={handleChange} required disabled={isLoading} /></div>
                <MotionButton type="submit" disabled={isLoading} whileHover={!isLoading ? { scale: 1.02 } : {}} whileTap={!isLoading ? { scale: 0.98 } : {}} className="contact-submit">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  <span>{isLoading ? "Envoi en cours..." : "Envoyer le message"}</span>
                </MotionButton>
              </div>
            </form>

            <aside className="contact-info-panel">
              <h4>Contact Info</h4>
              <p className="contact-info-intro">Disponible pour des projets web, mobile et des collaborations créatives.</p>
              <a className="contact-info-item" href="mailto:kevinnrabearison@gmail.com"><Mail size={20} /><span>kevinnrabearison@gmail.com</span></a>
              <div className="contact-info-item"><Phone size={20} /><span>038 35 482 45</span></div>
              <div className="contact-info-item"><MapPin size={20} /><span>Antananarivo, Madagascar</span></div>
              <div className="contact-socials">
                <a href="https://github.com/kevinnrabearison-hub" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={18} /></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
              </div>
            </aside>
          </div>

          {/* Live Terminal Log Box */}
          <div>
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
