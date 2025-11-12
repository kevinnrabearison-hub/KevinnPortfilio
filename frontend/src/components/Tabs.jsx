import { FaTimes } from "react-icons/fa";
import { VscSplitHorizontal, VscEllipsis } from "react-icons/vsc";
import { useTabs } from "../context/TabsContext";

const Tabs = () => {
  const { tabs, activeTab, setActiveTab, closeTab } = useTabs();

  return (
    <div className="flex items-center justify-between  bg-[#1e1e1e] h-10 px-3 border-b border-gray-700">
      <div className="flex space-x-2">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center px-6 py-[9px] text-sm rounded-t-sm cursor-pointer
              ${tab === activeTab ? "bg-[#2d2d2d] text-white" : "bg-[#1e1e1e] text-gray-400 hover:text-white"}`}
          >
            <img src="/logo/jsx-atom.svg" alt="jsx" className="w-4 h-4 mr-2" />
            {tab}
            <FaTimes
              className="ml-2 text-xs hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab);
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-4 text-white text-lg">
        <VscSplitHorizontal className="cursor-pointer hover:text-gray-300" />
        <VscEllipsis className="cursor-pointer hover:text-gray-300" />
      </div>
    </div>
  );
};

export default Tabs;
