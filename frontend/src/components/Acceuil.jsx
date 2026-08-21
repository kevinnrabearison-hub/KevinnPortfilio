import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
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
  FaDocker, FaGithub, FaMobileAlt, FaServer, FaTools, FaCode, FaFigma,
  FaFacebook, FaLinkedinIn, FaEnvelope
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
    gradient: "from-[#1f3864]/50 to-[#2f5288]/30",
    border: "border-[#5ab3d5]/30",
    icon: <Code2 className="text-[#5ab3d5]" size={24} />,
    items: [
      { name: "React", icon: <FaReact className="text-[#5ab3d5]" /> },
      { name: "Vue.js", icon: <FaVuejs className="text-[#0098ff]" /> },
      { name: "TypeScript", icon: <SiTypescript className="text-[#5ab3d5]" /> },
      { name: "HTML5", icon: <FaHtml5 className="text-[#0065a9]" /> },
      { name: "CSS3", icon: <FaCss3Alt className="text-[#0098ff]" /> },
    ],
  },
  {
    title: "Mobile & Cross-Platform",
    desc: "Applications hybrides performantes iOS & Android",
    gradient: "from-[#2f5288]/40 to-[#0065a9]/30",
    border: "border-[#0098ff]/30",
    icon: <FaMobileAlt className="text-[#0098ff]" size={24} />,
    items: [
      { name: "React Native", icon: <FaReact className="text-[#5ab3d5]" /> },
      { name: "Flutter", icon: <SiFlutter className="text-[#0098ff]" /> },
    ],
  },
  {
    title: "Backend & APIs",
    desc: "Architectures RESTful, bases de données & logique serveur",
    gradient: "from-[#1f3864]/60 to-[#1e1e1e]",
    border: "border-[#5ab3d5]/30",
    icon: <FaServer className="text-[#5ab3d5]" size={24} />,
    items: [
      { name: "Express.js", icon: <SiExpress className="text-[#e6e6e6]" /> },
      { name: "Django", icon: <SiDjango className="text-[#0098ff]" /> },
      { name: "Symfony", icon: <FaSymfony className="text-[#e6e6e6]" /> },
      { name: "PHP", icon: <FaPhp className="text-[#2f5288]" /> },
      { name: ".NET", icon: <SiDotnet className="text-[#5ab3d5]" /> },
    ],
  },
  {
    title: "UI / Styling & Design",
    desc: "Systèmes de design modernes et responsifs",
    gradient: "from-[#2f5288]/50 to-[#0098ff]/20",
    border: "border-[#0098ff]/30",
    icon: <SiTailwindcss className="text-[#0098ff]" size={24} />,
    items: [
      { name: "Tailwind CSS", icon: <SiTailwindcss className="text-[#0098ff]" /> },
      { name: "Bootstrap", icon: <SiBootstrap className="text-[#2f5288]" /> },
    ],
  },
  {
    title: "Bases de données & DevOps",
    desc: "Gestion de données et déploiement conteneurisé",
    gradient: "from-[#1f3864]/50 to-[#0065a9]/30",
    border: "border-[#5ab3d5]/30",
    icon: <FaTools className="text-[#5ab3d5]" size={24} />,
    items: [
      { name: "PostgreSQL", icon: <SiPostgresql className="text-[#0098ff]" /> },
      { name: "MongoDB", icon: <SiMongodb className="text-[#5ab3d5]" /> },
      { name: "Docker", icon: <FaDocker className="text-[#0098ff]" /> },
      { name: "GitHub", icon: <FaGithub className="text-[#e6e6e6]" /> },
      { name: "GitLab", icon: <SiGitlab className="text-[#0065a9]" /> },
    ],
  },
];

export default function Acceuil() {
  const { openTab } = useTabs();
  const [roleIndex, setRoleIndex] = useState(0);
  const profileVideoRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const video = profileVideoRef.current;
    if (!video) return undefined;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    video.playbackRate = isMobile ? 1.15 : 1.5;
    let hasStarted = false;
    let isVisible = false;

    const startVideo = () => {
      if (!isVisible || hasStarted || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      hasStarted = true;
      video.currentTime = 0;
      video.play().catch(() => {
        hasStarted = false;
      });
    };

    video.addEventListener("canplay", startVideo);
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        startVideo();
      } else if (!entry.isIntersecting) {
        hasStarted = false;
        video.pause();
        video.currentTime = 0;
      }
    }, { threshold: 0.5 });

    observer.observe(video);
    return () => {
      video.removeEventListener("canplay", startVideo);
      observer.disconnect();
    };
  }, []);

  const downloadCV = () => {
    downloadAndOpenCV();
  };

  return (
    <div className="bg-vscode-editor min-h-screen text-vscode-foreground font-display selection:bg-[#5ab3d5]/30">
      {/* Background Ambient Glows */}
      <div className="relative overflow-hidden px-3 sm:px-6 lg:px-8 2xl:px-12">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#5ab3d5]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#1f3864]/30 blur-[100px] rounded-full pointer-events-none" />

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
                      className="text-base sm:text-lg font-mono text-[#5ab3d5] font-semibold flex items-center gap-2"
                    >
                      <Terminal size={18} className="text-[#0098ff]" />
                      <span>{roles[roleIndex]}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Bio Subtitle */}
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl font-mono relative z-10">
                Je conçois des expériences numériques à l’intersection du <strong className="text-white">code, design</strong> et de l’<strong className="text-[#5ab3d5]">innovation</strong>. Je crée des interfaces modernes, rapides et engageantes.
              </p>



              {/* CTAs Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 relative z-10">
                <MotionButton
                  onClick={() => openTab("Projet.jsx")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0065a9] via-[#0098ff] to-[#5ab3d5] text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-[#0065a9]/25 hover:shadow-[#0098ff]/40 transition-all"
                >
                  <FolderOpen size={18} />
                  <span>Explorer mes Projets</span>
                </MotionButton>

                <MotionButton
                  onClick={downloadCV}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-vscode-hover border border-vscode-border text-gray-200 font-semibold text-sm flex items-center gap-2 hover:border-[#5ab3d5]/60 hover:text-[#5ab3d5] transition-all"
                >
                  <Download size={18} className="text-[#5ab3d5]" />
                  <span>Télécharger mon CV (PDF)</span>
                </MotionButton>

                <MotionButton
                  onClick={() => openTab("Contact.jsx")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-vscode-hover/80 border border-vscode-border text-gray-300 font-semibold text-sm flex items-center gap-2 hover:text-white transition-all"
                >
                  <Send size={18} className="text-[#0098ff]" />
                  <span className="text-white">Me contacter</span>
                </MotionButton>
              </div>

              {/* Social Media Links Bar */}
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-3 relative z-10 font-mono text-xs text-gray-400">
                <span className="text-gray-500 hidden sm:inline">&lt;réseaux /&gt;</span>
                <div className="flex items-center gap-2">
                  <a
                    href="mailto:kevinnrabearison@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                    title="Gmail: kevinnrabearison@gmail.com"
                    className="p-2.5 rounded-lg bg-vscode-sidebar border border-vscode-border hover:border-[#5ab3d5] text-[#5ab3d5] hover:scale-110 transition-all shadow-md"
                  >
                    <FaEnvelope size={16} />
                  </a>
                  <a
                    href="https://github.com/kevinnrabearison-hub"
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub: kevinnrabearison-hub"
                    className="p-2.5 rounded-lg bg-vscode-sidebar border border-vscode-border hover:border-[#5ab3d5] text-[#0098ff] hover:scale-110 transition-all shadow-md"
                  >
                    <FaGithub size={16} />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    title="Facebook"
                    className="p-2.5 rounded-lg bg-vscode-sidebar border border-vscode-border hover:border-[#5ab3d5] text-[#5ab3d5] hover:scale-110 transition-all shadow-md"
                  >
                    <FaFacebook size={16} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn"
                    className="p-2.5 rounded-lg bg-vscode-sidebar border border-vscode-border hover:border-[#5ab3d5] text-[#0098ff] hover:scale-110 transition-all shadow-md"
                  >
                    <FaLinkedinIn size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image with floating badges */}
            <div className="hero-image-wrapper relative z-10">
              <div className="hero-image-container">
                <div className="profile-image-glow" />
                <div className="profile-image-frame">
                  <div className="profile-image">
                    <video
                      ref={profileVideoRef}
                      src="/videos/pdpp.mp4"
                      poster="/pdp2.jpg"
                      aria-label="Portrait animé de Rabearison Fy Tahina Kevinn"
                      className="profile-photo"
                      autoPlay
                      muted
                      playsInline
                      preload="metadata"
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
            <div className="text-xl sm:text-2xl font-bold text-[#5ab3d5] font-mono">Licence en Génie Logiciel</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">INSI Madagascar</div>
            <div className="text-xl sm:text-2xl font-bold text-[#0098ff] font-mono">8+ projets réalisés</div>
            <div className="text-xl sm:text-2xl font-bold text-[#e6e6e6] font-mono">Full Stack</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Web & Mobile</div>
            <div className="text-xl sm:text-2xl font-bold text-[#5ab3d5] font-mono">CI / CD</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Docker &amp; Pipelines</div>
          </div>
        </div>
      </div>

      {/* Tech Stack Categories Grid */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 py-10 sm:py-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            
            <span>Technologies & Compétences Clés</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Mon écosystème de développement principal pour créer des projets complets et scalables.
          </p>
        </div>

        <div className="tech-3d-grid">
          {categories.map((cat, i) => (
            <MotionDiv
              key={cat.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="tech-3d-parent"
            >
              <div className="tech-3d-card">
                <div className="tech-3d-logo" aria-hidden="true">
                  <span className="tech-3d-circle tech-3d-circle1" />
                  <span className="tech-3d-circle tech-3d-circle2" />
                  <span className="tech-3d-circle tech-3d-circle3" />
                  <span className="tech-3d-circle tech-3d-circle4" />
                  <span className="tech-3d-circle tech-3d-circle5">{cat.icon}</span>
                </div>
                <div className="tech-3d-glass" />
                <div className="tech-3d-content">
                  <span className="tech-3d-title">{cat.title}</span>
                  <span className="tech-3d-text">{cat.desc}</span>
                  <div className="tech-3d-stack">
                  {cat.items.map((tech) => (
                    <span key={tech.name}>{tech.name}</span>
                  ))}
                  </div>
                </div>
                <div className="tech-3d-bottom">
                  <div className="tech-3d-socials">
                    {cat.items.slice(0, 3).map((tech) => (
                      <span className="tech-3d-social" key={`${cat.title}-${tech.name}`} title={tech.name}>{tech.icon}</span>
                    ))}
                  </div>
                  <button className="tech-3d-more" type="button" onClick={() => openTab("Competence.jsx")}>
                    Voir plus <span aria-hidden="true">⌄</span>
                  </button>
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
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-vscode-hover text-[#5ab3d5] hover:text-white border border-vscode-border text-xs font-semibold transition-all"
          >
            <span>Voir tous les projets</span>
            <ArrowRight size={14} />
          </MotionButton>
        </div>

        <div className="featured-projects-grid">
          {[
            {
              title: "Portfolio VS Code",
              icon: "💻",
              description: "Portfolio interactif et immersif sous forme d'environnement de développement VS Code, avec onglets, terminal interactif et command palette.",
              stack: ["React 19", "TailwindCSS", "Framer Motion"],
              github: "https://github.com/kevinnrabearison-hub/PortfolioVSC",
            },
            {
              title: "BenevolatApp",
              icon: "📱",
              description: "Application mobile connectant bénévoles et associations pour la gestion de missions humanitaires et solidaires.",
              stack: ["React Native", "Expo", "Firebase"],
              github: "https://github.com/kevinnrabearison-hub/BenevolatApp",
            },
          ].map((project) => (
            <div className="featured-browser-card" key={project.title}>
              <div className="featured-browser-bar">
                <div className="featured-browser-circles" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="featured-browser-controls">
                  <button type="button" aria-label="Retour">&#8249;</button>
                  <button type="button" aria-label="Avancer" disabled>&#8250;</button>
                </div>
                <div className="featured-search-bar">
                  <span aria-hidden="true">⌕</span>
                  <span>{project.title.toLowerCase().replaceAll(" ", "-")}.app</span>
                </div>
              </div>

              <div className="featured-browser-content">
                <h3><span aria-hidden="true">{project.icon}</span> {project.title}</h3>
                <p>{project.description}</p>
                <div className="featured-project-stack">
                  {project.stack.map((tech) => <span key={tech}>{tech}</span>)}
                </div>
                <a href={project.github} target="_blank" rel="noreferrer">
                  <FaGithub size={14} />
                  <span>Voir le dépôt GitHub →</span>
                </a>
              </div>
            </div>
          ))}
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
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0065a9] to-[#5ab3d5] text-white font-semibold text-sm inline-flex items-center gap-2 shadow-lg"
          >
            <Send size={16} />
            <span>Envoyer un message</span>
          </MotionButton>
        </div>
      </section>
    </div>
  );
}
