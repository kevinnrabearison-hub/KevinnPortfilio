import { useTabs } from "../context/TabsContext";
import { VscChromeClose } from "react-icons/vsc";

const TabHeader = () => {
  const { tabs, activeTab, closeTab, setActiveTab } = useTabs();

  if (tabs.length === 0) return null;

  return (
    <div className="flex items-center bg-vscode-tabbar h-9 px-2 text-sm text-white border-b border-vscode-border">
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`flex items-center px-3 py-1 mr-1 rounded-t-md cursor-pointer hover:bg-vscode-hover ${
            tab === activeTab ? "bg-vscode-tabActive font-semibold" : ""
          }`}
          onClick={() => setActiveTab(tab)}
        >
          <img src="/logo/jsx-atom.svg" alt="jsx" className="w-4 h-4 mr-1" />
          <span>{tab}</span>
          <VscChromeClose
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab);
            }}
            className="ml-2 hover:text-red-400"
          />
        </div>
      ))}
    </div>
  );
};

export default TabHeader;
