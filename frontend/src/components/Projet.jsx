import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
} from "lucide-react"; 
const projets = [
  {
    icon: <Laptop className="text-[#1e1e1e]" size={22} />,
    title: "Portfolio VS Code",
    description:
      "Un portfolio moderne inspiré de Visual Studio Code, développé avec React, TailwindCSS et Framer Motion.",
    stack: ["React", "TailwindCSS", "Framer Motion", "ExpressJS"],
    color: "from-blue-500 to-cyan-400",
    github: "",
  },
  {
    icon: <Handshake className="text-[#1e1e1e]" size={22} />,
    title: "Bénévolat App (React Native – L2)",
    description:
      "Application mobile permettant de connecter des bénévoles et des associations.",
    stack: ["React Native", "Expo", "Firebase"],
    color: "from-green-400 to-emerald-500",
    github: "https://github.com/kevinnrabearison-hub/BenevolatApp",
  },
  {
    icon: <ClipboardList className="text-[#1e1e1e]" size={22} />,
    title: "Task Manager – CI/CD (MEVN)",
    description:
      "Application de gestion de tâches intégrant un pipeline CI/CD complet.",
    stack: ["MongoDB", "Express", "Vue.js", "Node.js", "Docker"],
    color: "from-orange-400 to-red-500",
    github: "https://github.com/kevinnrabearison-hub/TaskManager-CICD",
  },
  {
    icon: <Vote className="text-[#1e1e1e]" size={22} />,
    title: "Vote Électronique (Web & Mobile)",
    description:
      "Projet de fin d’année – plateforme de vote sécurisée pour web et mobile.",
    stack: ["React", "React Native", "Django", "PostgreSQL"],
    color: "from-purple-500 to-pink-500",
    github: "https://github.com/kevinnrabearison-hub/VoteElectronique",
  },
  {
    icon: <BarChart className="text-[#1e1e1e]" size={22} />,
    title: "Dashboard React",
    description:
      "Un tableau de bord interactif et moderne développé en React avec des animations fluides et une visualisation de données.",
    stack: ["React", "TailwindCSS", "Recharts", "Framer Motion"],
    color: "from-indigo-500 to-sky-400",
    github: "https://github.com/kevinnrabearison-hub/Dash",
  },
  {
    icon: <Globe className="text-[#1e1e1e]" size={22} />,
    title: "Portfolio React (en cours)",
    description:
      "Mon nouveau portfolio en React, toujours en développement.",
    stack: ["React", "TailwindCSS"],
    color: "from-cyan-400 to-blue-500",
    github: "https://github.com/kevinnrabearison-hub/Portfolio-React",
  },
  {
    icon: <Users className="text-[#1e1e1e]" size={22} />,
    title: "Gestion des utilisateurs (Django)",
    description:
      "Application web Django permettant la gestion et l’authentification des utilisateurs.",
    stack: ["Django", "SQLite", "Bootstrap"],
    color: "from-yellow-400 to-orange-400",
    github: "https://github.com/kevinnrabearison-hub/Django-UserManagement",
  },
  {
    icon: <Smartphone className="text-[#1e1e1e]" size={22} />,
    title: "Examen React Native",
    description:
      "Projet universitaire mobile avec persistance de données et navigation avancée.",
    stack: ["React Native", "Expo", "AsyncStorage"],
    color: "from-teal-400 to-green-400",
    github: "https://github.com/kevinnrabearison-hub/ExamReactNative",
  },
];

export default function Projet() {
  const [lineCount, setLineCount] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const calcLines = () => {
      if (contentRef.current) {
        const height =
          contentRef.current.scrollHeight + window.innerHeight * 0.3;
        const lineHeight = 32;
        setLineCount(Math.ceil(height / lineHeight));
      }
    };

    calcLines();
    window.addEventListener("resize", calcLines);
    return () => window.removeEventListener("resize", calcLines);
  }, []);

  return (
    <section className="relative bg-[#1e1e1e] text-white font-mono min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto flex">
        <div className="text-gray-600 text-right pr-6 select-none">
          {Array.from({ length: lineCount }).map((_, i) => (
            <p key={i} className="leading-8 text-sm">
              {String(i + 1).padStart(2, "0")}
            </p>
          ))}
        </div>

        <div className="flex-1" ref={contentRef}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 text-3xl font-bold text-blue-400 mb-10 text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 8, -8, 0],
                filter: [
                  "drop-shadow(0 0 0px rgba(59,130,246,0.2))",
                  "drop-shadow(0 0 12px rgba(59,130,246,0.8))",
                  "drop-shadow(0 0 0px rgba(59,130,246,0.2))",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FolderOpen size={34} className="text-blue-400" />
            </motion.div>
            Mes Projets
          </motion.h1>

          {/* 🧱 Liste des projets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projets.map((proj, i) => (
              <motion.div
                key={proj.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="bg-[#252525] rounded-xl border border-gray-700 p-6 shadow-lg hover:border-blue-500 hover:scale-[1.02] transition-all"
              >
                {/* Icône principale */}
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      filter: [
                        "drop-shadow(0 0 0px rgba(255,255,255,0.1))",
                        "drop-shadow(0 0 10px rgba(59,130,246,0.6))",
                        "drop-shadow(0 0 0px rgba(255,255,255,0.1))",
                      ],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${proj.color} flex items-center justify-center shadow-md`}
                  >
                    {proj.icon}
                  </motion.div>
                </div>

                {/* Détails projet */}
                <h3 className="text-lg font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center">
                  {proj.title}
                </h3>

                <p className="text-gray-300 text-sm mb-4 text-center leading-relaxed">
                  {proj.description}
                </p>

                {/* Stack */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {proj.stack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#1e1e1e] border border-gray-700 rounded-lg text-xs hover:bg-blue-600/30 hover:text-blue-300 transition-all"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* 🔗 Bouton GitHub */}
                <div className="flex justify-center mt-2">
                  <motion.a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      scale: 1.07,
                      boxShadow: "0 0 25px rgba(59,130,246,0.6)",
                      backdropFilter: "blur(12px)",
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="relative flex items-center gap-2 px-5 py-2 rounded-xl 
                               bg-gradient-to-r from-[#1e1e1e]/80 to-[#252525]/80 
                               border border-blue-500/40 text-gray-200 text-sm 
                               backdrop-blur-md hover:text-white overflow-hidden group"
                  >
                    {/* Éclat animé */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent 
                                     opacity-0 group-hover:opacity-100 blur-md transition-all duration-700"></span>
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-40 blur-lg"></span>

                    <Github
                      size={18}
                      className="relative z-10 text-blue-400 group-hover:text-blue-300 transition-colors"
                    />
                    <span className="relative z-10 font-medium">
                      Voir sur GitHub
                    </span>
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 🌈 Barre droite style VS Code */}
        <div className="hidden md:flex flex-col items-center w-8 ml-6 select-none">
          <div className="flex-1 w-[2px] bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
