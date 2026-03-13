document.addEventListener("DOMContentLoaded", () => {
  loadGlobalComponent("../global/components/header.html", "header", () => {
    setActiveNavigation();
    initializeHeaderScrollState();
  });

  loadGlobalComponent("../global/components/footer.html", "footer");
});

function loadGlobalComponent(path, targetId, callback) {
  const targetElement = document.getElementById(targetId);

  if (!targetElement) return;

  fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load component: ${path}`);
      }
      return response.text();
    })
    .then((html) => {
      targetElement.innerHTML = html;

      if (typeof callback === "function") {
        callback();
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function setActiveNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPath = window.location.pathname.replace(/\/+$/, "");

  navLinks.forEach((link) => {
    const linkUrl = new URL(link.href, window.location.origin);
    const linkPath = linkUrl.pathname.replace(/\/+$/, "");

    if (linkPath === currentPath) {
      link.classList.add("is-active");
    }
  });
}

function initializeHeaderScrollState() {
  const header = document.querySelector(".site-header");

  if (!header) return;

  const updateHeaderState = () => {
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}