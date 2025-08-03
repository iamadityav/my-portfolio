// src/components/About.jsx
// About section with resume download, LinkedIn, and GitHub links
import { motion } from 'framer-motion';
import { Download, Linkedin, Github, Code, Coffee, Zap } from 'lucide-react';

function About() {
  const accentColor = '#3abf00';

  // Handler for resume download
  const handleResumeDownload = () => {
    // Create a temporary link element to trigger download
    // Replace 'resume.pdf' with your actual resume file path in the public folder
    const link = document.createElement('a');
    link.href = '/resume.pdf'; // Make sure to add your resume.pdf to the public folder
    link.download = 'Aditya_Verma_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: `0 10px 25px ${accentColor}30`
    },
    tap: { scale: 0.95 }
  };

  return (
    <section id="about" className="min-h-screen bg-black text-white py-20 px-8 flex items-center">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Side - About Content */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.h2 
              className="text-5xl font-bold mb-6"
              style={{ color: accentColor }}
            >
              About Me
            </motion.h2>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <p className="text-lg text-gray-300 leading-relaxed">
                I'm a passionate <span style={{ color: accentColor }} className="font-semibold">Front-end Developer</span> and 
                <span style={{ color: accentColor }} className="font-semibold"> Vibe Coder</span> who loves creating 
                innovative digital experiences. My journey in programming started in 2020, and since then, 
                I've been constantly evolving and learning new technologies.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                I specialize in building modern web applications using React, React Native, and TypeScript. 
                I'm particularly interested in AI integration, performance optimization, and creating 
                user-centric solutions that make a difference.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source 
                projects, or sharing knowledge with the developer community.
              </p>
            </motion.div>

            {/* Skills/Interests */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center space-x-3 p-4 bg-gray-900 rounded-lg">
                <Code size={24} style={{ color: accentColor }} />
                <span className="text-sm font-medium">Clean Code</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-900 rounded-lg">
                <Zap size={24} style={{ color: accentColor }} />
                <span className="text-sm font-medium">Performance</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-900 rounded-lg">
                <Coffee size={24} style={{ color: accentColor }} />
                <span className="text-sm font-medium">Innovation</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Profile & Actions */}
          <motion.div variants={itemVariants} className="text-center lg:text-left">
            {/* Profile Image Placeholder */}
            <motion.div 
              className="w-64 h-64 mx-auto lg:mx-0 mb-8 bg-gray-900 rounded-full flex items-center justify-center border-4 overflow-hidden"
              style={{ borderColor: accentColor }}
              whileHover={{ 
                boxShadow: `0 0 30px ${accentColor}50`,
                scale: 1.02 
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Replace this with your actual profile image */}
              <img 
                // src="https://placehold.co/256x256/3abf00/000000?text=AV&font=source-code-pro" 
                src="/src/components/avatar.png"
                alt="Aditya Verma"
                className="w-full h-full object-cover rounded-full"
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Resume Download Button */}
              <motion.button
                onClick={handleResumeDownload}
                className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-lg font-semibold text-black transition-all duration-300"
                style={{ backgroundColor: accentColor }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Download size={20} />
                <span>Download Resume</span>
              </motion.button>

              {/* Social Links */}
              <div className="grid grid-cols-2 gap-4">
                {/* LinkedIn Button */}
                <motion.a
                  href="https://linkedin.com/in/your-profile" // Replace with your LinkedIn URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-6 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Linkedin size={20} style={{ color: accentColor }} />
                  <span>LinkedIn</span>
                </motion.a>

                {/* GitHub Button */}
                <motion.a
                  href="https://github.com/your-username" // Replace with your GitHub URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-6 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Github size={20} style={{ color: accentColor }} />
                  <span>GitHub</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 grid grid-cols-3 gap-4 text-center"
            >
              <div className="p-4 bg-gray-900 rounded-lg">
                <div className="text-2xl font-bold" style={{ color: accentColor }}>5+</div>
                <div className="text-sm text-gray-400">Years Coding</div>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg">
                <div className="text-2xl font-bold" style={{ color: accentColor }}>50+</div>
                <div className="text-sm text-gray-400">Projects</div>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg">
                <div className="text-2xl font-bold" style={{ color: accentColor }}>∞</div>
                <div className="text-sm text-gray-400">Coffee Cups</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;