// src/components/SnakeBackground.jsx
// A faint Nokia-style snake that roams the hero section. Not playable.
// Place it as the first child of a `relative` container; it fills that container.
import { useEffect, useRef } from 'react';

// ---- Easy settings ----
const CELL = 22;          // grid cell size in px
const STEP_MS = 190;      // time per move (lower = faster)
const START_LEN = 5;      // starting snake length
const MAX_LEN = 14;       // never grows past this
const GROW_CHANCE = 0.35; // chance of growing after eating (it does not grow every time)
const SEEK_CHANCE = 0.45; // chance per step of steering toward food when food exists
const TURN_CHANCE = 0.12; // chance per step of a random turn
const OPACITY = 0.16;     // overall faintness (head and food are brighter)

const DIRS = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
const rand = (n) => Math.floor(Math.random() * n);

function SnakeBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cols = 0, rows = 0, snake = [], dir = DIRS[0], food = null;
    let foodDelay = 4, flash = 0, timer = null, onScreen = true;

    const isFree = (x, y) => !snake.slice(0, -1).some((s) => s.x === x && s.y === y);

    const spawnFood = () => {
      for (let t = 0; t < 40; t++) {
        const x = rand(cols), y = rand(rows);
        if (!snake.some((s) => s.x === x && s.y === y)) { food = { x, y }; return; }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, parent.clientWidth, parent.clientHeight);
      const rect = (c, a) => {
        ctx.fillStyle = `rgba(58,191,0,${a})`;
        ctx.fillRect(c.x * CELL + 2, c.y * CELL + 2, CELL - 4, CELL - 4);
      };
      snake.forEach((c, i) => rect(c, i === 0 ? (flash > 0 ? 0.55 : OPACITY * 1.8) : OPACITY));
      if (food) {
        ctx.fillStyle = `rgba(58,191,0,${OPACITY * 2.2})`;
        ctx.fillRect(food.x * CELL + 6, food.y * CELL + 6, CELL - 12, CELL - 12);
      }
    };

    const reset = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = parent.clientWidth, h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(START_LEN + 3, Math.floor(w / CELL));
      rows = Math.max(4, Math.floor(h / CELL));
      const y = rand(rows);
      snake = Array.from({ length: START_LEN }, (_, i) => ({ x: START_LEN - i, y }));
      dir = DIRS[0];
      food = null;
      foodDelay = 4;
      draw();
    };

    const step = () => {
      const head = snake[0];
      const next = (d) => ({ x: (head.x + d.x + cols) % cols, y: (head.y + d.y + rows) % rows });
      const safe = DIRS.filter((d) => !(d.x === -dir.x && d.y === -dir.y))
        .filter((d) => { const n = next(d); return isFree(n.x, n.y); });
      if (safe.length === 0) { reset(); return; }

      const straight = safe.find((d) => d.x === dir.x && d.y === dir.y);
      let d;
      if (food && Math.random() < SEEK_CHANCE) {
        const dist = (dd) => { const n = next(dd); return Math.abs(n.x - food.x) + Math.abs(n.y - food.y); };
        d = safe.reduce((best, c) => (dist(c) < dist(best) ? c : best), safe[0]);
      } else if (!straight || Math.random() < TURN_CHANCE) {
        d = safe[rand(safe.length)];
      } else {
        d = straight;
      }

      const n = next(d);
      dir = d;
      snake.unshift(n);

      if (food && n.x === food.x && n.y === food.y) {
        food = null;
        flash = 6;
        foodDelay = 8 + rand(14);
        // Only sometimes grow after eating
        if (!(Math.random() < GROW_CHANCE && snake.length < MAX_LEN)) snake.pop();
      } else {
        snake.pop();
        // Slowly shrink back toward the starting length
        if (snake.length > START_LEN && Math.random() < 0.02) snake.pop();
      }
      if (flash > 0) flash -= 1;
      if (!food && --foodDelay <= 0) spawnFood();
      draw();
    };

    const sync = () => {
      const shouldRun = onScreen && !document.hidden && !reduceMotion;
      if (shouldRun && !timer) timer = setInterval(step, STEP_MS);
      if (!shouldRun && timer) { clearInterval(timer); timer = null; }
    };

    reset();
    spawnFood();
    draw();

    const ro = new ResizeObserver(reset);
    ro.observe(parent);
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); });
    io.observe(parent);
    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      clearInterval(timer);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />;
}

export default SnakeBackground;