import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileCode, Terminal, Download, Send, ArrowRight, X, Palette } from "lucide-react";
import { useTabs } from "../context/TabsContext";
import { downloadAndOpenCV } from "../utils/downloadCv";

export default function CommandPalette({ isOpen, onClose, onOpenTerminal, onOpenSettings }) {
  const [query, setQuery] = useState("");
  const { openTab } = useTabs();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: "theme-settings",
      type: "settings",
      title: "Thème",
      desc: "Afficher tous les thèmes de couleurs",
      icon: <Palette className="text-[#5ab3d5]" size={18} />,
      action: () => {
        onClose(false);
        onOpenSettings?.();
      },
    },
    {
      id: "Accueil.jsx",
      type: "file",
      title: "Accueil.jsx",
      desc: "Page d'accueil & présentation générale",
      icon: <FileCode className="text-[#5ab3d5]" size={18} />,
      action: () => { openTab("Accueil.jsx"); onClose(false); },
    },
    {
      id: "Competence.jsx",
      type: "file",
      title: "Competence.jsx",
      desc: "Stack technique, frameworks & outils",
      icon: <FileCode className="text-[#0098ff]" size={18} />,
      action: () => { openTab("Competence.jsx"); onClose(false); },
    },
    {
      id: "Projet.jsx",
      type: "file",
      title: "Projet.jsx",
      desc: "Galerie de projets web & mobile",
      icon: <FileCode className="text-[#5ab3d5]" size={18} />,
      action: () => { openTab("Projet.jsx"); onClose(false); },
    },
    {
      id: "Apropos.jsx",
      type: "file",
      title: "Apropos.jsx",
      desc: "Bio, éducation INSI & philosophie",
      icon: <FileCode className="text-[#0098ff]" size={18} />,
      action: () => { openTab("Apropos.jsx"); onClose(false); },
    },
    {
      id: "Contact.jsx",
      type: "file",
      title: "Contact.jsx",
      desc: "Envoyer un message à Kevinn",
      icon: <Send className="text-[#5ab3d5]" size={18} />,
      action: () => { openTab("Contact.jsx"); onClose(false); },
    },
    {
      id: "download-cv",
      type: "action",
      title: "Télécharger le CV (PDF)",
      desc: "Télécharger et afficher CV KEVINN.pdf",
      icon: <Download className="text-[#0098ff]" size={18} />,
      action: () => {
        downloadAndOpenCV();
        onClose(false);
      },
    },
    {
      id: "toggle-terminal",
      type: "action",
      title: "Ouvrir le Terminal VS Code",
      desc: "Afficher la console interactive au bas de l'écran",
      icon: <Terminal className="text-[#5ab3d5]" size={18} />,
      action: () => {
        if (onOpenTerminal) onOpenTerminal();
        onClose(false);
      },
    },
  ];



  const filteredActions = actions.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-vscode-sidebar border border-vscode-border rounded-xl shadow-2xl overflow-hidden glass-panel"
        >
          {/* Header Input */}
          <div className="flex items-center px-4 py-3 border-b border-vscode-border bg-vscode-titlebar/80">
            <Search className="text-gray-400 mr-3" size={20} />
            <input
              type="text"
              autoFocus
              placeholder="Rechercher un fichier, une commande ou un thème..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm font-mono"
            />
            <button
              onClick={() => onClose(false)}
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-vscode-hover"
            >
              <X size={18} />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredActions.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                Aucun résultat trouvé pour "{query}"
              </div>
            ) : (
              filteredActions.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-vscode-hover text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-md bg-vscode-editor border border-vscode-border">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-200 group-hover:text-[#5ab3d5]">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-gray-500 group-hover:text-[#5ab3d5] group-hover:translate-x-1 transition-all"
                  />
                </button>
              ))
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2 border-t border-vscode-border bg-vscode-editor/90 flex justify-between items-center text-[11px] text-gray-400 font-mono">
            <span>
              Navigation rapide <kbd className="px-1.5 py-0.5 bg-vscode-hover border border-vscode-border rounded text-[10px]">Ctrl+K</kbd>
            </span>
            <span>
              Fermer <kbd className="px-1.5 py-0.5 bg-vscode-hover border border-vscode-border rounded text-[10px]">Esc</kbd>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
