import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Code2, Monitor, Server, Database, Cpu, Layers } from "lucide-react";

const categories = [
  {
    title: (
      <span className="flex items-center gap-2">
        <Monitor className="text-blue-400" size={18} /> Frontend
      </span>
    ),
    color: "from-blue-400 to-cyan-400",
    skills: ["React", "Vue.js", "Angular", "Tailwind CSS", "TypeScript"],
  },
  {
    title: (
      <span className="flex items-center gap-2">
        <Server className="text-green-400" size={18} /> Backend
      </span>
    ),
    color: "from-green-400 to-emerald-400",
    skills: ["Node.js", "Express", "Django", "Symfony", "REST API"],
  },
  {
    title: (
      <span className="flex items-center gap-2">
        <Database className="text-yellow-400" size={18} /> Base de données
      </span>
    ),
    color: "from-yellow-400 to-orange-400",
    skills: ["MongoDB", "PostgreSQL", "MySQL", "SQLite", "Firebase"],
  },
  {
    title: (
      <span className="flex items-center gap-2">
        <Cpu className="text-purple-400" size={18} /> Outils & DevOps
      </span>
    ),
    color: "from-purple-400 to-pink-400",
    skills: ["Git", "Docker", "Linux", "CI/CD", "Vercel", "AWS"],
  },
];

export default function Competence() {
  const [lineCount, setLineCount] = useState(20);
  const contentRef = useRef(null);

  useEffect(() => {
    const calcLines = () => {
      if (contentRef.current) {
        const height = Math.max(
          contentRef.current.scrollHeight,
          window.innerHeight
        );
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <motion.h1
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="flex items-center justify-center gap-3 text-3xl font-bold text-blue-400 mb-8 text-center"
>
  <motion.div
    animate={{
      scale: [1, 1.15, 1],
      rotate: [0, 5, -5, 0],
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
    <Code2 size={36} className="text-blue-400" />
  </motion.div>

  Mes Compétences
</motion.h1>
    
            <p className="text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
              Je suis un{" "}
              <span className="text-blue-400 font-semibold">
                développeur Full Stack JavaScript
              </span>{" "}
              passionné par la création d’expériences web modernes et
              performantes. Je maîtrise le développement{" "}
              <span className="text-green-400">frontend</span> avec React, Vue
              et Angular, ainsi que le{" "}
              <span className="text-yellow-400">backend</span> avec Node.js,
              Express, Django et Symfony. J’aime transformer les idées en
              projets concrets avec des outils fiables, des designs soignés et
              un workflow optimisé.
            </p>
          </motion.div>

          {/* Catégories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="bg-[#252525] rounded-xl border border-gray-700 p-6 shadow-lg hover:border-blue-500 transition-colors"
              >
                <h3
                  className={`text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${cat.color}`}
                >
                  {cat.title}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {cat.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#1e1e1e] border border-gray-700 rounded-lg text-sm hover:bg-blue-600/30 hover:text-blue-300 transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center w-8 ml-6 select-none">
          <div className="flex-1 w-[2px] bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
