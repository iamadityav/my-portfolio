// src/App.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// @ts-ignore: No type declaration for JSX file
import Hero from './components/Hero';
// Ensure this matches the actual filename **exactly**
import TimeLine from './components/TimeLine';
// @ts-ignore
import About from './components/About';
// @ts-ignore
import CodePlayground from './components/CodePlayground';
import type { Variants } from 'framer-motion';

function App() {
  const [showNavbar, setShowNavbar] = useState(false);



  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight;
      setShowNavbar(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

const sectionRevealVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1], // ✅ correct and typed
    },
  },
};

  return (
    <div>
      {showNavbar && (
        <nav className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 flex justify-center space-x-6 shadow-lg">
          <button onClick={() => scrollToSection('hero')} className="text-lg font-medium hover:text-[#3abf00] transition-colors duration-300">
            Home
          </button>
          <button onClick={() => scrollToSection('timeline')} className="text-lg font-medium hover:text-[#3abf00] transition-colors duration-300">
            TimeLine
          </button>
          <button onClick={() => scrollToSection('code-playground')} className="text-lg font-medium hover:text-[#3abf00] transition-colors duration-300">
            Code Playground
          </button>
          <button onClick={() => scrollToSection('about')} className="text-lg font-medium hover:text-[#3abf00] transition-colors duration-300">
            About
          </button>
        </nav>
      )}

      <div id="hero">
        <Hero />
      </div>

      <motion.div id="timeline" variants={sectionRevealVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
        <TimeLine />
      </motion.div>

      <motion.div id="code-playground" variants={sectionRevealVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
        <CodePlayground />
      </motion.div>

      <motion.div id="about" variants={sectionRevealVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
        <About />
      </motion.div>
    </div>
  );
}

export default App;
