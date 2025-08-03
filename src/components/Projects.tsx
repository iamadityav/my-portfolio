// src/components/Projects.jsx
// This component for the projects section is updated to use the consistent black/green theme and Fira Code font.

import React, { useState } from 'react';
import { motion } from 'framer-motion';

function Projects() {
  const accentColor = '#3abf00'; // Define the accent color.
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  // Mock data for the projects.
  const projects = [
    {
      id: 1,
      title: 'Voice-Enabled Note-Taking App',
      stack: ['React Native', 'OpenAI'],
      image: 'https://placehold.co/400x225/2563eb/ffffff?text=Voice+App',
      video: 'https://cdn.videvo.net/videvo_files/video/free/2021-04/large_thumb/210329_06_Paris_4k_019.jpg',
    },
    {
      id: 2,
      title: 'Instagram Clone App',
      stack: ['React Native', 'Redux', 'TypeScript'],
      image: 'https://placehold.co/400x225/10b981/ffffff?text=Instagram+Clone',
      video: 'https://cdn.videvo.net/videvo_files/video/free/2016-04/large_thumb/Green_Energy_Windmills_4K_1.jpg',
    },
    {
      id: 3,
      title: 'BuildSpace Season 5 Project',
      stack: ['React Native', 'Firebase', 'TypeScript'],
      image: 'https://placehold.co/400x225/f97316/ffffff?text=BuildSpace+Project',
      video: 'https://cdn.videvo.net/videvo_files/video/free/2021-08/large_thumb/210730_02_Cyber-UI_4k_025.jpg',
    },
  ];

  return (
    // Main section container with the consistent theme colors.
    <section id="projects" className={`py-20 bg-black text-[${accentColor}] min-h-screen`}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            // Each project card is a motion div with a hover animation.
            <motion.div
              key={project.id}
              className="bg-gray-950 rounded-2xl shadow-lg overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredProjectId(project.id)}
              onMouseLeave={() => setHoveredProjectId(null)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full aspect-video">
                {/* Conditional rendering for the video on hover or image otherwise. */}
                {hoveredProjectId === project.id ? (
                  <video
                    src={project.video}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech, index) => (
                    // Display technology tags with the accent color.
                    <span
                      key={index}
                      className={`bg-[${accentColor}] text-black text-xs font-medium px-2.5 py-1 rounded-full`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
