// src/components/Hero.jsx: split layout. Left: command center. Right: tiltable phone with live mini-apps.
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mic } from 'lucide-react';
import { profile } from '../data';
import { useFps } from './PerfMonitor';
import SnakeBackground from './SnakeBackground';

const ACCENT = '#3abf00';

/* ---------- Mini apps that run inside the phone ---------- */
const PHRASE = 'Remind me to ship the release build at 6 pm';

export function VoiceApp() {
  const [state, setState] = useState('idle');
  const [text, setText] = useState('');
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const record = () => {
    if (state !== 'idle') return;
    setText(''); setState('rec');
    timers.current.push(setTimeout(() => {
      setState('typing');
      let i = 0;
      const tick = () => { i += 1; setText(PHRASE.slice(0, i)); if (i < PHRASE.length) timers.current.push(setTimeout(tick, 35)); else setState('idle'); };
      tick();
    }, 2200));
  };
  return (
    <div className="h-full flex flex-col pt-10">
      <div className="px-4 text-sm font-semibold" style={{ color: ACCENT }}>Voice Notes</div>
      <div className="flex-1 px-4 pt-4 text-sm text-gray-200">
        {text ? <p>{text}{state === 'typing' && <span className="animate-pulse">|</span>}</p>
          : <p className="text-gray-600">{state === 'rec' ? 'Listening...' : 'Tap the mic to dictate.'}</p>}
      </div>
      <div className="flex items-end justify-center gap-1 h-10 mb-2">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span key={i} className="w-1 rounded-full" style={{ background: ACCENT }}
            animate={{ height: state === 'rec' ? [6, 10 + ((i * 7) % 26), 6] : 4 }}
            transition={state === 'rec' ? { repeat: Infinity, duration: 0.6 + (i % 4) * 0.1 } : { duration: 0.2 }} />
        ))}
      </div>
      <div className="pb-8 flex justify-center">
        <motion.button onClick={record} whileTap={{ scale: 0.9 }} className="w-14 h-14 rounded-full flex items-center justify-center text-black" style={{ background: ACCENT }} aria-label="Record">
          <Mic size={24} />
        </motion.button>
      </div>
    </div>
  );
}

const JOBS = [['React Native Engineer', 'Remote, India'], ['Mobile Lead', 'Bengaluru'], ['Frontend Developer', 'Remote, Global'], ['SDE 2, Mobile', 'Hybrid']];

function GestureApp() {
  const [i, setI] = useState(0);
  const [last, setLast] = useState('Drag the card left or right');
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-160, 160], [-14, 14]);
  const applyO = useTransform(x, [20, 120], [0, 1]);
  const skipO = useTransform(x, [-120, -20], [1, 0]);
  const [t, c] = JOBS[i % JOBS.length];
  const [nt] = JOBS[(i + 1) % JOBS.length];
  return (
    <div className="h-full flex flex-col items-center pt-10 px-4">
      <div className="self-start text-sm font-semibold" style={{ color: ACCENT }}>Swipe to apply</div>
      <div className="relative w-full h-56 mt-5">
        <div className="absolute inset-0 scale-[0.93] translate-y-3 rounded-2xl bg-gray-900 border border-gray-800 p-4 text-xs text-gray-600">{nt}</div>
        <motion.div key={i} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.9} style={{ x, rotate }}
          onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 100) { setLast(info.offset.x > 0 ? 'Applied' : 'Skipped'); x.set(0); setI((v) => v + 1); } }}
          className="absolute inset-0 rounded-2xl bg-gray-900 border border-gray-700 p-4 cursor-grab active:cursor-grabbing">
          <p className="font-semibold text-white text-sm">{t}</p>
          <p className="text-xs text-gray-400">{c}</p>
          <motion.span style={{ opacity: applyO, color: ACCENT, borderColor: ACCENT }} className="absolute top-3 right-3 text-xs border rounded px-1.5 py-0.5">APPLY</motion.span>
          <motion.span style={{ opacity: skipO }} className="absolute top-3 left-3 text-xs border border-gray-500 text-gray-400 rounded px-1.5 py-0.5">SKIP</motion.span>
        </motion.div>
      </div>
      <p className="mt-6 text-xs text-gray-400">{last}</p>
    </div>
  );
}

function HapticApp() {
  const [ripples, setRipples] = useState([]);
  const [taps, setTaps] = useState(0);
  const tap = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = performance.now();
    setRipples((rs) => [...rs, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTaps((n) => n + 1);
    navigator.vibrate?.(15); // real haptics on supported phones
  };
  return (
    <div className="h-full flex flex-col pt-10">
      <div className="px-4 text-sm font-semibold" style={{ color: ACCENT }}>Haptic visualizer</div>
      <div onPointerDown={tap} className="relative flex-1 m-4 rounded-2xl border border-gray-800 overflow-hidden cursor-pointer select-none">
        <p className="absolute inset-0 flex items-center justify-center text-xs text-gray-600">Tap anywhere</p>
        {ripples.map((r) => (
          <motion.span key={r.id} className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-2" style={{ left: r.x, top: r.y, borderColor: ACCENT }}
            initial={{ scale: 0.2, opacity: 0.9 }} animate={{ scale: 4, opacity: 0 }} transition={{ duration: 0.8 }}
            onAnimationComplete={() => setRipples((rs) => rs.filter((q) => q.id !== r.id))} />
        ))}
      </div>
      <p className="pb-8 text-center text-xs text-gray-400">Impact: light / taps: {taps}</p>
    </div>
  );
}

const APPS = [
  { id: 'voice', label: 'Voice Notes', C: VoiceApp },
  { id: 'gesture', label: 'Gestures', C: GestureApp },
  { id: 'haptic', label: 'Haptics', C: HapticApp },
];

/* ---------- 3D tiltable phone ---------- */
function Phone() {
  const [app, setApp] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), { stiffness: 150, damping: 15 });
  const glare = useTransform([mx, my], ([a, b]) => `radial-gradient(circle at ${(a + 0.5) * 100}% ${(b + 0.5) * 100}%, rgba(255,255,255,0.14), transparent 55%)`);
  const { C } = APPS[app];

  useEffect(() => {
    const next = () => setApp((a) => (a + 1) % APPS.length); // dock "Apps" button
    window.addEventListener('phone:next', next);
    return () => window.removeEventListener('phone:next', next);
  }, []);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }} className="p-8">
        <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, transformStyle: 'preserve-3d' }}
          className="relative w-[250px] h-[510px] rounded-[2.8rem] p-[3px] bg-gradient-to-b from-gray-500 via-gray-800 to-gray-600 shadow-[0_30px_80px_-20px_rgba(58,191,0,0.35)]">
          <span className="absolute -left-[3px] top-24 w-[3px] h-8 rounded-l bg-gray-600" />
          <span className="absolute -left-[3px] top-36 w-[3px] h-12 rounded-l bg-gray-600" />
          <span className="absolute -right-[3px] top-32 w-[3px] h-16 rounded-r bg-gray-600" />
          <div className="relative w-full h-full rounded-[2.6rem] bg-black p-[6px]" style={{ transform: 'translateZ(20px)' }}>
            <div className="relative w-full h-full rounded-[2.1rem] bg-gray-950 overflow-hidden">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black z-20" />
              <AnimatePresence mode="wait">
                <motion.div key={APPS[app].id} className="h-full" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }}>
                  <C />
                </motion.div>
              </AnimatePresence>
              <motion.div className="absolute inset-0 pointer-events-none z-10" style={{ background: glare }} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-2">
        {APPS.map((a, i) => (
          <button key={a.id} onClick={() => setApp(i)} className="px-3 py-1 rounded-full text-[11px] border transition-colors"
            style={app === i ? { background: ACCENT, color: '#000', borderColor: ACCENT } : { color: '#9ca3af', borderColor: '#374151' }}>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Left canvas ---------- */
const SNIPPETS = {
  'Reanimated 3': 'const x = useSharedValue(0);\nconst style = useAnimatedStyle(() => ({\n  transform: [{ translateX: x.value }],\n}));\nx.value = withSpring(120);',
  'Fabric Renderer': '// New Architecture\n// Fabric commits the UI tree synchronously\n// and JSI calls native without the JSON bridge.',
  'Re.Pack': '// Webpack -> Re.Pack migration at Digit\n// dev build times down ~40%',
};

function Hero() {
  const fps = useFps();
  const [open, setOpen] = useState('Reanimated 3');
  const badge = 'px-2.5 py-1 rounded-full border text-[11px] font-mono';

  return (
    <section id="hero" className="relative min-h-screen pt-20 pb-28 px-6 lg:px-16 overflow-hidden" style={{ color: ACCENT }}>
      <SnakeBackground />
      <div className="relative z-10 mx-auto max-w-7xl grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-12rem)]">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={badge} style={{ borderColor: ACCENT }}><span className="animate-pulse">●</span> LIVE ON APP STORE</span>
            <span className={badge} style={{ borderColor: '#374151' }}>FPS: {fps}</span>
            <span className={badge} style={{ borderColor: '#374151' }}>BRIDGE: JSI / TURBOMODULES</span>
          </div>

          <p className="font-mono text-sm text-gray-400 mb-3">{profile.role} / {profile.company}</p>
          <h1 className="font-display font-extrabold uppercase leading-[0.9] tracking-tight text-6xl md:text-8xl xl:text-9xl" style={{ textShadow: `0 0 40px ${ACCENT}40` }}>
            ADITYA<br />VERMA
          </h1>

          <p className="mt-6 text-sm text-gray-400 max-w-md">
            I ship React Native apps end to end. Tap a concept to see it:
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.keys(SNIPPETS).map((k) => (
              <button key={k} onClick={() => setOpen(open === k ? '' : k)} className="px-3 py-1 rounded-md text-xs border"
                style={open === k ? { background: ACCENT, color: '#000', borderColor: ACCENT } : { borderColor: '#374151', color: '#d1d5db' }}>
                {k}
              </button>
            ))}
          </div>
          <AnimatePresence initial={false}>
            {open && (
              <motion.pre key={open} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="mt-3 max-w-md overflow-hidden rounded-lg bg-gray-900/80 border border-gray-800 p-3 text-xs text-gray-300 whitespace-pre-wrap font-mono">
                {SNIPPETS[open]}
              </motion.pre>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex justify-center">
          <Phone />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;