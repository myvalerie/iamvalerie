import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeProjectVisualMotion();
  initializeWorkHeroParallax();
  initializeWorkThreeBackground();
});

function initializeProjectVisualMotion() {
  const frames = document.querySelectorAll(".project-visual-frame");

  frames.forEach((frame) => {
    frame.addEventListener("mousemove", (event) => {
      if (window.innerWidth <= 768) return;

      const rect = frame.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 3;
      const rotateX = ((centerY - y) / centerY) * 3;

      frame.style.transform = `
        perspective(900px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-4px)
      `;
    });

    frame.addEventListener("mouseleave", () => {
      frame.style.transform = "";
    });
  });
}

function initializeWorkHeroParallax() {
  const visual = document.getElementById("workHeroVisual");
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

    const core = visual.querySelector(".hero-core");
    const nodes = visual.querySelectorAll(".hero-node");
    const planes = visual.querySelectorAll(".hero-gallery-plane");
    const beams = visual.querySelectorAll(".hero-light-beam");
    const note = visual.querySelector(".hero-visual-note");

    if (core) {
      core.style.transform = `translate(${moveX * 0.18}px, ${moveY * 0.18}px)`;
    }

    nodes.forEach((node, index) => {
      const factor = 0.14 + index * 0.05;
      node.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
    });

    planes.forEach((plane, index) => {
      const factor = 0.05 + index * 0.04;
      const baseRotation = index === 0 ? -8 : index === 1 ? 6 : -3;
      plane.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px) rotate(${baseRotation}deg)`;
    });

    beams.forEach((beam, index) => {
      const factor = 0.06 + index * 0.02;
      beam.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
    });

    if (note) {
      note.style.transform = `translate(${moveX * 0.08}px, ${moveY * 0.08}px)`;
    }
  });

  visual.addEventListener("mouseleave", () => {
    const core = visual.querySelector(".hero-core");
    const nodes = visual.querySelectorAll(".hero-node");
    const planes = visual.querySelectorAll(".hero-gallery-plane");
    const beams = visual.querySelectorAll(".hero-light-beam");
    const note = visual.querySelector(".hero-visual-note");

    if (core) core.style.transform = "";
    nodes.forEach((node) => (node.style.transform = ""));
    planes.forEach((plane) => (plane.style.transform = ""));
    beams.forEach((beam) => (beam.style.transform = ""));
    if (note) note.style.transform = "";
  });
}

function initializeWorkThreeBackground() {
  const container = document.getElementById("workThreeBackground");
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
  scene.fog = new THREE.FogExp2(0xf8f1e6, 0.052);

  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    180
  );
  camera.position.set(0, 0.9, 15);

  const ambientLight = new THREE.AmbientLight(0xfff7ef, 1.3);
  scene.add(ambientLight);

  const pointLightA = new THREE.PointLight(0xffe4be, 1.8, 42, 2);
  pointLightA.position.set(-8, 5, 9);
  scene.add(pointLightA);

  const pointLightB = new THREE.PointLight(0xf4d69a, 1.1, 38, 2);
  pointLightB.position.set(8, -1, 8);
  scene.add(pointLightB);

  const pointLightC = new THREE.PointLight(0xfff6eb, 1.05, 34, 2);
  pointLightC.position.set(0, 6, 11);
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

  const galleryPlanes = createGalleryPlanes();
  galleryPlanes.forEach((item) => masterGroup.add(item));

  const hangingFrames = createHangingFrames();
  hangingFrames.forEach((item) => masterGroup.add(item.group));

  const floorLines = createFloorLines();
  masterGroup.add(floorLines);

  const lightStrips = createLightStrips();
  lightStrips.forEach((item) => masterGroup.add(item));

  const archiveDust = createArchiveDust();
  masterGroup.add(archiveDust.points);

  const depthParticles = createDepthParticles();
  masterGroup.add(depthParticles.points);

  function createGalleryPlanes() {
    const items = [];
    const configs = [
      { x: -5.6, y: 1.4, z: -5.4, w: 3.8, h: 4.8, rotY: 0.24, opacity: 0.12 },
      { x: -1.4, y: 0.4, z: -4.2, w: 4.4, h: 5.6, rotY: -0.08, opacity: 0.14 },
      { x: 3.6, y: 1.1, z: -5.2, w: 4, h: 5, rotY: -0.22, opacity: 0.11 },
      { x: 6.2, y: -0.4, z: -7.2, w: 3.2, h: 4.2, rotY: 0.3, opacity: 0.08 },
    ];

    configs.forEach((config) => {
      const geometry = new THREE.PlaneGeometry(config.w, config.h);
      const material = new THREE.MeshBasicMaterial({
        color: 0xfff5e9,
        transparent: true,
        opacity: config.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(config.x, config.y, config.z);
      mesh.rotation.y = config.rotY;

      const edgeGeometry = new THREE.EdgesGeometry(geometry);
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0xd9b66c,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
      mesh.add(edges);

      mesh.userData = {
        baseX: config.x,
        baseY: config.y,
        drift: Math.random() * Math.PI * 2,
        speed: 0.18 + Math.random() * 0.18,
      };

      items.push(mesh);
    });

    return items;
  }

  function createHangingFrames() {
    const items = [];
    const frameConfigs = [
      { x: -3.4, y: 0.6, z: -2.8, w: 2.2, h: 3, rotY: 0.16 },
      { x: 0.4, y: 0.2, z: -2.2, w: 2.6, h: 3.3, rotY: -0.04 },
      { x: 4.2, y: 0.8, z: -3.1, w: 2.1, h: 2.8, rotY: -0.18 },
    ];

    frameConfigs.forEach((config, index) => {
      const group = new THREE.Group();

      const geometry = new THREE.PlaneGeometry(config.w, config.h);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xfff0d9,
        transparent: true,
        opacity: 0.22,
        roughness: 0.22,
        metalness: 0.04,
        transmission: 0.08,
        thickness: 0.6,
        depthWrite: false,
      });

      const plane = new THREE.Mesh(geometry, material);
      group.add(plane);

      const edges = new THREE.EdgesGeometry(geometry);
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0xd5af5d,
        transparent: true,
        opacity: 0.34,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
      group.add(edgeLines);

      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, config.h / 2 + 1.4, 0),
        new THREE.Vector3(0, config.h / 2, 0),
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xe4c57a,
        transparent: true,
        opacity: 0.18,
      });
      const hangLine = new THREE.Line(lineGeometry, lineMaterial);
      group.add(hangLine);

      group.position.set(config.x, config.y, config.z);
      group.rotation.y = config.rotY;
      group.userData = {
        baseX: config.x,
        baseY: config.y,
        baseZ: config.z,
        swing: Math.random() * Math.PI * 2,
        speed: 0.22 + index * 0.06,
      };

      items.push({ group, geometry, material });
    });

    return items;
  }

  function createFloorLines() {
    const geometry = new THREE.PlaneGeometry(26, 16, 18, 14);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({
      color: 0xd0aa57,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(edges, material);
    lines.rotation.x = -Math.PI / 2.45;
    lines.position.set(0, -4.2, -4.8);
    return lines;
  }

  function createLightStrips() {
    const items = [];
    const geometry = new THREE.PlaneGeometry(7.2, 0.42);

    for (let i = 0; i < 3; i += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xffe1a8 : 0xfff5e6,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(-2.2 + i * 2.2, 2.2 - i * 1.5, -2.2 - i * 0.9);
      mesh.rotation.z = -0.14 + i * 0.08;
      mesh.userData = {
        baseX: mesh.position.x,
        baseY: mesh.position.y,
        drift: Math.random() * Math.PI * 2,
        speed: 0.26 + i * 0.08,
      };

      items.push(mesh);
    }

    return items;
  }

  function createArchiveDust() {
    const geometry = new THREE.BufferGeometry();
    const count = 760;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = -8 - Math.random() * 18;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xfff7ea,
      size: 0.038,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    return { points, geometry, material };
  }

  function createDepthParticles() {
    const geometry = new THREE.BufferGeometry();
    const count = 520;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const ring = 5 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;

      positions[i * 3] = Math.cos(angle) * ring;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = -2.5 - Math.random() * 6;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xe8c87a,
      size: 0.045,
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

    camera.position.x = pointer.x * 0.78;
    camera.position.y = 0.9 + pointer.y * 0.4;
    camera.lookAt(pointer.x * 0.2, pointer.y * 0.14, -3.8);

    masterGroup.rotation.y = pointer.x * 0.06 + Math.sin(elapsed * 0.08) * 0.02;
    masterGroup.rotation.x = pointer.y * 0.035;

    galleryPlanes.forEach((mesh) => {
      mesh.position.y =
        mesh.userData.baseY +
        Math.sin(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.12;
    });

    hangingFrames.forEach((item, index) => {
      item.group.rotation.z =
        Math.sin(elapsed * item.group.userData.speed + item.group.userData.swing) * 0.035;
      item.group.position.y =
        item.group.userData.baseY +
        Math.sin(elapsed * item.group.userData.speed + item.group.userData.swing) * 0.08;
      item.group.rotation.y += 0.0004 * (index % 2 === 0 ? 1 : -1);
    });

    lightStrips.forEach((mesh, index) => {
      mesh.position.x =
        mesh.userData.baseX +
        Math.sin(elapsed * mesh.userData.speed + mesh.userData.drift) * 1.1;
      mesh.material.opacity = 0.04 + (Math.sin(elapsed * (0.9 + index * 0.2)) + 1) * 0.025;
    });

    depthParticles.points.rotation.y += prefersReducedMotion ? 0.00008 : 0.0002;
    archiveDust.points.rotation.y -= prefersReducedMotion ? 0.00008 : 0.00018;

    renderer.render(scene, camera);
    animationFrameId = window.requestAnimationFrame(animate);
  }

  function handlePointerMove(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;
    pointer.targetX = x * 0.88;
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

    archiveDust.geometry.dispose();
    archiveDust.material.dispose();

    depthParticles.geometry.dispose();
    depthParticles.material.dispose();

    galleryPlanes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
      mesh.children.forEach((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    });

    hangingFrames.forEach((item) => {
      item.group.children.forEach((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    });

    lightStrips.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
  });
}
