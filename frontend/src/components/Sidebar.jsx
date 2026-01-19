import {
  VscFiles,
  VscSearch,
  VscSourceControl,
  VscDebugAlt,
  VscExtensions,
  VscAccount,
  VscSettingsGear,
} from "react-icons/vsc";

import { useState } from "react";
import { useTabs } from "../context/TabsContext";

const Sidebar = () => {
  const [active, setActive] = useState("files");
  const { openTab } = useTabs();

  const menuItems = [
    { id: "files", icon: <VscFiles />, tooltip: "Explorer", file: "Accueil.jsx" },
    { id: "search", icon: <VscSearch />, tooltip: "Rechercher" },
    { id: "source", icon: <VscSourceControl />, tooltip: "Contrôle de source" },
    { id: "debug", icon: <VscDebugAlt />, tooltip: "Déboguer" },
    { id: "extensions", icon: <VscExtensions />, tooltip: "Extensions" },
  ];

  const bottomItems = [
    { id: "account", icon: <VscAccount />, tooltip: "Compte" },
    { id: "settings", icon: <VscSettingsGear />, tooltip: "Paramètres" },
  ];

  const Item = ({ id, icon, tooltip, file }) => (
    <div
      onClick={() => {
        setActive(id);
        if (file) openTab(file); 
      }}
      className={`relative flex items-center justify-center h-12 w-full cursor-pointer transition-colors
        hover:text-white hover:bg-vscode-hover
        ${active === id ? "text-white" : "text-gray-400"}`}
      title={tooltip}
    >
      {active === id && (
        <div className="absolute left-0 top-0 h-full w-1 bg-vscode-statusbar rounded-r" />
      )}
      <div className="text-2xl">{icon}</div>
    </div>
  );

  return (
    <aside className="w-14 h-full bg-vscode-activitybar flex flex-col justify-between py-2 border-r border-vscode-border">
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </nav>
      <div className="flex flex-col space-y-2">
        {bottomItems.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
