// src/components/About.jsx: "Diagnostics & System Architecture" spec sheet + command hub
import { useState, useEffect, useRef } from 'react';
import { motion, animate, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, Linkedin, Github, Mail } from 'lucide-react';
import { profile } from '../data';
import avatar from './avatar.png';

const ACCENT = '#3abf00';
const glass = 'rounded-2xl border bg-gray-950/60 backdrop-blur-md shadow-[0_0_30px_rgba(58,191,0,0.10)]';
const edge = { borderColor: 'rgba(58,191,0,0.28)' };

const impact = [
  { tag: 'PERFORMANCE', text: 'Led the Webpack to Re.Pack migration at Digit: dev builds ~40% faster, higher CI/CD throughput, Tech Titan Award (2025).' },
  { tag: 'SCALE', text: 'Shipped Motor Claims, Bike Insurance and My Policy, used by 30K+ customers every month.' },
  { tag: 'AI & MONETIZATION', text: 'Launched AI resume generation and mock interviews (OpenAI, Anthropic) with Razorpay subscriptions at CloudHire.' },
  { tag: 'FREELANCE', text: 'Open to freelance projects: end-to-end React Native apps, AI features, payments, analytics and performance work.' },
];

const stack = [
  { cat: 'Runtime & Core', tags: ['React Native', 'TypeScript', 'JavaScript'],
    ctx: 'Sole React Native engineer on CloudHire (App Store + Play Store). Production React Native at Digit Insurance for 2.5+ years.', pill: '2 production apps' },
  { cat: 'State Management', tags: ['Zustand', 'Redux'],
    ctx: "Zustand drives CloudHire's multi-step onboarding and application tracker.", flow: 'UI event > action > store > selector > UI' },
  { cat: 'Build & Tooling', tags: ['Re.Pack', 'Xcode', 'Android Studio'],
    ctx: 'Led the Webpack to Re.Pack migration at Digit and won the Tech Titan Award (2025).', pill: '~40% faster dev builds' },
  { cat: 'AI & Backend', tags: ['Node.js', 'Firebase', 'PostgreSQL', 'OpenAI', 'Anthropic'],
    ctx: 'OpenAI and Anthropic power AI resume generation and mock interviews. Node.js drives reminders, Firebase handles real-time sync.', pill: 'AI in production' },
  { cat: 'Payments & Analytics', tags: ['Razorpay', 'Mixpanel', 'Meta App Events'],
    ctx: 'Razorpay subscriptions (Blue and Elite plans) behind one paywall. Mixpanel, Meta App Events and Firebase analytics with referral deep linking.', pill: 'Subscriptions + growth' },
];

/* ---------- small helpers ---------- */
function CountUp({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: 'easeOut', onUpdate: (l) => setV(Math.round(l)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

function Gauge({ value, label }) {
  return (
    <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden" role="img" aria-label={label}>
      <motion.div className="h-full rounded-full" style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
        initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut' }} />
    </div>
  );
}

const Pill = ({ children }) => (
  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ borderColor: ACCENT, color: ACCENT }}>{children}</span>
);

/* ---------- tilting avatar ---------- */
function AvatarCard() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 150, damping: 15 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <div onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }} className={`${glass} p-6 flex items-center gap-5`} style={edge}>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 600 }} className="relative w-28 h-28 shrink-0">
        <motion.div className="absolute inset-0 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ background: `conic-gradient(from 0deg, ${ACCENT}, transparent 40%, ${ACCENT} 70%, transparent)`, filter: 'blur(1px)' }} />
        <div className="absolute inset-[3px] rounded-full bg-black overflow-hidden" style={{ boxShadow: `0 0 30px ${ACCENT}55` }}>
          <img src={avatar} alt={profile.name} className="w-full h-full object-cover" />
        </div>
      </motion.div>
      <div>
        <p className="font-display font-extrabold text-xl text-white">{profile.name}</p>
        <p className="text-xs text-gray-400">{profile.role}</p>
        <p className="text-xs mt-1" style={{ color: ACCENT }}>{profile.company}</p>
      </div>
    </div>
  );
}

/* ---------- main ---------- */
function About({ notify }) {
  const [active, setActive] = useState(0);
  const [meta, setMeta] = useState('PDF');

  // Real file details for the resume button (size, last updated), when the file is served
  useEffect(() => {
    fetch(profile.resume, { method: 'HEAD' }).then((r) => {
      if (!r.ok || !(r.headers.get('content-type') || '').includes('pdf')) return;
      const size = r.headers.get('content-length');
      const mod = r.headers.get('last-modified');
      const parts = ['PDF'];
      if (size) parts.push(`${Math.round(size / 1024)} KB`);
      if (mod) parts.push('updated ' + new Date(mod).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }));
      setMeta(parts.join(' / '));
    }).catch(() => {});
  }, []);

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(profile.email); notify('Copied to clipboard! 📋'); }
    catch { notify(profile.email); }
  };
  const ctx = stack[active];
  const key = 'flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/70 hover:border-[#3abf00] transition-colors text-sm text-white';
  const keycap = 'text-[11px] font-mono px-2 py-0.5 rounded border border-gray-600 text-gray-300';

  return (
    <section id="about" className="relative min-h-screen py-20 px-4 sm:px-8 text-white overflow-hidden">
      <div className="absolute -top-20 right-0 w-[60vw] h-[60vw] pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(circle, rgba(58,191,0,0.14), transparent 65%)' }} />

      <div className="relative mx-auto max-w-7xl grid lg:grid-cols-[1.25fr_1fr] gap-8">
        {/* ---------- left: narrative + dependency matrix ---------- */}
        <div>
          <p className="font-mono text-xs sm:text-sm tracking-wide mb-4" style={{ color: ACCENT }}>// DIAGNOSTICS & SYSTEM ARCHITECTURE</p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight mb-8 text-white">
            I'm Aditya, a React Native engineer who takes mobile products from architecture to the App Store and Play Store. Open to freelance work.
          </h2>

          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {impact.map((c, i) => (
              <motion.div key={c.tag} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`${glass} p-4`} style={edge}>
                <Pill>{c.tag}</Pill>
                <p className="mt-3 text-sm text-gray-300">{c.text}</p>
              </motion.div>
            ))}
          </div>

          <div className={`${glass} p-4`} style={edge}>
            <p className="font-mono text-[11px] text-gray-500 mb-3">TECH STACK (hover or tap a category)</p>
            <div className="divide-y divide-gray-800">
              {stack.map((row, i) => (
                <button key={row.cat} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}
                  className="w-full text-left py-3 grid sm:grid-cols-[150px_1fr] gap-2 items-start">
                  <span className="text-xs font-mono" style={{ color: active === i ? ACCENT : '#9ca3af' }}>{row.cat}</span>
                  <span className="flex flex-wrap gap-1.5">
                    {row.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-md border transition-colors"
                        style={active === i ? { borderColor: ACCENT, color: ACCENT, background: 'rgba(58,191,0,0.08)' } : { borderColor: '#374151', color: '#d1d5db' }}>
                        {t}
                      </span>
                    ))}
                  </span>
                </button>
              ))}
            </div>
            <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl bg-black/50 border border-gray-800 p-3 text-xs text-gray-300">
              <p>{ctx.ctx}</p>
              {ctx.flow && <p className="mt-2 font-mono" style={{ color: ACCENT }}>{ctx.flow}</p>}
              {ctx.pill && <div className="mt-2"><Pill>{ctx.pill}</Pill></div>}
            </motion.div>
          </div>
        </div>

        {/* ---------- right: avatar, metrics, command hub ---------- */}
        <div className="space-y-4">
          <AvatarCard />

          <div className="grid grid-cols-2 gap-3">
            <div className={`${glass} p-4`} style={edge}>
              <div className="text-3xl font-display font-extrabold" style={{ color: ACCENT }}><CountUp to={3} suffix="+" /></div>
              <p className="text-xs text-gray-400 mb-3">Years shipping RN</p>
              <Gauge value={70} label="Years of experience" />
              <div className="flex gap-1.5 mt-3"><Pill>iOS</Pill><Pill>Android</Pill></div>
            </div>

            <div className={`${glass} p-4`} style={edge}>
              <div className="text-3xl font-display font-extrabold" style={{ color: ACCENT }}><CountUp to={30} suffix="K+" /></div>
              <p className="text-xs text-gray-400 mb-3">Monthly users at Digit</p>
              <Gauge value={85} label="Monthly users" />
              <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-gray-300">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full animate-ping" style={{ background: ACCENT, opacity: 0.6 }} />
                  <span className="relative inline-flex w-2 h-2 rounded-full" style={{ background: ACCENT }} />
                </span>
                STABLE PRODUCTION
              </div>
            </div>

            <div className={`${glass} p-4`} style={edge}>
              <div className="text-3xl font-display font-extrabold" style={{ color: ACCENT }}>~<CountUp to={40} suffix="%" /></div>
              <p className="text-xs text-gray-400 mb-3">Faster builds</p>
              <div className="space-y-1.5 text-[10px] font-mono text-gray-400">
                <div>Webpack<Gauge value={100} label="Webpack relative build time" /></div>
                <div>Re.Pack<Gauge value={60} label="Re.Pack relative build time" /></div>
              </div>
              <p className="text-[10px] text-gray-600 mt-2">relative dev build time</p>
            </div>

            <div className={`${glass} p-4`} style={edge}>
              <div className="text-3xl font-display font-extrabold" style={{ color: ACCENT }}>~<CountUp to={30} suffix="%" /></div>
              <p className="text-xs text-gray-400 mb-3">Fewer recurring prod issues</p>
              <Gauge value={70} label="Recurring production issues reduced" />
              <div className="flex gap-1.5 mt-3"><Pill>Digit Insurance</Pill></div>
            </div>
          </div>

          {/* command hub */}
          <div className={`${glass} p-4 space-y-3`} style={edge}>
            <p className="font-mono text-[11px] text-gray-500">COMMAND HUB / OPEN TO FREELANCE PROJECTS</p>
            <motion.a href={profile.resume} download="Aditya_Verma_Resume.pdf" onClick={() => notify('Resume downloading')}
              initial="rest" whileHover="hover" whileTap={{ scale: 0.98 }}
              variants={{ rest: { boxShadow: `0 0 0 0 ${ACCENT}00` }, hover: { boxShadow: `0 0 28px ${ACCENT}aa` } }}
              className="flex items-center justify-between gap-3 px-5 py-4 rounded-xl font-semibold text-black" style={{ background: ACCENT }}>
              <span className="flex items-center gap-3">
                <motion.span variants={{ rest: { y: 0 }, hover: { y: [0, 3, 0], transition: { repeat: Infinity, duration: 0.8 } } }}><Download size={20} /></motion.span>
                Download Resume
              </span>
              <span className="text-[10px] font-mono font-normal">{meta}</span>
            </motion.a>

            <button onClick={copyEmail} className={`${key} w-full`}>
              <span className="flex items-center gap-3"><Mail size={18} style={{ color: ACCENT }} /> Copy email</span>
              <span className="text-xs text-gray-500">{profile.email}</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={key}>
                <span className="flex items-center gap-2"><Linkedin size={18} style={{ color: ACCENT }} /> LinkedIn</span>
                <span className={keycap}>⌘ + IN</span>
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className={key}>
                <span className="flex items-center gap-2"><Github size={18} style={{ color: ACCENT }} /> GitHub</span>
                <span className={keycap}>⌘ + GH</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <p className="relative mt-16 text-center text-[11px] font-mono text-gray-600">
        © 2026 Aditya Verma / built with React, Tailwind and Framer Motion
      </p>
    </section>
  );
}

export default About;