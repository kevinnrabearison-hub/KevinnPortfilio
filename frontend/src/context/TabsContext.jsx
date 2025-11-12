// src/context/TabsContext.jsx
import { createContext, useContext, useState } from "react";

const TabsContext = createContext();

export const TabsProvider = ({ children }) => {
  const [tabs, setTabs] = useState(["Accueil.jsx"]);
  const [activeTab, setActiveTab] = useState("Accueil.jsx");

  const openTab = (file) => {
    setTabs((prev) => (prev.includes(file) ? prev : [...prev, file]));
    setActiveTab(file);
  };

  const closeTab = (file) => {
    setTabs((prev) => prev.filter((t) => t !== file));
    if (activeTab === file) {
      const index = tabs.indexOf(file);
      const nextTab = tabs[index - 1] || tabs[index + 1] || null;
      setActiveTab(nextTab);
    }
  };

  return (
    <TabsContext.Provider value={{ tabs, activeTab, openTab, closeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabs = () => useContext(TabsContext);
