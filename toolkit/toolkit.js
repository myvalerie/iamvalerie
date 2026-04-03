import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeToolkitHoverTilt();
  initializeToolkitMouseGlow();
  initializeToolkitParallax();
  initializeToolkitThreeBackground();
});

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

function initializeToolkitParallax() {
  const visual = document.getElementById("toolkitVisual");
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

    const core = visual.querySelector(".visual-core");
    const nodes = visual.querySelectorAll(".visual-node");
    const modules = visual.querySelectorAll(".visual-module");
    const rails = visual.querySelectorAll(".visual-rail");
    const note = visual.querySelector(".visual-note");

    if (core) {
      core.style.transform = `translate(${moveX * 0.22}px, ${moveY * 0.22}px) rotate(45deg)`;
    }

    nodes.forEach((node, index) => {
      const factor = 0.12 + index * 0.05;
      node.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
    });

    modules.forEach((module, index) => {
      const factor = 0.08 + index * 0.03;
      module.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
    });

    rails.forEach((rail, index) => {
      const factor = 0.05 + index * 0.02;
      rail.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
    });

    if (note) {
      note.style.transform = `translate(${moveX * 0.08}px, ${moveY * 0.08}px)`;
    }
  });

  visual.addEventListener("mouseleave", () => {
    const core = visual.querySelector(".visual-core");
    const nodes = visual.querySelectorAll(".visual-node");
    const modules = visual.querySelectorAll(".visual-module");
    const rails = visual.querySelectorAll(".visual-rail");
    const note = visual.querySelector(".visual-note");

    if (core) {
      core.style.transform = "";
    }

    nodes.forEach((node) => {
      node.style.transform = "";
    });

    modules.forEach((module) => {
      module.style.transform = "";
    });

    rails.forEach((rail) => {
      rail.style.transform = "";
    });

    if (note) {
      note.style.transform = "";
    }
  });
}

function initializeToolkitThreeBackground() {
  const container = document.getElementById("toolkitThreeBackground");
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
  scene.fog = new THREE.FogExp2(0xf8f1e6, 0.06);

  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    160
  );
  camera.position.set(0, 1.2, 16);

  const ambientLight = new THREE.AmbientLight(0xfff7ef, 1.3);
  scene.add(ambientLight);

  const pointLightA = new THREE.PointLight(0xffe4be, 1.8, 38, 2);
  pointLightA.position.set(-8, 4, 10);
  scene.add(pointLightA);

  const pointLightB = new THREE.PointLight(0xe8d3a3, 1.2, 40, 2);
  pointLightB.position.set(8, -2, 8);
  scene.add(pointLightB);

  const pointLightC = new THREE.PointLight(0xfff6eb, 1, 30, 2);
  pointLightC.position.set(0, 6, 12);
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

  const gridPlane = createGridPlane();
  masterGroup.add(gridPlane);

  const modularBlocks = createModularBlocks();
  modularBlocks.forEach((item) => masterGroup.add(item));

  const nodeLattice = createNodeLattice();
  masterGroup.add(nodeLattice.points);

  const railLines = createRailLines();
  railLines.forEach((item) => masterGroup.add(item));

  const scanPanels = createScanPanels();
  scanPanels.forEach((item) => masterGroup.add(item));

  const backgroundDust = createBackgroundDust();
  masterGroup.add(backgroundDust.points);

  function createGridPlane() {
    const geometry = new THREE.PlaneGeometry(28, 18, 24, 18);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({
      color: 0xd4b161,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(edges, material);
    lines.rotation.x = -Math.PI / 2.7;
    lines.position.set(0, -3.6, -3.5);
    return lines;
  }

  function createModularBlocks() {
    const items = [];
    const boxConfigs = [
      { x: -4.8, y: 1.8, z: -1.5, w: 1.4, h: 1.4, d: 1.4, color: 0xffefcf },
      { x: -2.2, y: -0.6, z: -2.4, w: 1.8, h: 0.9, d: 1.2, color: 0xf1d596 },
      { x: 2.4, y: 1.1, z: -1.8, w: 1.2, h: 2, d: 1.2, color: 0xfff5e5 },
      { x: 5.2, y: -1.8, z: -2.6, w: 1.6, h: 1.1, d: 1.4, color: 0xe9d2a1 },
      { x: 0.2, y: 2.8, z: -3.8, w: 2.2, h: 0.7, d: 1.2, color: 0xfff1da },
      { x: 0.6, y: -2.2, z: -1.2, w: 1.2, h: 1.2, d: 1.2, color: 0xf4ddab },
    ];

    boxConfigs.forEach((config, index) => {
      const geometry = new THREE.BoxGeometry(config.w, config.h, config.d);
      const material = new THREE.MeshPhysicalMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.2,
        roughness: 0.28,
        metalness: 0.08,
        transmission: 0.12,
        thickness: 0.8,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(config.x, config.y, config.z);

      const edges = new THREE.EdgesGeometry(geometry);
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0xd9b66c,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
      mesh.add(edgeLines);

      mesh.userData = {
        baseX: config.x,
        baseY: config.y,
        baseZ: config.z,
        speed: 0.24 + Math.random() * 0.22,
        drift: Math.random() * Math.PI * 2,
        rotX: (Math.random() * 0.02 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        rotY: (Math.random() * 0.02 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
      };

      items.push(mesh);
    });

    return items;
  }

  function createNodeLattice() {
    const geometry = new THREE.BufferGeometry();
    const count = 320;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const x = -10 + (i % 20) * 1.05 + (Math.random() - 0.5) * 0.1;
      const y = -4 + Math.floor(i / 20) * 0.55 + (Math.random() - 0.5) * 0.08;
      const z = -5.2 + Math.sin(i * 0.18) * 0.3;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xd8b35d,
      size: 0.05,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    return { points, geometry, material };
  }

  function createRailCurve(yOffset, zOffset, bend) {
    const points = [];
    const segments = 6;

    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const x = -10 + t * 20;
      const y = yOffset + Math.sin(t * Math.PI * 2) * bend;
      const z = zOffset + Math.cos(t * Math.PI * 1.4) * 0.35;
      points.push(new THREE.Vector3(x, y, z));
    }

    return new THREE.CatmullRomCurve3(points);
  }

  function createRailLines() {
    const configs = [
      { y: 2.7, z: -2.3, bend: 0.35, color: 0xf0d28c, opacity: 0.16, radius: 0.028 },
      { y: 0.7, z: -2.6, bend: 0.26, color: 0xffefd2, opacity: 0.12, radius: 0.022 },
      { y: -1.6, z: -2.2, bend: 0.32, color: 0xe7c57b, opacity: 0.14, radius: 0.026 },
    ];

    return configs.map((config, index) => {
      const curve = createRailCurve(config.y, config.z, config.bend);
      const geometry = new THREE.TubeGeometry(curve, 100, config.radius, 10, false);
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
        speed: 0.2 + Math.random() * 0.14,
        drift: Math.random() * Math.PI * 2,
      };
      return mesh;
    });
  }

  function createScanPanels() {
    const items = [];
    const geometry = new THREE.PlaneGeometry(6.2, 0.5);

    for (let i = 0; i < 3; i += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xffe7b7 : 0xfff6e6,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(-1.4 + i * 1.4, -1.2 + i * 1.8, -1.4 - i * 0.7);
      mesh.rotation.z = -0.1 + i * 0.06;
      mesh.userData = {
        baseX: mesh.position.x,
        baseY: mesh.position.y,
        speed: 0.32 + i * 0.08,
        drift: Math.random() * Math.PI * 2,
      };
      items.push(mesh);
    }

    return items;
  }

  function createBackgroundDust() {
    const geometry = new THREE.BufferGeometry();
    const count = 700;
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

    camera.position.x = pointer.x * 0.8;
    camera.position.y = 1.2 + pointer.y * 0.45;
    camera.lookAt(pointer.x * 0.25, pointer.y * 0.16, -1.5);

    masterGroup.rotation.y = pointer.x * 0.08 + Math.sin(elapsed * 0.12) * 0.02;
    masterGroup.rotation.x = pointer.y * 0.04;

    modularBlocks.forEach((mesh) => {
      mesh.position.y =
        mesh.userData.baseY +
        Math.sin(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.16;
      mesh.position.x =
        mesh.userData.baseX +
        Math.cos(elapsed * mesh.userData.speed * 0.8 + mesh.userData.drift) * 0.08;
      mesh.rotation.x += mesh.userData.rotX;
      mesh.rotation.y += mesh.userData.rotY;
    });

    railLines.forEach((mesh, index) => {
      mesh.position.y =
        Math.sin(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.08;
      mesh.rotation.z += 0.0004 + index * 0.0001;
    });

    scanPanels.forEach((mesh, index) => {
      mesh.position.x =
        mesh.userData.baseX +
        Math.sin(elapsed * mesh.userData.speed + mesh.userData.drift) * 1.1;
      mesh.material.opacity = 0.05 + (Math.sin(elapsed * (0.9 + index * 0.2)) + 1) * 0.03;
    });

    nodeLattice.points.rotation.z = Math.sin(elapsed * 0.08) * 0.01;
    backgroundDust.points.rotation.y -= prefersReducedMotion ? 0.0001 : 0.00024;

    renderer.render(scene, camera);
    animationFrameId = window.requestAnimationFrame(animate);
  }

  function handlePointerMove(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;
    pointer.targetX = x * 0.9;
    pointer.targetY = -y * 0.45;
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

    nodeLattice.geometry.dispose();
    nodeLattice.material.dispose();

    backgroundDust.geometry.dispose();
    backgroundDust.material.dispose();

    modularBlocks.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
      mesh.children.forEach((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    });

    railLines.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });

    scanPanels.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
  });
}
