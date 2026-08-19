import { FaTimes } from "react-icons/fa";
import { VscChevronRight, VscFileCode } from "react-icons/vsc";
import { useTabs } from "../context/TabsContext";

const getTabIcon = (tabName) => {
  if (tabName.endsWith(".jsx")) {
    return (
      <svg className="w-3.5 h-3.5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="2.5" />
        <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M12 4.5c4.5 0 8 3.36 8 7.5s-3.5 7.5-8 7.5-8-3.36-8-7.5 3.5-7.5 8-7.5z" transform="rotate(30 12 12)" />
        <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M12 4.5c4.5 0 8 3.36 8 7.5s-3.5 7.5-8 7.5-8-3.36-8-7.5 3.5-7.5 8-7.5z" transform="rotate(-30 12 12)" />
      </svg>
    );
  }
  return <img src="/logo/jsx-atom.svg" alt="jsx" className="w-3.5 h-3.5 shrink-0" />;
};

const Tabs = () => {
  const { tabs, activeTab, setActiveTab, closeTab } = useTabs();

  return (
    <div className="bg-vscode-tabbar border-b border-vscode-border select-none">
      {/* Tabs Header Row */}
      <div className="flex items-center justify-between h-9 px-1 overflow-x-auto scrollbar-none">
        <div className="flex items-center min-w-0">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group flex items-center gap-2 px-3 h-9 text-xs cursor-pointer border-r border-vscode-border whitespace-nowrap select-none border-t-2 transition-all ${
                  isActive
                    ? "bg-vscode-tabActive text-white border-t-vscode-statusbar font-medium"
                    : "bg-vscode-tabInactive text-gray-400 hover:text-gray-200 hover:bg-vscode-hover border-t-transparent"
                }`}
              >
                {getTabIcon(tab)}
                <span>{tab}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab);
                  }}
                  className="ml-1 p-0.5 rounded text-gray-400 hover:text-white hover:bg-vscode-hover opacity-60 group-hover:opacity-100 transition-opacity"
                  title="Fermer (Ctrl+W)"
                >
                  <FaTimes className="text-[10px]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breadcrumb Trail (Fil d'Ariane) */}
      <div className="flex items-center px-4 py-1 bg-vscode-editor/80 border-t border-vscode-border/50 text-[11px] font-mono text-white space-x-1.5 overflow-x-auto">
        <span className="hover:text-white cursor-pointer">portfolio</span>
        <VscChevronRight className="text-white text-[10px]" />
        <span className="hover:text-white cursor-pointer">src</span>
        <VscChevronRight className="text-white text-[10px]" />
        <span className="hover:text-white cursor-pointer">components</span>
        <VscChevronRight className="text-white text-[10px]" />
        <div className="flex items-center space-x-1 text-sky-400 font-semibold">
          <VscFileCode size={13} />
          <span>{activeTab}</span>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
