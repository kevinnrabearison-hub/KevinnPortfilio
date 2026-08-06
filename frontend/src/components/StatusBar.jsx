import React from 'react';
import {
  FaTimesCircle,
  FaExclamationTriangle,
  FaBroadcastTower,
  FaBell,
  FaGitAlt,
  FaTerminal,
} from "react-icons/fa";

const StatusBar = ({ onToggleTerminal, onOpenCommandPalette }) => {
  return (
    <footer className="w-full h-6 bg-vscode-statusbar text-white text-[11px] font-mono flex items-center justify-between px-3 border-t border-vscode-border select-none z-30">
      {/* Left Items */}
      <div className="flex items-center space-x-3">
        {/* Remote / Git Branch */}
        <button
          onClick={onToggleTerminal}
          className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-vscode-statusbarHover transition-colors"
          title="Branche Git actuelle"
        >
          <FaGitAlt className="text-white text-xs" />
          <span className="font-semibold">main*</span>
        </button>

        <button
          onClick={onToggleTerminal}
          className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-vscode-statusbarHover transition-colors text-red-200"
          title="Erreurs"
        >
          <FaTimesCircle className="text-red-300 text-xs" />
          <span>0</span>
        </button>

        <button
          onClick={onToggleTerminal}
          className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-vscode-statusbarHover transition-colors text-yellow-200"
          title="Avertissements"
        >
          <FaExclamationTriangle className="text-yellow-300 text-xs" />
          <span>0</span>
        </button>

        <button
          onClick={onToggleTerminal}
          className="hidden sm:flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-vscode-statusbarHover transition-colors text-gray-200"
          title="Ouvrir le Terminal"
        >
          <FaTerminal className="text-xs" />
          <span>Terminal</span>
        </button>
      </div>

      {/* Center Details */}
      <div className="hidden lg:flex items-center space-x-4 text-gray-200">
        <span>Ln 42, Col 18</span>
        <span>Espaces: 2</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span className="text-sky-200 font-semibold">{`{ }`} React JSX</span>
      </div>

      {/* Right Action Items */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onOpenCommandPalette && onOpenCommandPalette(true)}
          className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-vscode-statusbarHover transition-colors"
          title="Statut du serveur de développement"
        >
          <FaBroadcastTower className="text-emerald-300 animate-pulse text-xs" />
          <span>Port 5173</span>
        </button>

        <span className="px-1.5 py-0.5 rounded hover:bg-vscode-statusbarHover transition-colors cursor-pointer hidden sm:inline">
          ✓ Prettier
        </span>

        <button
          onClick={() => onOpenCommandPalette && onOpenCommandPalette(true)}
          className="px-2 py-0.5 rounded hover:bg-vscode-statusbarHover transition-colors"
          title="Notifications"
        >
          <FaBell className="text-xs" />
        </button>
      </div>
    </footer>
  );
};

export default StatusBar;
