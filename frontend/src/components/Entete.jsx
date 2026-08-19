import React from 'react';
import {
  VscLayoutSidebarLeft,
  VscLayoutPanel,
  VscLayoutSidebarRight,
  VscSearch,
  VscBell,
  VscColorMode,
} from 'react-icons/vsc';

const Entete = ({ onOpenCommandPalette, onToggleTerminal, onOpenSettings }) => {
  return (
    <header className="flex h-9 w-full min-w-0 items-center justify-between border-b border-vscode-border bg-vscode-titlebar px-2 text-xs font-sans text-gray-300 select-none sm:px-3 z-50">
      {/* Left: Window Dots & VS Code Menus */}
      <div className="flex shrink-0 items-center space-x-2 sm:space-x-3">
        {/* macOS style Window controls */}
        <div className="mr-1 flex items-center space-x-1 sm:mr-2 sm:space-x-1.5">
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
      <div className="min-w-0 max-w-lg flex-1 mx-1 sm:mx-4">
        <button
          onClick={() => onOpenCommandPalette(true)}
          className="flex w-full min-w-0 items-center justify-between rounded-md border border-vscode-border/70 bg-vscode-hover/70 px-2 py-1 text-xs text-gray-400 transition-all hover:bg-vscode-hover hover:text-gray-200 group sm:px-3"
        >
          <div className="flex min-w-0 items-center space-x-1.5 truncate sm:space-x-2">
            <VscSearch className="text-[#5ab3d5] group-hover:scale-110 transition-transform" />
            <span className="truncate sm:hidden">Rechercher...</span>
            <span className="hidden truncate sm:inline">Kevinn Portfolio — Command Palette (Recherche)</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-vscode-editor/80 border border-vscode-border rounded text-[10px] text-gray-400 font-mono">
            Ctrl + K
          </kbd>
        </button>
      </div>
            <button
        onClick={onOpenSettings}
        className="flex shrink-0 items-center gap-1 rounded px-1.5 py-1 text-gray-400 transition-colors hover:bg-vscode-hover hover:text-white sm:gap-1.5 sm:px-2"
        title="Thème de couleurs"
        aria-label="Ouvrir les thèmes de couleurs"
      >
        <VscColorMode size={15} />
        <span className="hidden text-[11px] sm:inline">Thème</span>
      </button>

      {/* Right: Layout Controls & Notifications */}
      <div className="flex shrink-0 items-center space-x-1 text-gray-400 sm:space-x-2">
        <button
          onClick={onToggleTerminal}
          className="rounded p-1 hover:bg-vscode-hover hover:text-white transition-colors"
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
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#5ab3d5] animate-pulse" />
        </button>
      </div>
    </header>
  );
};

export default Entete;
