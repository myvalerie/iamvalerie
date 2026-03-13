document.addEventListener('DOMContentLoaded', async () => {
  const body = document.body;
  const level = body.dataset.level || '1';
  const page = body.dataset.page || '';
  const prefix = level === '0' ? './' : '../';

  await injectComponent('header', `${prefix}global/components/header.html`);
  await injectComponent('footer', `${prefix}global/components/footer.html`);

  wireRoutes(prefix, page);
  wireHeader();
  wireReveal();
});

async function injectComponent(targetId, path) {
  const target = document.getElementById(targetId);
  if (!target) return;

  try {
    const response = await fetch(path);
    const html = await response.text();
    target.innerHTML = html;
  } catch (error) {
    console.error(`Unable to load component: ${path}`, error);
  }
}

function wireRoutes(prefix, page) {
  const routeMap = {
    home: `${prefix}home/`,
    about: `${prefix}about/`,
    work: `${prefix}work/`,
    connect: `${prefix}connect/`
  };

  document.querySelectorAll('[data-route]').forEach((link) => {
    const route = link.dataset.route;
    if (routeMap[route]) {
      link.setAttribute('href', routeMap[route]);
    }
    if (route === page) {
      link.classList.add('is-active');
    }
  });
}

function wireHeader() {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  const nav = document.querySelector('.site-nav');

  const handleScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
      const expanded = nav.classList.contains('is-open');
      toggle.setAttribute('aria-expanded', String(expanded));
    });
  }
}

function wireReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 70, 320)}ms`;
    observer.observe(item);
  });
}
