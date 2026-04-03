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

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xfed8d3, 0.022);

  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(0, 0, 18);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
  scene.add(ambientLight);

  const lightA = new THREE.PointLight(0x99cdd8, 2.8, 100, 2);
  lightA.position.set(-9, 5, 10);
  scene.add(lightA);

  const lightB = new THREE.PointLight(0xcf06c4, 1.9, 80, 2);
  lightB.position.set(8, -1, 8);
  scene.add(lightB);

  const lightC = new THREE.PointLight(0xf3c382, 1.8, 90, 2);
  lightC.position.set(0, -7, 12);
  scene.add(lightC);

  const world = new THREE.Group();
  scene.add(world);

  const pointer = {
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
  };

  const clock = new THREE.Clock();

  const nearDust = createParticleField({
    count: 720,
    width: 18,
    height: 10,
    depth: 18,
    color: 0xf3c382,
    opacity: 0.34,
    size: 0.05,
  });

  const farDust = createParticleField({
    count: 1100,
    width: 34,
    height: 18,
    depth: 44,
    color: 0x99cdd8,
    opacity: 0.13,
    size: 0.032,
  });

  const blushDust = createParticleField({
    count: 560,
    width: 24,
    height: 14,
    depth: 26,
    color: 0xfed8d3,
    opacity: 0.12,
    size: 0.038,
  });

  world.add(nearDust.points);
  world.add(farDust.points);
  world.add(blushDust.points);

  const silkLayers = createSilkLayers();
  silkLayers.forEach((layer) => world.add(layer.mesh));

  const haloLayers = createHaloLayers();
  haloLayers.forEach((halo) => world.add(halo));

  const glowOrbs = createGlowOrbs();
  glowOrbs.forEach((orb) => world.add(orb));

  function createParticleField(config) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.count * 3);

    for (let i = 0; i < config.count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * config.width;
      positions[i * 3 + 1] = (Math.random() - 0.5) * config.height;
      positions[i * 3 + 2] = -Math.random() * config.depth;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: config.color,
      size: config.size,
      transparent: true,
      opacity: config.opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);

    return { points, geometry, material };
  }

  function createSilkMesh(config) {
    const geometry = new THREE.PlaneGeometry(
      config.width,
      config.height,
      config.segmentsX,
      config.segmentsY
    );

    const material = new THREE.MeshBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: config.opacity,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(config.x, config.y, config.z);
    mesh.rotation.set(config.rx, config.ry, config.rz);

    mesh.userData = {
      basePositions: geometry.attributes.position.array.slice(),
      strengthA: config.strengthA,
      strengthB: config.strengthB,
      speedA: config.speedA,
      speedB: config.speedB,
      phase: config.phase,
      drift: config.drift,
      baseY: config.y,
      pointerFactorX: config.pointerFactorX,
      pointerFactorY: config.pointerFactorY,
    };

    return { mesh, geometry, material };
  }

  function createSilkLayers() {
    const configs = [
      {
        width: 24,
        height: 11,
        segmentsX: 140,
        segmentsY: 90,
        x: -1.8,
        y: 1.2,
        z: -4,
        rx: -0.62,
        ry: 0.48,
        rz: -0.12,
        color: 0xcf06c4,
        opacity: 0.08,
        strengthA: 0.55,
        strengthB: 0.28,
        speedA: 0.42,
        speedB: 0.25,
        phase: 0.0,
        drift: 0.7,
        pointerFactorX: 0.24,
        pointerFactorY: 0.12,
      },
      {
        width: 22,
        height: 10,
        segmentsX: 132,
        segmentsY: 84,
        x: 2.2,
        y: -0.8,
        z: -7.2,
        rx: -0.54,
        ry: -0.34,
        rz: 0.18,
        color: 0xf3c382,
        opacity: 0.09,
        strengthA: 0.48,
        strengthB: 0.22,
        speedA: 0.35,
        speedB: 0.2,
        phase: 1.4,
        drift: 0.9,
        pointerFactorX: 0.18,
        pointerFactorY: 0.1,
      },
      {
        width: 28,
        height: 12,
        segmentsX: 120,
        segmentsY: 76,
        x: 0.4,
        y: 0.2,
        z: -11.5,
        rx: -0.42,
        ry: 0.12,
        rz: -0.06,
        color: 0x99cdd8,
        opacity: 0.08,
        strengthA: 0.42,
        strengthB: 0.18,
        speedA: 0.26,
        speedB: 0.16,
        phase: 2.2,
        drift: 0.4,
        pointerFactorX: 0.1,
        pointerFactorY: 0.06,
      },
    ];

    return configs.map((config) => createSilkMesh(config));
  }

  function createHaloLayers() {
    const items = [];

    const configs = [
      {
        radius: 6.8,
        tube: 0.045,
        color: 0x99cdd8,
        opacity: 0.07,
        x: 1.0,
        y: 1.3,
        z: -10.8,
        rx: 1.02,
        ry: 0.16,
        rz: 0.18,
      },
      {
        radius: 4.6,
        tube: 0.038,
        color: 0xdae813,
        opacity: 0.08,
        x: -0.6,
        y: 0.2,
        z: -6.2,
        rx: 0.94,
        ry: -0.18,
        rz: -0.32,
      },
    ];

    configs.forEach((config) => {
      const geometry = new THREE.TorusGeometry(config.radius, config.tube, 24, 220);
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
        baseX: config.x,
        baseY: config.y,
        speed: 0.08 + Math.random() * 0.04,
        drift: Math.random() * Math.PI * 2,
      };
      items.push(mesh);
    });

    return items;
  }

  function createGlowOrbs() {
    const items = [];

    const configs = [
      { size: 1.8, x: -5.8, y: 3.4, z: -9.4, color: 0xfed8d3, opacity: 0.08 },
      { size: 1.2, x: 5.2, y: -2.4, z: -8.8, color: 0xcf06c4, opacity: 0.05 },
      { size: 2.2, x: 1.2, y: 4.2, z: -14.6, color: 0x99cdd8, opacity: 0.05 },
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
        speed: 0.12 + Math.random() * 0.06,
        drift: Math.random() * Math.PI * 2,
      };
      items.push(mesh);
    });

    return items;
  }

  function updateSilkLayer(layer, elapsed) {
    const geometry = layer.geometry;
    const positionAttribute = geometry.attributes.position;
    const array = positionAttribute.array;
    const base = layer.mesh.userData.basePositions;

    const {
      strengthA,
      strengthB,
      speedA,
      speedB,
      phase,
      drift,
      baseY,
      pointerFactorX,
      pointerFactorY,
    } = layer.mesh.userData;

    for (let i = 0; i < array.length; i += 3) {
      const baseX = base[i];
      const baseYLocal = base[i + 1];
      const baseZ = base[i + 2];

      const ripple1 = Math.sin(baseX * 0.32 + elapsed * speedA + phase);
      const ripple2 = Math.cos(baseYLocal * 0.48 + elapsed * speedB + drift);
      const ripple3 = Math.sin((baseX + baseYLocal) * 0.18 + elapsed * 0.22 + phase);

      array[i] =
        baseX +
        ripple2 * strengthB * 0.26 +
        pointer.currentX * pointerFactorX * (1 + baseYLocal * 0.02);

      array[i + 1] =
        baseYLocal +
        ripple1 * strengthA * 0.22 +
        pointer.currentY * pointerFactorY;

      array[i + 2] =
        baseZ +
        ripple1 * strengthA +
        ripple2 * strengthB +
        ripple3 * 0.34;
    }

    positionAttribute.needsUpdate = true;
    layer.mesh.position.y = baseY + Math.sin(elapsed * 0.12 + phase) * 0.08;
  }

  function animate() {
    const elapsed = clock.getElapsedTime();

    pointer.currentX += (pointer.targetX - pointer.currentX) * 0.03;
    pointer.currentY += (pointer.targetY - pointer.currentY) * 0.03;

    camera.position.x = pointer.currentX * 0.65;
    camera.position.y = pointer.currentY * 0.42;
    camera.lookAt(pointer.currentX * 0.18, pointer.currentY * 0.12, -7);

    world.rotation.y = pointer.currentX * 0.035;
    world.rotation.x = pointer.currentY * 0.025;
    world.position.y = Math.sin(elapsed * 0.12) * 0.12;

    nearDust.points.rotation.y += prefersReducedMotion ? 0.00008 : 0.00024;
    nearDust.points.rotation.z += prefersReducedMotion ? 0.00004 : 0.00008;

    farDust.points.rotation.y -= prefersReducedMotion ? 0.00003 : 0.00008;
    blushDust.points.rotation.y += prefersReducedMotion ? 0.00003 : 0.00006;

    silkLayers.forEach((layer) => {
      updateSilkLayer(layer, elapsed);
    });

    haloLayers.forEach((halo, index) => {
      halo.rotation.x += 0.00015 + index * 0.00003;
      halo.rotation.y += 0.00022 + index * 0.00004;
      halo.position.y = halo.userData.baseY + Math.sin(elapsed * halo.userData.speed + halo.userData.drift) * 0.16;
      halo.position.x = halo.userData.baseX + pointer.currentX * (index === 0 ? 0.18 : 0.1);
    });

    glowOrbs.forEach((orb, index) => {
      orb.position.y = orb.userData.baseY + Math.sin(elapsed * orb.userData.speed + orb.userData.drift) * 0.22;
      orb.position.x = orb.userData.baseX + Math.cos(elapsed * orb.userData.speed + orb.userData.drift) * 0.14;
      orb.scale.setScalar(1 + Math.sin(elapsed * 0.18 + index) * 0.04);
    });

    renderer.render(scene, camera);
    animationFrameId = window.requestAnimationFrame(animate);
  }

  function handlePointerMove(event) {
    const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
    const normalizedY = (event.clientY / window.innerHeight) * 2 - 1;

    pointer.targetX = normalizedX * 0.8;
    pointer.targetY = -normalizedY * 0.45;
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  let animationFrameId = window.requestAnimationFrame(animate);

  window.addEventListener("mousemove", handlePointerMove, { passive: true });
  window.addEventListener("resize", handleResize);

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(animationFrameId);

    renderer.dispose();

    nearDust.geometry.dispose();
    nearDust.material.dispose();

    farDust.geometry.dispose();
    farDust.material.dispose();

    blushDust.geometry.dispose();
    blushDust.material.dispose();

    silkLayers.forEach((layer) => {
      layer.geometry.dispose();
      layer.material.dispose();
    });

    haloLayers.forEach((halo) => {
      halo.geometry.dispose();
      halo.material.dispose();
    });

    glowOrbs.forEach((orb) => {
      orb.geometry.dispose();
      orb.material.dispose();
    });
  });
}
