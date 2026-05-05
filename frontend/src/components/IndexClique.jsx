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
import { FiDownload } from "react-icons/fi"; 
import { useTabs } from "../context/TabsContext";

const IndexClique = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { openTab, activeTab } = useTabs();

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
      link.href = "/CV KEVINN.pdf"; 
      link.download = "CV KEVINN.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      openTab(file);
    }
  };

  return (
    <aside className="w-56 h-full bg-vscode-sidebar flex flex-col justify-between py-2 border-r border-vscode-border overflow-hidden">
      <div>
        {/* Titre */}
        <div className="text-vscode-foreground bg-vscode-sidebar flex justify-between items-center px-3">
          <h1 className="text-[11px] tracking-widest uppercase text-gray-300">Explorer</h1>
          <button className="px-2 py-1 rounded hover:bg-vscode-hover/80 text-gray-300" type="button" aria-label="Explorer menu">
            ...
          </button>
        </div>

        {/* Dossier */}
        <div className="px-3 py-2 text-vscode-foreground">
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
              <span className="text-sm font-medium">Portfolio</span>
            </button>

            <div className="flex gap-1 text-gray-400 text-lg">
              <VscNewFile className="cursor-pointer hover:text-white hover:bg-vscode-hover/80 p-1 rounded" title="Nouveau fichier" />
              <VscNewFolder className="cursor-pointer hover:text-white hover:bg-vscode-hover/80 p-1 rounded" title="Nouveau dossier" />
              <VscRefresh className="cursor-pointer hover:text-white hover:bg-vscode-hover/80 p-1 rounded" title="Rafraîchir" />
              <VscCollapseAll className="cursor-pointer hover:text-white hover:bg-vscode-hover/80 p-1 rounded" title="Réduire" />
            </div>
          </div>

          {/* Liste des fichiers */}
          {isOpen && (
            <ul className="mt-4 space-y-0.5 text-sm text-gray-400 pl-2 pr-1 max-h-[calc(100vh-16rem)] overflow-y-auto">
              {files.map((file) => (
                (() => {
                  const isActive = activeTab === file;
                  return (
                <li
                  key={file}
                  onClick={() => handleFileClick(file)}
                  className={`group flex items-center justify-between cursor-pointer px-2 py-1 rounded transition-colors hover:text-white hover:bg-vscode-hover ${
                    file === "MonCV.json" ? "text-green-400" : ""
                  } ${
                    isActive
                      ? "bg-vscode-hover/80 text-white shadow-[inset_2px_0_0_0_rgba(0,122,204,0.95)]"
                      : ""
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
                  );
                })()
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Bas du menu */}
      <div className="border-t border-vscode-border text-gray-400">
        <div className="flex items-center gap-2 px-4 py-1 text-sm hover:bg-vscode-hover cursor-pointer">
          <VscSymbolInterface className="text-lg" />
          <span>OUTLINE</span>
        </div>
        <div className="flex items-center border-t border-vscode-border gap-2 px-4 py-1 text-sm hover:bg-vscode-hover cursor-pointer">
          <VscHistory className="text-lg" />
          <span>TIMELINE</span>
        </div>
      </div>
    </aside>
  );
};

export default IndexClique;
