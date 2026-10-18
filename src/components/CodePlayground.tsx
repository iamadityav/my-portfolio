// src/components/CodePlayground.jsx
// "The Native Bridge Engine": a JS editor wired to a simulated React Native bridge.
// Code runs in the browser against mock native APIs. Native logs and timings are simulated.
import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useFps } from './PerfMonitor';

const ACCENT = '#3abf00';
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const glass = 'rounded-xl border bg-gray-950/70 backdrop-blur shadow-[0_0_24px_rgba(58,191,0,0.12)]';
const glassBorder = { borderColor: 'rgba(58,191,0,0.35)' };

/* ---------- presets, completions, highlighting ---------- */
const PRESETS = [
  { id: 'turbo', name: 'Custom TurboModule Call', code: "// Call a native module through the TurboModule layer\nconst info = await TurboModule.execute('DeviceInfo', 'getBatteryLevel', []);\nconsole.log('native replied', info);\nUI.setText('Battery: ' + info.level + '%');\n" },
  { id: 'gesture', name: 'Reanimated 3 Gesture Handler', code: "// Gesture worklets run on the UI thread\nfor (const dir of ['left', 'right', 'left']) {\n  await Gesture.swipe(dir);\n  console.log('swiped', dir);\n}\nUI.setColor('#3abf00');\n" },
  { id: 'jsi', name: 'JSI Memory Allocation', code: "// JSI: direct host-object call, no JSON bridge\nconst buf = JSI.allocate(1024 * 1024);\nconsole.log('allocated', buf);\nBridge.sendEventToNative('memoryReport', { bytes: buf.bytes });\nUI.setText('1 MB via JSI');\n" },
  { id: 'haptic', name: 'Native Haptic Driver', code: "// Fire native haptics from JS\nHaptics.impact('light');\nawait new Promise((r) => setTimeout(r, 300));\nHaptics.impact('heavy');\nUI.setText('Haptic fired');\n" },
];

const COMPLETIONS = [
  { label: 'Bridge.sendEventToNative', insert: "Bridge.sendEventToNative('event', {})", detail: 'Send an event across the bridge' },
  { label: 'TurboModule.execute', insert: "TurboModule.execute('Module', 'method', [])", detail: 'Call a native TurboModule method' },
  { label: 'JSI.allocate', insert: 'JSI.allocate(1024)', detail: 'Allocate native memory via JSI' },
  { label: 'Haptics.impact', insert: "Haptics.impact('medium')", detail: "'light' | 'medium' | 'heavy'" },
  { label: 'Gesture.swipe', insert: "Gesture.swipe('left')", detail: "'left' | 'right'" },
  { label: 'UI.setText', insert: "UI.setText('Hello')", detail: 'Commit text to the phone screen' },
  { label: 'UI.setColor', insert: "UI.setColor('#3abf00')", detail: 'Change the screen accent color' },
  { label: 'console.log', insert: 'console.log()', detail: 'Print to JS output' },
];

const TOKEN = /(\/\/[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(const|let|var|await|async|function|return|for|of|if|else|new|true|false|null)\b|\b(Bridge|TurboModule|JSI|Haptics|Gesture|UI|console)\b|\b(\d+(?:\.\d+)?)\b/g;
const TOKEN_COLORS = [null, '#6b7280', '#a3e635', '#86efac', ACCENT, '#fbbf24'];
function highlight(src) {
  const out = [];
  let last = 0;
  for (const m of src.matchAll(TOKEN)) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const g = m.findIndex((v, i) => i > 0 && v !== undefined);
    out.push(<span key={m.index} style={{ color: TOKEN_COLORS[g], fontWeight: g === 4 ? 700 : 400 }}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  out.push(src.slice(last) + '\n');
  return out;
}

const fmt = (a) => (typeof a === 'string' ? a : a instanceof Error ? a.message : (() => { try { return JSON.stringify(a, null, 2); } catch { return String(a); } })());
const MOCK_RESULTS = { 'DeviceInfo.getBatteryLevel': { level: 87, charging: false }, 'DeviceInfo.getModel': { model: 'iPhone 15 Pro' } };
const initialPhone = { text: 'Ready', color: ACCENT, pulses: [], swipe: null, shake: 0 };

/* ---------- mini 3D phone that reacts to the code ---------- */
function NativePreview({ phone, setPhone }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 150, damping: 15 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <div onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }} className="h-full flex items-center justify-center">
      <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}>
        <motion.div key={phone.shake} animate={phone.shake ? { x: [0, -8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.4 }}
          className="relative w-[124px] h-[236px] rounded-[1.7rem] p-[3px] bg-gradient-to-b from-gray-500 via-gray-800 to-gray-600 shadow-[0_20px_50px_-15px_rgba(58,191,0,0.4)]">
          <div className="relative w-full h-full rounded-[1.5rem] bg-gray-950 overflow-hidden flex flex-col items-center justify-center gap-3 px-2">
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 rounded-full bg-black" />
            <motion.div key={phone.swipe?.id ?? 'none'} className="w-20 h-16 rounded-xl flex items-center justify-center text-[10px] text-black font-semibold text-center px-1 leading-tight"
              style={{ background: phone.color }}
              animate={phone.swipe ? { x: [0, phone.swipe.dir === 'left' ? -40 : 40, 0] } : {}} transition={{ duration: 0.45 }}>
              {phone.text}
            </motion.div>
            {phone.pulses.map((p) => (
              <motion.span key={p.id} className="absolute left-1/2 top-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full border-2 pointer-events-none"
                style={{ borderColor: phone.color }} initial={{ scale: 0.3, opacity: 0.9 }}
                animate={{ scale: p.style === 'heavy' ? 4.5 : p.style === 'light' ? 2 : 3, opacity: 0 }} transition={{ duration: 0.8 }}
                onAnimationComplete={() => setPhone((s) => ({ ...s, pulses: s.pulses.filter((q) => q.id !== p.id) }))} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ---------- main ---------- */
function CodePlayground() {
  const fps = useFps();
  const [code, setCode] = useState(PRESETS[0].code);
  const [preset, setPreset] = useState('turbo');
  const [jsOut, setJsOut] = useState([]);
  const [native, setNative] = useState([]);
  const [phone, setPhone] = useState(initialPhone);
  const [metrics, setMetrics] = useState({ js: 0, bridge: 0, calls: 0 });
  const [running, setRunning] = useState(false);
  const [sugg, setSugg] = useState(null);
  const [status, setStatus] = useState('');
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem('rn-playground-saved') || '[]'); } catch { return []; } });
  const taRef = useRef(null);
  const uid = useRef(0);
  const sectionRef = useRef(null);

  // Load a shared snippet from the URL hash (#code=...)
  useEffect(() => {
    if (!window.location.hash.startsWith('#code=')) return;
    try {
      setCode(decodeURIComponent(escape(atob(decodeURIComponent(window.location.hash.slice(6))))));
      setPreset('');
      sectionRef.current?.scrollIntoView();
    } catch { /* ignore bad link */ }
  }, []);

  const flash = (m) => { setStatus(m); setTimeout(() => setStatus(''), 2000); };

  const run = async () => {
    if (running) return;
    setRunning(true);
    setJsOut([]); setNative([]); setPhone(initialPhone);
    const t0 = performance.now();
    const latencies = [];
    const inited = new Set();
    let calls = 0;
    const id = () => (uid.current += 1);
    const pushJs = (kind, args) => setJsOut((o) => [...o, { id: id(), kind, text: args.map(fmt).join(' ') }]);
    const nlog = (text) => setNative((n) => [...n, { id: id(), text }]);
    const call = (label, base) => {
      const platform = calls++ % 2 === 0 ? 'iOS / Swift' : 'Android / Kotlin';
      const ms = base + Math.random() * base;
      latencies.push(ms);
      nlog(`[${platform}] ${label} -> ${ms.toFixed(2)}ms`);
    };
    const patch = (fn) => setPhone((p) => ({ ...p, ...fn(p) }));

    const Bridge = { sendEventToNative: (name) => { call(`Bridge event "${name}"`, 0.8); return true; } };
    const TurboModule = {
      execute: async (mod, method) => {
        if (!inited.has(mod)) { inited.add(mod); nlog(`[Android / Kotlin] TurboModule ${mod} initialized: memory allocated`); }
        call(`${mod}.${method}()`, 0.3);
        await sleep(90);
        return MOCK_RESULTS[`${mod}.${method}`] ?? { ok: true };
      },
    };
    const JSI = { allocate: (bytes) => { call(`JSI direct call allocate(${bytes})`, 0.04); return { bytes, address: '0x' + (0x10000000 + Math.floor(Math.random() * 0xffffff)).toString(16) }; } };
    const Haptics = {
      impact: (style = 'medium') => {
        call(`Haptics.impact('${style}')`, 0.2);
        navigator.vibrate?.(style === 'heavy' ? 40 : style === 'light' ? 10 : 20);
        patch((p) => ({ pulses: [...p.pulses, { id: id(), style }], shake: style === 'heavy' ? id() : p.shake }));
      },
    };
    const Gesture = { swipe: async (dir) => { call(`Gesture.swipe('${dir}') worklet on UI thread`, 0.1); patch(() => ({ swipe: { dir, id: id() } })); await sleep(500); } };
    const UI = {
      setText: (t) => { call('UI.setText (Fabric commit)', 0.5); patch(() => ({ text: String(t) })); },
      setColor: (c) => { call('UI.setColor (Fabric commit)', 0.5); patch(() => ({ color: String(c) })); },
    };
    const cons = { log: (...a) => pushJs('log', a), info: (...a) => pushJs('log', a), warn: (...a) => pushJs('warn', a), error: (...a) => pushJs('error', a) };

    try {
      await new AsyncFunction('Bridge', 'TurboModule', 'JSI', 'Haptics', 'Gesture', 'UI', 'console', code)(Bridge, TurboModule, JSI, Haptics, Gesture, UI, cons);
    } catch (err) {
      pushJs('error', [err && err.message ? err.message : String(err)]);
    } finally {
      const avg = latencies.length ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
      setMetrics({ js: performance.now() - t0, bridge: avg, calls: latencies.length });
      setRunning(false);
    }
  };

  /* ----- editor behaviour ----- */
  const updateSugg = (value, pos) => {
    const word = (value.slice(0, pos).match(/[\w.]+$/) || [''])[0];
    if (word.length < 2) return setSugg(null);
    const items = COMPLETIONS.filter((c) => c.label.toLowerCase().startsWith(word.toLowerCase()) && c.label.toLowerCase() !== word.toLowerCase());
    setSugg(items.length ? { items, idx: 0, word } : null);
  };
  const accept = () => {
    const ta = taRef.current;
    const pos = ta.selectionStart;
    const item = sugg.items[sugg.idx];
    const next = code.slice(0, pos - sugg.word.length) + item.insert + code.slice(pos);
    const caret = pos - sugg.word.length + item.insert.length;
    setCode(next); setSugg(null);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(caret, caret); });
  };
  const onKeyDown = (e) => {
    if (sugg) {
      if (e.key === 'ArrowDown') { e.preventDefault(); return setSugg((s) => ({ ...s, idx: (s.idx + 1) % s.items.length })); }
      if (e.key === 'ArrowUp') { e.preventDefault(); return setSugg((s) => ({ ...s, idx: (s.idx - 1 + s.items.length) % s.items.length })); }
      if (e.key === 'Tab' || e.key === 'Enter') { e.preventDefault(); return accept(); }
      if (e.key === 'Escape') return setSugg(null);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); return run(); }
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = e.target.selectionStart;
      setCode(code.slice(0, s) + '  ' + code.slice(e.target.selectionEnd));
      requestAnimationFrame(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; });
    }
  };

  /* ----- toolbar actions ----- */
  const save = () => {
    const next = [...saved, { name: `Saved #${saved.length + 1}`, code }];
    setSaved(next);
    try { localStorage.setItem('rn-playground-saved', JSON.stringify(next)); flash('Snippet saved in this browser'); } catch { flash('Could not save'); }
  };
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#code=${encodeURIComponent(btoa(unescape(encodeURIComponent(code))))}`;
    try { await navigator.clipboard.writeText(url); flash('Share link copied'); } catch { flash('Copy failed'); }
  };
  const onPreset = (v) => {
    setPreset(v);
    const p = PRESETS.find((x) => x.id === v) || saved.find((x) => x.name === v);
    if (p) setCode(p.code);
  };

  const lines = code.split('\n');
  const btn = 'px-3 py-2 rounded-lg text-xs font-semibold border border-gray-700 text-gray-200 hover:bg-gray-800';

  return (
    <section id="code-playground" ref={sectionRef} className="relative min-h-screen py-20 px-4 sm:px-8 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs sm:text-sm tracking-wide mb-4" style={{ color: ACCENT }}>
          // JAVASCRIPT PLAYGROUND: THE NATIVE BRIDGE ENGINE
        </p>

        {/* toolbar */}
        <div className={`${glass} p-3 mb-4 flex flex-wrap items-center gap-3`} style={glassBorder}>
          <select value={preset} onChange={(e) => onPreset(e.target.value)} aria-label="Presets"
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none">
            <option value="">Custom code</option>
            {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            {saved.length > 0 && <optgroup label="Saved">{saved.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}</optgroup>}
          </select>
          <motion.button onClick={run} disabled={running} whileHover={{ boxShadow: `0 0 24px ${ACCENT}99` }} whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-lg text-xs font-bold text-black disabled:opacity-60" style={{ background: ACCENT }}>
            {running ? 'RUNNING...' : 'RUN IN NATIVE CONTEXT'}
          </motion.button>
          <button onClick={save} className={btn}>SAVE SNIPPET</button>
          <button onClick={share} className={btn} title="Copies a link that contains your code">SHARE LINK</button>
          {status && <span className="text-xs" style={{ color: ACCENT }}>{status}</span>}

          <div className="ml-auto flex items-center gap-4 text-[11px] font-mono text-gray-400" title="FPS is live. Bridge latency is simulated.">
            <span>FPS <b style={{ color: ACCENT }}>{fps}</b></span>
            <span>JS <b style={{ color: ACCENT }}>{metrics.js.toFixed(1)}ms</b></span>
            <span>BRIDGE <b style={{ color: ACCENT }}>{metrics.bridge.toFixed(2)}ms</b></span>
            <span>CALLS <b style={{ color: ACCENT }}>{metrics.calls}</b></span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* editor */}
          <div className={`${glass} h-[560px] flex flex-col relative overflow-hidden`} style={glassBorder}>
            <div className="px-4 py-2 border-b border-gray-800 text-[11px] font-mono text-gray-500 flex justify-between">
              <span>playground.js</span><span>Ctrl/Cmd + Enter to run</span>
            </div>
            <div className="flex-1 overflow-auto font-mono text-[13px] leading-6">
              <div className="flex min-w-full w-max min-h-full">
                <div className="sticky left-0 z-10 shrink-0 w-11 text-right pr-2 py-3 select-none text-gray-600 bg-gray-950 border-r border-gray-800">
                  {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
                <div className="relative flex-1 min-w-[320px]">
                  <pre aria-hidden="true" className="m-0 py-3 px-3 pointer-events-none whitespace-pre font-mono text-[13px] leading-6 text-gray-200">{highlight(code)}</pre>
                  <textarea ref={taRef} value={code} spellCheck={false} wrap="off" maxLength={4000} aria-label="Code editor"
                    onChange={(e) => { setCode(e.target.value); setPreset(''); updateSugg(e.target.value, e.target.selectionStart); }}
                    onKeyDown={onKeyDown} onClick={() => setSugg(null)}
                    className="absolute inset-0 w-full h-full py-3 px-3 bg-transparent text-transparent caret-[#3abf00] resize-none outline-none whitespace-pre overflow-hidden font-mono text-[13px] leading-6 selection:bg-white/20" />
                </div>
              </div>
            </div>
            {sugg && (
              <div className="absolute bottom-3 left-14 z-20 w-72 rounded-lg border bg-gray-900 shadow-xl text-xs font-mono overflow-hidden" style={glassBorder}>
                {sugg.items.map((c, i) => (
                  <div key={c.label} className="px-3 py-1.5" style={i === sugg.idx ? { background: 'rgba(58,191,0,0.18)' } : {}}>
                    <div style={{ color: ACCENT }}>{c.label}</div>
                    {i === sugg.idx && <div className="text-gray-400 text-[11px]">{c.detail}</div>}
                  </div>
                ))}
                <div className="px-3 py-1 text-[10px] text-gray-600 border-t border-gray-800">Tab to insert, Esc to close</div>
              </div>
            )}
          </div>

          {/* console + preview */}
          <div className="flex flex-col gap-4">
            <div className={`${glass} h-[262px] grid grid-cols-2 divide-x divide-gray-800 overflow-hidden`} style={glassBorder}>
              <div className="flex flex-col min-h-0">
                <div className="px-3 py-2 text-[11px] font-mono text-gray-500 border-b border-gray-800">JS OUTPUT</div>
                <div className="flex-1 overflow-auto p-3 text-xs font-mono space-y-1">
                  {jsOut.length === 0 && <p className="text-gray-600">console.log output appears here.</p>}
                  {jsOut.map((o) => (
                    <pre key={o.id} className="whitespace-pre-wrap" style={{ color: o.kind === 'error' ? '#f87171' : o.kind === 'warn' ? '#fbbf24' : '#d1d5db' }}>{o.text}</pre>
                  ))}
                </div>
              </div>
              <div className="flex flex-col min-h-0">
                <div className="px-3 py-2 text-[11px] font-mono text-gray-500 border-b border-gray-800" title="Simulated native log stream">NATIVE BRIDGE (simulated)</div>
                <div className="flex-1 overflow-auto p-3 text-[11px] font-mono space-y-1">
                  {native.length === 0 && <p className="text-gray-600">Native thread logs appear here.</p>}
                  {native.map((n) => <p key={n.id} style={{ color: n.text.startsWith('[iOS') ? ACCENT : '#86efac' }}>{n.text}</p>)}
                </div>
              </div>
            </div>

            <div className={`${glass} h-[282px] relative`} style={glassBorder}>
              <span className="absolute top-2 left-3 text-[11px] font-mono text-gray-500">LIVE DEVICE PREVIEW</span>
              <NativePreview phone={phone} setPhone={setPhone} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CodePlayground;