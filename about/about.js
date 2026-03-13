document.addEventListener("DOMContentLoaded", () => {
  initializeAboutParallax();
});

function initializeAboutParallax() {
  const visual = document.querySelector(".about-visual");
  if (!visual) return;

  visual.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 768) return;

    const rect = visual.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = ((x - centerX) / centerX) * 10;
    const moveY = ((y - centerY) / centerY) * 10;

    const frame = visual.querySelector(".profile-frame");
    const tags = visual.querySelectorAll(".profile-tag");

    if (frame) {
      frame.style.transform = `translate(${moveX * 0.35}px, ${moveY * 0.35}px)`;
    }

    tags.forEach((tag, index) => {
      const factor = (index + 1) * 0.18;
      tag.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
    });
  });

  visual.addEventListener("mouseleave", () => {
    const frame = visual.querySelector(".profile-frame");
    const tags = visual.querySelectorAll(".profile-tag");

    if (frame) {
      frame.style.transform = "";
    }

    tags.forEach((tag) => {
      tag.style.transform = "";
    });
  });
}