import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Laptop,
  Handshake,
  ClipboardList,
  Vote,
  BarChart,
  Globe,
  Users,
  Smartphone,
  FolderOpen,
  ExternalLink,
  Code,
  X,
  Sparkles,
  Layers
} from "lucide-react";

const MotionDiv = motion.div;
const MotionA = motion.a;

const projetsList = [
  {
    id: "nexcommerce",
    category: "Web",
    icon: <Laptop className="text-[#5ab3d5]" size={24} />,
    title: "NexCommerce",
    description:
      "Full-stack e-commerce moderne avec recommandations IA et expérience utilisateur fluide.",
    stack: ["Next.js", "Stripe", "MongoDB"],
    color: "from-[#0065a9] to-[#5ab3d5]",
    borderColor: "border-[#5ab3d5]/40",
    github: "#",
    details: "Plateforme de commerce connectée avec recommandations personnalisées, paiement sécurisé et interface responsive.",
  },
  {
    id: "lumina-dashboard",
    category: "Data",
    icon: <BarChart className="text-[#0098ff]" size={24} />,
    title: "Lumina Dashboard",
    description:
      "Dashboard analytique en temps réel avec visualisations interactives et données live.",
    stack: ["React", "D3.js", "WebSocket"],
    color: "from-[#1f3864] to-[#2f5288]",
    borderColor: "border-[#2f5288]/50",
    github: "#",
    details: "Tableau de bord professionnel affichant métriques, alertes et flux de données en direct pour la prise de décision rapide.",
  },
  {
    id: "pixelforge-studio",
    category: "Design",
    icon: <Sparkles className="text-[#5ab3d5]" size={24} />,
    title: "PixelForge Studio",
    description:
      "Suite créative browser pour générer des visuels et explorer des systèmes graphiques.",
    stack: ["Canvas API", "WebGL", "GSAP"],
    color: "from-[#2f5288] to-[#0098ff]",
    borderColor: "border-[#0098ff]/40",
    github: "#",
    details: "Expérience graphique évolutive pour créer du contenu visuel en temps réel dans le navigateur.",
  },
  {
    id: "cogni-ai-chat",
    category: "AI",
    icon: <Globe className="text-[#5ab3d5]" size={24} />,
    title: "Cogni AI Chat",
    description:
      "Plateforme conversationnelle multi-modèles pour des assistants intelligents et réactifs.",
    stack: ["Python", "FastAPI", "OpenAI"],
    color: "from-[#0065a9] to-[#1f3864]",
    borderColor: "border-[#5ab3d5]/40",
    github: "#",
    details: "Système de chat IA avec routage de modèles, personnalisation et mise en production sécurisée.",
  },
  {
    id: "threadnest",
    category: "Social",
    icon: <Users className="text-[#0098ff]" size={24} />,
    title: "ThreadNest",
    description:
      "Plateforme communautaire pour développeurs avec partage de code et flux collaboratif.",
    stack: ["Node.js", "Socket.io", "Redis"],
    color: "from-[#1f3864] to-[#5ab3d5]",
    borderColor: "border-[#5ab3d5]/40",
    github: "#",
    details: "Espace social où les développeurs publient des threads, échangent et construisent ensemble en temps réel.",
  },
  {
    id: "vaultchain",
    category: "Security",
    icon: <Code className="text-[#5ab3d5]" size={24} />,
    title: "VaultChain",
    description:
      "Solution de stockage décentralisé avec vérification blockchain et chiffrement d'entreprise.",
    stack: ["Solidity", "IPFS", "Web3.js"],
    color: "from-[#2f5288] to-[#0065a9]",
    borderColor: "border-[#0065a9]/50",
    github: "#",
    details: "Infrastructure sécurisée pour stocker et vérifier des données avec un registre immuable et une interface moderne.",
  },
];

export default function Projet() {
  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [activeModalProject, setActiveModalProject] = useState(null);

  const categories = ["Tous", "React", "Mobile", "Backend", "Full Stack"];

  const filteredProjets =
    selectedFilter === "Tous"
      ? projetsList
      : projetsList.filter((p) => p.category === selectedFilter);

  return (
    <section className="bg-vscode-editor text-vscode-foreground min-h-screen px-4 sm:px-8 py-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-vscode-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <FolderOpen size={28} className="text-[#5ab3d5]" />
              <span>Galerie des Projets</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Applications web, mobiles et architectures backend développées.
            </p>
          </div>

          <div className="text-xs font-mono text-[#5ab3d5] bg-vscode-sidebar border border-vscode-border px-3 py-1.5 rounded-lg">
            {filteredProjets.length} Projets affichés
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                selectedFilter === cat
                  ? "bg-[#0065a9] border-[#5ab3d5] text-white shadow-md shadow-[#0098ff]/20"
                  : "bg-vscode-sidebar border-vscode-border text-gray-400 hover:text-white hover:border-gray-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjets.map((proj, i) => (
            <MotionDiv
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className={`glass-card rounded-xl p-6 border ${proj.borderColor} space-y-4 hover:scale-[1.02] transition-all duration-300 shadow-lg flex flex-col justify-between group`}
            >
              <div>
                {/* Header Icon & Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${proj.color} shadow-md`}>
                    {proj.icon}
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-vscode-editor border border-vscode-border text-gray-300">
                    {proj.category}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-white group-hover:text-[#5ab3d5] transition-colors">
                  {proj.title}
                </h3>
                <p className="text-gray-300 text-xs leading-relaxed mt-2 line-clamp-3">
                  {proj.description}
                </p>

                {/* Stack Badges */}
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-vscode-border/50">
                  {proj.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-vscode-editor border border-vscode-border/70 text-[10px] font-mono text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-vscode-border/40 mt-4">
                <button
                  onClick={() => setActiveModalProject(proj)}
                  className="text-xs text-[#5ab3d5] hover:text-[#0098ff] font-semibold underline flex items-center gap-1"
                >
                  <Sparkles size={13} />
                  <span>Détails & Code</span>
                </button>

                {proj.github && (
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-vscode-hover border border-vscode-border text-xs text-gray-200 hover:text-white hover:border-[#5ab3d5]/50 transition-all"
                  >
                    <Github size={14} />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>

      {/* Project Inspector Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-vscode-border shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-vscode-hover"
              >
                <X size={20} />
              </button>

              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${activeModalProject.color}`}>
                  {activeModalProject.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{activeModalProject.title}</h3>
                  <span className="text-xs font-mono text-[#5ab3d5]">{activeModalProject.category}</span>
                </div>
              </div>

              <p className="text-gray-200 text-sm leading-relaxed">{activeModalProject.details}</p>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono text-gray-400">Stack Technique :</div>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.stack.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-vscode-editor rounded-lg border border-vscode-border text-xs font-mono text-gray-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {activeModalProject.github && (
                <div className="pt-4 flex justify-end">
                  <a
                    href={activeModalProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0065a9] to-[#5ab3d5] hover:opacity-90 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg"
                  >
                    <Github size={16} />
                    <span>Ouvrir sur GitHub</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
