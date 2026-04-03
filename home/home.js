import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeThreeBackground();
});

function initializeThreeBackground() {
  const container = document.getElementById("threeBackground");
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
  scene.fog = new THREE.FogExp2(0xf6efe5, 0.032);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(0, 0.3, 17);

  const ambientLight = new THREE.AmbientLight(0xfff5eb, 1.5);
  scene.add(ambientLight);

  const pointLightA = new THREE.PointLight(0xffe6c1, 3.6, 90, 2);
  pointLightA.position.set(-10, 6, 10);
  scene.add(pointLightA);

  const pointLightB = new THREE.PointLight(0xf2d8ff, 2.8, 70, 2);
  pointLightB.position.set(8, -2, 7);
  scene.add(pointLightB);

  const pointLightC = new THREE.PointLight(0xf2c775, 2.2, 80, 2);
  pointLightC.position.set(0, -8, 12);
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

  const starField = createStarField(1800, 18, 11, 22, 0xf5dfb0, 0.95, 0.055);
  const dustField = createStarField(1400, 34, 18, 40, 0xffffff, 0.28, 0.038);
  const farField = createStarField(900, 52, 28, 70, 0xf2e9dc, 0.16, 0.03);

  masterGroup.add(starField.points);
  masterGroup.add(dustField.points);
  masterGroup.add(farField.points);

  const silkWaves = createSilkWaves();
  silkWaves.forEach((wave) => masterGroup.add(wave.mesh));

  const haloRings = createHaloRings();
  haloRings.forEach((ring) => masterGroup.add(ring));

  const crystalFrames = createCrystalFrames();
  crystalFrames.forEach((frame) => masterGroup.add(frame));

  const floatingOrbs = createFloatingOrbs();
  floatingOrbs.forEach((orb) => masterGroup.add(orb));

  const sparkNodes = createSparkNodes();
  sparkNodes.forEach((node) => masterGroup.add(node));

  function createStarField(count, width, height, depth, color, opacity, size) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * width;
      positions[i * 3 + 1] = (Math.random() - 0.5) * height;
      positions[i * 3 + 2] = -Math.random() * depth;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color,
      size,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);

    return { points, geometry, material };
  }

  function createSilkWave(config) {
    const geometry = new THREE.PlaneGeometry(18, 8.6, 120, 72);
    const material = new THREE.MeshBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: config.opacity,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(config.x, config.y, config.z);
    mesh.rotation.set(config.rx, config.ry, config.rz);
    mesh.userData = {
      basePositions: geometry.attributes.position.array.slice(),
      amplitudeX: config.amplitudeX,
      amplitudeY: config.amplitudeY,
      speed: config.speed,
      phase: config.phase,
      drift: config.drift,
    };

    return { mesh, geometry, material };
  }

  function createSilkWaves() {
    const configs = [
      {
        x: -1.5,
        y: 1.4,
        z: -3,
        rx: -0.55,
        ry: 0.6,
        rz: -0.18,
        color: 0xf7d7ff,
        opacity: 0.12,
        amplitudeX: 0.34,
        amplitudeY: 0.28,
        speed: 0.85,
        phase: 0.0,
        drift: 0.9,
      },
      {
        x: 1.9,
        y: -1.1,
        z: -5.6,
        rx: -0.46,
        ry: -0.44,
        rz: 0.3,
        color: 0xffd9aa,
        opacity: 0.1,
        amplitudeX: 0.28,
        amplitudeY: 0.24,
        speed: 0.65,
        phase: 1.2,
        drift: 0.6,
      },
      {
        x: 0.3,
        y: 0.1,
        z: -8.4,
        rx: -0.36,
        ry: 0.18,
        rz: -0.08,
        color: 0xfff1d8,
        opacity: 0.08,
        amplitudeX: 0.24,
        amplitudeY: 0.2,
        speed: 0.52,
        phase: 2.1,
        drift: 0.45,
      },
    ];

    return configs.map((config) => createSilkWave(config));
  }

  function createHaloRings() {
    const configs = [
      { radius: 4.8, tube: 0.05, color: 0xf0c978, opacity: 0.16, x: 0.5, y: 1.7, z: -2.6, rx: 1.0, ry: 0.15, rz: 0.28 },
      { radius: 6.5, tube: 0.038, color: 0xf0dcff, opacity: 0.11, x: -0.8, y: 0.2, z: -6.8, rx: 0.92, ry: -0.24, rz: -0.42 },
      { radius: 8.8, tube: 0.03, color: 0xffead2, opacity: 0.08, x: 0, y: -1.4, z: -11.2, rx: 1.16, ry: 0.08, rz: 0.1 },
    ];

    return configs.map((config) => {
      const geometry = new THREE.TorusGeometry(config.radius, config.tube, 28, 220);
      const material = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: config.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(config.x, config.y, config.z);
      mesh.rotation.set(config.rx, config.ry, config.rz);
      mesh.userData = {
        speedX: (Math.random() * 0.05 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        speedY: (Math.random() * 0.05 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
      };
      return mesh;
    });
  }

  function createCrystalFrames() {
    const items = [];
    const configs = [
      { size: 2.4, x: -5.2, y: 2.2, z: -3.2, color: 0xffe8c9, opacity: 0.12 },
      { size: 1.8, x: 5.8, y: -1.6, z: -4.8, color: 0xf1dbff, opacity: 0.1 },
      { size: 3.2, x: 2.2, y: 4.0, z: -8.6, color: 0xffd9a8, opacity: 0.08 },
    ];

    configs.forEach((config) => {
      const geometry = new THREE.IcosahedronGeometry(config.size, 0);
      const edges = new THREE.EdgesGeometry(geometry);
      const material = new THREE.LineBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: config.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const line = new THREE.LineSegments(edges, material);
      line.position.set(config.x, config.y, config.z);
      line.userData = {
        speed: 0.08 + Math.random() * 0.08,
        drift: Math.random() * Math.PI * 2,
        baseY: config.y,
      };
      items.push(line);
    });

    return items;
  }

  function createFloatingOrbs() {
    const items = [];
    const configs = [
      { size: 1.4, x: -4.4, y: 3.2, z: -6.8, color: 0xffe5c4, opacity: 0.12 },
      { size: 1.0, x: 4.8, y: -2.8, z: -5.4, color: 0xf4d8ff, opacity: 0.1 },
      { size: 1.9, x: 1.2, y: 3.6, z: -12.5, color: 0xf2c770, opacity: 0.08 },
      { size: 0.8, x: -1.8, y: -3.4, z: -8.2, color: 0xffffff, opacity: 0.06 },
    ];

    configs.forEach((config) => {
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
        baseX: config.x,
        baseY: config.y,
        baseZ: config.z,
        speed: 0.25 + Math.random() * 0.22,
        drift: Math.random() * Math.PI * 2,
      };
      items.push(mesh);
    });

    return items;
  }

  function createSparkNodes() {
    const items = [];
    const geometry = new THREE.IcosahedronGeometry(0.1, 0);

    for (let i = 0; i < 40; i += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0xf6d28f : i % 3 === 1 ? 0xffffff : 0xf0dcff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 13,
        (Math.random() - 0.5) * 8,
        -2 - Math.random() * 14
      );
      mesh.scale.setScalar(Math.random() * 1.2 + 0.4);
      mesh.userData = {
        baseX: mesh.position.x,
        baseY: mesh.position.y,
        baseZ: mesh.position.z,
        speed: 0.35 + Math.random() * 0.45,
        drift: Math.random() * Math.PI * 2,
      };
      items.push(mesh);
    }

    return items;
  }

  function updateSilkWave(wave, elapsed) {
    const geometry = wave.geometry;
    const position = geometry.attributes.position;
    const base = wave.mesh.userData.basePositions;
    const array = position.array;
    const amplitudeX = wave.mesh.userData.amplitudeX;
    const amplitudeY = wave.mesh.userData.amplitudeY;
    const speed = wave.mesh.userData.speed;
    const phase = wave.mesh.userData.phase;
    const drift = wave.mesh.userData.drift;

    for (let i = 0; i < array.length; i += 3) {
      const baseX = base[i];
      const baseY = base[i + 1];
      const baseZ = base[i + 2];

      const rippleA = Math.sin(baseX * 0.72 + elapsed * speed + phase);
      const rippleB = Math.cos(baseY * 1.1 + elapsed * (speed * 0.86) + drift);
      const rippleC = Math.sin((baseX + baseY) * 0.4 + elapsed * 0.42 + phase);

      array[i] = baseX + rippleB * amplitudeX * 0.35;
      array[i + 1] = baseY + rippleA * amplitudeY * 0.42;
      array[i + 2] = baseZ + rippleA * amplitudeX + rippleB * amplitudeY + rippleC * 0.36;
    }

    position.needsUpdate = true;
  }

  function animate() {
    const elapsed = clock.getElapsedTime();

    pointer.x += (pointer.targetX - pointer.x) * 0.045;
    pointer.y += (pointer.targetY - pointer.y) * 0.045;

    camera.position.x = pointer.x * 1.05;
    camera.position.y = 0.3 + pointer.y * 0.8;
    camera.lookAt(pointer.x * 0.35, pointer.y * 0.25, -5);

    masterGroup.rotation.y = elapsed * 0.025 + pointer.x * 0.16;
    masterGroup.rotation.x = Math.sin(elapsed * 0.22) * 0.03 + pointer.y * 0.08;
    masterGroup.position.y = Math.sin(elapsed * 0.24) * 0.18;

    starField.points.rotation.y += prefersReducedMotion ? 0.00018 : 0.0007;
    starField.points.rotation.z += prefersReducedMotion ? 0.00008 : 0.00025;

    dustField.points.rotation.y -= prefersReducedMotion ? 0.00008 : 0.00022;
    farField.points.rotation.y += prefersReducedMotion ? 0.00004 : 0.00012;

    silkWaves.forEach((wave, index) => {
      updateSilkWave(wave, elapsed);
      wave.mesh.rotation.z += 0.0003 + index * 0.00008;
      wave.mesh.position.y += Math.sin(elapsed * 0.3 + index) * 0.0018;
    });

    haloRings.forEach((ring) => {
      ring.rotation.x += ring.userData.speedX * 0.002;
      ring.rotation.y += ring.userData.speedY * 0.002;
    });

    crystalFrames.forEach((frame, index) => {
      frame.rotation.x += 0.001 + index * 0.00018;
      frame.rotation.y += 0.0014 + index * 0.00022;
      frame.position.y = frame.userData.baseY + Math.sin(elapsed * frame.userData.speed + frame.userData.drift) * 0.25;
    });

    floatingOrbs.forEach((orb) => {
      orb.position.x = orb.userData.baseX + Math.sin(elapsed * orb.userData.speed + orb.userData.drift) * 0.24;
      orb.position.y = orb.userData.baseY + Math.cos(elapsed * orb.userData.speed + orb.userData.drift) * 0.28;
      orb.scale.setScalar(1 + Math.sin(elapsed * 0.5 + orb.userData.drift) * 0.06);
    });

    sparkNodes.forEach((node, index) => {
      node.position.x = node.userData.baseX + Math.sin(elapsed * node.userData.speed + node.userData.drift) * 0.18;
      node.position.y = node.userData.baseY + Math.cos(elapsed * node.userData.speed + node.userData.drift) * 0.22;
      node.rotation.x += 0.01;
      node.rotation.y += 0.012 + index * 0.0001;
    });

    renderer.render(scene, camera);
    animationFrameId = window.requestAnimationFrame(animate);
  }

  function handlePointerMove(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;
    pointer.targetX = x * 0.85;
    pointer.targetY = -y * 0.5;
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

    starField.geometry.dispose();
    starField.material.dispose();

    dustField.geometry.dispose();
    dustField.material.dispose();

    farField.geometry.dispose();
    farField.material.dispose();

    silkWaves.forEach((wave) => {
      wave.geometry.dispose();
      wave.material.dispose();
    });

    haloRings.forEach((ring) => {
      ring.geometry.dispose();
      ring.material.dispose();
    });

    crystalFrames.forEach((frame) => {
      frame.geometry.dispose();
      frame.material.dispose();
    });

    floatingOrbs.forEach((orb) => {
      orb.geometry.dispose();
      orb.material.dispose();
    });

    sparkNodes.forEach((node) => {
      node.geometry.dispose();
      node.material.dispose();
    });
  });
}
