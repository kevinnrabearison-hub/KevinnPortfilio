import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Globe2,
  Code2,
  Mail,
  Phone,
  GraduationCap,
  GitCommit,
  Download,
  Terminal,
  Calendar,
  MapPin,
  Sparkles
} from "lucide-react";
import { downloadAndOpenCV } from "../utils/downloadCv";
import insiLogo from "../../public/Logo INSI.png";

const MotionDiv = motion.div;

const timelineEvents = [
  {
    year: "2023 - Présent",
    title: "L3 INSI GL",
    institution: "Institut Supérieur d'Informatique (INSI)",
    desc: "Licence en Informatique, spécialité Génie Logiciel, avec approfondissement sur les bases de la programmation, l’architecture logicielle et les outils de développement moderne.",
    icon: <GraduationCap className="text-sky-400" size={18} />,
  },
  {
    year: "2022 - 2023",
    title: "Notion Web chez HOPES Formation",
    institution: "HOPES Formation - Andavamamba",
    desc: "Formation certifiée en HTML, CSS, JavaScript, avec un apprentissage pratique du développement front-end et des bases du web design.",
    icon: <Code2 className="text-purple-400" size={18} />,
  },
  {
    year: "Avant 2023",
    title: "Web Design & Bureautique chez IS Info Andranomena",
    institution: "IS Info Andranomena",
    desc: "Découverte du web design, Photoshop, Illustrator, et de la bureautique, avec une première immersion dans le monde du design numérique et des outils de création.",
    icon: <Sparkles className="text-amber-400" size={18} />,
  },
];

export default function Apropos() {
  const profileVideoRef = useRef(null);

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
    <section className="bg-vscode-editor text-vscode-foreground min-h-screen px-4 sm:px-8 py-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-3 pb-6 border-b border-vscode-border">
          <div className="inline-flex items-center space-x-2 px-3 py-1    text-sky-400 text-2xl font-mono">
            <h1 className="font-bold">&lt;À propos /&gt;</h1>
            
          </div>

         

          <p className="text-gray-300 text-sm max-w-2xl mx-auto leading-relaxed italic">
            Je suis Kevinn Rabearison, développeur full-stack et créatif digital, passionné par la conception d’expériences web élégantes, performantes et utiles. J’aime transformer des idées en solutions concrètes et donner vie à des projets qui marquent leurs utilisateurs.
          </p>
        </div>

        {/* Profile Card & Key Info */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-vscode-border grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col items-center text-center md:border-r border-vscode-border/60 md:pr-6 space-y-3">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg">
              <video
                ref={profileVideoRef}
                src="/videos/pdpp.mp4"
                poster="/pdp2.jpg"
                aria-label="Portrait animé de Kevinn Rabearison"
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                preload="metadata"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Kevinn Rabearison</h3>
              <div className="flex items-center justify-center space-x-1.5 text-xs text-sky-400 font-mono mt-0.5">
                <MapPin size={13} />
                <span>Antananarivo, Madagascar</span>
              </div>
            </div>

            <button
              onClick={downloadCV}
              className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
            >
              <Download size={15} />
              <span>Télécharger le CV</span>
            </button>
          </div>

          <div className="md:col-span-2 space-y-4 text-sm text-gray-300 leading-relaxed">
            <p>
              Étudiant en <strong className="text-white">Licence Informatique (Génie Logiciel)</strong> à l'
              <span className="inline-flex items-center space-x-1 font-semibold text-yellow-400 bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-800/50">
                <span>INSI</span>
                <img src={insiLogo} alt="INSI Logo" className="w-4 h-4 rounded-full object-contain" />
              </span>, je transforme les idées en interfaces nettes et les architectures en systèmes fiables.
            </p>

            <p>
              Chaque projet est une opportunité de livrer une expérience mémorable : du code optimisé, des transitions soignées et un parcours utilisateur maîtrisé — toujours avec un style proche d'un éditeur moderne.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-vscode-editor border border-vscode-border flex items-center space-x-3">
                <Mail className="text-blue-400" size={16} />
                <a href="mailto:kevinnrabearison@gmail.com" className="hover:underline text-gray-200 truncate">
                  kevinnrabearison@gmail.com
                </a>
              </div>

              <div className="p-3 rounded-lg bg-vscode-editor border border-vscode-border flex items-center space-x-3">
                <Phone className="text-emerald-400" size={16} />
                <span className="text-gray-200">038 35 482 45</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Git Commit History */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <GitCommit className="text-purple-400" size={22} />
            <h2 className="text-xl font-bold text-white">Parcours Académique & Expérience</h2>
          </div>

          <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-vscode-border">
            {timelineEvents.map((event, idx) => (
              <MotionDiv
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative pl-10 group"
              >
                <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-vscode-editor border-2 border-purple-500 group-hover:bg-purple-500 transition-colors" />

                <div className="glass-card rounded-xl p-5 border border-vscode-border space-y-2 hover:border-purple-500/50 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                    <span className="text-purple-400 font-semibold flex items-center space-x-1">
                      {event.icon}
                      <span>{event.title}</span>
                    </span>
                    <span className="text-gray-400 flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{event.year}</span>
                    </span>
                  </div>

                  <div className="text-xs font-bold text-gray-200">{event.institution}</div>
                  <p className="text-xs text-gray-300 leading-relaxed">{event.desc}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-vscode-editor border border-vscode-border/80 text-center italic text-sky-300 text-sm font-mono">
          “Le code n’est pas seulement une suite d’instructions, c’est une façon de donner vie à des idées.”
        </div>
      </div>
    </section>
  );
}
