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
  scene.fog = new THREE.FogExp2(0xf9f2e7, 0.05);

  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    120
  );
  camera.position.set(0, 0.8, 14);

  const ambientLight = new THREE.AmbientLight(0xfff6eb, 1.5);
  scene.add(ambientLight);

  const pointLightA = new THREE.PointLight(0xffe3bf, 2.2, 40, 2);
  pointLightA.position.set(-7, 5, 8);
  scene.add(pointLightA);

  const pointLightB = new THREE.PointLight(0xf3d7ff, 1.8, 34, 2);
  pointLightB.position.set(8, -1, 6);
  scene.add(pointLightB);

  const pointLightC = new THREE.PointLight(0xf0c470, 1.4, 28, 2);
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

  const particles = createParticleField();
  masterGroup.add(particles.points);

  const deepParticles = createDeepParticleField();
  masterGroup.add(deepParticles.points);

  const ribbons = createRibbonSet();
  ribbons.forEach((item) => masterGroup.add(item));

  const orbits = createOrbitSet();
  orbits.forEach((item) => masterGroup.add(item));

  const glowSpheres = createGlowSpheres();
  glowSpheres.forEach((item) => masterGroup.add(item));

  const floatingNodes = createFloatingNodes();
  floatingNodes.forEach((item) => masterGroup.add(item));

  function createParticleField() {
    const geometry = new THREE.BufferGeometry();
    const count = 1400;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const radius = 8 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 7.5;

      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 1] = spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      sizes[i] = Math.random() * 1.2 + 0.4;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: 0xd9b66c,
      size: 0.055,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    points.position.set(0, 0.2, 0);
    return { points, geometry, material };
  }

  function createDeepParticleField() {
    const geometry = new THREE.BufferGeometry();
    const count = 900;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = -8 - Math.random() * 16;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xf7efe0,
      size: 0.045,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    return { points, geometry, material };
  }

  function createRibbonCurve(yOffset, amplitude, zOffset) {
    const points = [];
    const segments = 9;

    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const x = -10 + t * 20;
      const y =
        yOffset +
        Math.sin(t * Math.PI * 2.2) * amplitude +
        (Math.random() - 0.5) * 0.3;
      const z = zOffset + Math.cos(t * Math.PI * 1.6) * 0.8;
      points.push(new THREE.Vector3(x, y, z));
    }

    return new THREE.CatmullRomCurve3(points);
  }

  function createRibbonSet() {
    const ribbonConfigs = [
      { y: 2.4, amp: 0.6, z: -1.2, color: 0xeac0ef, opacity: 0.2, radius: 0.05 },
      { y: 0.7, amp: 0.8, z: -0.6, color: 0xdfb45a, opacity: 0.18, radius: 0.06 },
      { y: -1.5, amp: 0.7, z: -1.4, color: 0xffe4c4, opacity: 0.16, radius: 0.05 },
      { y: -3.1, amp: 0.55, z: -2.0, color: 0xe9c9f5, opacity: 0.14, radius: 0.045 },
    ];

    return ribbonConfigs.map((config, index) => {
      const curve = createRibbonCurve(config.y, config.amp, config.z);
      const geometry = new THREE.TubeGeometry(curve, 160, config.radius, 12, false);
      const material = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: config.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.z = index * 0.12 - 0.18;
      mesh.userData = {
        baseY: config.y,
        floatOffset: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.18,
      };

      return mesh;
    });
  }

  function createOrbitSet() {
    const orbitConfigs = [
      { radius: 2.8, tube: 0.035, color: 0xdcb56a, y: 1.4, z: 0.6, opacity: 0.16, rx: 0.9, ry: 0.2, rz: 0.1 },
      { radius: 3.9, tube: 0.03, color: 0xf0d6f3, y: 0.2, z: -0.8, opacity: 0.12, rx: 1.1, ry: -0.3, rz: 0.42 },
      { radius: 5.2, tube: 0.024, color: 0xf6e2c9, y: -0.8, z: -1.2, opacity: 0.1, rx: 0.95, ry: 0.1, rz: -0.36 },
    ];

    return orbitConfigs.map((config) => {
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

  function createGlowSpheres() {
    const sphereConfigs = [
      { size: 1.2, x: -4.2, y: 2.8, z: -1.5, color: 0xffe6c3, opacity: 0.18 },
      { size: 0.9, x: 4.6, y: -2.6, z: -1.8, color: 0xf1d7fb, opacity: 0.14 },
      { size: 1.6, x: 1.4, y: 3.8, z: -3.5, color: 0xf2c878, opacity: 0.1 },
    ];

    return sphereConfigs.map((config) => {
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
        speed: 0.3 + Math.random() * 0.2,
        drift: Math.random() * Math.PI * 2,
      };
      return mesh;
    });
  }

  function createFloatingNodes() {
    const items = [];
    const geometry = new THREE.IcosahedronGeometry(0.09, 0);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    for (let i = 0; i < 34; i += 1) {
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 7,
        -1.5 - Math.random() * 5
      );
      mesh.scale.setScalar(Math.random() * 1.1 + 0.6);
      mesh.userData = {
        baseX: mesh.position.x,
        baseY: mesh.position.y,
        baseZ: mesh.position.z,
        speed: 0.35 + Math.random() * 0.35,
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

    camera.position.x = pointer.x * 0.9;
    camera.position.y = 0.8 + pointer.y * 0.6;
    camera.lookAt(pointer.x * 0.5, pointer.y * 0.35, 0);

    masterGroup.rotation.y = elapsed * 0.03 + pointer.x * 0.12;
    masterGroup.rotation.x = Math.sin(elapsed * 0.22) * 0.03 + pointer.y * 0.08;
    masterGroup.position.y = Math.sin(elapsed * 0.3) * 0.14;

    particles.points.rotation.y += prefersReducedMotion ? 0.0004 : 0.0012;
    particles.points.rotation.z += prefersReducedMotion ? 0.00015 : 0.00035;

    deepParticles.points.rotation.y -= prefersReducedMotion ? 0.00015 : 0.0004;

    ribbons.forEach((mesh, index) => {
      mesh.rotation.z += 0.0008 + index * 0.00015;
      mesh.position.y =
        Math.sin(elapsed * mesh.userData.speed + mesh.userData.floatOffset) * 0.12;
    });

    orbits.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.speedX * 0.002;
      mesh.rotation.y += mesh.userData.speedY * 0.002;
    });

    glowSpheres.forEach((mesh) => {
      mesh.position.y =
        mesh.userData.baseY + Math.sin(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.22;
      mesh.scale.setScalar(1 + Math.sin(elapsed * 0.6 + mesh.userData.drift) * 0.06);
    });

    floatingNodes.forEach((mesh, index) => {
      mesh.position.x = mesh.userData.baseX + Math.sin(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.16;
      mesh.position.y = mesh.userData.baseY + Math.cos(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.18;
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.012 + index * 0.0001;
    });

    renderer.render(scene, camera);
    animationFrameId = window.requestAnimationFrame(animate);
  }

  function handlePointerMove(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;
    pointer.targetX = x * 0.9;
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

    particles.geometry.dispose();
    particles.material.dispose();

    deepParticles.geometry.dispose();
    deepParticles.material.dispose();

    ribbons.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });

    orbits.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });

    glowSpheres.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });

    floatingNodes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
  });
}
