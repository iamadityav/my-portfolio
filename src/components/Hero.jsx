// src/components/Hero.jsx
// This version correctly places the main title in the bottom-right corner.
import React from 'react';
import { motion } from 'framer-motion';

function Hero() {
  // Define a constant for the accent color to easily manage the theme.
  const accentColor = '#3abf00'; // The bright green accent color.

  // Define animation variants for the top-left text block.
  const topLeftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Define animation variants for the main title for a bottom-right appearance.
  const mainTitleVariants = {
    hidden: { opacity: 0, x: 50 }, // Starts hidden and 50px to the right.
    visible: {
      opacity: 1,
      x: 0, // Animates to its final horizontal position.
      transition: {
        duration: 1.2,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  return (
    // The main section container with proper overflow handling
    <section 
      id="hero" 
      className="min-h-screen relative flex flex-col items-center justify-center bg-black overflow-hidden"
      style={{ color: accentColor }}
    >
      {/* Container for the text block in the top-left. */}
      <motion.div
        className="absolute top-8 left-8 p-4 text-left w-1/3 z-10"
        variants={topLeftVariants}
        initial="hidden"
        animate="visible"
        style={{ color: accentColor }}
      >
        <p className="text-2xl md:text-3xl font-bold">Front-end Developer</p>
        <p className="text-2xl md:text-3xl font-bold">Vibe Coder</p>
      </motion.div>

      {/* The main heading "ADITYA VERMA" positioned at the bottom right. */}
      <motion.h1
        className="absolute bottom-8 right-8 text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black uppercase tracking-tighter leading-none text-right z-10"
        variants={mainTitleVariants}
        initial="hidden"
        animate="visible"
        style={{ 
          color: accentColor,
          textShadow: `0 0 20px ${accentColor}40` // Added subtle glow effect
        }}
      >
        ADITYA<br />VERMA
      </motion.h1>
    </section>
  );
}

export default Hero;