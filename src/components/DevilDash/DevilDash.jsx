// src/components/DevilDash/DevilDash.jsx
import React, { useRef, useEffect, useState } from 'react';

const GW = 700, GH = 220; 
const GRAV = 0.58, JV = -11, SPD = 4.5, MVY = 15;

const LEVELS = [
  {
    name: 'LEVEL 1', intro: 'Watch out for the red guy!',
    start: { x: 30, y: 150 }, gp: { x: 628, y: 66 },
    plats: [
      { x: 0,   y: 190, w: 700, h: 30, t: 'solid' }, // Basement
      { x: 145, y: 164, w: 95,  h: 14, t: 'solid' },
      { x: 450, y: 164, w: 95,  h: 14, t: 'solid' },
      { x: 600, y: 94, w: 96,  h: 14, t: 'solid' },
    ],
    enemies: [
      { x: 200, y: 162, w: 20, h: 28, x1: 10, x2: 680, speed: 2 } // Patrols the floor
    ]
  },
  {
    name: 'LEVEL 2', intro: 'Double trouble',
    start: { x: 30, y: 150 }, gp: { x: 594, y: 98 },
    plats: [
      { x: 0,   y: 190, w: 200, h: 30, t: 'solid' }, 
      { x: 400, y: 190, w: 300, h: 30, t: 'solid' }, // Gap in middle
      { x: 280, y: 134, w: 98,  h: 14, t: 'solid' },
    ],
    enemies: [
      { x: 450, y: 162, w: 20, h: 28, x1: 410, x2: 680, speed: 3 }
    ]
  }
];

function ovlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export default function DevilDash() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const [fallingOut, setFallingOut] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const keys = {};
    const onKeyDown = (e) => keys[e.code] = true;
    const onKeyUp = (e) => keys[e.code] = false;
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    let lvIdx = 0;
    let plats = [], enms = [], goal = {};
    let pl = { dead: false };

    const initLv = (i) => {
      const def = LEVELS[i % LEVELS.length];
      plats = def.plats.map(p => ({ ...p }));
      // Initialize enemies with a direction property
      enms = (def.enemies || []).map(e => ({ ...e, dir: 1, walkT: 0 }));
      goal = { x: def.gp.x, y: def.gp.y, w: 22, h: 38 };
      pl = { x: def.start.x, y: def.start.y, vx: 0, vy: 0, w: 20, h: 28, dead: false, facing: 1, walkT: 0 };
    };

    const triggerFallingOut = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = rect.width / GW; 
      setFallingOut({ x: rect.left + (pl.x * scale), y: rect.top + (pl.y * scale) });
      pl.dead = true;
      setTimeout(() => { setFallingOut(null); initLv(lvIdx); }, 2000);
    };

    initLv(0);

    const update = (dt) => {
      if (pl.dead) return;

      // Player Movement
      if (keys['ArrowLeft'] || keys['KeyA']) { pl.vx = -SPD; pl.facing = -1; }
      else if (keys['ArrowRight'] || keys['KeyD']) { pl.vx = SPD; pl.facing = 1; }
      else pl.vx *= 0.8;

      pl.vy = Math.min(pl.vy + GRAV, MVY);
      pl.x += pl.vx;
      pl.y += pl.vy;

      // GAPS & BOUNDARIES (Fall Through Page)
      if (pl.x < -15 || pl.y > GH) { triggerFallingOut(); return; }

      // Platform Collision
      let grounded = false;
      for (const pt of plats) {
        if (ovlap(pl.x, pl.y, pl.w, pl.h, pt.x, pt.y, pt.w, pt.h)) {
          if (pl.vy > 0 && pl.y + pl.h - pt.y < 12) {
            pl.y = pt.y - pl.h; pl.vy = 0; grounded = true;
            if (keys['ArrowUp'] || keys['Space'] || keys['KeyW']) pl.vy = JV;
          }
        }
      }
      if (grounded && Math.abs(pl.vx) > 0.5) pl.walkT += dt * 0.015;

      // Enemy Update Logic
     
for (const en of enms) {
  en.x += en.speed * en.dir;
  en.walkT += (dt || 16) * 0.015;
  if (en.x <= en.x1 || en.x + en.w >= en.x2) en.dir *= -1;

  // Collision with Enemy
  if (!pl.dead && ovlap(pl.x, pl.y, pl.w, pl.h, en.x, en.y, en.w, en.h)) {
    // CHANGE THIS: Instead of an instant reset, trigger the "Fourth Wall" fall
    triggerFallingOut(); 
    return; // Exit the update so we don't process other collisions
  }
}

      // Goal Collision
      if (ovlap(pl.x, pl.y, pl.w, pl.h, goal.x, goal.y, goal.w, goal.h)) {
        lvIdx++; initLv(lvIdx);
      }
    };

    const draw = () => {
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color-light').trim() || '#f8f7f5';
      ctx.clearRect(0, 0, GW, GH);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, GW, GH);

      // Draw Platforms
      ctx.fillStyle = '#141414';
      plats.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

      // Draw Goal
      ctx.fillStyle = '#18a050';
      ctx.fillRect(goal.x, goal.y, goal.w, goal.h);

      // Draw Enemies
      enms.forEach(en => {
        const sw = Math.sin(en.walkT);
        ctx.save();
        ctx.translate(en.x + (en.dir === -1 ? en.w : 0), en.y);
        if (en.dir === -1) ctx.scale(-1, 1);
        ctx.fillStyle = '#cc1830'; // Red Enemy
        ctx.fillRect(5, 19, 4, 9 - Math.max(0, sw)*4); ctx.fillRect(11, 19, 4, 9 - Math.max(0, -sw)*4); // Legs
        ctx.fillRect(5, 9, 10, 12); ctx.fillRect(4, 0, 12, 10); // Body & Head
        ctx.fillStyle = 'white';
        ctx.fillRect(11, 3, 3, 4); // One angry eye looking forward
        ctx.restore();
      });

      // Draw Player
      if (!pl.dead) {
        const sw = Math.sin(pl.walkT);
        ctx.save();
        ctx.translate(pl.x + (pl.facing === -1 ? pl.w : 0), pl.y);
        if (pl.facing === -1) ctx.scale(-1, 1);
        ctx.fillStyle = '#141414';
        ctx.fillRect(5, 19, 4, 9 - Math.max(0, sw)*4); ctx.fillRect(11, 19, 4, 9 - Math.max(0, -sw)*4);
        ctx.fillRect(5, 9, 10, 12); ctx.fillRect(4, 0, 12, 10);
        ctx.fillStyle = 'white';
        ctx.fillRect(6, 3, 3, 4); ctx.fillRect(11, 3, 3, 4);
        ctx.restore();
      }
    };

    let lastT = 0;
    const loop = (t) => { update(t - lastT); draw(); lastT = t; rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {fallingOut && (
        <div className="character-fall-out" style={{ left: fallingOut.x, top: fallingOut.y }}>
          <div className="char-head"><div className="char-eye" style={{ left: '2px' }} /><div className="char-eye" style={{ right: '2px' }} /></div>
          <div className="char-body" />
          <div className="char-leg char-leg-anim-1" style={{ left: '1px' }} /><div className="char-leg char-leg-anim-2" style={{ right: '1px' }} />
          <div className="char-scream">NOOOOOO!</div>
        </div>
      )}
      <div style={{ position: 'relative', width: '100%', aspectRatio: `${GW} / ${GH}` }}>
        <canvas ref={canvasRef} width={GW} height={GH} style={{ display: 'block', width: '100%', height: '100%', borderRadius: '4px' }} />
      </div>
    </div>
  );
}