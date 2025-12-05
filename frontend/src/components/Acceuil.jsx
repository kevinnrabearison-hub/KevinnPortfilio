
import { motion } from "framer-motion";
import { Github,  FolderOpen, Send} from "lucide-react";

import {
  FaHtml5, FaCss3Alt, FaReact, FaVuejs, FaPhp, FaSymfony,
  FaDocker, FaGithub, FaMobileAlt, FaServer, FaTools
} from "react-icons/fa";
import {
  SiFlutter, SiDjango, SiExpress, SiDotnet, SiTailwindcss,
  SiBootstrap, SiGitlab
} from "react-icons/si";
import { useTabs } from "../context/TabsContext";

const categories = [
  {
    title: "Web",
    icon: "💻",
    items: [
      <FaHtml5 className="text-orange-500" />,
      <FaCss3Alt className="text-blue-500" />,
      <FaReact className="text-sky-400" />,
      <FaVuejs className="text-green-500" />,
    ],
  },
  {
    title: "Mobile",
    icon: <FaMobileAlt className="text-pink-400" />,
    items: [<SiFlutter className="text-sky-500" />, <FaReact className="text-sky-400" />],
  },
  {
    title: "Backend",
    icon: <FaServer className="text-yellow-400" />,
    items: [
      <SiDjango className="text-green-600" />,
      <SiExpress className="text-gray-400" />,
      <SiDotnet className="text-purple-600" />,
      <FaSymfony className="text-black" />,
      <FaPhp className="text-indigo-500" />,
    ],
  },
  {
    title: "Framework CSS",
    icon: <SiTailwindcss className="text-cyan-400" />,
    items: [<SiBootstrap className="text-violet-600" />, <SiTailwindcss className="text-cyan-400" />],
  },
  {
    title: "Outils",
    icon: <FaTools className="text-gray-300" />,
    items: [
      <FaGithub className="text-white" />,
      <SiGitlab className="text-orange-500" />,
      <FaDocker className="text-blue-400" />,
    ],
  },
];


export default function Acceuil() {
  const { openTab } = useTabs();

  return (
    <div className="bg-[#1e1e1e] min-h-screen text-white overflow-hidden">
      <div className="p-10 text-center">
        <div
          className="relative mx-auto w-48 h-48"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            initial={{ rotateY: 0, scale: 1 }}
            animate={{
              rotateY: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 4, ease: "easeInOut", repeat: 0 }}
            className="relative w-full h-full [transform-style:preserve-3d]"
          >
            <div className="absolute inset-0 flex justify-center items-center [backface-visibility:hidden] rounded-full border-4 border-blue-600 shadow-lg">
              <img
                src="/1764860470955.jpg"
                alt="Profil"
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 flex justify-center items-center [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-full border-4 border-blue-600 overflow-hidden">
              <img
                src="/AMA-DC_June.jpg"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        <h1 className="flex flex-col items-center justify-center p-6 text-[2.6rem] leading-[120%] text-white font-[Poppins-Black]">
          <p className="ccc text-shadow">
            <span className="wave-hand">👋</span> Bonjour, je suis
          </p>

          <section className="animation mt-2 overflow-hidden h-[72px]">
            <div className="first">
              <div className="px-2 py-1 inline-block text-white font-[Poppins-Black]">
                Rabearison Fy Tahina Kevinn
              </div>
            </div>
            <div className="second">
              <div className="bg-[#CD921E] py-3 inline-block text-white rounded-md">
                Développeur Web
              </div>
            </div>
            <div className="third">
              <div className="bg-[#c10528] px-3 inline-block text-white rounded-md">
                Licence en cours
              </div>
            </div>
          </section>
        </h1>

        <div className="font-[Poppins-Black] text-center">
          <p className="text-2xl font-semibold text-white animate-fade-up">
            🎓 Étudiant à INSI, licence en cours.
          </p>
          <p className="mt-2 text-lg text-gray-300 animate-fade-up animation-delay-500">
            Passionné par le web, je transforme chaque défi en opportunité.
          </p>
        </div>
      </div>

      <section className="px-6 py-12 bg-[#252525] text-white">
        <h2 className="text-2xl font-bold mb-10 text-center">Mes Compétences</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-[#2d2d2d] rounded-2xl p-6 shadow-lg text-center"
            >
              <div className="flex justify-center mb-4 text-4xl">{cat.icon}</div>
              <h3 className="text-lg font-semibold mb-6">{cat.title}</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {cat.items.map((icon, idx) => (
                  <div key={idx} className="text-4xl hover:scale-110 transition-transform duration-300">
                    {icon}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

<section className="px-6 py-16 bg-gradient-to-b from-[#1e1e1e] to-[#252525]">
  <h2 className="text-3xl font-extrabold mb-12 text-center text-white">
    Mes Projets Récents
  </h2>

  {(() => {
    const projets = [
      {
        title: "💻 Portfolio VS Code",
        description:
          "Un portfolio moderne inspiré de Visual Studio Code, développé avec React, TailwindCSS et Framer Motion.",
        stack: ["React", "TailwindCSS", "Framer Motion"],
        color: "from-blue-500 to-cyan-400",
        github: "https://github.com/kevinnrabearison-hub/PortfolioVSC",
      },
      {
        title: "📱 BenevolatApp",
        description:
          "Application mobile pour connecter bénévoles et associations, construite avec React Native et Expo.",
        stack: ["React Native", "Expo", "Firebase"],
        color: "from-purple-500 to-pink-400",
        github: "https://github.com/kevinnrabearison-hub/BenevolatApp",
      },
    ];

    return (
      <div className="grid md:grid-cols-2 gap-8">
        {projets.map((projet, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className={`relative bg-gradient-to-br ${projet.color} p-[2px] rounded-2xl shadow-lg hover:scale-[1.03] transition-transform duration-300`}
          >
            <div className="bg-[#1e1e1e] rounded-2xl p-6 h-full flex flex-col justify-between">
              <h3 className="text-2xl font-bold mb-2 text-white">{projet.title}</h3>

              <p className="text-gray-300 text-sm mb-4">{projet.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {projet.stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-[#2d2d2d] text-gray-300 px-2 py-1 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {projet.github && (
                <div className="flex justify-center mt-4">
  <motion.a
    href={projet.github}
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
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent 
                     opacity-0 group-hover:opacity-100 blur-md transition-all duration-700"></span>

    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-40 blur-lg"></span>

    <Github
      size={18}
      className="relative z-10 text-blue-400 group-hover:text-blue-300 transition-colors"
    />
    <span className="relative z-10 font-medium">Voir sur GitHub</span>
  </motion.a>
</div>

              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  })()}

  <div className="flex justify-center mt-12">
  <motion.button
    onClick={() => openTab("Projet.jsx")}
    whileHover={{
      scale: 1.07,
      boxShadow: "0 0 25px rgba(59,130,246,0.6)",
      backdropFilter: "blur(12px)",
    }}
    transition={{ type: "spring", stiffness: 200, damping: 12 }}
    className="relative flex items-center gap-2 px-6 py-3 rounded-xl 
               bg-gradient-to-r from-blue-600/90 to-blue-500/80
               border border-blue-400/40 text-white font-medium 
               backdrop-blur-md overflow-hidden group shadow-md"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent 
                     opacity-0 group-hover:opacity-100 blur-md transition-all duration-700"></span>

    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-40 blur-lg"></span>

    <FolderOpen size={20} className="relative z-10 text-blue-200 group-hover:text-white transition-colors" />
    <span className="relative z-10 font-semibold">Voir tous mes projets →</span>
  </motion.button>
</div>
</section>


      <section className="px-6 py-16 bg-[#1e1e1e] text-center border-t border-gray-800 relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2a2a2a]/30 to-[#1e1e1e] opacity-60 blur-3xl"></div>

  <div className="relative z-10">
    <h2 className="text-3xl font-bold text-white mb-4 tracking-wide">
      Restons en contact
    </h2>
    <p className="text-gray-300 mb-8 text-lg">
      Une idée de projet ? Besoin d’un développeur ? Parlons-en ensemble !
    </p>

    <motion.button
      onClick={() => openTab("Contact.jsx")}
      whileHover={{
        scale: 1.08,
        boxShadow: "0 0 25px rgba(34,197,94,0.6)",
        backdropFilter: "blur(12px)",
      }}
      transition={{ type: "spring", stiffness: 220, damping: 14 }}
      className="relative flex items-center gap-2 mx-auto px-6 py-3 rounded-xl 
                 bg-gradient-to-r from-green-600/90 to-emerald-500/80
                 border border-green-400/40 text-white font-semibold
                 backdrop-blur-md overflow-hidden group shadow-md"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/30 to-transparent 
                       opacity-0 group-hover:opacity-100 blur-md transition-all duration-700"></span>

      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-40 blur-lg"></span>

      <Send size={20} className="relative z-10 text-green-200 group-hover:text-white transition-colors" />
      <span className="relative z-10">Me contacter →</span>
    </motion.button>
  </div>
</section>
    </div>
  );
}
