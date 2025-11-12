import { useTabs } from "../context/TabsContext";
import { VscChromeClose } from "react-icons/vsc";

const TabHeader = () => {
  const { openTabs, activeTab, closeTab, setActiveTab } = useTabs();

  if (openTabs.length === 0) return null;

  return (
    <div className="flex items-center bg-[#1e1e1e] h-9 px-2 text-sm text-white border-b border-gray-700">
      {openTabs.map((tab) => (
        <div
          key={tab}
          className={`flex items-center px-3 py-1 mr-1 rounded-t-md cursor-pointer hover:bg-[#2a2a2a] ${
            tab === activeTab ? "bg-[#2d2d2d] font-semibold" : ""
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
