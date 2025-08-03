// src/App.jsx
// Updated main file with new section order: Hero -> Timeline -> About -> Code Playground
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import About from './components/About';
import CodePlayground from './components/CodePlayground';

function App() {
  const [showNavbar, setShowNavbar] = useState(false);

  // useEffect to handle the scroll event for revealing the navbar and other sections.
  useEffect(() => {
    const handleScroll = () => {
      // The scroll threshold is set to one viewport height.
      // This means the navbar appears after the Hero section is scrolled past.
      const scrollThreshold = window.innerHeight;
      if (window.scrollY > scrollThreshold) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    // Add the event listener when the component mounts.
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts.
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function for smooth scrolling to sections.
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants for sections revealed on scroll.
  const sectionRevealVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    // The top-level div for the application.
    <div>
      {/* The navbar is conditionally rendered based on the showNavbar state. */}
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

      {/* The Hero component is the first thing rendered. */}
      <Hero />

      {/* The Timeline section - comes first after Hero */}
      <motion.div
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <Timeline />
      </motion.div>

      {/* The Code Playground section - comes second */}
      <motion.div
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <CodePlayground />
      </motion.div>

      {/* The About section - comes last */}
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