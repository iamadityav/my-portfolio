// src/components/Timeline.jsx
// Interactive timeline with animated car following a zigzag path through 15 milestone points
import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

function TimeLine() {
  const accentColor = '#3abf00';
  const [currentPoint, setCurrentPoint] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carControls = useAnimation();

  // Timeline milestones data
  const milestones = [
    { id: 1, year: '2020', title: 'Started Programming', description: 'First line of code in Python' },
    { id: 2, year: '2020', title: 'Web Development', description: 'Learned HTML, CSS, JavaScript' },
    { id: 3, year: '2021', title: 'React Mastery', description: 'Built first React application' },
    { id: 4, year: '2021', title: 'Backend Skills', description: 'Node.js and Express.js' },
    { id: 5, year: '2021', title: 'Database Design', description: 'MongoDB and MySQL expertise' },
    { id: 6, year: '2022', title: 'Mobile Development', description: 'React Native journey begins' },
    { id: 7, year: '2022', title: 'TypeScript', description: 'Type-safe development practices' },
    { id: 8, year: '2022', title: 'DevOps Basics', description: 'Docker and deployment strategies' },
    { id: 9, year: '2023', title: 'AI Integration', description: 'OpenAI APIs and voice features' },
    { id: 10, year: '2023', title: 'Advanced React', description: 'Redux, Context, Custom hooks' },
    { id: 11, year: '2023', title: 'UI/UX Focus', description: 'Design systems and user experience' },
    { id: 12, year: '2024', title: 'Cloud Services', description: 'AWS and Firebase integration' },
    { id: 13, year: '2024', title: 'Performance', description: 'Optimization and best practices' },
    { id: 14, year: '2024', title: 'Team Leadership', description: 'Mentoring and code reviews' },
    { id: 15, year: '2025', title: 'Current Focus', description: 'Building innovative solutions' },
  ];

  // Generate zigzag path coordinates
  const generateZigzagPath = () => {
    const points = [];
    const containerWidth = 1000; // Approximate container width
    const containerHeight = 800; // Approximate container height
    const pointsPerRow = 3; // 3 points per row for zigzag effect
    
    for (let i = 0; i < 15; i++) {
      const row = Math.floor(i / pointsPerRow);
      const col = i % pointsPerRow;
      
      // Create zigzag pattern
      const isEvenRow = row % 2 === 0;
      const actualCol = isEvenRow ? col : (pointsPerRow - 1 - col);
      
      const x = (actualCol * (containerWidth / (pointsPerRow - 1))) + 100;
      const y = (row * (containerHeight / 5)) + 100;
      
      points.push({ x, y, id: i + 1 });
    }
    return points;
  };

  const pathPoints = generateZigzagPath();

  // Start the car animation journey
  const startJourney = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentPoint(0);

    for (let i = 0; i < pathPoints.length; i++) {
      const point = pathPoints[i];
      
      // Animate car to current point
      await carControls.start({
        x: point.x - 25, // Center the car on the point
        y: point.y - 25,
        transition: {
          duration: 1.5,
          ease: "easeInOut",
        }
      });

      setCurrentPoint(i + 1);
      
      // Pause at each point for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setIsAnimating(false);
  };

  // SVG path string for the zigzag line
  const createPathString = () => {
    let pathString = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      pathString += ` L ${pathPoints[i].x} ${pathPoints[i].y}`;
    }
    return pathString;
  };

  return (
    <section id="timeline" className="min-h-screen bg-black text-white py-20 px-8 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4" style={{ color: accentColor }}>
            Development Timeline
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            My journey through the world of programming and development
          </p>
          
          {/* Start Journey Button */}
          <motion.button
            onClick={startJourney}
            disabled={isAnimating}
            className="px-8 py-4 rounded-lg font-semibold text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: accentColor }}
            whileHover={{ scale: isAnimating ? 1 : 1.05 }}
            whileTap={{ scale: isAnimating ? 1 : 0.95 }}
          >
            {isAnimating ? `Traveling... (${currentPoint}/15)` : 'Start the Journey'}
          </motion.button>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative w-full" style={{ minHeight: '900px' }}>
          {/* SVG Path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Zigzag Path */}
            <motion.path
              d={createPathString()}
              stroke={accentColor}
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {/* Timeline Points */}
            {pathPoints.map((point, index) => (
              <motion.circle
                key={point.id}
                cx={point.x}
                cy={point.y}
                r="8"
                fill={currentPoint > index ? accentColor : '#374151'}
                stroke={accentColor}
                strokeWidth="2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={currentPoint === index + 1 ? 'animate-pulse' : ''}
              />
            ))}
          </svg>

          {/* Animated Car */}
          <motion.div
            animate={carControls}
            initial={{ x: pathPoints[0].x - 25, y: pathPoints[0].y - 25 }}
            className="absolute w-12 h-12 z-10"
          >
            {/* Simple Car SVG */}
            <svg viewBox="0 0 50 50" className="w-full h-full">
              <rect
                x="10" y="20" width="30" height="15"
                fill={accentColor}
                rx="3"
              />
              <rect
                x="15" y="15" width="20" height="8"
                fill={accentColor}
                rx="2"
              />
              {/* Wheels */}
              <circle cx="18" cy="38" r="4" fill="#374151" />
              <circle cx="32" cy="38" r="4" fill="#374151" />
              {/* Headlights */}
              <circle cx="42" cy="25" r="2" fill="#ffffff" />
              <circle cx="42" cy="30" r="2" fill="#ffffff" />
            </svg>
          </motion.div>

          {/* Milestone Cards */}
          {milestones.map((milestone, index) => {
            const point = pathPoints[index];
            const isActive = currentPoint > index;
            const isCurrent = currentPoint === index + 1;
            
            return (
              <motion.div
                key={milestone.id}
                className={`absolute p-4 rounded-lg shadow-lg transition-all duration-500 ${
                  isActive ? 'bg-gray-800' : 'bg-gray-900'
                } ${isCurrent ? 'ring-2' : ''}`}
                style={{
                  left: point.x + (index % 2 === 0 ? 40 : -220),
                  top: point.y - 20,
                  width: '200px',
                  borderColor: isCurrent ? accentColor : 'transparent',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-sm font-mono mb-1" style={{ color: accentColor }}>
                  {milestone.year}
                </div>
                <h3 className={`font-bold text-sm mb-2 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {milestone.title}
                </h3>
                <p className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-600'}`}>
                  {milestone.description}
                </p>
                {isCurrent && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping" 
                       style={{ backgroundColor: accentColor }} />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="mt-16 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentPoint > i ? 'scale-100' : 'scale-75'
                }`}
                style={{
                  backgroundColor: currentPoint > i ? accentColor : '#374151',
                }}
              />
            ))}
          </div>
          <p className="text-gray-400 font-mono text-sm">
            Progress: {currentPoint}/15 milestones
          </p>
        </div>
      </div>
    </section>
  );
}

export default TimeLine;