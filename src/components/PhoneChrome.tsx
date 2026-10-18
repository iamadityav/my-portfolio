// src/components/PhoneChrome.jsx: status bar, bottom tab bar and toast
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Home, Route, LayoutGrid, Terminal, User } from 'lucide-react';

const ACCENT = '#3abf00';
const tabs = [
  { id: 'hero', label: 'Home', Icon: Home },
  { id: 'timeline', label: 'Journey', Icon: Route },
  { id: 'projects', label: 'Apps', Icon: LayoutGrid },
  { id: 'code-playground', label: 'Play', Icon: Terminal },
  { id: 'about', label: 'About', Icon: User },
];

export function StatusBar() {
  const [time, setTime] = useState('');
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    tick();
    const t = setInterval(tick, 15000);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearInterval(t); window.removeEventListener('scroll', onScroll); };
  }, []);
  return (
    <div className="fixed top-0 inset-x-0 z-50 h-7 px-5 flex items-center justify-between text-xs bg-black/80 backdrop-blur" style={{ color: ACCENT }}>
      <span>{time}</span>
      <span className="flex items-center gap-2">
        <span>5G</span>
        {/* battery = how far you have scrolled */}
        <span className="relative inline-block w-6 h-3 rounded-sm border" style={{ borderColor: ACCENT }}>
          <span className="absolute inset-0.5 rounded-[1px] origin-left" style={{ background: ACCENT, transform: `scaleX(${1 - progress})` }} />
        </span>
        <span>{Math.round((1 - progress) * 100)}%</span>
      </span>
    </div>
  );
}

function DockItem({ mouseX, label, Icon, active, onClick }) {
  const ref = useRef(null);
  const dist = useTransform(mouseX, (v) => {
    const b = ref.current?.getBoundingClientRect();
    return b ? v - (b.x + b.width / 2) : Infinity;
  });
  const size = useSpring(useTransform(dist, [-120, 0, 120], [44, 66, 44]), { stiffness: 300, damping: 22 });
  return (
    <motion.button ref={ref} onClick={onClick} aria-label={label} style={{ width: size, height: size, color: active ? ACCENT : '#9ca3af' }}
      className="group relative rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center">
      <Icon size={22} />
      <span className="absolute -top-7 px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">{label}</span>
      {active && <span className="absolute -bottom-1.5 w-1 h-1 rounded-full" style={{ background: ACCENT }} />}
    </motion.button>
  );
}

export function TabBar() {
  const [active, setActive] = useState('hero');
  const mouseX = useMotionValue(Infinity);
  useEffect(() => {
    const onScroll = () => {
      let current = 'hero';
      tabs.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight / 2) current = id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const go = (id) => {
    if (id === 'projects') { // "Apps": jump to the phone and switch its app
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
      window.dispatchEvent(new Event('phone:next'));
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <nav onMouseMove={(e) => mouseX.set(e.clientX)} onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex items-end gap-2 px-3 py-2 rounded-3xl bg-gray-900/70 backdrop-blur border border-gray-800 shadow-xl">
      {tabs.map(({ id, label, Icon }) => (
        <DockItem key={id} mouseX={mouseX} label={label} Icon={Icon} active={active === id} onClick={() => go(id)} />
      ))}
    </nav>
  );
}

export function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed top-10 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-full bg-gray-900 border text-sm text-white shadow-lg"
          style={{ borderColor: ACCENT }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}