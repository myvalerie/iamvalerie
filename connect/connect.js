document.querySelectorAll('.connect-link').forEach((link) => {
  link.addEventListener('mousemove', (event) => {
    const rect = link.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    link.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(247,239,199,0.96), rgba(255,255,255,0.88) 54%)`;
  });

  link.addEventListener('mouseleave', () => {
    link.style.background = 'rgba(255,255,255,0.64)';
  });
});
