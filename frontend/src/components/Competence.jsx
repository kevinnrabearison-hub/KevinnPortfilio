import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Monitor, Server, Database, Cpu, CheckCircle2, Terminal as TerminalIcon, Sparkles } from "lucide-react";
import { FaReact, FaVuejs, FaAngular, FaNodeJs, FaPhp, FaSymfony, FaDocker, FaGitAlt } from "react-icons/fa";
import { SiTailwindcss, SiTypescript, SiDjango, SiExpress, SiMongodb, SiPostgresql, SiMysql, SiFirebase, SiVercel, SiAmazon } from "react-icons/si";

const MotionDiv = motion.div;

const skillCategories = [
  {
    id: "frontend",
    label: "Frontend",
    icon: <Monitor className="text-[#5ab3d5]" size={18} />,
    color: "border-[#5ab3d5]/40",
    skills: [
      { name: "React / React Native", level: 90, icon: <FaReact className="text-[#5ab3d5]" /> },
      { name: "Vue.js", level: 80, icon: <FaVuejs className="text-[#0098ff]" /> },
      { name: "Angular", level: 70, icon: <FaAngular className="text-[#2f5288]" /> },
      { name: "Tailwind CSS", level: 95, icon: <SiTailwindcss className="text-[#5ab3d5]" /> },
      { name: "TypeScript", level: 82, icon: <SiTypescript className="text-[#0098ff]" /> },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: <Server className="text-[#0098ff]" size={18} />,
    color: "border-[#0098ff]/40",
    skills: [
      { name: "Node.js / Express", level: 88, icon: <FaNodeJs className="text-[#5ab3d5]" /> },
      { name: "Django (Python)", level: 85, icon: <SiDjango className="text-[#0098ff]" /> },
      { name: "Symfony (PHP)", level: 75, icon: <FaSymfony className="text-[#e6e6e6]" /> },
      { name: "PHP", level: 80, icon: <FaPhp className="text-[#2f5288]" /> },
      { name: "REST APIs", level: 90, icon: <TerminalIcon className="text-[#5ab3d5]" /> },
    ],
  },
  {
    id: "database",
    label: "Bases de Données",
    icon: <Database className="text-[#2f5288]" size={18} />,
    color: "border-[#2f5288]/50",
    skills: [
      { name: "MongoDB", level: 85, icon: <SiMongodb className="text-[#5ab3d5]" /> },
      { name: "PostgreSQL", level: 82, icon: <SiPostgresql className="text-[#0098ff]" /> },
      { name: "MySQL", level: 85, icon: <SiMysql className="text-[#0065a9]" /> },
      { name: "Firebase", level: 78, icon: <SiFirebase className="text-[#5ab3d5]" /> },
    ],
  },
  {
    id: "devops",
    label: "Outils & DevOps",
    icon: <Cpu className="text-[#0065a9]" size={18} />,
    color: "border-[#0065a9]/50",
    skills: [
      { name: "Git / GitHub / GitLab", level: 90, icon: <FaGitAlt className="text-[#5ab3d5]" /> },
      { name: "Docker", level: 78, icon: <FaDocker className="text-[#0098ff]" /> },
      { name: "Linux / Bash", level: 82, icon: <TerminalIcon className="text-gray-300" /> },
      { name: "Vercel / Netlify", level: 88, icon: <SiVercel className="text-[#e6e6e6]" /> },
    ],
  },
];

export default function Competence() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("visual"); // visual vs code

  const filteredCategories =
    activeFilter === "all"
      ? skillCategories
      : skillCategories.filter((cat) => cat.id === activeFilter);

  const jsonCodeView = JSON.stringify(
    {
      developer: "Rabearison Fy Tahina Kevinn",
      education: "Licence GL @ INSI",
      skills: skillCategories.map((c) => ({
        category: c.label,
        technologies: c.skills.map((s) => ({ name: s.name, level: `${s.level}%` })),
      })),
    },
    null,
    2
  );

  return (
    <section className="bg-vscode-editor text-vscode-foreground min-h-screen px-4 sm:px-8 py-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-vscode-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <Code2 size={28} className="text-[#5ab3d5]" />
              <span>Stack Technique & Compétences</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Vue d'ensemble de mes langages, frameworks et outils maîtrisés.
            </p>
          </div>

          {/* View Mode Switch (Visual vs Code) */}
          <div className="flex items-center bg-vscode-sidebar border border-vscode-border rounded-lg p-1 text-xs font-mono">
            <button
              onClick={() => setViewMode("visual")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === "visual"
                  ? "bg-vscode-statusbar text-white font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Vue Graphique
            </button>
            <button
              onClick={() => setViewMode("code")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === "code"
                  ? "bg-vscode-statusbar text-white font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Code JSON
            </button>
          </div>
        </div>

        {/* Category Filters */}
        {viewMode === "visual" && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                activeFilter === "all"
                  ? "bg-[#0065a9] border-[#5ab3d5] text-white shadow-md shadow-[#0098ff]/20"
                  : "bg-vscode-sidebar border-vscode-border text-gray-400 hover:text-white hover:border-gray-500"
              }`}
            >
              Toutes les compétences ({skillCategories.reduce((a, b) => a + b.skills.length, 0)})
            </button>
            {skillCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                  activeFilter === cat.id
                    ? "bg-[#0065a9] border-[#5ab3d5] text-white shadow-md shadow-[#0098ff]/20"
                    : "bg-vscode-sidebar border-vscode-border text-gray-400 hover:text-white hover:border-gray-500"
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content Section */}
        {viewMode === "visual" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCategories.map((cat, idx) => (
              <MotionDiv
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className={`glass-card rounded-xl p-6 border ${cat.color} space-y-4 hover:shadow-xl transition-all`}
              >
                <div className="flex items-center space-x-3 pb-3 border-b border-vscode-border/50">
                  <div className="p-2 rounded-lg bg-vscode-editor border border-vscode-border">
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{cat.label}</h3>
                </div>

                <div className="space-y-3 pt-2">
                  {cat.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center space-x-2 text-gray-200 font-medium">
                          <span className="text-base">{skill.icon}</span>
                          <span>{skill.name}</span>
                        </span>
                        <span className="font-mono text-[#5ab3d5] font-semibold">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-vscode-editor rounded-full h-2 overflow-hidden border border-vscode-border/50">
                        <MotionDiv
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="bg-gradient-to-r from-[#0065a9] to-[#5ab3d5] h-full rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </MotionDiv>
            ))}
          </div>
        ) : (
          /* JSON Code View */
          <div className="glass-panel rounded-xl p-6 border border-vscode-border font-mono text-xs text-[#5ab3d5] relative overflow-x-auto">
            <div className="absolute top-3 right-4 text-[11px] text-gray-400">
              skills.config.json
            </div>
            <pre className="leading-relaxed">{jsonCodeView}</pre>
          </div>
        )}
      </div>
    </section>
  );
}
