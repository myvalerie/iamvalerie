import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeAboutParallax();
  initializeAboutNetwork();
  initializeAboutThreeBackground();
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
    const note = visual.querySelector(".visual-note");

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

    if (note) {
      note.style.transform = `translate(${moveX * 0.1}px, ${moveY * 0.1}px)`;
    }
  });

  visual.addEventListener("mouseleave", () => {
    const frame = visual.querySelector(".profile-frame");
    const tags = visual.querySelectorAll(".profile-tag");
    const network = visual.querySelector(".visual-network");
    const note = visual.querySelector(".visual-note");

    if (frame) {
      frame.style.transform = "";
    }

    tags.forEach((tag) => {
      tag.style.transform = "";
    });

    if (network) {
      network.style.transform = "";
    }

    if (note) {
      note.style.transform = "";
    }
  });
}

function initializeAboutNetwork() {
  const network = document.getElementById("visualNetwork");
  if (!network) return;

  const nodeCount = 16;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < nodeCount; i += 1) {
    const node = document.createElement("span");
    node.className = "network-node";

    const left = 10 + Math.random() * 80;
    const top = 10 + Math.random() * 80;
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

  for (let i = 0; i < 10; i += 1) {
    const line = document.createElement("span");
    line.className = "network-line";

    const left = 10 + Math.random() * 68;
    const top = 16 + Math.random() * 64;
    const width = 70 + Math.random() * 100;
    const rotation = -40 + Math.random() * 80;
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

function initializeAboutThreeBackground() {
  const container = document.getElementById("aboutThreeBackground");
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
  scene.fog = new THREE.FogExp2(0xf9f2e7, 0.055);

  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    120
  );
  camera.position.set(0, 0.6, 14);

  const ambientLight = new THREE.AmbientLight(0xfff7ef, 1.45);
  scene.add(ambientLight);

  const pointLightA = new THREE.PointLight(0xffe1c1, 2, 36, 2);
  pointLightA.position.set(-6, 4, 8);
  scene.add(pointLightA);

  const pointLightB = new THREE.PointLight(0xf2d7f8, 1.7, 34, 2);
  pointLightB.position.set(7, 1, 7);
  scene.add(pointLightB);

  const pointLightC = new THREE.PointLight(0xecc97a, 1.2, 26, 2);
  pointLightC.position.set(0, -5, 10);
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

  const ambientParticles = createAmbientParticleField();
  masterGroup.add(ambientParticles.points);

  const farParticles = createFarParticleField();
  masterGroup.add(farParticles.points);

  const auraLoops = createAuraLoops();
  auraLoops.forEach((item) => masterGroup.add(item));

  const signalArcs = createSignalArcs();
  signalArcs.forEach((item) => masterGroup.add(item));

  const glowClouds = createGlowClouds();
  glowClouds.forEach((item) => masterGroup.add(item));

  const diamondNodes = createDiamondNodes();
  diamondNodes.forEach((item) => masterGroup.add(item));

  function createAmbientParticleField() {
    const geometry = new THREE.BufferGeometry();
    const count = 1200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = 4 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 8;

      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xf2d7f8,
      size: 0.05,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    return { points, geometry, material };
  }

  function createFarParticleField() {
    const geometry = new THREE.BufferGeometry();
    const count = 950;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = -8 - Math.random() * 14;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xfff1df,
      size: 0.04,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    return { points, geometry, material };
  }

  function createAuraLoops() {
    const configs = [
      { radius: 2.8, tube: 0.032, color: 0xf0d6f6, y: 1.3, z: -0.4, opacity: 0.14, rx: 1.1, ry: 0.2, rz: 0.12 },
      { radius: 4.2, tube: 0.026, color: 0xe8c26e, y: 0.1, z: -1.1, opacity: 0.1, rx: 0.9, ry: -0.16, rz: 0.42 },
      { radius: 5.4, tube: 0.022, color: 0xffe7cd, y: -0.9, z: -1.6, opacity: 0.08, rx: 1.02, ry: 0.14, rz: -0.3 },
    ];

    return configs.map((config) => {
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

      return mesh;
    });
  }

  function createSignalCurve(yOffset, amplitude, zOffset) {
    const points = [];
    const segments = 8;

    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const x = -9 + t * 18;
      const y =
        yOffset +
        Math.sin(t * Math.PI * 2.4) * amplitude +
        (Math.random() - 0.5) * 0.26;
      const z = zOffset + Math.cos(t * Math.PI * 1.7) * 0.7;
      points.push(new THREE.Vector3(x, y, z));
    }

    return new THREE.CatmullRomCurve3(points);
  }

  function createSignalArcs() {
    const configs = [
      { y: 2.2, amp: 0.48, z: -1.2, color: 0xeecff6, opacity: 0.14, radius: 0.045 },
      { y: 0.8, amp: 0.62, z: -0.8, color: 0xf3d38b, opacity: 0.13, radius: 0.05 },
      { y: -1.2, amp: 0.55, z: -1.5, color: 0xffebd7, opacity: 0.11, radius: 0.042 },
      { y: -2.8, amp: 0.44, z: -2.0, color: 0xeecff6, opacity: 0.09, radius: 0.038 },
    ];

    return configs.map((config, index) => {
      const curve = createSignalCurve(config.y, config.amp, config.z);
      const geometry = new THREE.TubeGeometry(curve, 150, config.radius, 12, false);
      const material = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: config.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.z = index * 0.1 - 0.14;
      mesh.userData = {
        floatOffset: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.16,
      };
      return mesh;
    });
  }

  function createGlowClouds() {
    const configs = [
      { size: 1.25, x: -4.6, y: 2.7, z: -1.8, color: 0xffe5cd, opacity: 0.16 },
      { size: 1.05, x: 4.2, y: -1.8, z: -1.3, color: 0xf0d6f6, opacity: 0.14 },
      { size: 1.45, x: 1.6, y: 4.1, z: -3.4, color: 0xecc97a, opacity: 0.08 },
    ];

    return configs.map((config) => {
      const geometry = new THREE.SphereGeometry(config.size, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: config.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(config.x, config.y, config.z);
      mesh.userData = {
        baseY: config.y,
        speed: 0.28 + Math.random() * 0.18,
        drift: Math.random() * Math.PI * 2,
      };
      return mesh;
    });
  }

  function createDiamondNodes() {
    const items = [];
    const geometry = new THREE.OctahedronGeometry(0.1, 0);

    for (let i = 0; i < 30; i += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xfff1df : 0xf0d6f6,
        transparent: true,
        opacity: 0.34,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 7,
        -1.5 - Math.random() * 5
      );
      mesh.scale.setScalar(Math.random() * 1.1 + 0.55);
      mesh.userData = {
        baseX: mesh.position.x,
        baseY: mesh.position.y,
        speed: 0.32 + Math.random() * 0.3,
        drift: Math.random() * Math.PI * 2,
      };
      items.push(mesh);
    }

    return items;
  }

  function animate() {
    const elapsed = clock.getElapsedTime();

    pointer.x += (pointer.targetX - pointer.x) * 0.045;
    pointer.y += (pointer.targetY - pointer.y) * 0.045;

    camera.position.x = pointer.x * 0.72;
    camera.position.y = 0.6 + pointer.y * 0.52;
    camera.lookAt(pointer.x * 0.35, pointer.y * 0.22, 0);

    masterGroup.rotation.y = elapsed * 0.022 + pointer.x * 0.09;
    masterGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.026 + pointer.y * 0.06;
    masterGroup.position.y = Math.sin(elapsed * 0.24) * 0.12;

    ambientParticles.points.rotation.y += prefersReducedMotion ? 0.0003 : 0.0009;
    ambientParticles.points.rotation.z += prefersReducedMotion ? 0.0001 : 0.00024;

    farParticles.points.rotation.y -= prefersReducedMotion ? 0.0001 : 0.00026;

    auraLoops.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.speedX * 0.002;
      mesh.rotation.y += mesh.userData.speedY * 0.002;
    });

    signalArcs.forEach((mesh, index) => {
      mesh.rotation.z += 0.00055 + index * 0.00012;
      mesh.position.y =
        Math.sin(elapsed * mesh.userData.speed + mesh.userData.floatOffset) * 0.12;
    });

    glowClouds.forEach((mesh) => {
      mesh.position.y =
        mesh.userData.baseY +
        Math.sin(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.2;
      mesh.scale.setScalar(1 + Math.sin(elapsed * 0.5 + mesh.userData.drift) * 0.05);
    });

    diamondNodes.forEach((mesh, index) => {
      mesh.position.x =
        mesh.userData.baseX +
        Math.sin(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.15;
      mesh.position.y =
        mesh.userData.baseY +
        Math.cos(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.16;
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.011 + index * 0.0001;
    });

    renderer.render(scene, camera);
    animationFrameId = window.requestAnimationFrame(animate);
  }

  function handlePointerMove(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;
    pointer.targetX = x * 0.82;
    pointer.targetY = -y * 0.42;
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

    ambientParticles.geometry.dispose();
    ambientParticles.material.dispose();

    farParticles.geometry.dispose();
    farParticles.material.dispose();

    auraLoops.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });

    signalArcs.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });

    glowClouds.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });

    diamondNodes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
  });
}
