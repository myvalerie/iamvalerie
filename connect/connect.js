import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeConnectLinks();
  initializeConnectCardParallax();
  initializeConnectThreeBackground();
});

function initializeConnectLinks() {
  document.querySelectorAll(".connect-link").forEach((link) => {
    link.addEventListener("mousemove", (event) => {
      const rect = link.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      link.style.setProperty("--glow-x", `${x}px`);
      link.style.setProperty("--glow-y", `${y}px`);
    });

    link.addEventListener("mouseleave", () => {
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

function initializeConnectCardParallax() {
  const card = document.getElementById("connectCard");
  if (!card) return;

  card.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 768) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = ((x - centerX) / centerX) * 10;
    const moveY = ((y - centerY) / centerY) * 10;

    const rings = card.querySelectorAll(".connect-rings");
    const node = card.querySelector(".connect-signal-node");
    const closing = card.querySelector(".connect-closing");

    rings.forEach((ring, index) => {
      const factor = 0.04 + index * 0.03;
      ring.style.transform = `translate(calc(-50% + ${moveX * factor}px), calc(-50% + ${moveY * factor}px))`;
    });

    if (node) {
      node.style.transform = `translate(calc(-50% + ${moveX * 0.1}px), calc(-50% + ${moveY * 0.1}px))`;
    }

    if (closing) {
      closing.style.transform = `translate(${moveX * 0.05}px, ${moveY * 0.05}px)`;
    }
  });

  card.addEventListener("mouseleave", () => {
    const rings = card.querySelectorAll(".connect-rings");
    const node = card.querySelector(".connect-signal-node");
    const closing = card.querySelector(".connect-closing");

    rings.forEach((ring) => {
      ring.style.transform = "";
    });

    if (node) {
      node.style.transform = "";
    }

    if (closing) {
      closing.style.transform = "";
    }
  });
}

function initializeConnectThreeBackground() {
  const container = document.getElementById("connectThreeBackground");
  if (!container) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xf8f1e6, 0.05);

  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    180
  );
  camera.position.set(0, 0.2, 14);

  const ambientLight = new THREE.AmbientLight(0xfff7ef, 1.35);
  scene.add(ambientLight);

  const pointLightA = new THREE.PointLight(0xffe3bf, 1.8, 42, 2);
  pointLightA.position.set(-7, 4, 9);
  scene.add(pointLightA);

  const pointLightB = new THREE.PointLight(0xf4d59a, 1.15, 38, 2);
  pointLightB.position.set(7, -1, 8);
  scene.add(pointLightB);

  const pointLightC = new THREE.PointLight(0xfff6eb, 1.05, 34, 2);
  pointLightC.position.set(0, 5, 10);
  scene.add(pointLightC);

  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  const pointer = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  };

  const clock = new THREE.Clock();

  const signalRings = createSignalRings();
  signalRings.forEach((item) => masterGroup.add(item));

  const pulseLines = createPulseLines();
  pulseLines.forEach((item) => masterGroup.add(item));

  const beaconNodes = createBeaconNodes();
  beaconNodes.forEach((item) => masterGroup.add(item));

  const transmissionDust = createTransmissionDust();
  masterGroup.add(transmissionDust.points);

  const rippleParticles = createRippleParticles();
  masterGroup.add(rippleParticles.points);

  function createSignalRings() {
    const items = [];
    const configs = [
      { radius: 2.2, tube: 0.028, color: 0xf1cf88, y: 0.2, z: -1.8, opacity: 0.14, rx: 1.2, ry: 0.1, rz: 0.1 },
      { radius: 3.6, tube: 0.022, color: 0xffedd0, y: 0.1, z: -2.6, opacity: 0.1, rx: 1.12, ry: -0.16, rz: 0.2 },
      { radius: 5.2, tube: 0.018, color: 0xeecf90, y: -0.2, z: -4.2, opacity: 0.08, rx: 1.04, ry: 0.12, rz: -0.12 },
    ];

    configs.forEach((config) => {
      const geometry = new THREE.TorusGeometry(config.radius, config.tube, 24, 180);
      const material = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: config.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, config.y, config.z);
      mesh.rotation.set(config.rx, config.ry, config.rz);
      mesh.userData = {
        speedX: (Math.random() * 0.08 + 0.02) * (Math.random() > 0.5 ? 1 : -1),
        speedY: (Math.random() * 0.08 + 0.02) * (Math.random() > 0.5 ? 1 : -1),
      };

      items.push(mesh);
    });

    return items;
  }

  function createPulseCurve(yOffset, zOffset, amplitude) {
    const points = [];
    const segments = 10;

    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const x = -10 + t * 20;
      const y = yOffset + Math.sin(t * Math.PI * 2.6) * amplitude;
      const z = zOffset + Math.cos(t * Math.PI * 1.6) * 0.45;
      points.push(new THREE.Vector3(x, y, z));
    }

    return new THREE.CatmullRomCurve3(points);
  }

  function createPulseLines() {
    const configs = [
      { y: -0.4, z: -1.8, amplitude: 0.32, color: 0xf0cc83, opacity: 0.16, radius: 0.02 },
      { y: 1.2, z: -2.6, amplitude: 0.26, color: 0xffefd4, opacity: 0.12, radius: 0.018 },
      { y: -1.8, z: -3.4, amplitude: 0.34, color: 0xeecf90, opacity: 0.12, radius: 0.018 },
    ];

    return configs.map((config, index) => {
      const curve = createPulseCurve(config.y, config.z, config.amplitude);
      const geometry = new THREE.TubeGeometry(curve, 120, config.radius, 10, false);
      const material = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: config.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.z = index * 0.06 - 0.08;
      mesh.userData = {
        baseY: config.y,
        drift: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.14,
      };
      return mesh;
    });
  }

  function createBeaconNodes() {
    const items = [];
    const geometry = new THREE.SphereGeometry(0.09, 20, 20);

    for (let i = 0; i < 28; i += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xfff4e2 : 0xf0cc83,
        transparent: true,
        opacity: 0.36,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);

      const angle = Math.random() * Math.PI * 2;
      const radius = 2.4 + Math.random() * 4.8;

      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 4,
        -1.8 - Math.random() * 5.4
      );

      mesh.userData = {
        baseX: mesh.position.x,
        baseY: mesh.position.y,
        baseZ: mesh.position.z,
        drift: Math.random() * Math.PI * 2,
        speed: 0.28 + Math.random() * 0.28,
      };

      items.push(mesh);
    }

    return items;
  }

  function createTransmissionDust() {
    const geometry = new THREE.BufferGeometry();
    const count = 620;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = -6 - Math.random() * 18;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xfff7ea,
      size: 0.036,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    return { points, geometry, material };
  }

  function createRippleParticles() {
    const geometry = new THREE.BufferGeometry();
    const count = 520;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.4 + Math.random() * 7.6;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.34;
      positions[i * 3 + 2] = -2 - Math.random() * 6;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xecc97b,
      size: 0.044,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    return { points, geometry, material };
  }

  function animate() {
    const elapsed = clock.getElapsedTime();

    pointer.x += (pointer.targetX - pointer.x) * 0.05;
    pointer.y += (pointer.targetY - pointer.y) * 0.05;

    camera.position.x = pointer.x * 0.72;
    camera.position.y = 0.2 + pointer.y * 0.34;
    camera.lookAt(pointer.x * 0.16, pointer.y * 0.1, -3);

    masterGroup.rotation.y = pointer.x * 0.05;
    masterGroup.rotation.x = pointer.y * 0.03;

    signalRings.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.speedX * 0.002;
      mesh.rotation.y += mesh.userData.speedY * 0.002;
    });

    pulseLines.forEach((mesh, index) => {
      mesh.position.y =
        Math.sin(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.08;
      mesh.rotation.z += 0.00035 + index * 0.00008;
    });

    beaconNodes.forEach((mesh, index) => {
      mesh.position.x =
        mesh.userData.baseX +
        Math.sin(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.16;
      mesh.position.y =
        mesh.userData.baseY +
        Math.cos(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.14;
      mesh.scale.setScalar(1 + Math.sin(elapsed * 0.9 + index) * 0.08);
    });

    rippleParticles.points.rotation.z += prefersReducedMotion ? 0.00006 : 0.00016;
    transmissionDust.points.rotation.y -= prefersReducedMotion ? 0.00006 : 0.00014;

    renderer.render(scene, camera);
    animationFrameId = window.requestAnimationFrame(animate);
  }

  function handlePointerMove(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;
    pointer.targetX = x * 0.82;
    pointer.targetY = -y * 0.36;
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  let animationFrameId = window.requestAnimationFrame(animate);

  window.addEventListener("mousemove", handlePointerMove, { passive: true });
  window.addEventListener("resize", handleResize);

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(animationFrameId);
    renderer.dispose();

    transmissionDust.geometry.dispose();
    transmissionDust.material.dispose();

    rippleParticles.geometry.dispose();
    rippleParticles.material.dispose();

    signalRings.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });

    pulseLines.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });

    beaconNodes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
  });
}
