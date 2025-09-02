// src/components/FloatingStar.jsx
import React from 'react';
import { motion } from 'framer-motion';

const FloatingStar = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <motion.div
        className="absolute"
        animate={{
          x: [
            '10vw', '80vw', '25vw', '70vw', '15vw', 
            '90vw', '40vw', '5vw', '85vw', '30vw',
            '75vw', '20vw', '95vw', '35vw', '60vw',
            '10vw'
          ],
          y: [
            '10vh', '70vh', '25vh', '85vh', '40vh',
            '15vh', '90vh', '55vh', '20vh', '75vh',
            '35vh', '80vh', '50vh', '10vh', '65vh',
            '10vh'
          ],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: 'drop-shadow(0 0 20px #3abf00)',
        }}
      >
        {/* Star with glowing effect */}
        <div className="relative">
          {/* Main star body */}
          <div 
            className="w-3 h-3 rotate-45 relative"
            style={{
              background: 'linear-gradient(45deg, #3abf00, #4eff00)',
              borderRadius: '2px',
              boxShadow: `
                0 0 10px #3abf00,
                0 0 20px #3abf00,
                0 0 30px #3abf00,
                inset 0 0 10px rgba(58, 191, 0, 0.3)
              `,
            }}
          >
            {/* Star cross effect */}
            <div 
              className="absolute inset-0 rotate-45"
              style={{
                background: 'linear-gradient(45deg, transparent 40%, #3abf00 50%, transparent 60%)',
              }}
            />
          </div>
          
          {/* Glowing tail trail - now dynamic based on movement direction */}
          <motion.div
            className="absolute top-1/2"
            style={{
              width: '150px',
              height: '2px',
              background: 'linear-gradient(to right, transparent, #3abf00, rgba(58, 191, 0, 0.5), transparent)',
              transform: 'translateY(-50%)',
              borderRadius: '1px',
              boxShadow: `
                0 0 5px #3abf00,
                0 0 10px rgba(58, 191, 0, 0.5)
              `,
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scaleX: [0.8, 1.2, 0.8],
              rotate: [0, 5, -5, 0],
              x: [-75, -75],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Additional sparkle effects */}
          <motion.div
            className="absolute -top-1 -left-1 w-1 h-1 rounded-full"
            style={{
              backgroundColor: '#3abf00',
              boxShadow: '0 0 8px #3abf00',
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.5,
            }}
          />
          
          <motion.div
            className="absolute -bottom-1 -right-1 w-1 h-1 rounded-full"
            style={{
              backgroundColor: '#3abf00',
              boxShadow: '0 0 8px #3abf00',
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 1,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingStar;