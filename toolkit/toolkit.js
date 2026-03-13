document.addEventListener("DOMContentLoaded", () => {
  initializeToolkitReveal();
  initializeToolkitHoverTilt();
  initializeToolkitMouseGlow();
});

function initializeToolkitReveal() {
  const revealElements = document.querySelectorAll(
    ".toolkit-hero, .toolkit-category, .toolkit-closing, .tech-item"
  );

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;

        if (element.classList.contains("tech-item")) {
          const delay = Number(element.dataset.delay || 0);
          window.setTimeout(() => {
            element.classList.add("is-visible");
          }, delay);
        } else {
          element.classList.add("is-visible");
        }

        observer.unobserve(element);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  const categoryGrids = document.querySelectorAll(".tech-grid");

  categoryGrids.forEach((grid) => {
    const items = grid.querySelectorAll(".tech-item");
    items.forEach((item, index) => {
      item.dataset.delay = String(index * 60);
      revealObserver.observe(item);
    });
  });

  document
    .querySelectorAll(".toolkit-hero, .toolkit-category, .toolkit-closing")
    .forEach((element) => {
      revealObserver.observe(element);
    });
}

function initializeToolkitHoverTilt() {
  const items = document.querySelectorAll(".tech-item");

  items.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      if (window.innerWidth <= 768) return;

      const rect = item.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 4;
      const rotateX = ((centerY - y) / centerY) * 4;

      item.style.transform = `
        translateY(-6px)
        perspective(700px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.03)
      `;
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
    });
  });
}

function initializeToolkitMouseGlow() {
  const items = document.querySelectorAll(".tech-item");

  items.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      item.style.setProperty("--glow-x", `${x}px`);
      item.style.setProperty("--glow-y", `${y}px`);
    });
  });
}