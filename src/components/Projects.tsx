// src/components/Projects.jsx: app springboard + architecture inspector
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Shield, Mic, Zap, Globe, ExternalLink, Github } from 'lucide-react';
import { projects } from '../data';
import { useFps } from './PerfMonitor';

const ACCENT = '#3abf00';
const icons = { cloud: Cloud, shield: Shield, mic: Mic, zap: Zap, globe: Globe };
const glass = 'rounded-2xl border bg-gray-950/60 backdrop-blur-md shadow-[0_0_30px_rgba(58,191,0,0.10)]';
const edge = { borderColor: 'rgba(58,191,0,0.28)' };

function Projects() {
  const [activeId, setActiveId] = useState(projects[0].id);
  const [ping, setPing] = useState({ id: '', n: 0 });
  const fps = useFps();
  const project = projects.find((p) => p.id === activeId);

  const select = (id) => {
    setActiveId(id);
    setPing((p) => ({ id, n: p.n + 1 })); // ripple on the tapped tile
    navigator.vibrate?.(8);               // tiny haptic on phones that support it
  };
  const badgeOf = (p) => (p.id === 'portfolio' ? `${fps} FPS` : p.badge);

  const act = 'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-shadow';

  return (
    <section id="projects" className="relative min-h-screen py-20 px-4 sm:px-8 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs sm:text-sm tracking-wide mb-2 text-center" style={{ color: ACCENT }}>// APP SPRINGBOARD</p>
        <h2 className="font-display font-extrabold text-4xl text-center mb-2" style={{ color: ACCENT }}>Apps</h2>
        <p className="text-gray-400 text-sm text-center mb-10">Tap an app to inspect its architecture.</p>

        {/* springboard */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-8 mb-8">
          {projects.map((p) => {
            const Icon = icons[p.icon];
            const isActive = p.id === activeId;
            return (
              <div key={p.id} className="flex flex-col items-center gap-2 w-24">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border whitespace-nowrap"
                  style={{ borderColor: isActive ? ACCENT : '#374151', color: isActive ? ACCENT : '#9ca3af' }}>
                  {badgeOf(p)}
                </span>
                <motion.button onClick={() => select(p.id)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }} aria-label={`Open ${p.name}`} aria-pressed={isActive}
                  className="relative w-20 h-20 rounded-[1.4rem] border bg-gradient-to-b from-gray-800/80 to-gray-950/80 backdrop-blur flex items-center justify-center overflow-hidden"
                  style={{ borderColor: isActive ? ACCENT : 'rgba(255,255,255,0.12)', color: ACCENT, boxShadow: isActive ? `0 0 24px ${ACCENT}66` : '0 8px 20px rgba(0,0,0,0.5)' }}>
                  <Icon size={32} />
                  {ping.id === p.id && (
                    <motion.span key={ping.n} className="absolute inset-0 m-auto w-10 h-10 rounded-full border-2 pointer-events-none"
                      style={{ borderColor: ACCENT }} initial={{ scale: 0.3, opacity: 0.9 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.6 }} />
                  )}
                </motion.button>
                <span className="text-xs text-gray-300">{p.name}</span>
                <div className="h-2 flex justify-center">
                  {isActive && (
                    <motion.span layoutId="app-dot" className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* inspector */}
        <AnimatePresence mode="wait">
          <motion.div key={project.id} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }} className={`${glass} p-5 sm:p-6`} style={edge}>
            {/* A. header + key metric */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] text-gray-500">{project.name} / {project.period}</p>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl" style={{ color: ACCENT }}>{project.headline}</h3>
                <p className="text-sm text-gray-400 mt-1">{project.subtitle}</p>
              </div>
              <div className="rounded-xl border px-4 py-3 text-right" style={edge}>
                <div className="font-display font-extrabold text-xl" style={{ color: ACCENT }}>{project.metric.value}</div>
                <div className="text-[11px] text-gray-400 max-w-[180px]">{project.metric.label}</div>
              </div>
            </div>

            {/* B. architectural summary */}
            <p className="font-mono text-[11px] text-gray-500 mt-6 mb-2">ARCHITECTURE & RESPONSIBILITIES</p>
            <ul className="space-y-2 text-sm text-gray-300">
              {project.points.map((pt) => (
                <li key={pt} className="flex gap-2"><span style={{ color: ACCENT }}>&gt;</span><span>{pt}</span></li>
              ))}
            </ul>

            {/* C. stack + actions */}
            <p className="font-mono text-[11px] text-gray-500 mt-6 mb-2">DEPENDENCIES</p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-md border" style={{ borderColor: ACCENT, color: ACCENT, background: 'rgba(58,191,0,0.08)' }}>{s}</span>
              ))}
            </div>

            {(project.store || project.repo) && (
              <div className="flex flex-wrap gap-3 mt-6">
                {project.store && (
                  <motion.a href={project.store} target="_blank" rel="noopener noreferrer" whileHover={{ boxShadow: `0 0 24px ${ACCENT}aa` }}
                    className={`${act} text-black`} style={{ background: ACCENT }}>
                    <ExternalLink size={16} /> Open live build
                  </motion.a>
                )}
                {project.repo && (
                  <a href={project.repo} target="_blank" rel="noopener noreferrer"
                    className={`${act} border border-gray-600 text-white hover:border-[#3abf00]`}>
                    <Github size={16} /> Inspect source
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Projects;