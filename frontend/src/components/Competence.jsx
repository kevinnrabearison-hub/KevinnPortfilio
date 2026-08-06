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
    icon: <Monitor className="text-sky-400" size={18} />,
    color: "border-sky-500/40",
    skills: [
      { name: "React / React Native", level: 90, icon: <FaReact className="text-sky-400" /> },
      { name: "Vue.js", level: 80, icon: <FaVuejs className="text-emerald-500" /> },
      { name: "Angular", level: 70, icon: <FaAngular className="text-red-500" /> },
      { name: "Tailwind CSS", level: 95, icon: <SiTailwindcss className="text-cyan-400" /> },
      { name: "TypeScript", level: 82, icon: <SiTypescript className="text-blue-400" /> },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: <Server className="text-emerald-400" size={18} />,
    color: "border-emerald-500/40",
    skills: [
      { name: "Node.js / Express", level: 88, icon: <FaNodeJs className="text-green-500" /> },
      { name: "Django (Python)", level: 85, icon: <SiDjango className="text-emerald-600" /> },
      { name: "Symfony (PHP)", level: 75, icon: <FaSymfony className="text-white" /> },
      { name: "PHP", level: 80, icon: <FaPhp className="text-indigo-400" /> },
      { name: "REST APIs", level: 90, icon: <TerminalIcon className="text-yellow-400" /> },
    ],
  },
  {
    id: "database",
    label: "Bases de Données",
    icon: <Database className="text-amber-400" size={18} />,
    color: "border-amber-500/40",
    skills: [
      { name: "MongoDB", level: 85, icon: <SiMongodb className="text-green-500" /> },
      { name: "PostgreSQL", level: 82, icon: <SiPostgresql className="text-blue-400" /> },
      { name: "MySQL", level: 85, icon: <SiMysql className="text-sky-600" /> },
      { name: "Firebase", level: 78, icon: <SiFirebase className="text-yellow-500" /> },
    ],
  },
  {
    id: "devops",
    label: "Outils & DevOps",
    icon: <Cpu className="text-purple-400" size={18} />,
    color: "border-purple-500/40",
    skills: [
      { name: "Git / GitHub / GitLab", level: 90, icon: <FaGitAlt className="text-orange-500" /> },
      { name: "Docker", level: 78, icon: <FaDocker className="text-sky-400" /> },
      { name: "Linux / Bash", level: 82, icon: <TerminalIcon className="text-gray-300" /> },
      { name: "Vercel / Netlify", level: 88, icon: <SiVercel className="text-white" /> },
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
              <Code2 size={28} className="text-blue-400" />
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
                  ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20"
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
                    ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20"
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
                        <span className="font-mono text-sky-400 font-semibold">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-vscode-editor rounded-full h-2 overflow-hidden border border-vscode-border/50">
                        <MotionDiv
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="bg-gradient-to-r from-blue-500 to-sky-400 h-full rounded-full"
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
          <div className="glass-panel rounded-xl p-6 border border-vscode-border font-mono text-xs text-sky-300 relative overflow-x-auto">
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
