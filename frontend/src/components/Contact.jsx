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
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 🌀 État de chargement

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    try {
      await axios.post("http://localhost:5000/api/contact", formData);
      setNotification({ type: "success", text: "Message envoyé avec succès 🎉" });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        text: "Erreur lors de l’envoi. Réessayez plus tard ",
      });
    } finally {
      setIsLoading(false); 
      setTimeout(() => setNotification(null), 4500);
    }
  };

  return (
    <motion.section
      className="relative flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-[#1e1e1e] text-white font-mono overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.2 }}
        className="h-[2px] mb-6 bg-[#007ACC]  rounded-full" 
      />

      <motion.h1
        className="flex items-center justify-center gap-3 text-4xl font-bold mb-8 text-blue-400"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            filter: [
              "drop-shadow(0 0 0px rgba(86,156,214,0.2))",
              "drop-shadow(0 0 10px rgba(86,156,214,0.8))",
              "drop-shadow(0 0 0px rgba(86,156,214,0.2))",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Send size={34} className="text-blue-400" />
        </motion.div>
        Me Contacter
      </motion.h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#252526] w-full max-w-lg p-8 rounded-2xl shadow-lg border border-[#333] space-y-5 relative z-10"
      >
        <div className="relative">
          <User className="absolute left-3 top-3 text-[#9cdcfe]" size={20} />
          <input
            type="text"
            name="name"
            placeholder="Votre nom"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full pl-10 pr-3 py-3 bg-[#1e1e1e]/80 text-white rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#569cd6] disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-[#9cdcfe]" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Votre adresse email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full pl-10 pr-3 py-3 bg-[#1e1e1e]/80 text-white rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#569cd6] disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 text-[#9cdcfe]" size={20} />
          <textarea
            name="message"
            placeholder="Votre message..."
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full pl-10 pr-3 py-3 bg-[#1e1e1e]/80 text-white rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#569cd6] resize-none disabled:opacity-60 disabled:cursor-not-allowed"
          ></textarea>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.05 } : {}}
          whileTap={!isLoading ? { scale: 0.97 } : {}}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
            isLoading
              ? "bg-[#005a9e] cursor-not-allowed opacity-80"
              : "bg-gradient-to-r from-[#007acc] via-[#0a84ff] to-[#6a5acd] hover:from-[#0b93ff] hover:to-[#7b68ee]"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin text-white" size={20} />
              <span>Envoi en cours...</span>
            </>
          ) : (
            <>
              <Send size={18} className="text-white" />
              <span>Envoyer</span>
            </>
          )}
        </motion.button>
      </form>

      <AnimatePresence>
        {notification && (
          <motion.div
            key="notif"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-24 right-6 z-[99999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-lg border 
              ${
                notification.type === "success"
                  ? "#007ACC"
                  : "#e74c3c"
              }`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={22} className="text-white" />
            ) : (
              <XCircle size={22} className="text-white" />
            )}
            <p className="text-sm font-medium text-white">{notification.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-[9999] pointer-events-auto cursor-wait"
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Contact;
