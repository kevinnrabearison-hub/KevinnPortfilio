import React from 'react';
import {
  VscLayoutSidebarLeft,
  VscLayoutPanel,
  VscLayoutSidebarRight,
  VscSearch,
  VscBell,
  VscColorMode,
} from 'react-icons/vsc';
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const Entete = ({ onOpenCommandPalette, onToggleTerminal }) => {
  const { theme, setTheme, themes } = useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between bg-vscode-titlebar h-9 px-3 text-gray-300 border-b border-vscode-border w-full select-none text-xs font-sans z-50">
      {/* Left: Window Dots & VS Code Menus */}
      <div className="flex items-center space-x-3">
        {/* macOS style Window controls */}
        <div className="flex items-center space-x-1.5 mr-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 cursor-pointer transition-all border border-black/20" title="Fermer" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 cursor-pointer transition-all border border-black/20" title="Réduire" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 cursor-pointer transition-all border border-black/20" title="Agrandir" />
        </div>

        <img src="/logo/vscode.svg" alt="VSCode Logo" className="w-4 h-4 hover:rotate-12 transition-transform" />

        <nav className="hidden md:flex items-center space-x-1 text-gray-300 font-medium">
          <button className="px-2 py-0.5 rounded hover:bg-vscode-hover hover:text-white transition-colors">Fichier</button>
          <button className="px-2 py-0.5 rounded hover:bg-vscode-hover hover:text-white transition-colors">Édition</button>
          <button className="px-2 py-0.5 rounded hover:bg-vscode-hover hover:text-white transition-colors">Sélection</button>
          <button className="px-2 py-0.5 rounded hover:bg-vscode-hover hover:text-white transition-colors">Affichage</button>
          <button className="px-2 py-0.5 rounded hover:bg-vscode-hover hover:text-white transition-colors" onClick={onToggleTerminal}>Terminal</button>
          <button className="px-2 py-0.5 rounded hover:bg-vscode-hover hover:text-white transition-colors" onClick={() => onOpenCommandPalette(true)}>Aide</button>
        </nav>
      </div>

      {/* Center: Command Palette Trigger Input */}
      <div className="flex-1 max-w-lg mx-4">
        <button
          onClick={() => onOpenCommandPalette(true)}
          className="w-full flex items-center justify-between px-3 py-1 rounded-md bg-vscode-hover/70 hover:bg-vscode-hover text-gray-400 hover:text-gray-200 border border-vscode-border/70 transition-all text-xs group"
        >
          <div className="flex items-center space-x-2 truncate">
            <VscSearch className="text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="truncate">Kevinn Portfolio — Command Palette (Recherche)</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-vscode-editor/80 border border-vscode-border rounded text-[10px] text-gray-400 font-mono">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right: Layout Controls & Notifications */}
      <div className="flex items-center space-x-2 text-gray-400">
        <div className="relative">
          <button
            onClick={() => setIsThemeMenuOpen((isOpen) => !isOpen)}
            className="p-1 rounded hover:bg-vscode-hover hover:text-white transition-colors"
            title="Changer le thème de couleurs"
            aria-label="Changer le thème de couleurs"
            aria-expanded={isThemeMenuOpen}
          >
            <VscColorMode size={15} />
          </button>
          {isThemeMenuOpen && (
            <div className="absolute right-0 top-8 z-50 w-44 rounded-md border border-vscode-border bg-vscode-sidebar p-1 shadow-2xl">
              <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-gray-500">Color Theme</p>
              {Object.entries(themes).map(([themeId, themeOption]) => (
                <button
                  key={themeId}
                  onClick={() => {
                    setTheme(themeId);
                    setIsThemeMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors hover:bg-vscode-hover ${
                    theme === themeId ? "bg-vscode-hover text-white" : "text-gray-300"
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-sm border border-white/20"
                    style={{ backgroundColor: themeOption.swatch }}
                  />
                  {themeOption.label}
                  {theme === themeId && <span className="ml-auto text-sky-400">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={onToggleTerminal}
          className="p-1 rounded hover:bg-vscode-hover hover:text-white transition-colors"
          title="Basculer le terminal"
        >
          <VscLayoutPanel size={15} />
        </button>
        <button
          className="p-1 rounded hover:bg-vscode-hover hover:text-white transition-colors hidden sm:block"
          title="Disposition du volet"
        >
          <VscLayoutSidebarLeft size={15} />
        </button>
        <button
          className="p-1 rounded hover:bg-vscode-hover hover:text-white transition-colors hidden sm:block"
          title="Disposition secondaire"
        >
          <VscLayoutSidebarRight size={15} />
        </button>
        <button
          onClick={() => onOpenCommandPalette(true)}
          className="p-1 rounded hover:bg-vscode-hover hover:text-white transition-colors relative"
          title="Notifications"
        >
          <VscBell size={15} />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        </button>
      </div>
    </header>
  );
};

export default Entete;
