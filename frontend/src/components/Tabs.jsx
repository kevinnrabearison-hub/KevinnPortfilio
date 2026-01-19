import { FaTimes } from "react-icons/fa";
import { VscSplitHorizontal, VscEllipsis } from "react-icons/vsc";
import { useTabs } from "../context/TabsContext";

const Tabs = () => {
  const { tabs, activeTab, setActiveTab, closeTab } = useTabs();

  return (
    <div className="flex items-center justify-between bg-vscode-tabbar h-10 px-2 border-b border-vscode-border">
      <div className="flex min-w-0 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`group flex items-center gap-2 px-4 h-9 text-sm cursor-pointer border-r border-vscode-border whitespace-nowrap select-none
              ${tab === activeTab ? "bg-vscode-tabActive text-white" : "bg-vscode-tabbar text-gray-400 hover:text-white hover:bg-vscode-hover"}`}
          >
            <img src="/logo/jsx-atom.svg" alt="jsx" className="w-4 h-4 mr-2" />
            {tab}
            <FaTimes
              className="ml-1 text-xs text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab);
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-3 text-white text-lg">
        <VscSplitHorizontal className="cursor-pointer hover:text-gray-300" />
        <VscEllipsis className="cursor-pointer hover:text-gray-300" />
      </div>
    </div>
  );
};

export default Tabs;
