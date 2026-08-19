import { X, Check, Search, Palette, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeSettings({ isOpen, onClose }) {
  const { theme, setTheme, themes } = useTheme();
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState(null);

  if (!isOpen) return null;

  const filteredThemes = Object.entries(themes).filter(([, option]) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[9998] flex items-start justify-center bg-black/60 px-4 pt-20 backdrop-blur-sm">
      <section className="w-full max-w-xl overflow-hidden rounded-xl border border-vscode-border bg-vscode-sidebar font-mono shadow-2xl glass-panel">
        <header className="flex items-center justify-between border-b border-vscode-border bg-vscode-titlebar px-4 py-3">
          <div className="flex items-center gap-2">
            {activeSection && (
              <button
                onClick={() => {
                  setActiveSection(null);
                  setQuery("");
                }}
                className="rounded p-1 text-gray-400 hover:bg-vscode-hover hover:text-white"
                aria-label="Retour aux paramètres"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">Paramètres</p>
            <h2 className="mt-1 text-sm font-semibold text-gray-100">
              {activeSection ? "Thème de couleurs" : "Paramètres"}
            </h2>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-vscode-hover hover:text-white" aria-label="Fermer les paramètres">
            <X size={17} />
          </button>
        </header>

        <div className="border-b border-vscode-border p-3">
          <label className="flex items-center gap-2 rounded border border-vscode-border bg-vscode-editor px-2.5 py-2 text-gray-400 focus-within:border-blue-400">
            <Search size={14} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher dans les paramètres..."
              className="w-full bg-transparent text-sm text-gray-100 outline-none placeholder:text-gray-500"
            />
          </label>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!activeSection ? (
            <button
              onClick={() => setActiveSection("themes")}
              className="flex w-full items-center gap-3 rounded px-3 py-3 text-left transition-colors hover:bg-vscode-hover"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded bg-vscode-editor text-sky-400">
                <Palette size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-gray-100">Thème</span>
                <span className="block text-[10px] text-gray-500">Couleurs de l’interface</span>
              </span>
              <span className="text-gray-500">›</span>
            </button>
          ) : (
            <>
              {filteredThemes.map(([themeId, option]) => (
                <button
                  key={themeId}
                  onClick={() => setTheme(themeId)}
                  className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left transition-colors hover:bg-vscode-hover ${theme === themeId ? "bg-vscode-hover" : ""}`}
                >
                  <span className="h-8 w-10 shrink-0 rounded border border-white/20 shadow-inner" style={{ background: option.swatch }} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-gray-100">{option.label}</span>
                    <span className="block text-[10px] text-gray-500">{option.group}</span>
                  </span>
                  {theme === themeId && <Check size={16} className="text-sky-400" />}
                </button>
              ))}
              {filteredThemes.length === 0 && <p className="p-6 text-center text-xs text-gray-500">Aucun thème trouvé.</p>}
            </>
          )}
        </div>
      </section>
    </div>
  );
}