document.addEventListener("DOMContentLoaded", () => {
  initializePageBackground();
});

function initializePageBackground() {
  const canvas = document.getElementById("pageBackgroundCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.35,
    tx: window.innerWidth * 0.5,
    ty: window.innerHeight * 0.35,
    active: false,
  };

  const state = {
    width: 0,
    height: 0,
    ratio: 1,
    particles: [],
    ribbons: [],
    nodes: [],
    animationId: null,
  };

  function createParticles(count) {
    return Array.from({ length: count }, () => ({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.6 + 0.8,
      alpha: Math.random() * 0.45 + 0.2,
    }));
  }

  function createNodes(count) {
    return Array.from({ length: count }, () => ({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 1.7 + 1.2,
    }));
  }

  function createRibbons(count) {
    return Array.from({ length: count }, (_, index) => ({
      baseY: state.height * (0.2 + index * 0.16),
      amplitude: 28 + Math.random() * 34,
      wavelength: 180 + Math.random() * 140,
      speed: 0.0008 + Math.random() * 0.0012,
      thickness: 1 + Math.random() * 1.4,
      alpha: 0.06 + Math.random() * 0.08,
      drift: (Math.random() - 0.5) * 18,
    }));
  }

  function resizeCanvas() {
    state.ratio = window.devicePixelRatio || 1;
    state.width = window.innerWidth;
    state.height = window.innerHeight;

    canvas.width = state.width * state.ratio;
    canvas.height = state.height * state.ratio;
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    ctx.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);

    const particleCount = Math.min(90, Math.max(46, Math.floor((state.width * state.height) / 22000)));
    const nodeCount = Math.min(28, Math.max(16, Math.floor(state.width / 70)));
    const ribbonCount = state.width < 760 ? 4 : 6;

    state.particles = createParticles(particleCount);
    state.nodes = createNodes(nodeCount);
    state.ribbons = createRibbons(ribbonCount);
  }

  function drawBackgroundGlow(time) {
    const gradient = ctx.createRadialGradient(
      pointer.x,
      pointer.y,
      0,
      pointer.x,
      pointer.y,
      Math.max(state.width, state.height) * 0.45
    );
    gradient.addColorStop(0, "rgba(255, 230, 197, 0.22)");
    gradient.addColorStop(0.4, "rgba(242, 215, 255, 0.10)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, state.width, state.height);

    const bottomGlow = ctx.createRadialGradient(
      state.width * 0.5,
      state.height * 0.95,
      0,
      state.width * 0.5,
      state.height * 0.95,
      state.width * 0.5
    );
    bottomGlow.addColorStop(0, "rgba(220, 178, 96, 0.12)");
    bottomGlow.addColorStop(1, "rgba(220, 178, 96, 0)");

    ctx.fillStyle = bottomGlow;
    ctx.fillRect(0, 0, state.width, state.height);

    const shimmer = 0.012 + Math.sin(time * 0.00045) * 0.004;
    ctx.fillStyle = `rgba(255, 255, 255, ${shimmer})`;
    ctx.fillRect(0, 0, state.width, state.height);
  }

  function drawRibbons(time) {
    state.ribbons.forEach((ribbon, index) => {
      ctx.beginPath();

      for (let x = -80; x <= state.width + 80; x += 12) {
        const y =
          ribbon.baseY +
          Math.sin(x / ribbon.wavelength + time * ribbon.speed) * ribbon.amplitude +
          Math.cos(x / (ribbon.wavelength * 0.62) + time * ribbon.speed * 1.4) * (ribbon.amplitude * 0.34) +
          ribbon.drift;

        if (x === -80) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      const hueMix = index % 2 === 0
        ? `rgba(214, 175, 87, ${ribbon.alpha})`
        : `rgba(232, 195, 242, ${ribbon.alpha})`;

      ctx.strokeStyle = hueMix;
      ctx.lineWidth = ribbon.thickness;
      ctx.stroke();
    });
  }

  function drawParticles() {
    state.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20) particle.x = state.width + 20;
      if (particle.x > state.width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = state.height + 20;
      if (particle.y > state.height + 20) particle.y = -20;

      const dx = pointer.x - particle.x;
      const dy = pointer.y - particle.y;
      const distance = Math.hypot(dx, dy);

      if (pointer.active && distance < 180) {
        particle.x -= dx * 0.0012;
        particle.y -= dy * 0.0012;
      }

      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.r * 10
      );
      gradient.addColorStop(0, `rgba(255, 250, 244, ${particle.alpha})`);
      gradient.addColorStop(0.45, `rgba(233, 198, 127, ${particle.alpha * 0.6})`);
      gradient.addColorStop(1, "rgba(233, 198, 127, 0)");

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(particle.x, particle.y, particle.r * 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(173, 129, 47, ${particle.alpha * 0.9})`;
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawNodeConnections() {
    state.nodes.forEach((node, i) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > state.width) node.vx *= -1;
      if (node.y < 0 || node.y > state.height) node.vy *= -1;

      for (let j = i + 1; j < state.nodes.length; j += 1) {
        const other = state.nodes[j];
        const dx = other.x - node.x;
        const dy = other.y - node.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 160) {
          const alpha = 0.09 - distance / 2400;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(180, 139, 63, ${Math.max(alpha, 0.01)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 10);
      glow.addColorStop(0, "rgba(255, 240, 220, 0.55)");
      glow.addColorStop(1, "rgba(255, 240, 220, 0)");

      ctx.beginPath();
      ctx.fillStyle = glow;
      ctx.arc(node.x, node.y, node.radius * 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "rgba(165, 122, 42, 0.76)";
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function animate(time) {
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    ctx.clearRect(0, 0, state.width, state.height);

    drawBackgroundGlow(time);
    drawRibbons(time);
    drawNodeConnections();
    drawParticles();

    state.animationId = window.requestAnimationFrame(animate);
  }

  function onPointerMove(event) {
    pointer.tx = event.clientX;
    pointer.ty = event.clientY;
    pointer.active = true;
  }

  function onPointerLeave() {
    pointer.active = false;
    pointer.tx = state.width * 0.5;
    pointer.ty = state.height * 0.35;
  }

  resizeCanvas();
  animate(0);

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", onPointerMove, { passive: true });
  window.addEventListener("mouseleave", onPointerLeave);

  window.addEventListener("beforeunload", () => {
    if (state.animationId) {
      window.cancelAnimationFrame(state.animationId);
    }
  });
}
