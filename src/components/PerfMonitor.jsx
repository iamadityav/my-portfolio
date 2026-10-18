// src/components/PerfMonitor.jsx: live FPS hook + floating performance widget
import { useEffect, useRef, useState } from 'react';

const ACCENT = '#3abf00';

// Real frame rate, measured with requestAnimationFrame
export function useFps() {
  const [fps, setFps] = useState(60);
  useEffect(() => {
    let frames = 0, last = performance.now(), raf;
    const loop = (t) => {
      frames += 1;
      if (t - last >= 1000) { setFps(Math.round((frames * 1000) / (t - last))); frames = 0; last = t; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return fps;
}

const Bar = ({ label, value, hint }) => (
  <div title={hint} className="flex items-center gap-2">
    <span className="w-6 text-gray-400">{label}</span>
    <span className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
      <span className="block h-full rounded-full transition-all duration-200" style={{ width: `${value}%`, background: ACCENT }} />
    </span>
  </div>
);

export function PerfMonitor() {
  const fps = useFps();
  const [js, setJs] = useState(4);
  const [ui, setUi] = useState(0);
  const vel = useRef(0);
  const lastY = useRef(0);
  const busy = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      vel.current = Math.max(vel.current, Math.abs(window.scrollY - lastY.current));
      lastY.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    let po;
    try { // long tasks = real main-thread (JS) blocking
      po = new PerformanceObserver((l) => l.getEntries().forEach((e) => { busy.current += e.duration; }));
      po.observe({ entryTypes: ['longtask'] });
    } catch { /* not supported */ }
    const id = setInterval(() => {
      setJs(Math.min(100, 4 + busy.current / 2.5));
      busy.current = 0;
      setUi(Math.min(100, vel.current * 1.2)); // illustrative: driven by scroll speed
      vel.current *= 0.4;
    }, 250);
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(id); po?.disconnect(); };
  }, []);

  return (
    <div className="hidden sm:block fixed top-9 right-3 z-50 w-36 p-2.5 rounded-lg bg-gray-900/80 backdrop-blur border border-gray-800 text-[10px] font-mono space-y-1.5">
      <div className="flex justify-between" style={{ color: ACCENT }}>
        <span>FPS</span><span>{fps}</span>
      </div>
      <Bar label="JS" value={js} hint="Main-thread long tasks (measured)" />
      <Bar label="UI" value={ui} hint="Scroll-driven demo of UI thread load" />
    </div>
  );
}