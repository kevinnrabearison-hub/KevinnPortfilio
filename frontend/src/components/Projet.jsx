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
    id: "vsc-portfolio",
    category: "React",
    icon: <Laptop className="text-sky-400" size={24} />,
    title: "Portfolio VS Code",
    description:
      "Un portfolio immersif et ultra-moderne conçu sous la forme d'un éditeur Visual Studio Code complet (Tabs, Terminal interactif, Command Palette Ctrl+K).",
    stack: ["React 19", "TailwindCSS", "Framer Motion", "Vite"],
    color: "from-blue-600 to-cyan-500",
    borderColor: "border-blue-500/40",
    github: "https://github.com/kevinnrabearison-hub/PortfolioVSC",
    details: "Développé en React avec Vite, ce portfolio inclut une gestion avancée des onglets, un terminal interactif bash, une palette de commandes rapide et un design glassmorphism soigné.",
  },
  {
    id: "benevolat-app",
    category: "Mobile",
    icon: <Handshake className="text-pink-400" size={24} />,
    title: "Bénévolat App (React Native)",
    description:
      "Application mobile intuitive permettant d'associer des bénévoles avec des ONG et associations caritatives pour des événements locaux.",
    stack: ["React Native", "Expo", "Firebase", "AsyncStorage"],
    color: "from-purple-600 to-pink-500",
    borderColor: "border-purple-500/40",
    github: "https://github.com/kevinnrabearison-hub/BenevolatApp",
    details: "Conçu dans le cadre du cursus L2. Inclus l'authentification Firebase, la géolocalisation de missions de bénévolat et un système de messagerie directe.",
  },
  {
    id: "task-manager-cicd",
    category: "Full Stack",
    icon: <ClipboardList className="text-emerald-400" size={24} />,
    title: "Task Manager — Pipeline CI/CD",
    description:
      "Plateforme Web de gestion de tâches intégrant un pipeline d'intégration et déploiement continu complet avec Docker et tests automatisés.",
    stack: ["MongoDB", "Express", "Vue.js", "Node.js", "Docker", "CI/CD"],
    color: "from-emerald-600 to-teal-500",
    borderColor: "border-emerald-500/40",
    github: "https://github.com/kevinnrabearison-hub/TaskManager-CICD",
    details: "Architecture MEVN complète containerisée via Docker Compose. Intègre des tests unitaires automatisés et un déploiement continu automatisé.",
  },
  {
    id: "vote-electronique",
    category: "Full Stack",
    icon: <Vote className="text-amber-400" size={24} />,
    title: "Plateforme de Vote Électronique",
    description:
      "Système de vote sécurisé hybride (Web & Mobile) assurant la transparence et l'intégrité des données d'élections académiques.",
    stack: ["React", "React Native", "Django", "PostgreSQL"],
    color: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/40",
    github: "https://github.com/kevinnrabearison-hub/VoteElectronique",
    details: "Projet majeur de fin d'année. Intègre le chiffrement des bulletins, un contrôle d'accès biométrique/OTP et un tableau de bord analytique en temps réel.",
  },
  {
    id: "dashboard-react",
    category: "React",
    icon: <BarChart className="text-indigo-400" size={24} />,
    title: "Dashboard Analytique React",
    description:
      "Tableau de bord interactif avec visualisations graphiques avancées et filtrage dynamique de données financières et d'activité.",
    stack: ["React", "TailwindCSS", "Recharts", "Framer Motion"],
    color: "from-indigo-600 to-sky-500",
    borderColor: "border-indigo-500/40",
    github: "https://github.com/kevinnrabearison-hub/Dash",
    details: "Intègre des graphiques dynamiques réactifs avec Recharts, un mode sombre/clair et un filtrage de métriques en temps réel.",
  },
  {
    id: "django-usermanagement",
    category: "Backend",
    icon: <Users className="text-green-400" size={24} />,
    title: "Gestion des Utilisateurs Django",
    description:
      "Application web de gestion d'utilisateurs, de rôles et de permissions d'accès sécurisées développée en Django Python.",
    stack: ["Django", "SQLite / PostgreSQL", "Bootstrap 5"],
    color: "from-green-600 to-emerald-500",
    borderColor: "border-green-500/40",
    github: "https://github.com/kevinnrabearison-hub/Django-UserManagement",
    details: "Implémentation d'un système d'authentification complet avec réinitialisation de mot de passe par mail et gestion des droits d'administration.",
  },
  {
    id: "exam-react-native",
    category: "Mobile",
    icon: <Smartphone className="text-cyan-400" size={24} />,
    title: "Examen Mobile React Native",
    description:
      "Projet d'évaluation mobile universitaire axé sur la persistance offline de données et la navigation multi-écrans fluide.",
    stack: ["React Native", "Expo", "AsyncStorage"],
    color: "from-cyan-600 to-blue-500",
    borderColor: "border-cyan-500/40",
    github: "https://github.com/kevinnrabearison-hub/ExamReactNative",
    details: "Application mobile démontrant une gestion optimale de la persistance locale de données et la fluidité des transitions de navigation React Navigation.",
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
              <FolderOpen size={28} className="text-blue-400" />
              <span>Galerie des Projets</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Applications web, mobiles et architectures backend développées.
            </p>
          </div>

          <div className="text-xs font-mono text-sky-400 bg-vscode-sidebar border border-vscode-border px-3 py-1.5 rounded-lg">
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
                  ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20"
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
                <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
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
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold underline flex items-center gap-1"
                >
                  <Sparkles size={13} />
                  <span>Détails & Code</span>
                </button>

                {proj.github && (
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-vscode-hover border border-vscode-border text-xs text-gray-200 hover:text-white hover:border-blue-500/50 transition-all"
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
                  <span className="text-xs font-mono text-sky-400">{activeModalProject.category}</span>
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
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg"
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
