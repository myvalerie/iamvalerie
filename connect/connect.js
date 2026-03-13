document.addEventListener("DOMContentLoaded", () => {
  initializeConnectLinks();
});

function initializeConnectLinks() {
  document.querySelectorAll(".connect-link").forEach((link) => {
    link.addEventListener("mousemove", (event) => {
      const rect = link.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      link.style.background = `
        radial-gradient(
          circle at ${x}px ${y}px,
          rgba(247, 239, 199, 0.96),
          rgba(255, 255, 255, 0.88) 54%
        )
      `;
    });

    link.addEventListener("mouseleave", () => {
      link.style.background = "rgba(255,255,255,0.64)";
      link.style.transform = "";
    });

    link.addEventListener("mousemove", (event) => {
      if (window.innerWidth <= 768) return;

      const rect = link.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 3;
      const rotateX = ((centerY - y) / centerY) * 3;

      link.style.transform = `
        translateY(-5px)
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    });
  });
}