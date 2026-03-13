const canvas = document.getElementById('heroCanvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  const pointer = { x: 0, y: 0, active: false };
  let particles = [];
  let animationId = null;

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    createParticles(rect.width, rect.height);
  }

  function createParticles(width, height) {
    const count = Math.min(54, Math.max(34, Math.floor((width * height) / 18000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
      size: Math.random() * 2.2 + 1.2
    }));
  }

  function step() {
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      const dxPointer = pointer.x - p.x;
      const dyPointer = pointer.y - p.y;
      const pointerDistance = Math.hypot(dxPointer, dyPointer);

      if (pointer.active && pointerDistance < 140) {
        p.x -= dxPointer * 0.003;
        p.y -= dyPointer * 0.003;
      }

      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const dx = other.x - p.x;
        const dy = other.y - p.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(184, 140, 47, ${0.13 - distance / 1200})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12);
      gradient.addColorStop(0, 'rgba(215, 184, 89, 0.82)');
      gradient.addColorStop(1, 'rgba(215, 184, 89, 0)');

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = 'rgba(130, 99, 29, 0.78)';
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    animationId = requestAnimationFrame(step);
  }

  window.addEventListener('resize', resizeCanvas);
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  });
  canvas.addEventListener('mouseleave', () => {
    pointer.active = false;
  });

  resizeCanvas();
  step();

  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
  });
}
