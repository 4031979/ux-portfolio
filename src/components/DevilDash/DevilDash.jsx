// src/components/DevilDash/DevilDash.jsx
import React, { useRef, useEffect, useState } from 'react';

const GW = 700, GH = 220;
const GRAV = 0.58, JV = -11, SPD = 4.5, MVY = 15;
const TWO_PI = Math.PI * 2;

const LEVELS = [
  {
    name: 'LEVEL 1', intro: 'Watch out for the red guy!',
    start: { x: 30, y: 150 }, gp: { x: 628, y: 66 },
    plats: [
      { x: 0,   y: 190, w: 700, h: 2, t: 'solid' },
      { x: 145, y: 164, w: 95,  h: 14, t: 'solid' },
      { x: 450, y: 164, w: 95,  h: 14, t: 'solid' },
      { x: 600, y: 94,  w: 96,  h: 14, t: 'solid' },
    ],
    enemies: [{ x: 200, y: 162, w: 20, h: 28, x1: 10, x2: 680, speed: 2 }],
    balls: [], signs: [],
  },
  {
    name: 'LEVEL 2', intro: 'Double trouble',
    start: { x: 30, y: 150 }, gp: { x: 594, y: 98 },
    plats: [
      { x: 0,   y: 190, w: 200, h: 3, t: 'solid' },
      { x: 400, y: 190, w: 300, h: 30, t: 'solid' },
      { x: 280, y: 134, w: 98,  h: 14, t: 'solid' },
    ],
    enemies: [{ x: 450, y: 162, w: 20, h: 28, x1: 410, x2: 680, speed: 3 }],
    balls: [], signs: [],
  },
  {
    name: 'LEVEL 3', intro: "perfectly safe. don't worry.",
    start: { x: 30, y: 150 }, gp: { x: 628, y: 66 },
    plats: [
      { x: 0,   y: 190, w: 120, h: 3, t: 'solid' },
      { x: 130, y: 190, w: 90,  h: 14, t: 'crumble' },
      { x: 230, y: 190, w: 90,  h: 14, t: 'crumble' },
      { x: 330, y: 190, w: 90,  h: 14, t: 'crumble' },
      { x: 430, y: 190, w: 90,  h: 14, t: 'crumble' },
      { x: 550, y: 190, w: 150, h: 30, t: 'solid' },
      { x: 600, y: 94,  w: 96,  h: 14, t: 'solid' },
    ],
    enemies: [], balls: [],
    signs: [{ x: 140, y: 183, text: '' }],
  },
  {
    name: 'LEVEL 4', intro: 'clear path ahead :)',
    start: { x: 30, y: 150 }, gp: { x: 628, y: 148 },
    plats: [
      { x: 0,   y: 190, w: 700, h: 3, t: 'solid' },
      { x: 600, y: 162, w: 96,  h: 14, t: 'solid' },
    ],
    enemies: [],
    balls: [
      { ox: GW + 10, y: 163, r: 8, speed: -5,   delay: 400  },
      { ox: GW + 10, y: 163, r: 8, speed: -5,   delay: 1900 },
      { ox: GW + 10, y: 163, r: 8, speed: -5,   delay: 3400 },
      { ox: GW + 10, y: 143, r: 8, speed: -7.5, delay: 900  },
      { ox: GW + 10, y: 143, r: 8, speed: -7.5, delay: 2400 },
      { ox: GW + 10, y: 122, r: 7, speed: -10,  delay: 200  },
      { ox: GW + 10, y: 122, r: 7, speed: -10,  delay: 1700 },
    ],
    signs: [],
  },
  {
    name: 'LEVEL 5', intro: 'trust your instincts.',
    start: { x: 30, y: 150 }, gp: { x: 620, y: 66 },
    plats: [
      { x: 0,   y: 190, w: 100, h: 3, t: 'solid' },
      { x: 120, y: 162, w: 80,  h: 14, t: 'blink', period: 1100, phase: 0   },
      { x: 240, y: 142, w: 80,  h: 14, t: 'blink', period: 1100, phase: 370 },
      { x: 360, y: 162, w: 80,  h: 14, t: 'blink', period: 1100, phase: 740 },
      { x: 480, y: 142, w: 80,  h: 14, t: 'blink', period: 1100, phase: 180 },
      { x: 590, y: 190, w: 110, h: 30, t: 'solid' },
      { x: 600, y: 94,  w: 96,  h: 14, t: 'solid' },
    ],
    enemies: [], balls: [], signs: [],
  },
  {
    name: 'LEVEL 6', intro: 'you got this. almost done!',
    start: { x: 30, y: 150 }, gp: { x: 614, y: 80 },
    plats: [
      { x: 0,   y: 190, w: 160, h: 3, t: 'solid' },
      { x: 200, y: 165, w: 110, h: 14, t: 'fake'  },
      { x: 360, y: 150, w: 80,  h: 14, t: 'crumble' },
      { x: 480, y: 190, w: 220, h: 30, t: 'solid' },
      { x: 600, y: 108, w: 96,  h: 14, t: 'solid' },
    ],
    enemies: [{ x: 500, y: 162, w: 20, h: 28, x1: 485, x2: 685, speed: 3.5 }],
    balls: [
      { ox: GW + 10, y: 82, r: 9, speed: -6.5, delay: 1400 },
      { ox: GW + 10, y: 82, r: 9, speed: -6.5, delay: 3200 },
    ],
    signs: [{ x: 212, y: 158, text: '← safe!' }],
  },
];

function ovlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function buildPlats(defs) {
  return defs.map(p => ({
    ...p,
    triggered: false, crumbleMs: 0, falling: false, fallVy: 0, alpha: 1, _wob: 0,
    _visible: true,
  }));
}

function buildBalls(defs) {
  return (defs || []).map(b => ({ ...b, cx: b.ox, active: false, elapsed: 0 }));
}

export default function DevilDash() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const timerRef  = useRef(null);   // FIX 1: track setTimeout so we can cancel it
  const pausedRef = useRef(false);  // FIX 3: IntersectionObserver pause flag
  const [fallingOut, setFallingOut] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // FIX 2: read the CSS variable ONCE, not 60×/s
    const bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--bg-color-light').trim() || '#f8f7f5';

    // ── Input ───────────────────────────────────────────────
    const keys = {};
    const onKeyDown = (e) => { keys[e.code] = true; };
    const onKeyUp   = (e) => { keys[e.code] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);

    // FIX 3: pause RAF when canvas scrolls out of view
    const observer = new IntersectionObserver(
      ([entry]) => { pausedRef.current = !entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // ── Game state ──────────────────────────────────────────
    let lvIdx = 0;
    let plats = [], enms = [], balls = [], signs = [], goal = {};
    let pl = { dead: false };
    let lvMs = 0;

    const initLv = (i) => {
      const def = LEVELS[i % LEVELS.length];
      lvMs  = 0;
      plats = buildPlats(def.plats);
      enms  = (def.enemies || []).map(e => ({ ...e, dir: 1, walkT: 0 }));
      balls = buildBalls(def.balls);
      signs = def.signs || [];
      goal  = { x: def.gp.x, y: def.gp.y, w: 22, h: 38 };
      pl    = {
        x: def.start.x, y: def.start.y,
        vx: 0, vy: 0, w: 20, h: 28,
        onG: false, dead: false, facing: 1,
        walkT: 0,   // FIX 4: reset on each level — never accumulates across sessions
        jbuf: 0,
      };
    };

    // FIX 1: clear any pending death timer before scheduling a new one
    const triggerFallingOut = () => {
      if (pl.dead) return;
      const rect  = canvas.getBoundingClientRect();
      const scale = rect.width / GW;
      setFallingOut({
        x: rect.left + window.scrollX + pl.x * scale,
        y: rect.top  + window.scrollY + pl.y * scale,
      });
      pl.dead = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setFallingOut(null);
        initLv(lvIdx);
      }, 2000);
    };

    initLv(0);

    // ── Update ──────────────────────────────────────────────
    const update = (dt) => {
      if (pl.dead) return;
      lvMs += dt;

      // fireballs
      for (const b of balls) {
        b.elapsed += dt;
        if (!b.active && b.elapsed >= b.delay) { b.active = true; b.cx = b.ox; }
        if (b.active) {
          b.cx += b.speed;
          if (b.cx < -40) { b.active = false; b.elapsed = 0; }
          else if (ovlap(pl.x, pl.y, pl.w, pl.h, b.cx - b.r, b.y - b.r, b.r * 2, b.r * 2)) {
            triggerFallingOut(); return;
          }
        }
      }

      // enemies
      for (const en of enms) {
        en.x += en.speed * en.dir;
        // FIX 4: wrap walkT at 2π so it never grows unboundedly
        en.walkT = (en.walkT + dt * 0.015) % TWO_PI;
        if (en.x <= en.x1 || en.x + en.w >= en.x2) en.dir *= -1;
        if (ovlap(pl.x, pl.y, pl.w, pl.h, en.x, en.y, en.w, en.h)) {
          triggerFallingOut(); return;
        }
      }

      // input
      if (pl.jbuf > 0) pl.jbuf -= dt;
      if (keys['ArrowLeft']  || keys['KeyA']) { pl.vx = -SPD; pl.facing = -1; }
      else if (keys['ArrowRight'] || keys['KeyD']) { pl.vx = SPD; pl.facing = 1; }
      else pl.vx *= 0.8;
      if (keys['ArrowUp'] || keys['Space'] || keys['KeyW']) pl.jbuf = 130;

      pl.vy = Math.min(pl.vy + GRAV, MVY);
      pl.x += pl.vx;
      pl.y += pl.vy;

      if (pl.x < -15 || pl.y > GH) { triggerFallingOut(); return; }

      // platform collision
      pl.onG = false;
      for (const pt of plats) {
        if (pt.t === 'blink') {
          const cycle = (lvMs + pt.phase) % pt.period;
          pt._visible = cycle < pt.period * 0.55;
          if (!pt._visible) continue;
        }
        if (pt.t === 'fake') continue;
        if (pt.t === 'crumble' && pt.falling) {
          pt.fallVy += GRAV;
          pt.y      += pt.fallVy;
          pt.alpha   = Math.max(0, 1 - (pt.y - 220) / 80);
          continue;
        }
        if (pt.alpha <= 0) continue;

        if (ovlap(pl.x, pl.y, pl.w, pl.h, pt.x, pt.y, pt.w, pt.h)) {
          if (pl.vy >= 0 && pl.y + pl.h - pt.y < 14) {
            pl.y = pt.y - pl.h; pl.vy = 0; pl.onG = true;
            if (pl.jbuf > 0) { pl.vy = JV; pl.jbuf = 0; }
            if (pt.t === 'crumble' && !pt.triggered) { pt.triggered = true; pt.crumbleMs = 420; }
          }
        }
        if (pt.t === 'crumble' && pt.triggered && !pt.falling) {
          pt.crumbleMs -= dt;
          pt._wob = Math.sin(lvMs * 0.055) * (1 - pt.crumbleMs / 420) * 5;
          if (pt.crumbleMs <= 0) { pt.falling = true; pt._wob = 0; }
        }
      }

      // FIX 4: wrap player walkT too
      if (pl.onG && Math.abs(pl.vx) > 0.5)
        pl.walkT = (pl.walkT + dt * 0.015) % TWO_PI;

      if (ovlap(pl.x, pl.y, pl.w, pl.h, goal.x, goal.y, goal.w, goal.h)) {
        lvIdx++;
        initLv(lvIdx);
      }
    };

    // ── Draw ────────────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, GW, GH);
      ctx.fillStyle = bgColor;   // FIX 2: cached value, no reflow
      ctx.fillRect(0, 0, GW, GH);

      for (const pt of plats) {
        const wob = pt._wob || 0;
        if (pt.t === 'fake') {
          ctx.fillStyle = '#141414';
          ctx.fillRect(pt.x, pt.y, pt.w, pt.h);
          ctx.fillStyle = 'rgba(255,255,255,0.08)';
          ctx.fillRect(pt.x, pt.y, pt.w, 2);
          continue;
        }
        if (pt.t === 'blink') {
          if (!pt._visible) continue;
          ctx.fillStyle = '#141414';
          ctx.fillRect(pt.x, pt.y, pt.w, pt.h);
          ctx.fillStyle = 'rgba(255,255,255,0.18)';
          ctx.fillRect(pt.x, pt.y, pt.w, 2);
          continue;
        }
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = (pt.t === 'crumble' && pt.triggered && !pt.falling && Math.floor(lvMs / 55) % 2 === 0)
          ? '#3a0a0a' : '#141414';
        ctx.fillRect(pt.x + wob, pt.y, pt.w, pt.h);
        ctx.globalAlpha = 1;
      }

      ctx.font = 'bold 8px monospace';
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.textAlign = 'left';
      for (const sg of signs) ctx.fillText(sg.text, sg.x, sg.y);

      for (const b of balls) {
        if (!b.active) continue;
        const p = 0.88 + 0.12 * Math.sin(lvMs * 0.022);
        ctx.beginPath(); ctx.arc(b.cx, b.y, b.r + 4, 0, TWO_PI);
        ctx.fillStyle = `rgba(230,80,0,${(0.15 * p).toFixed(2)})`; ctx.fill();
        ctx.beginPath(); ctx.arc(b.cx, b.y, b.r, 0, TWO_PI);
        ctx.fillStyle = `rgba(210,45,0,${(0.92 * p).toFixed(2)})`; ctx.fill();
        ctx.beginPath(); ctx.arc(b.cx - b.r * 0.28, b.y - b.r * 0.28, b.r * 0.42, 0, TWO_PI);
        ctx.fillStyle = `rgba(255,190,60,${(0.82 * p).toFixed(2)})`; ctx.fill();
      }

      const gp = 0.75 + 0.25 * Math.sin(lvMs * 0.004);
      ctx.fillStyle = `rgba(175,215,0,${gp.toFixed(2)})`;
      ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillRect(goal.x + goal.w / 2 - 1, goal.y + 4, 2, goal.h - 8);
      ctx.fillRect(goal.x + 3, goal.y + goal.h / 2 - 1, goal.w - 6, 2);

      for (const en of enms) {
        const sw = Math.sin(en.walkT);
        ctx.save();
        ctx.translate(en.x + (en.dir === -1 ? en.w : 0), en.y);
        if (en.dir === -1) ctx.scale(-1, 1);
        ctx.fillStyle = '#888';
        ctx.fillRect(5, 19, 4, 9 - Math.max(0,  sw) * 4);
        ctx.fillRect(11, 19, 4, 9 - Math.max(0, -sw) * 4);
        ctx.fillRect(5, 9, 10, 12); ctx.fillRect(4, 0, 12, 10);
        ctx.fillStyle = 'white'; ctx.fillRect(11, 3, 3, 4);
        ctx.restore();
      }

      if (!pl.dead) {
        const sw = Math.sin(pl.walkT);
        ctx.save();
        ctx.translate(pl.x + (pl.facing === -1 ? pl.w : 0), pl.y);
        if (pl.facing === -1) ctx.scale(-1, 1);
        ctx.fillStyle = '#141414';
        ctx.fillRect(5, 19, 4, 9 - Math.max(0,  sw) * 4);
        ctx.fillRect(11, 19, 4, 9 - Math.max(0, -sw) * 4);
        ctx.fillRect(5, 9, 10, 12); ctx.fillRect(4, 0, 12, 10);
        ctx.fillStyle = 'white';
        ctx.fillRect(6, 3, 3, 4); ctx.fillRect(11, 3, 3, 4);
        ctx.restore();
      }

      ctx.globalAlpha = 1;
    };

    // ── Loop — pauses automatically when off-screen ─────────
    let lastT = 0;
    const loop = (t) => {
      rafRef.current = requestAnimationFrame(loop);   // schedule first so we always hold one RAF token
      if (pausedRef.current) return;                  // FIX 3: skip update+draw when not visible
      const dt = Math.min(t - lastT, 50);
      lastT = t;
      update(dt);
      draw();
    };
    rafRef.current = requestAnimationFrame((t) => { lastT = t; rafRef.current = requestAnimationFrame(loop); });

    // ── Cleanup — guaranteed to run on unmount ───────────────
    return () => {
      cancelAnimationFrame(rafRef.current);           // kill the RAF loop
      if (timerRef.current) clearTimeout(timerRef.current);  // FIX 1: kill pending death timer
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
      observer.disconnect();                          // FIX 3: stop IntersectionObserver
    };
  }, []);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {fallingOut && (
        <div className="character-fall-out" style={{ left: fallingOut.x, top: fallingOut.y }}>
          <div className="char-head">
            <div className="char-eye" style={{ left: '2px' }} />
            <div className="char-eye" style={{ right: '2px' }} />
          </div>
          <div className="char-body" />
          <div className="char-leg char-leg-anim-1" style={{ left: '1px' }} />
          <div className="char-leg char-leg-anim-2" style={{ right: '1px' }} />
          <div className="char-scream">WHAT THE ..!</div>
        </div>
      )}
      <div style={{ position: 'relative', width: '100%', aspectRatio: `${GW} / ${GH}` }}>
        <canvas
          ref={canvasRef}
          width={GW}
          height={GH}
          style={{ display: 'block', width: '100%', height: '100%', borderRadius: '4px' }}
        />
      </div>
    </div>
  );
}