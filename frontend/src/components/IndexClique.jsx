import { useState, useRef, useEffect } from "react";
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
import { downloadAndOpenCV } from "../utils/downloadCv";

const getFileIcon = (file) => {
  if (file === "MonCV.json") {
    return <FiDownload className="text-emerald-400 text-sm hover:scale-110 transition-transform" />;
  }
  if (file.endsWith(".jsx")) {
    return (
      <svg className="w-4 h-4 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="2.5" />
        <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M12 4.5c4.5 0 8 3.36 8 7.5s-3.5 7.5-8 7.5-8-3.36-8-7.5 3.5-7.5 8-7.5z" transform="rotate(30 12 12)" />
        <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M12 4.5c4.5 0 8 3.36 8 7.5s-3.5 7.5-8 7.5-8-3.36-8-7.5 3.5-7.5 8-7.5z" transform="rotate(-30 12 12)" />
      </svg>
    );
  }
  return <img src="/logo/jsx-atom.svg" alt="JSX" className="w-4 h-4 shrink-0" />;
};

const IndexClique = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { openTab, activeTab } = useTabs();

  // resize state for the sidebar (drag right edge)
  const [width, setWidth] = useState(240); // px (w-60 ≈ 240px)
  const MIN_WIDTH = 48; // collapsed / icon-only minimum
  const MAX_WIDTH = 420; // reasonable maximum width
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizingRef.current) return;
      const dx = e.clientX - startXRef.current;
      const newW = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidthRef.current + dx));
      setWidth(newW);
    };

    const onMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        document.body.style.cursor = "";
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const handleResizerDown = (e) => {
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.body.style.cursor = "col-resize";
    e.preventDefault();
  };

  const files = [
    { name: "Accueil.jsx", label: "Accueil.jsx", tag: "JSX" },
    { name: "Competence.jsx", label: "Competence.jsx", tag: "JSX" },
    { name: "Projet.jsx", label: "Projet.jsx", tag: "JSX" },
    { name: "Apropos.jsx", label: "Apropos.jsx", tag: "JSX" },
    { name: "Contact.jsx", label: "Contact.jsx", tag: "JSX" },
    { name: "MonCV.json", label: "Télécharger CV (PDF)", tag: "PDF" },
  ];

  const handleFileClick = (file) => {
    if (file === "MonCV.json") {
      downloadAndOpenCV();
    } else {
      openTab(file);
    }
  };

  return (
    <aside
      className="h-full bg-vscode-sidebar flex flex-col justify-between py-2 border-r border-vscode-border select-none overflow-hidden font-sans text-xs relative"
      style={{ width: `${width}px` }}
    >
      <div>
        {/* Sidebar Header Title */}
        <div className="text-gray-400 bg-vscode-sidebar flex justify-between items-center px-3 py-1 font-semibold tracking-wider text-[11px] uppercase border-b border-vscode-border/40">
          <span>Explorateur</span>
          <button className="px-1 rounded hover:bg-vscode-hover hover:text-white" type="button" title="Plus d'actions">
            ...
          </button>
        </div>

        {/* Project Directory Section */}
        <div className="px-2 py-2 text-vscode-foreground">
          <div className="flex items-center justify-between py-1 px-1 rounded hover:bg-vscode-hover/40 transition-colors">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 hover:text-white font-semibold text-gray-200"
            >
              <VscTriangleDown
                className={`transition-transform duration-200 text-gray-400 ${
                  isOpen ? "rotate-0" : "-rotate-90"
                }`}
              />
              <span className="truncate">KEVINN-PORTFOLIO</span>
            </button>

            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <VscNewFile className="cursor-pointer hover:text-white p-0.5 rounded" title="Nouveau fichier" />
              <VscNewFolder className="cursor-pointer hover:text-white p-0.5 rounded" title="Nouveau dossier" />
              <VscRefresh className="cursor-pointer hover:text-white p-0.5 rounded" title="Rafraîchir" />
              <VscCollapseAll className="cursor-pointer hover:text-white p-0.5 rounded" title="Réduire" />
            </div>
          </div>

          {/* File Tree Items */}
          {isOpen && (
            <ul className="mt-1 space-y-0.5 pl-3">
              {files.map((item) => {
                const isActive = activeTab === item.name;
                return (
                  <li
                    key={item.name}
                    onClick={() => handleFileClick(item.name)}
                    className={`group flex items-center justify-between cursor-pointer px-2 py-1.5 rounded transition-all duration-150 ${
                      isActive
                        ? "bg-vscode-hover text-white font-medium shadow-[inset_2px_0_0_0_rgba(0,122,204,1)]"
                        : "text-gray-400 hover:text-gray-200 hover:bg-vscode-hover/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getFileIcon(item.name)}
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.name === "MonCV.json" && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-800 font-mono">
                        PDF
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Sidebar Footer Sections */}
      <div className="border-t border-vscode-border text-gray-400 text-[11px] font-mono">
        <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-vscode-hover cursor-pointer transition-colors">
          <VscSymbolInterface className="text-blue-400" />
          <span>OUTLINE</span>
        </div>
        <div className="flex items-center border-t border-vscode-border/50 gap-2 px-3 py-1.5 hover:bg-vscode-hover cursor-pointer transition-colors">
          <VscHistory className="text-purple-400" />
          <span>TIMELINE</span>
        </div>
      </div>
      {/* resizer: small hit area on right edge to change cursor and start drag */}
      <div
        onMouseDown={handleResizerDown}
        className="absolute top-0 right-0 h-full w-1 -mr-1 z-50 hover:bg-vscode-hover/30 cursor-col-resize"
        title="Redimensionner la barre (glisser la bordure droite)"
      />
    </aside>
  );
};

export default IndexClique;
