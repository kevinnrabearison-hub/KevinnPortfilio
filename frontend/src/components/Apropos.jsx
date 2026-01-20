import { motion } from "framer-motion";
import { Lightbulb, Globe2, Code2, Mail, Phone } from "lucide-react";
import insiLogo from "../../public/Logo INSI.png";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionBlockquote = motion.blockquote;

const Apropos = () => {
  return (
    <section className="relative bg-vscode-editor text-vscode-foreground font-mono min-h-screen px-6 flex justify-center items-center">
      <div className="max-w-4xl text-center">
        {/* Ligne supérieure */}
        <MotionDiv
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="h-[2px] mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
        ></MotionDiv>

        {/* Titre */}
        <MotionH1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 text-4xl font-bold mb-6 text-blue-400"
        >
          <MotionDiv
            animate={{
              scale: [1, 1.15, 1],
              filter: [
                "drop-shadow(0 0 0px rgba(255,255,100,0.2))",
                "drop-shadow(0 0 15px rgba(255,255,100,0.8))",
                "drop-shadow(0 0 0px rgba(255,255,100,0.2))",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Lightbulb size={36} className="text-yellow-400" />
          </MotionDiv>
          À propos de moi
        </MotionH1>

        {/* Texte principal */}
        <MotionP
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-gray-300 leading-relaxed text-lg max-w-2xl mx-auto"
        >
          Je suis{" "}
          <span className="text-blue-400 font-semibold">
            Rabearison Fy Tahina Kevinn
          </span>
          , étudiant en{" "}
          <span className="text-green-400">Licence en Informatique</span> à
          l’
          <span className="inline-flex items-center gap-2 text-yellow-400">
            INSI
            <img
              src={insiLogo}
              alt="Logo INSI"
              className="w-7 h-7 rounded-full object-contain"
            />
          </span>
          , parcours{" "}
          <span className="text-purple-400">Génie Logiciel (GL)</span>.
          <br />
          <br />
          <span className="inline-flex items-center justify-center gap-2">
            <Code2 className="text-blue-400" size={18} />
            Passionné par le développement web et mobile
          </span>
          , je m’efforce de créer des expériences modernes, esthétiques et
          performantes. Mon objectif est de concevoir des applications qui
          allient{" "}
          <span className="text-blue-300 font-medium">
            simplicité, efficacité et créativité
          </span>
          .
          <br />
          <br />
          <span className="inline-flex items-center justify-center gap-2">
            Je crois que chaque ligne de code est une opportunité d’apprendre,
            d’innover et de laisser une empreinte dans le monde numérique
            <Globe2 size={36} className="text-blue-400 inline" />
          </span>
        </MotionP>

        {/* Citation */}
        <MotionBlockquote
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="mt-10 text-blue-400 italic text-md"
        >
          “Le code n’est pas seulement une suite d’instructions, c’est une façon
          de donner vie à une idée.”
        </MotionBlockquote>

        {/* --- 🧾 Section contact perso --- */}
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 bg-vscode-sidebar border border-vscode-border p-4 rounded-xl shadow-lg max-w-md mx-auto"
        >
          <div className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition">
            <Mail size={20} className="text-blue-400" />
            <a
              href="mailto:kevinnrabearison@gmail.com"
              className="hover:underline"
            >
              kevinnrabearison@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition">
            <Phone size={20} className="text-green-400" />
            <span>034 98 534 09</span>
          </div>
        </MotionDiv>

        {/* Ligne inférieure */}
        <MotionDiv
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.2, delay: 1 }}
          className="h-[2px] mt-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
        ></MotionDiv>
      </div>
    </section>
  );
};

export default Apropos;
