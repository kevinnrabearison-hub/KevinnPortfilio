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

import Contact from "../components/Contact";
import Projet from "../components/Projet";
import Competence from "../components/Competence";
import Apropos from "../components/Apropos";

import { useTabs } from "../context/TabsContext";
import Tabs from "../components/Tabs";

const componentsMap = {
  "Accueil.jsx": Acceuil,
  "Contact.jsx": Contact,
  "Projet.jsx": Projet,
  "Competence.jsx": Competence,
  "Apropos.jsx": Apropos,
};

const MotionDiv = motion.div;
const MotionButton = motion.button;

const MainLayout = () => {
  const { activeTab, openTab } = useTabs();
  const ActiveComponent = componentsMap[activeTab] || Acceuil;

  const mobileTabs = [
    { id: "Accueil.jsx", icon: <FaHome />, label: "Accueil" },
    { id: "Projet.jsx", icon: <FaCode />, label: "Projets" },
    { id: "Competence.jsx", icon: <FaCogs />, label: "Compétences" },
    { id: "Apropos.jsx", icon: <FaUser />, label: "À propos" },
    { id: "Contact.jsx", icon: <FaEnvelope />, label: "Contact" },
  ];

  return (
    <div className="bg-vscode-editor text-vscode-foreground min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-30 bg-vscode-titlebar border-b border-vscode-border">
        <Entete />
      </header>

      <div className="flex flex-1 pt-12 pb-14 md:pb-6 overflow-hidden">
        <div className="hidden md:flex flex-shrink-0">
          <Sidebar />
          <IndexClique />
        </div>

        <main className="flex-1 overflow-y-auto bg-vscode-editor relative z-10 scroll-smooth">
          <div className="sticky top-0 bg-vscode-tabbar z-20 border-b border-vscode-border hidden sm:block">
            <Tabs />
          </div>

          <div className="p-4 md:p-6">
            <AnimatePresence mode="wait">
              <MotionDiv
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <ActiveComponent />
              </MotionDiv>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <footer className="hidden md:block fixed bottom-0 left-0 right-0 z-30 bg-vscode-statusbar">
        <StatusBar />
      </footer>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111]/80 backdrop-blur-md border-t border-gray-700 flex justify-around items-center py-2 z-50">
        {mobileTabs.map((tab) => (
          <MotionButton
            key={tab.id}
            onClick={() => openTab(tab.id)}
            className={`flex flex-col items-center text-xs ${
              activeTab === tab.id
                ? "text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <MotionDiv
              animate={{
                scale: activeTab === tab.id ? [1, 1.2, 1] : 1,
                color: activeTab === tab.id ? "#3B82F6" : "#9CA3AF",
              }}
              transition={{ duration: 0.4 }}
              className="text-xl"
            >
              {tab.icon}
            </MotionDiv>
            <span className="text-[0.7rem] mt-1">{tab.label}</span>
          </MotionButton>
        ))}
      </div>
    </div>
  );
};

export default MainLayout;
