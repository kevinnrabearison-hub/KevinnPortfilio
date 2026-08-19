import React, { useState, useRef, useEffect } from "react";
import { X, Terminal as TerminalIcon, Maximize2, Minimize2, Trash2, CheckCircle2 } from "lucide-react";
import { useTabs } from "../context/TabsContext";
import { useTheme } from "../context/ThemeContext";
import { downloadAndOpenCV } from "../utils/downloadCv";

export default function Terminal({ isOpen, onClose }) {
  const [history, setHistory] = useState([
    { type: "info", text: "VS Code Embedded Terminal v2.4 [bash]" },
    { type: "info", text: "Tapez 'help' pour afficher la liste des commandes disponibles." },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { openTab } = useTabs();
  const { theme, setTheme, themes } = useTheme();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const newHistory = [...history, { type: "cmd", text: `kevinn@portfolio:~$ ${cmd}` }];

    const lowerCmd = cmd.toLowerCase();
    const [commandName, ...commandArguments] = lowerCmd.split(/\s+/);

    if (lowerCmd === "help") {
      newHistory.push({
        type: "output",
        text: `Commandes disponibles :
  - help      : Affiche ce message d'aide
  - about     : En savoir plus sur Kevinn Rabearison
  - skills    : Liste des compétences principales
  - projects  : Afficher la liste des projets
  - contact   : Informations de contact rapides
  - cv        : Télécharger le CV (PDF)
  - theme     : Lister les thèmes disponibles
  - theme ID  : Appliquer un thème (ex: theme monokai)
  - clear     : Effacer la console
  - date      : Afficher l'heure locale`,
      });
    } else if (commandName === "theme") {
      const requestedTheme = commandArguments.join(" ");

      if (!requestedTheme || requestedTheme === "list" || requestedTheme === "help") {
        newHistory.push({
          type: "output",
          text: `Thèmes disponibles :\n${Object.entries(themes)
            .map(([themeId, option]) => `  - ${themeId.padEnd(14)} ${option.label}${theme === themeId ? "  (actif)" : ""}`)
            .join("\n")}\n\nUsage : theme <id>`,
        });
      } else {
        const matchingTheme = Object.entries(themes).find(
          ([themeId, option]) =>
            themeId === requestedTheme || option.label.toLowerCase() === requestedTheme
        );

        if (matchingTheme) {
          setTheme(matchingTheme[0]);
          newHistory.push({
            type: "success",
            text: `Thème activé : ${matchingTheme[1].label}`,
          });
        } else {
          newHistory.push({
            type: "error",
            text: `Thème inconnu : '${requestedTheme}'. Tapez 'theme' pour voir la liste.`,
          });
        }
      }
    } else if (commandName === "about") {
      newHistory.push({
        type: "output",
        text: `Rabearison Fy Tahina Kevinn - Étudiant en Licence (INSI), parcours Génie Logiciel (GL).
Passionné par la création d'applications web & mobiles modernes, performantes et élégantes.`,
      });
      openTab("Apropos.jsx");
    } else if (lowerCmd === "skills") {
      newHistory.push({
        type: "output",
        text: `Frontend: React, Vue, Angular, Tailwind CSS, TypeScript
Backend: Node.js, Express, Django, Symfony, REST API
Mobile: React Native, Flutter
DevOps & BDD: Docker, Git, MongoDB, PostgreSQL, MySQL`,
      });
      openTab("Competence.jsx");
    } else if (lowerCmd === "projects") {
      newHistory.push({
        type: "output",
        text: `1. Portfolio VS Code (React, Tailwind, Framer Motion)
2. BenevolatApp (React Native, Expo, Firebase)
3. TaskManager CI/CD (MEVN, Docker)
4. Vote Électronique (React, Django, PostgreSQL)`,
      });
      openTab("Projet.jsx");
    } else if (lowerCmd === "contact") {
      newHistory.push({
        type: "output",
        text: `Email: kevinnrabearison@gmail.com | Tel: 038 35 482 45 | GitHub: @kevinnrabearison-hub`,
      });
      openTab("Contact.jsx");
    } else if (lowerCmd === "cv") {
      downloadAndOpenCV();
      newHistory.push({ type: "success", text: "Ouverture et téléchargement du CV KEVINN.pdf en cours !" });
    } else if (lowerCmd === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    } else if (lowerCmd === "date") {
      newHistory.push({ type: "output", text: new Date().toLocaleString() });
    } else if (lowerCmd.startsWith("echo ")) {
      newHistory.push({ type: "output", text: cmd.substring(5) });
    } else {
      newHistory.push({
        type: "error",
        text: `Commande non reconnue : '${cmd}'. Tapez 'help' pour la liste.`,
      });
    }

    setHistory(newHistory);
    setInputVal("");
  };

  return (
    <div
      className={`fixed bottom-6 left-0 right-0 z-40 bg-vscode-terminal border-t border-vscode-border font-mono text-xs text-gray-200 transition-all duration-300 shadow-2xl ${
        isExpanded ? "h-[60vh]" : "h-56"
      }`}
    >
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-vscode-titlebar border-b border-vscode-border select-none">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-blue-400 font-semibold">
            <TerminalIcon size={14} />
            <span>TERMINAL</span>
          </div>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400 text-[11px]">bash (node v20.19.4)</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setHistory([])}
            title="Effacer"
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-vscode-hover"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Réduire" : "Agrandir"}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-vscode-hover"
          >
            {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          <button
            onClick={onClose}
            title="Fermer"
            className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-vscode-hover"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-3 h-[calc(100%-2.25rem)] overflow-y-auto font-mono space-y-1.5 leading-relaxed">
        {history.map((item, idx) => (
          <div key={idx} className="break-words">
            {item.type === "cmd" && <span className="text-[#5ab3d5] font-semibold">{item.text}</span>}
            {item.type === "info" && <span className="text-gray-400">{item.text}</span>}
            {item.type === "output" && <pre className="text-gray-300 whitespace-pre-wrap font-mono">{item.text}</pre>}
            {item.type === "success" && (
              <span className="text-[#5ab3d5] flex items-center gap-1">
                <CheckCircle2 size={12} /> {item.text}
              </span>
            )}
            {item.type === "error" && <span className="text-red-400">{item.text}</span>}
          </div>
        ))}

        <form onSubmit={handleCommand} className="flex items-center space-x-2 pt-1">
          <span className="text-[#5ab3d5] font-semibold select-none">kevinn@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-100 font-mono text-xs focus:ring-0"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
