import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { 
  Instagram, 
  Facebook, 
  Mail, 
  ArrowRight, 
  Bike, 
  Leaf, 
  Smartphone, 
  Laptop, 
  MessageCircle, 
  PenTool 
} from 'lucide-react';

// --- Components ---

// 1. Custom Cursor Component
const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, smoothOptions);
  const smoothY = useSpring(mouseY, smoothOptions);

  useEffect(() => {
    const manageMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", manageMouseMove);
    return () => window.removeEventListener("mousemove", manageMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 bg-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-full rounded-full bg-purple-500 opacity-50"
        animate={{ scale: [1, 2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </motion.div>
  );
};

// 2. Animated Background Grid
const CyberGrid = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a]">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] animate-grid-move" />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] opacity-90" />
  </div>
);

// 3. Glitch Text Effect
const GlitchText = ({ text, className }) => {
  return (
    <motion.div 
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyan-400 opacity-0 animate-glitch-1">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-purple-500 opacity-0 animate-glitch-2">{text}</span>
      <style jsx>{`
        @keyframes glitch-1 {
          0% { clip: rect(20px, 9999px, 10px, 0); opacity: 0.8; transform: translate(-2px, 1px); }
          100% { clip: rect(80px, 9999px, 90px, 0); opacity: 0; transform: translate(2px, -1px); }
        }
        @keyframes glitch-2 {
          0% { clip: rect(60px, 9999px, 70px, 0); opacity: 0.8; transform: translate(2px, -1px); }
          100% { clip: rect(10px, 9999px, 20px, 0); opacity: 0; transform: translate(-2px, 1px); }
        }
        .animate-glitch-1 { animation: glitch-1 2.5s infinite linear alternate-reverse; }
        .animate-glitch-2 { animation: glitch-2 3s infinite linear alternate-reverse; }
      `}</style>
    </motion.div>
  );
};

// 4. Loading Screen
const Loader = ({ onComplete }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] text-white"
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <motion.div
        className="text-4xl md:text-6xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
      >
        INITIALIZING...
      </motion.div>
      <div className="mt-8 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-cyan-400"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          onAnimationComplete={onComplete}
        />
      </div>
    </motion.div>
  );
};

// 5. Skill Card with 3D Tilt Simulation
const SkillCard = ({ icon: Icon, title, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 211, 238, 0.1)", borderColor: "#22d3ee" }}
      className="relative p-6 border border-gray-800 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-sm group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex flex-col items-center text-center gap-4">
        <div className="p-4 rounded-full bg-gray-900 text-cyan-400 group-hover:text-white group-hover:bg-cyan-500 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <Icon size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-200 group-hover:text-cyan-300 transition-colors">{title}</h3>
      </div>
    </motion.div>
  );
};

// --- Main Application ---

export default function Portfolio() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Force loading state for 2 seconds minimum to show animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const skills = [
    { title: "Graphic Design", icon: PenTool },
    { title: "Communication", icon: MessageCircle },
    { title: "Computer Literacy", icon: Laptop },
    { title: "Mobile Tech", icon: Smartphone },
    { title: "Eco-conscious", icon: Leaf },
    { title: "Cycling", icon: Bike },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      <style>{`
        body { cursor: none; }
        a, button { cursor: none; }
        @media (hover: none) { body { cursor: auto; } }
      `}</style>
      
      <CustomCursor />
      <CyberGrid />
      
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          {/* --- Hero Section --- */}
          <section className="min-h-screen flex flex-col justify-center items-center px-4 text-center relative">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-cyan-400 tracking-[0.5em] text-sm md:text-base mb-4 uppercase font-bold">
                Student & Creative Designer
              </p>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter text-white">
                <GlitchText text="MAHADI" className="block md:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mx-2 md:mx-4">
                  HASAN
                </span>
                <GlitchText text="MUBIN" className="block md:inline" />
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 font-light">
                "Guiding path to a beautiful life."
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-transparent border border-cyan-500 text-cyan-400 font-bold uppercase tracking-wider rounded-full overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore My World <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-cyan-500/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </motion.button>
            </motion.div>

            <motion.div 
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="w-[1px] h-16 bg-gradient-to-b from-cyan-500 to-transparent" />
            </motion.div>
          </section>

          {/* --- About Section --- */}
          <section className="py-24 px-4 md:px-20 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">
                About <span className="text-cyan-500">Me</span>
              </h2>
              <div className="h-1 w-20 bg-cyan-500 mb-8" />
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed border-l-2 border-purple-500 pl-6 py-2 bg-gray-900/30 rounded-r-lg">
                I have been dedicating myself to continuous learning for over 12 years. My mission is to be of great benefit to others. I believe in helping people and returning kindness, even in difficult situations. Creating value for humanity is my true passion.
              </p>
            </motion.div>
          </section>

          {/* --- Skills Section --- */}
          <section className="py-24 px-4 md:px-20 bg-[#0f0f0f]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-12 text-white text-right">
                My <span className="text-purple-500">Arsenal</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill, index) => (
                  <SkillCard key={index} {...skill} index={index} />
                ))}
              </div>
            </div>
          </section>

          {/* --- Contact Section --- */}
          <section className="py-24 px-4 md:px-20 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
                Let's <span className="text-cyan-500">Connect</span>
              </h2>
              <p className="text-gray-400 mb-10 text-lg">
                Available for collaborations and friendly chats.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <a 
                  href="https://wa.me/8801572916616?text=Hello" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-4 bg-gray-800 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  <MessageCircle size={32} />
                </a>
                <a 
                  href="https://www.instagram.com/mahadihasanmubin.mubin/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-4 bg-gray-800 rounded-full hover:bg-pink-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Instagram size={32} />
                </a>
                <a 
                  href="https://www.facebook.com/mdmahadihasanmubin.mubin" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-4 bg-gray-800 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Facebook size={32} />
                </a>
                <a 
                  href="mailto:mahadihasanmubin001@gmail.com" 
                  className="p-4 bg-gray-800 rounded-full hover:bg-cyan-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Mail size={32} />
                </a>
              </div>

              <a 
                href="mailto:mahadihasanmubin001@gmail.com"
                className="text-xl md:text-2xl font-mono text-cyan-400 hover:underline decoration-purple-500 underline-offset-4"
              >
                mahadihasanmubin001@gmail.com
              </a>
            </motion.div>
          </section>

          {/* --- Footer --- */}
          <footer className="py-8 border-t border-gray-800 bg-black relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
              <p>&copy; {new Date().getFullYear()} Mahadi Hasan Mubin. All Systems Normal.</p>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}