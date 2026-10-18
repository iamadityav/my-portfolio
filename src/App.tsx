// src/App.tsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
// @ts-ignore
import Hero from './components/Hero';
import TimeLine from './components/TimeLine';
// @ts-ignore
import Projects from './components/Projects';
// @ts-ignore
import CodePlayground from './components/CodePlayground';
// @ts-ignore
import About from './components/About';
// @ts-ignore
import { StatusBar, TabBar, Toast } from './components/PhoneChrome';
// @ts-ignore
import { PerfMonitor } from './components/PerfMonitor';

// Soft electric-lime glows drifting behind everything (the canvas stays dark, but not flat)
const blobs = [
  { top: '-10%', left: '-10%', size: '60vw', dx: 60, dy: 40, a: 0.16 },
  { top: '35%', left: '55%', size: '55vw', dx: -50, dy: 60, a: 0.12 },
  { top: '70%', left: '-5%', size: '50vw', dx: 40, dy: -50, a: 0.10 },
];

function App() {
  const [toast, setToast] = useState('');
  const timer = useRef<number>(0);
  const notify = (msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(''), 2200);
  };

  return (
    <div>
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: b.top, left: b.left, width: b.size, height: b.size,
              background: `radial-gradient(circle, rgba(58,191,0,${b.a}) 0%, transparent 65%)`,
            }}
            animate={{ x: [0, b.dx, 0], y: [0, b.dy, 0] }}
            transition={{ duration: 18 + i * 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <StatusBar />
      <PerfMonitor />
      <Toast message={toast} />
      <Hero />
      <TimeLine />
      <Projects />
      <CodePlayground />
      <About notify={notify} />
      <TabBar />
    </div>
  );
}

export default App;