document.addEventListener("DOMContentLoaded", () => {
  initializeAboutParallax();
  initializeAboutNetwork();
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

    const moveX = ((x - centerX) / centerX) * 12;
    const moveY = ((y - centerY) / centerY) * 12;

    const frame = visual.querySelector(".profile-frame");
    const tags = visual.querySelectorAll(".profile-tag");
    const network = visual.querySelector(".visual-network");

    if (frame) {
      frame.style.transform = `translate(${moveX * 0.28}px, ${moveY * 0.28}px)`;
    }

    tags.forEach((tag, index) => {
      const factor = (index + 1) * 0.16;
      tag.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
    });

    if (network) {
      network.style.transform = `translate(${moveX * 0.12}px, ${moveY * 0.12}px)`;
    }
  });

  visual.addEventListener("mouseleave", () => {
    const frame = visual.querySelector(".profile-frame");
    const tags = visual.querySelectorAll(".profile-tag");
    const network = visual.querySelector(".visual-network");

    if (frame) {
      frame.style.transform = "";
    }

    tags.forEach((tag) => {
      tag.style.transform = "";
    });

    if (network) {
      network.style.transform = "";
    }
  });
}

function initializeAboutNetwork() {
  const network = document.getElementById("visualNetwork");
  if (!network) return;

  const nodeCount = 14;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < nodeCount; i += 1) {
    const node = document.createElement("span");
    node.className = "network-node";

    const left = 12 + Math.random() * 76;
    const top = 12 + Math.random() * 76;
    const size = 4 + Math.random() * 6;
    const delay = Math.random() * 6;
    const duration = 4 + Math.random() * 5;

    node.style.left = `${left}%`;
    node.style.top = `${top}%`;
    node.style.width = `${size}px`;
    node.style.height = `${size}px`;
    node.style.animationDelay = `${delay}s`;
    node.style.animationDuration = `${duration}s`;

    fragment.appendChild(node);
  }

  for (let i = 0; i < 8; i += 1) {
    const line = document.createElement("span");
    line.className = "network-line";

    const left = 14 + Math.random() * 64;
    const top = 18 + Math.random() * 60;
    const width = 70 + Math.random() * 90;
    const rotation = -35 + Math.random() * 70;
    const delay = Math.random() * 4;

    line.style.left = `${left}%`;
    line.style.top = `${top}%`;
    line.style.width = `${width}px`;
    line.style.transform = `rotate(${rotation}deg)`;
    line.style.animationDelay = `${delay}s`;

    fragment.appendChild(line);
  }

  network.appendChild(fragment);
}