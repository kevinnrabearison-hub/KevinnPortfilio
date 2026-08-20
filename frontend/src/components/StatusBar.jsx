import React from 'react';
import {
  FaTimesCircle,
  FaExclamationTriangle,
  FaBroadcastTower,
  FaBell,
  FaGitAlt,
  FaTerminal,
  FaEye,
} from "react-icons/fa";

const StatusBar = ({ onToggleTerminal, onOpenCommandPalette, visitorCount, compact = false }) => {
  return (
    <footer className={`flex w-full items-center justify-between border-t border-vscode-border bg-vscode-statusbar font-mono text-white select-none z-30 ${compact ? "h-7 px-2 text-[10px]" : "h-6 px-3 text-[11px]"}`}>
      <div className="flex items-center space-x-3">
        <button onClick={onToggleTerminal} className="flex items-center space-x-1 rounded px-2 py-0.5 hover:bg-vscode-statusbarHover transition-colors" title="Branche Git actuelle">
          <FaGitAlt className="text-xs text-white" />
          <span className="font-semibold">main*</span>
        </button>
        <button onClick={onToggleTerminal} className="flex items-center space-x-1 rounded px-2 py-0.5 text-red-200 hover:bg-vscode-statusbarHover transition-colors" title="Erreurs">
          <FaTimesCircle className="text-xs text-red-300" />
          <span>0</span>
        </button>
        <button onClick={onToggleTerminal} className="flex items-center space-x-1 rounded px-2 py-0.5 text-yellow-200 hover:bg-vscode-statusbarHover transition-colors" title="Avertissements">
          <FaExclamationTriangle className="text-xs text-yellow-300" />
          <span>0</span>
        </button>
        <button onClick={onToggleTerminal} className={`${compact ? "hidden" : "hidden sm:flex"} items-center space-x-1 rounded px-2 py-0.5 text-gray-200 hover:bg-vscode-statusbarHover transition-colors`} title="Ouvrir le Terminal">
          <FaTerminal className="text-xs" />
          <span>Terminal</span>
        </button>
      </div>

      <div className="hidden items-center space-x-4 text-gray-200 lg:flex">
        <span>Ln 42, Col 18</span>
        <span>Espaces: 2</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span className="font-semibold text-sky-200">{`{ }`} React JSX</span>
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={() => onOpenCommandPalette && onOpenCommandPalette(true)} className="flex items-center space-x-1 rounded px-2 py-0.5 hover:bg-vscode-statusbarHover transition-colors" title="Statut du serveur de développement">
          <FaBroadcastTower className="animate-pulse text-xs text-emerald-300" />
          <span className={compact ? "hidden" : "inline"}>Port 5173</span>
        </button>
        <span className="hidden rounded px-1.5 py-0.5 hover:bg-vscode-statusbarHover transition-colors sm:inline">✓ Prettier</span>
        <span className={`flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-vscode-statusbarHover px-2 py-0.5 font-semibold text-white shadow-sm ${compact ? "min-w-[78px]" : "min-w-[112px]"}`} title="Visiteurs uniques du portfolio">
          <FaEye className="text-sm text-cyan-200" />
          <span className="tabular-nums">{visitorCount ?? "-"}</span>
          <span>{compact ? "vues env." : "visiteurs env."}</span>
        </span>
        <button onClick={() => onOpenCommandPalette && onOpenCommandPalette(true)} className="rounded px-2 py-0.5 hover:bg-vscode-statusbarHover transition-colors" title="Notifications">
          <FaBell className="text-xs" />
        </button>
      </div>
    </footer>
  );
};

export default StatusBar;
