import { lazy, Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaUser,
  FaCode,
  FaEnvelope,
  FaCogs,
} from "react-icons/fa";

import Acceuil from "../components/Acceuil";
import Entete from "../components/Entete";
import IndexClique from "../components/IndexClique";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";

import { useTabs } from "../context/TabsContext";
import Tabs from "../components/Tabs";
import Terminal from "../components/Terminal";
import CommandPalette from "../components/CommandPalette";
import ChatWidget from "../components/ChatWidget";
import ThemeSettings from "../components/ThemeSettings";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


const componentsMap = {
  "Accueil.jsx": Acceuil,
  "Contact.jsx": lazy(() => import("../components/Contact")),
  "Projet.jsx": lazy(() => import("../components/Projet")),
  "Competence.jsx": lazy(() => import("../components/Competence")),
  "Apropos.jsx": lazy(() => import("../components/Apropos")),
};

const MotionDiv = motion.div;
const MotionButton = motion.button;
const VISITOR_COUNT_REFRESH_MS = 5 * 60 * 1000;

const MainLayout = () => {
  const { activeTab, openTab } = useTabs();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(null);

  const ActiveComponent = componentsMap[activeTab] || Acceuil;

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Terminal with Ctrl+` or Ctrl+T
      if ((e.ctrlKey || e.metaKey) && (e.key === "`" || e.key.toLowerCase() === "t")) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadVisitorCount = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/visitors/count`);
        const data = await response.json();
        if (isMounted && data.success) setVisitorCount(data.count);
      } catch (error) {
        console.error("Erreur compteur visiteurs:", error);
      }
    };

    loadVisitorCount();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        loadVisitorCount();
      }
    };

    const intervalId = window.setInterval(
      refreshWhenVisible,
      VISITOR_COUNT_REFRESH_MS
    );
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  const mobileTabs = [
    { id: "Accueil.jsx", icon: <FaHome />, label: "Accueil" },
    { id: "Projet.jsx", icon: <FaCode />, label: "Projets" },
    { id: "Competence.jsx", icon: <FaCogs />, label: "Skills" },
    { id: "Apropos.jsx", icon: <FaUser />, label: "À propos" },
    { id: "Contact.jsx", icon: <FaEnvelope />, label: "Contact" },
  ];

  return (
    <div className="bg-vscode-editor text-vscode-foreground h-screen overflow-hidden flex flex-col font-sans select-none">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <Entete
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </header>

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden min-h-0 pt-9 pb-24 md:pb-6">
        {/* Desktop Left Activitybar & Explorer */}
        <div className="hidden md:flex flex-shrink-0 h-full">
          <Sidebar
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
          <IndexClique />
        </div>

        {/* Editor Main Canvas */}
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden bg-vscode-editor relative z-10">
          {/* Top Tabs & Breadcrumbs Bar */}
          <div className="sticky top-0 z-20 hidden sm:block">
            <Tabs />
          </div>

          {/* Tab Content Viewport */}
          <div className="flex-1 overflow-y-auto scroll-smooth">
            <AnimatePresence mode="wait">
              <MotionDiv
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="h-full"
              >
                <Suspense
                  fallback={
                    <div className="flex h-full min-h-48 items-center justify-center bg-vscode-editor text-sm text-gray-400 font-mono">
                      Chargement...
                    </div>
                  }
                >
                  <ActiveComponent />
                </Suspense>
              </MotionDiv>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Interactive Bottom Terminal Drawer */}
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      {/* Quick Search & Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={setIsCommandPaletteOpen}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <ThemeSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Desktop Fixed Status Bar */}
      <footer className="hidden md:block fixed bottom-0 left-0 right-0 z-30">
        <StatusBar
          onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          visitorCount={visitorCount}
        />
      </footer>

      {/* Compact VS Code status bar below the mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <StatusBar
          compact
          onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          visitorCount={visitorCount}
        />
      </div>

      {/* Mobile Bottom Quick Tabs Bar */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 bg-vscode-tabbar/90 backdrop-blur-md border-t border-vscode-border flex justify-around items-center py-1.5 z-50">
        {mobileTabs.map((tab) => (
          <MotionButton
            key={tab.id}
            onClick={() => openTab(tab.id)}
            className={`flex flex-col items-center text-[10px] px-3 py-1 rounded-lg transition-colors ${
              activeTab === tab.id
                ? "text-[#5ab3d5] font-semibold bg-vscode-hover/60"
                : "text-gray-400 hover:text-white"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <div className="text-lg">{tab.icon}</div>
            <span className="mt-0.5">{tab.label}</span>
          </MotionButton>
        ))}
      </div>

      {/* Floating Visitor Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default MainLayout;

