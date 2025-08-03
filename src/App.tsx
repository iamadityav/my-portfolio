// src/App.tsx
import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import CodePlayground from './components/CodePlayground';
import { motion, type Variants } from 'framer-motion';
import TimeLine from './components/TimeLine'; // <— correct casing here

const sectionRevealVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
  },
};

function App() {
  const [showNavbar, setShowNavbar] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initialize
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {showNavbar && (
        <nav className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 flex justify-center space-x-6 shadow-lg">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-lg font-medium hover:text-[#3abf00] transition-colors duration-300"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('timeline')}
            className="text-lg font-medium hover:text-[#3abf00] transition-colors duration-300"
          >
            Timeline
          </button>
          <button
            onClick={() => scrollToSection('code-playground')}
            className="text-lg font-medium hover:text-[#3abf00] transition-colors duration-300"
          >
            Code Playground
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-lg font-medium hover:text-[#3abf00] transition-colors duration-300"
          >
            About
          </button>
        </nav>
      )}

      <Hero />

      <motion.div
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <TimeLine />
      </motion.div>

      <motion.div
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <CodePlayground />
      </motion.div>

      <motion.div
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <About />
      </motion.div>
    </div>
  );
}

export default App;
