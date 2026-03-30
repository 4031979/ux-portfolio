// src/components/ParticleBackground.jsx

import React, { useEffect, useRef } from 'react';

const ParticleBackground = ({ opacity = 0.5 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const SPACING = 10;
    const THICKNESS = Math.pow(100, 2);
    const DRAG = 0.95;
    const EASE = 0.25;

    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    
    const COLS = Math.floor(width / SPACING);
    const ROWS = Math.floor(height / SPACING);
    const NUM_PARTICLES = ROWS * COLS;

    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    let toggle = true;
    let animFrameId = null; // ← store frame ID

    const ctx = canvas.getContext('2d');

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      particles.push({
        x: col * SPACING,
        y: row * SPACING,
        ox: col * SPACING,
        oy: row * SPACING,
        vx: 0,
        vy: 0
      });
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const newCols = Math.floor(canvas.width / SPACING);
      const newRows = Math.floor(canvas.height / SPACING);
      const newCount = newRows * newCols;
      
      particles = [];
      for (let i = 0; i < newCount; i++) {
        const col = i % newCols;
        const row = Math.floor(i / newCols);
        particles.push({
          x: col * SPACING,
          y: row * SPACING,
          ox: col * SPACING,
          oy: row * SPACING,
          vx: 0,
          vy: 0
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    function animate() {
      toggle = !toggle;

      if (toggle) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < THICKNESS) {
            const force = -THICKNESS / distSq;
            const angle = Math.atan2(dy, dx);
            p.vx += force * Math.cos(angle);
            p.vy += force * Math.sin(angle);
          }

          p.vx *= DRAG;
          p.vy *= DRAG;
          p.x += p.vx + (p.ox - p.x) * EASE;
          p.y += p.vy + (p.oy - p.y) * EASE;
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isDark = document.documentElement.classList.contains('dark');
        const particleColor = isDark ? 200 : 80;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.fillStyle = `rgb(${particleColor}, ${particleColor}, ${particleColor})`;
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2);
        }
      }

      animFrameId = requestAnimationFrame(animate); // ← store ID
    }

    animate();

    return () => {
      cancelAnimationFrame(animFrameId); // ← cancel on unmount
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        opacity: opacity,
        pointerEvents: 'none'
      }}
      className="particle-bg-canvas"
    />
  );
};

export default ParticleBackground;