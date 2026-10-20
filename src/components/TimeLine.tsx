// src/components/TimeLine.jsx
// "Deployment Console": career as a git graph. Main trunk to the v3.0.0 release,
// side work branches out and merges back. Each commit is an expandable PR card.
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceApp } from './Hero';

const ACCENT = '#3abf00';
const TRUNK_X = 24;
const BRANCH_X = 72;
const DOT_Y = 28;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// T = main trunk commit, B = side branch (forks from the previous trunk commit, merges into the next)
const commits = [
  { lane: 'T', tag: 'chore', ver: '0.1.0', year: '2019', title: 'Start B.Tech at G.L. Bajaj Institute',
    body: 'Bachelor of Technology in New Delhi NCR, 2019 to 2023.', stats: [['Degree', 'B.Tech']], stack: [] },
  { lane: 'B', branch: 'feat/foundations', tag: 'feat', ver: '0.2.0', year: '2020-23', title: 'Build the fundamentals: hackathons and 250+ LeetCode problems',
    body: 'Competed in hackathons on real-world problems and built problem-solving depth alongside college.',
    stats: [['LeetCode', '250+ solved'], ['Hackathons', 'Multiple']], stack: ['Algorithms', 'JavaScript'] },
  { lane: 'T', tag: 'feat', ver: '0.3.0', year: '2021', title: 'Frontend internship at MLworkX',
    body: 'Built responsive UI components in React.js, integrated REST APIs and worked with backend teams on PostgreSQL APIs.',
    stats: [['Role', 'Frontend Intern'], ['Where', 'New Delhi']], stack: ['React.js', 'REST', 'PostgreSQL'] },
  { lane: 'T', tag: 'release', ver: '1.0.0', year: '2023', title: 'Graduate with a B.Tech',
    body: 'Completed the degree in May 2023.', stats: [['Degree', 'B.Tech']], stack: [] },
  { lane: 'T', tag: 'feat', ver: '1.1.0', year: '2023', title: 'Join Digit Insurance as a React Native developer',
    body: 'Software Developer (React Native) in Bengaluru, working on the insurance mobile app.', stats: [['Role', 'Software Dev (RN)']], stack: ['React Native'] },
  { lane: 'T', tag: 'feat', ver: '1.2.0', year: '2023-26', title: 'Ship Motor Claims, Bike Insurance and My Policy',
    body: 'Implemented and maintained the core insurance journeys used by customers every month.', stats: [['Reach', '30K+ customers / month']], stack: ['React Native'] },
  { lane: 'B', branch: 'feat/buildspace-s5', tag: 'feat', ver: '1.3.0', year: '2024', title: 'Prototype an offline-first real-time app (Buildspace S5)',
    body: 'Real-time cross-platform app with offline caching, TypeScript architecture and Firebase data sync.',
    stats: [['Focus', 'Offline-first'], ['Sync', 'Firebase']], stack: ['React Native', 'TypeScript', 'Firebase'] },
  { lane: 'T', tag: 'perf', ver: '1.4.0', year: '2023-26', title: 'Improve load time and production stability',
    body: 'Optimized bundle size and rendering for mid-range and low-end Android devices, and strengthened crash analytics and logging.',
    stats: [['Initial load', '~20% faster'], ['Recurring issues', '~30% lower']], stack: ['React Native', 'Android'],
    diff: ['  // performance and reliability', '+ leaner bundle and render path', '+ stronger crash analytics and logging'] },
  { lane: 'T', tag: 'perf', ver: '2.0.0', year: '2025', title: 'Migrate the build system from Webpack to Re.Pack',
    body: 'Moved the app to Callstack Re.Pack, improving CI/CD throughput and helping the team ship features faster.',
    stats: [['Dev builds', '~40% faster'], ['CI/CD', 'Higher throughput']], stack: ['Re.Pack', 'Webpack'],
    diff: ['- bundler: Webpack', '+ bundler: Callstack Re.Pack', '  // dev build time: ~40% down'] },
  { lane: 'T', tag: 'release', ver: '2.1.0', year: '2025', title: 'Tech Titan Award',
    body: 'Recognized at Digit Insurance for leading the Webpack to Re.Pack migration.', stats: [['Award', 'Tech Titan 2025']], stack: [] },
  { lane: 'B', branch: 'feat/voice-notes', tag: 'feat', ver: '2.2.0', year: '2025', title: 'Build a voice-enabled note-taking app using Open AI whisper API',
    body: 'Speech-to-text transcription with OpenAI and reminders powered by Node.js APIs. Try the demo below.',
    stats: [['Speech-to-text', 'OpenAI']], stack: ['React Native', 'OpenAI', 'Node.js'], demo: true },
  { lane: 'T', tag: 'release', ver: '3.0.0', year: '2026', title: 'Ship CloudHire AI as the sole React Native engineer',
    body: 'Joined as SDE 2 and independently architected, built and shipped the B2C app to the App Store and Play Store.',
    stats: [['Stores', 'iOS + Android'], ['Role', 'SDE 2'], ['Plans', 'Blue / Elite']],
    stack: ['React Native', 'Zustand', 'OpenAI', 'Anthropic', 'Razorpay', 'FCM'],
    diff: ['+ job feed, filters, swipe-to-apply', '+ Auto Apply: LinkedIn OTP, 2FA, inbox sync', '+ AI resume + mock interviews', '+ subscriptions, chat, push, analytics'] },
];

const tagStyle = { feat: ACCENT, perf: '#a3e635', fix: '#fbbf24', chore: '#6b7280', release: '#ffffff' };

function Rail({ i, head }) {
  const c = commits[i];
  const prev = commits[i - 1];
  const isBranch = c.lane === 'B';
  const mergeRow = prev && prev.lane === 'B'; // merge curve arrives at this trunk commit
  const reached = head >= i;
  const x = isBranch ? BRANCH_X : TRUNK_X;
  return (
    <svg className="absolute left-0 top-0 h-full" width="96" aria-hidden="true">
      <line x1={TRUNK_X} y1={i === 0 ? DOT_Y : 0} x2={TRUNK_X} y2={i === commits.length - 1 ? DOT_Y : '100%'} stroke={ACCENT} strokeOpacity="0.45" strokeWidth="2" />
      {isBranch && (
        <>
          <path d={`M${TRUNK_X} 0 C${TRUNK_X} 22 ${BRANCH_X} 8 ${BRANCH_X} ${DOT_Y}`} fill="none" stroke={ACCENT} strokeOpacity="0.45" strokeWidth="2" />
          <line x1={BRANCH_X} y1={DOT_Y} x2={BRANCH_X} y2="100%" stroke={ACCENT} strokeOpacity="0.45" strokeWidth="2" />
        </>
      )}
      {mergeRow && <path d={`M${BRANCH_X} 0 C${BRANCH_X} 18 ${TRUNK_X} 10 ${TRUNK_X} ${DOT_Y}`} fill="none" stroke={ACCENT} strokeOpacity="0.45" strokeWidth="2" />}
      {head === i && <circle cx={x} cy={DOT_Y} r="13" fill={ACCENT} opacity="0.25" className="animate-ping" style={{ transformOrigin: `${x}px ${DOT_Y}px` }} />}
      <circle cx={x} cy={DOT_Y} r={c.tag === 'release' ? 9 : 7} fill={reached ? ACCENT : '#111827'} stroke={ACCENT} strokeWidth="2.5" />
    </svg>
  );
}

function Card({ c, isOpen, isHead, onToggle }) {
  return (
    <div className="rounded-xl border bg-gray-900/70 backdrop-blur" style={{ borderColor: isHead ? ACCENT : '#1f2937' }}>
      <button onClick={onToggle} className="w-full text-left p-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ color: '#000', background: tagStyle[c.tag] }}>{c.tag}</span>
        <span className="font-semibold text-sm text-white">{c.title}</span>
        <span className="ml-auto text-[11px] font-mono text-gray-500">v{c.ver} / {c.year}</span>
        {c.branch && <span className="basis-full text-[11px] font-mono" style={{ color: ACCENT }}>branch: {c.branch}, merged</span>}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-3 pb-3 space-y-3">
              <p className="text-sm text-gray-300">{c.body}</p>
              {c.stats.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {c.stats.map(([k, v]) => (
                    <span key={k} className="text-[11px] font-mono px-2 py-1 rounded border border-gray-700 text-gray-300">
                      {k}: <span style={{ color: ACCENT }}>{v}</span>
                    </span>
                  ))}
                </div>
              )}
              {c.diff && (
                <div>
                  <pre className="text-xs font-mono rounded-lg bg-black/60 border border-gray-800 p-3 overflow-x-auto">
                    {c.diff.map((l, k) => (
                      <div key={k} style={{ color: l[0] === '+' ? ACCENT : l[0] === '-' ? '#f87171' : '#6b7280' }}>{l}</div>
                    ))}
                  </pre>
                  <p className="text-[10px] text-gray-600 mt-1">illustrative diff</p>
                </div>
              )}
              {c.stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {c.stack.map((s) => <span key={s} className="text-[11px] px-2 py-0.5 rounded-full text-black font-medium" style={{ background: ACCENT }}>{s}</span>)}
                </div>
              )}
              {c.demo && (
                <div className="flex justify-center">
                  <div className="w-[190px] h-[390px] rounded-[2rem] border-4 border-gray-700 bg-gray-950 overflow-hidden relative">
                    <div className="origin-top-left" style={{ width: 250, height: 520, transform: 'scale(0.74)' }}><VoiceApp /></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TimeLine() {
  const [cmd, setCmd] = useState('start-my-journey --year=2019');
  const [log, setLog] = useState('Ready. Press Enter to deploy.');
  const [running, setRunning] = useState(false);
  const [head, setHead] = useState(-1);
  const [open, setOpen] = useState(-1);
  const rows = useRef([]);
  const cancelled = useRef(false);
  useEffect(() => () => { cancelled.current = true; }, []);

  const run = async () => {
    if (running) return;
    if (!cmd.trim().startsWith('start-my-journey')) { setLog(`command not found: ${cmd.trim().split(' ')[0] || '(empty)'}`); return; }
    const m = cmd.match(/--year=(\d{4})/);
    const year = m ? Number(m[1]) : 2019;
    const start = commits.findIndex((c) => parseInt(c.year, 10) >= year);
    if (start < 0) { setLog(`no commits found for year ${year}`); return; }

    cancelled.current = false;
    setRunning(true);
    for (let i = start; i < commits.length; i++) {
      const c = commits[i];
      setHead(i);
      setOpen(i);
      setLog(`deploying v${c.ver}  ${c.title}`);
      rows.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(c.demo ? 4500 : 2400);
      if (cancelled.current) return;
    }
    setLog('Release v3.0.0 deployed. Welcome to production.');
    setRunning(false);
  };

  return (
    <section id="timeline" className="relative min-h-screen py-20 px-4 sm:px-8 overflow-hidden text-white">
      {/* perspective grid floor */}
      <div className="absolute inset-x-0 top-0 h-[420px] pointer-events-none opacity-40" aria-hidden="true"
        style={{
          backgroundImage: 'linear-gradient(rgba(58,191,0,.28) 1px, transparent 1px), linear-gradient(90deg, rgba(58,191,0,.28) 1px, transparent 1px)',
          backgroundSize: '48px 48px', transform: 'perspective(500px) rotateX(62deg)', transformOrigin: 'top',
          maskImage: 'linear-gradient(black, transparent)', WebkitMaskImage: 'linear-gradient(black, transparent)',
        }} />

      <div className="relative mx-auto max-w-3xl">
        <p className="font-mono text-xs tracking-widest mb-2" style={{ color: ACCENT }}>DEPLOYMENT CONSOLE</p>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl mb-6" style={{ color: ACCENT }}>Release History</h2>

        {/* terminal */}
        <div className="rounded-xl border border-gray-800 bg-gray-950/90 backdrop-blur p-4 mb-10 font-mono text-sm">
          <label className="flex items-center gap-2">
            <span style={{ color: ACCENT }}>&gt;</span>
            <input value={cmd} onChange={(e) => setCmd(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && run()}
              disabled={running} spellCheck={false} aria-label="Console command"
              className="flex-1 bg-transparent outline-none text-white disabled:opacity-60" />
            <button onClick={run} disabled={running} className="px-3 py-1 rounded text-xs font-semibold text-black disabled:opacity-50" style={{ background: ACCENT }}>
              {running ? 'Running' : 'Run'}
            </button>
          </label>
          <p className="mt-3 text-xs text-gray-400">{log}</p>
          <p className="mt-1 text-[11px] text-gray-600">Try: start-my-journey --year=2023</p>
        </div>

        {/* git graph */}
        <div>
          {commits.map((c, i) => (
            <div key={i} ref={(el) => { rows.current[i] = el; }} className="relative pl-[104px] pb-4">
              <Rail i={i} head={head} />
              <div style={{ paddingTop: 0 }}>
                <Card c={c} isOpen={open === i} isHead={head === i} onToggle={() => setOpen(open === i ? -1 : i)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TimeLine;