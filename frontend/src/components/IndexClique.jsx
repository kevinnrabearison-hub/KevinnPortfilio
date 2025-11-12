import { useState } from "react";
import {
  VscTriangleDown,
  VscNewFile,
  VscNewFolder,
  VscRefresh,
  VscCollapseAll,
  VscHistory,
  VscSymbolInterface,
} from "react-icons/vsc";
import { FiDownload } from "react-icons/fi"; // 🆕 Icône de téléchargement
import { useTabs } from "../context/TabsContext";

const IndexClique = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { openTab } = useTabs();

  const files = [
    "Accueil.jsx",
    "Competence.jsx",
    "Projet.jsx",
    "Apropos.jsx",
    "Contact.jsx",
    "MonCV.json", 
  ];

  
  const handleFileClick = (file) => {
    if (file === "MonCV.json") {
      const link = document.createElement("a");
      link.href = "/CV.json"; 
      link.download = "MonCV.json";
      link.click();
    } else {
      openTab(file);
    }
  };

  return (
    <div className="fixed left-14 top-13 h-[calc(100vh-4rem)] w-56 bg-background flex flex-col justify-between py-2 border-r border-gray-700 z-40 overflow-hidden">
      <div>
        {/* Titre */}
        <div className="text-text bg-background flex justify-between items-center px-3">
          <h1 className="text-sm font-semibold">Explorer</h1>
          <h1 className="text-lg">...</h1>
        </div>

        {/* Dossier */}
        <div className="px-3 py-2 text-text">
          <div className="py-2 flex items-center justify-between gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 hover:text-white"
            >
              <VscTriangleDown
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-90" : "-rotate-90"
                }`}
              />
              <span className="text-sm">Portfolio</span>
            </button>

            <div className="flex gap-2 text-gray-400 text-lg">
              <VscNewFile className="cursor-pointer hover:text-white" title="Nouveau fichier" />
              <VscNewFolder className="cursor-pointer hover:text-white" title="Nouveau dossier" />
              <VscRefresh className="cursor-pointer hover:text-white" title="Rafraîchir" />
              <VscCollapseAll className="cursor-pointer hover:text-white" title="Réduire" />
            </div>
          </div>

          {/* Liste des fichiers */}
          {isOpen && (
            <ul className="mt-4 space-y-1 text-sm text-gray-400 pl-6">
              {files.map((file) => (
                <li
                  key={file}
                  onClick={() => handleFileClick(file)}
                  className={`flex items-center justify-between hover:text-white cursor-pointer px-1 py-0.5 rounded transition-all ${
                    file === "MonCV.json" ? "text-green-400" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {file === "MonCV.json" ? (
                      <FiDownload className="text-green-400 text-lg hover:scale-110 transition-transform" />
                    ) : (
                      <img
                        src="/logo/jsx-atom.svg"
                        alt="JSX Icon"
                        className="w-4 h-4 hover:scale-105 transition-transform"
                      />
                    )}
                    <span>{file}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Bas du menu */}
      <div className="border-t border-gray-700 text-gray-400">
        <div className="flex items-center gap-2 px-4 py-1 text-sm hover:bg-[#2a2a2a] cursor-pointer">
          <VscSymbolInterface className="text-lg" />
          <span>OUTLINE</span>
        </div>
        <div className="flex items-center border-t border-gray-600 gap-2 px-4 py-1 text-sm hover:bg-[#2a2a2a] cursor-pointer">
          <VscHistory className="text-lg" />
          <span>TIMELINE</span>
        </div>
      </div>
    </div>
  );
};

export default IndexClique;
