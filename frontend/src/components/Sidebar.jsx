import { useState } from "react";
import {
  VscFiles,
  VscSearch,
  VscSourceControl,
  VscDebugAlt,
  VscExtensions,
  VscAccount,
  VscSettingsGear,
} from "react-icons/vsc";
import { useTabs } from "../context/TabsContext";

const Sidebar = ({ onOpenCommandPalette, onToggleTerminal }) => {
  const [active, setActive] = useState("files");
  const { openTab } = useTabs();

  const menuItems = [
    { id: "files", icon: <VscFiles />, tooltip: "Explorateur de fichiers", file: "Accueil.jsx" },
    {
      id: "search",
      icon: <VscSearch />,
      tooltip: "Rechercher (Ctrl+K)",
      action: () => onOpenCommandPalette(true),
    },
    { id: "source", icon: <VscSourceControl />, tooltip: "Contrôle de source (Git)", badge: "3" },
    { id: "debug", icon: <VscDebugAlt />, tooltip: "Exécuter & Déboguer", action: onToggleTerminal },
    { id: "extensions", icon: <VscExtensions />, tooltip: "Extensions VS Code" },
  ];

  const bottomItems = [
    { id: "account", icon: <VscAccount />, tooltip: "Compte — Kevinn Rabearison", file: "Apropos.jsx" },
    { id: "settings", icon: <VscSettingsGear />, tooltip: "Paramètres (Command Palette)", action: () => onOpenCommandPalette(true) },
  ];

  const Item = ({ id, icon, tooltip, file, badge, action }) => (
    <div
      onClick={() => {
        setActive(id);
        if (action) action();
        else if (file) openTab(file);
      }}
      className={`relative flex items-center justify-center h-12 w-full cursor-pointer transition-all duration-200 group
        ${
          active === id
            ? "text-white bg-vscode-hover/50"
            : "text-gray-400 hover:text-white hover:bg-vscode-hover/30"
        }`}
      title={tooltip}
    >
      {active === id && (
        <div className="absolute left-0 top-0 h-full w-1 bg-vscode-statusbar rounded-r shadow-[0_0_10px_rgba(0,122,204,0.8)]" />
      )}
      <div className="text-2xl group-hover:scale-110 transition-transform relative">
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-vscode-activitybar">
            {badge}
          </span>
        )}
      </div>

      {/* Hover Tooltip */}
      <span className="absolute left-14 px-2 py-1 bg-vscode-sidebar border border-vscode-border text-gray-200 text-xs rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {tooltip}
      </span>
    </div>
  );

  return (
    <aside className="w-14 h-full bg-vscode-activitybar flex flex-col justify-between py-2 border-r border-vscode-border select-none z-20">
      <nav className="flex flex-col space-y-1">
        {menuItems.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </nav>

      <div className="flex flex-col space-y-1">
        {bottomItems.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
