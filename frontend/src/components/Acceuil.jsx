import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  FolderOpen,
  Send,
  Download,
  Terminal,
  Code2,
  Sparkles,
  CheckCircle2,
  Award,
  Layers,
  ArrowRight,
  Zap
} from "lucide-react";
import {
  FaHtml5, FaCss3Alt, FaReact, FaVuejs, FaPhp, FaSymfony,
  FaDocker, FaGithub, FaMobileAlt, FaServer, FaTools, FaCode, FaFigma
} from "react-icons/fa";
import {
  SiFlutter, SiDjango, SiExpress, SiDotnet, SiTailwindcss,
  SiBootstrap, SiGitlab, SiTypescript, SiPostgresql, SiMongodb
} from "react-icons/si";
import { downloadAndOpenCV } from "../utils/downloadCv";
import { useTabs } from "../context/TabsContext";
import "./Acceuil.css";

const MotionDiv = motion.div;
const MotionA = motion.a;
const MotionButton = motion.button;

const roles = [

  "Licence en Génie Logiciel @ INSI",
  "Concepteur d'Applications Innovantes"
];

const badges = [
  { className: "badge-top-right", title: "FullStack", label: "React • Backend", icon: <FaCode className="badge-icon" /> },
  { className: "badge-bottom-left", title: "Automation", label: "Workflows • API", icon: <Zap className="badge-icon" /> },
];

const categories = [
  {
    title: "Développement Web",
    desc: "Interfaces réactives & Single Page Applications",
    gradient: "from-sky-500/20 to-blue-600/10",
    border: "border-sky-500/30",
    icon: <Code2 className="text-sky-400" size={24} />,
    items: [
      { name: "React", icon: <FaReact className="text-sky-200" /> },
      { name: "Vue.js", icon: <FaVuejs className="text-emerald-500" /> },
      { name: "TypeScript", icon: <SiTypescript className="text-blue-400" /> },
      { name: "HTML5", icon: <FaHtml5 className="text-orange-500" /> },
      { name: "CSS3", icon: <FaCss3Alt className="text-blue-500" /> },
    ],
  },
  {
    title: "Mobile & Cross-Platform",
    desc: "Applications hybrides performantes iOS & Android",
    gradient: "from-purple-500/20 to-pink-600/10",
    border: "border-purple-500/30",
    icon: <FaMobileAlt className="text-pink-400" size={24} />,
    items: [
      { name: "React Native", icon: <FaReact className="text-sky-400" /> },
      { name: "Flutter", icon: <SiFlutter className="text-cyan-400" /> },
    ],
  },
  {
    title: "Backend & APIs",
    desc: "Architectures RESTful, bases de données & logique serveur",
    gradient: "from-emerald-500/20 to-teal-600/10",
    border: "border-emerald-500/30",
    icon: <FaServer className="text-emerald-400" size={24} />,
    items: [
      { name: "Express.js", icon: <SiExpress className="text-gray-300" /> },
      { name: "Django", icon: <SiDjango className="text-emerald-600" /> },
      { name: "Symfony", icon: <FaSymfony className="text-white" /> },
      { name: "PHP", icon: <FaPhp className="text-indigo-400" /> },
      { name: ".NET", icon: <SiDotnet className="text-purple-400" /> },
    ],
  },
  {
    title: "UI / Styling & Design",
    desc: "Systèmes de design modernes et responsifs",
    gradient: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/30",
    icon: <SiTailwindcss className="text-cyan-400" size={24} />,
    items: [
      { name: "Tailwind CSS", icon: <SiTailwindcss className="text-cyan-400" /> },
      { name: "Bootstrap", icon: <SiBootstrap className="text-purple-500" /> },
    ],
  },
  {
    title: "Bases de données & DevOps",
    desc: "Gestion de données et déploiement conteneurisé",
    gradient: "from-amber-500/20 to-orange-600/10",
    border: "border-amber-500/30",
    icon: <FaTools className="text-amber-400" size={24} />,
    items: [
      { name: "PostgreSQL", icon: <SiPostgresql className="text-blue-400" /> },
      { name: "MongoDB", icon: <SiMongodb className="text-green-500" /> },
      { name: "Docker", icon: <FaDocker className="text-sky-400" /> },
      { name: "GitHub", icon: <FaGithub className="text-white" /> },
      { name: "GitLab", icon: <SiGitlab className="text-orange-500" /> },
    ],
  },
];

export default function Acceuil() {
  const { openTab } = useTabs();
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const downloadCV = () => {
    downloadAndOpenCV();
  };

  return (
    <div className="bg-vscode-editor min-h-screen text-vscode-foreground font-display selection:bg-blue-600/30">
      {/* Background Ambient Glows */}
      <div className="relative overflow-hidden px-3 sm:px-6 lg:px-8 2xl:px-12">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        {/* Hero Card Container */}
        <div className="mx-auto w-full max-w-[1440px] glass-card p-4 sm:p-8 lg:p-10 2xl:p-12 relative z-10 shadow-2xl overflow-hidden">
          <div className="acceuil-bg" />
          <div className="acceuil-grid-lines" />
          <div className="acceuil-scanlines" />
          <div className="acceuil-noise" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 xl:gap-14 2xl:gap-20">
            {/* Left Column: Text & Hero Info */}
            <div className="min-w-0 flex-1 text-center lg:text-left space-y-6 relative z-10">


              <div className="space-y-4">
                <h1 className="hero-heading text-white font-extrabold font-display">
                  Bonjour, je suis
                  <span className="hero-name hero-name-gradient block mt-4">
                    Kevinn Rabearison
                  </span>
                </h1>

                <div className="h-10 flex items-center justify-center lg:justify-start">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={roleIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="text-base sm:text-lg font-mono text-sky-400 font-semibold flex items-center gap-2"
                    >
                      <Terminal size={18} className="text-blue-500" />
                      <span>{roles[roleIndex]}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Bio Subtitle */}
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl font-mono relative z-10">
                Je conçois des expériences numériques à l’intersection du <strong className="text-white">code, design</strong> et de l’<strong className="text-sky-300">innovation</strong>. Je crée des interfaces modernes, rapides et engageantes.
              </p>



              {/* CTAs Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 relative z-10">
                <MotionButton
                  onClick={() => openTab("Projet.jsx")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                >
                  <FolderOpen size={18} />
                  <span>Explorer mes Projets</span>
                </MotionButton>

                <MotionButton
                  onClick={downloadCV}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-vscode-hover border border-vscode-border text-gray-200 font-semibold text-sm flex items-center gap-2 hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
                >
                  <Download size={18} className="text-emerald-400" />
                  <span>Télécharger mon CV (PDF)</span>
                </MotionButton>

                <MotionButton
                  onClick={() => openTab("Contact.jsx")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-vscode-hover/80 border border-vscode-border text-gray-300 font-semibold text-sm flex items-center gap-2 hover:text-white transition-all"
                >
                  <Send size={18} className="text-purple-400" />
                  <span className="text-white">Me contacter</span>
                </MotionButton>
              </div>
            </div>

            {/* Right Column: Hero Image with floating badges */}
            <div className="hero-image-wrapper relative z-10">
              <div className="hero-image-container">
                <div className="profile-image-glow" />
                <div className="profile-image-frame">
                  <div className="profile-image">
                    <img
                      src="/pdp2.jpg"
                      alt="Rabearison Fy Tahina Kevinn"
                      className="profile-photo"
                    />
                  </div>
                </div>

                {badges.map((badge) => (
                  <div className={`floating-badge ${badge.className ?? badge.title.replace(/\s+/g, "-").toLowerCase()}`} key={badge.title}>
                    {badge.icon}
                    <div className="badge-content">
                      <span className="badge-title">{badge.title}</span>
                      <span className="badge-libs">{badge.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-10 pt-8 border-t border-vscode-border/60 text-center space-y-2">
            <div className="text-xl sm:text-2xl font-bold text-sky-400 font-mono">Licence en Génie Logiciel</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">INSI Madagascar</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">8+ projets réalisés</div>
            <div className="text-xl sm:text-2xl font-bold text-purple-400 font-mono">Full Stack</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Web & Mobile</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">CI / CD</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Docker &amp; Pipelines</div>
          </div>
        </div>
      </div>

      {/* Tech Stack Categories Grid */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 py-10 sm:py-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-400" size={24} />
            <span>Technologies & Compétences Clés</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Mon écosystème de développement principal pour créer des projets complets et scalables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <MotionDiv
              key={cat.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`bg-vscode-sidebar/90 rounded-xl p-6 border ${cat.border} hover:border-blue-500/60 transition-all duration-300 shadow-lg flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-gray border border-vscode-border group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-sky-300 group-hover:text-white transition-colors">
                      {cat.title}
                    </h3>
                    <span className="text-xs text-gray-400">{cat.desc}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-vscode-border/50">
                  {cat.items.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-vscode-editor border border-vscode-border/70 text-xs font-medium text-gray-200 hover:border-sky-500/50 hover:text-white transition-all"
                    >
                      <span className="text-base">{tech.icon}</span>
                      <span>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </MotionDiv>
          ))}
        </div>
      </section>

      {/* Featured Projects Highlights */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 py-10 sm:py-12 border-t border-vscode-border/60">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Projets à la une</h2>
            <p className="text-gray-400 text-sm">Découvrez une sélection de mes réalisations récentes</p>
          </div>

          <MotionButton
            onClick={() => openTab("Projet.jsx")}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-vscode-hover text-sky-400 hover:text-white border border-vscode-border text-xs font-semibold transition-all"
          >
            <span>Voir tous les projets</span>
            <ArrowRight size={14} />
          </MotionButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-6 border border-vscode-border hover:border-blue-500/50 transition-all space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white">💻 Portfolio VS Code</h3>
  
            </div>
            <p className="text-gray-300 text-sm">
              Portfolio interactif et immersif sous forme d'environnement de développement VS Code, avec onglets, terminal interactif et command palette.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-400">
              <span className="px-2 py-1 bg-vscode-editor rounded border border-vscode-border">React 19</span>
              <span className="px-2 py-1 bg-vscode-editor rounded border border-vscode-border">TailwindCSS</span>
              <span className="px-2 py-1 bg-vscode-editor rounded border border-vscode-border">Framer Motion</span>
            </div>
            <div className="pt-2">
              <a
                href="https://github.com/kevinnrabearison-hub/PortfolioVSC"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-sky-400 hover:underline"
              >
                <Github size={14} />
                <span>Voir le dépôt GitHub →</span>
              </a>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 border border-vscode-border hover:border-purple-500/50 transition-all space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white">📱 BenevolatApp</h3>
              
            </div>
            <p className="text-gray-300 text-sm">
              Application mobile connectant bénévoles et associations pour la gestion de missions humanitaires et solidaires.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-400">
              <span className="px-2 py-1 bg-vscode-editor rounded border border-vscode-border">React Native</span>
              <span className="px-2 py-1 bg-vscode-editor rounded border border-vscode-border">Expo</span>
              <span className="px-2 py-1 bg-vscode-editor rounded border border-vscode-border">Firebase</span>
            </div>
            <div className="pt-2">
              <a
                href="https://github.com/kevinnrabearison-hub/BenevolatApp"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-purple-400 hover:underline"
              >
                <Github size={14} />
                <span>Voir le dépôt GitHub →</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Contact Banner */}
      <section className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 py-10 sm:py-12 text-center">
        <div className="glass-card rounded-2xl p-8 border border-vscode-border space-y-4">
          <h2 className="text-2xl font-bold text-white">Envie de collaborer sur un projet ?</h2>
          <p className="text-gray-300 text-sm max-w-md mx-auto">
            Je suis disponible pour des missions de développement web, mobile ou des opportunités professionnelles.
          </p>
          <MotionButton
            onClick={() => openTab("Contact.jsx")}
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-sm inline-flex items-center gap-2 shadow-lg"
          >
            <Send size={16} />
            <span>Envoyer un message</span>
          </MotionButton>
        </div>
      </section>
    </div>
  );
}
