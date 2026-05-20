import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let mouseX = -1;
    let mouseY = -1;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; baseOpacity: number; color: string;
      phase: number; speed: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const colors = ['212,168,83', '45,212,168', '99,102,241', '255,255,255'];
    const count = Math.min(80, Math.floor(canvas.width * canvas.height / 20000));

    for (let i = 0; i < count; i++) {
      const ci = Math.floor(Math.random() * colors.length);
      const baseOp = Math.random() * 0.3 + 0.05;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15 - 0.08,
        size: Math.random() * 2 + 0.5,
        opacity: baseOp,
        baseOpacity: baseOp,
        color: colors[ci],
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
      });
    }

    let time = 0;
    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ambient fog layers
      const fogGrad = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.3, 0,
        canvas.width * 0.3, canvas.height * 0.3, canvas.width * 0.5
      );
      fogGrad.addColorStop(0, 'rgba(212,168,83,0.012)');
      fogGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fogGrad2 = ctx.createRadialGradient(
        canvas.width * 0.7 + Math.sin(time * 0.3) * 50,
        canvas.height * 0.7 + Math.cos(time * 0.2) * 30,
        0,
        canvas.width * 0.7, canvas.height * 0.7, canvas.width * 0.4
      );
      fogGrad2.addColorStop(0, 'rgba(45,212,168,0.008)');
      fogGrad2.addColorStop(1, 'transparent');
      ctx.fillStyle = fogGrad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Breathing opacity
        p.opacity = p.baseOpacity + Math.sin(time * p.speed * 60 + p.phase) * p.baseOpacity * 0.5;

        // Mouse interaction - particles gently drift away
        if (mouseX >= 0) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150 * 0.3;
            p.vx += (dx / dist) * force * 0.01;
            p.vy += (dy / dist) * force * 0.01;
            p.opacity = Math.min(p.opacity * 1.5, 0.6);
          }
        }

        // Gentle velocity damping
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Wrap
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        const op = Math.max(0.02, Math.min(0.5, p.opacity));

        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${op * 0.08})`;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${op})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
