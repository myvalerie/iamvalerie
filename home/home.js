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
  scene.fog = new THREE.FogExp2(0x080c17, 0.028);

  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    220
  );
  camera.position.set(0, 0.2, 18);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(ambientLight);

  const pointLightA = new THREE.PointLight(0x99cdd8, 2.8, 90, 2);
  pointLightA.position.set(-10, 4, 8);
  scene.add(pointLightA);

  const pointLightB = new THREE.PointLight(0xcf06c4, 2.2, 80, 2);
  pointLightB.position.set(8, -2, 10);
  scene.add(pointLightB);

  const pointLightC = new THREE.PointLight(0xf3c382, 1.8, 90, 2);
  pointLightC.position.set(0, -8, 14);
  scene.add(pointLightC);

  const world = new THREE.Group();
  scene.add(world);

  const pointer = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  };

  const clock = new THREE.Clock();

  const colorState = {
    hue: 192,
  };

  const nearParticles = createParticleField({
    count: 520,
    width: 16,
    height: 10,
    depth: 16,
    size: 0.06,
    opacity: 0.42,
  });

  const midParticles = createParticleField({
    count: 1300,
    width: 28,
    height: 16,
    depth: 36,
    size: 0.042,
    opacity: 0.24,
  });

  const farParticles = createParticleField({
    count: 1700,
    width: 48,
    height: 28,
    depth: 70,
    size: 0.028,
    opacity: 0.12,
  });

  world.add(nearParticles.points);
  world.add(midParticles.points);
  world.add(farParticles.points);

  const arcRings = createArcRings();
  arcRings.forEach((mesh) => world.add(mesh));

  const glowSpheres = createGlowSpheres();
  glowSpheres.forEach((mesh) => world.add(mesh));

  const structuralNodes = createStructuralNodes();
  structuralNodes.forEach((mesh) => world.add(mesh));

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
      color: 0x99cdd8,
      size: config.size,
      transparent: true,
      opacity: config.opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);

    return { geometry, material, points };
  }

  function createArcRings() {
    const configs = [
      { radius: 4.8, tube: 0.045, x: 0.8, y: 1.2, z: -6.4, rx: 1.02, ry: 0.16, rz: 0.28, opacity: 0.11 },
      { radius: 7.2, tube: 0.032, x: -0.4, y: -0.2, z: -12.8, rx: 1.12, ry: -0.1, rz: -0.34, opacity: 0.08 },
      { radius: 9.6, tube: 0.024, x: 0.2, y: 0.6, z: -18.2, rx: 0.96, ry: 0.04, rz: 0.08, opacity: 0.05 },
    ];

    return configs.map((config, index) => {
      const geometry = new THREE.TorusGeometry(config.radius, config.tube, 24, 220);
      const material = new THREE.MeshBasicMaterial({
        color: index === 0 ? 0x99cdd8 : index === 1 ? 0xcf06c4 : 0xf3c382,
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
        speedX: (Math.random() * 0.04 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        speedY: (Math.random() * 0.04 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
      };
      return mesh;
    });
  }

  function createGlowSpheres() {
    const configs = [
      { size: 1.8, x: -5.2, y: 3.0, z: -10.4, color: 0x99cdd8, opacity: 0.06 },
      { size: 1.2, x: 5.2, y: -2.0, z: -8.8, color: 0xcf06c4, opacity: 0.06 },
      { size: 2.4, x: 1.2, y: 4.0, z: -17.8, color: 0xf3c382, opacity: 0.04 },
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
        baseX: config.x,
        baseY: config.y,
        speed: 0.12 + Math.random() * 0.08,
        drift: Math.random() * Math.PI * 2,
      };
      return mesh;
    });
  }

  function createStructuralNodes() {
    const items = [];
    const geometry = new THREE.IcosahedronGeometry(0.09, 0);

    for (let i = 0; i < 28; i += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0xdae813 : i % 3 === 1 ? 0x99cdd8 : 0xcf06c4,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 9,
        -4 - Math.random() * 18
      );
      mesh.scale.setScalar(Math.random() * 1.2 + 0.5);
      mesh.userData = {
        baseX: mesh.position.x,
        baseY: mesh.position.y,
        speed: 0.18 + Math.random() * 0.14,
        drift: Math.random() * Math.PI * 2,
      };
      items.push(mesh);
    }

    return items;
  }

  function setHueShift(targetHue) {
    const hueA = ((targetHue % 360) + 360) % 360;
    const hueB = (hueA + 72) % 360;
    const hueC = (hueA + 140) % 360;

    const colorA = new THREE.Color().setHSL(hueA / 360, 0.72, 0.72);
    const colorB = new THREE.Color().setHSL(hueB / 360, 0.76, 0.58);
    const colorC = new THREE.Color().setHSL(hueC / 360, 0.78, 0.64);

    nearParticles.material.color.copy(colorC);
    midParticles.material.color.copy(colorA);
    farParticles.material.color.copy(colorB);

    arcRings[0].material.color.copy(colorA);
    arcRings[1].material.color.copy(colorB);
    arcRings[2].material.color.copy(colorC);

    glowSpheres[0].material.color.copy(colorA);
    glowSpheres[1].material.color.copy(colorB);
    glowSpheres[2].material.color.copy(colorC);

    structuralNodes.forEach((mesh, index) => {
      if (index % 3 === 0) {
        mesh.material.color.copy(colorA);
      } else if (index % 3 === 1) {
        mesh.material.color.copy(colorB);
      } else {
        mesh.material.color.copy(colorC);
      }
    });

    const root = document.documentElement;
    root.style.setProperty("--glow-dynamic-a", colorA.getStyle());
    root.style.setProperty("--glow-dynamic-b", colorB.getStyle());
    root.style.setProperty("--glow-dynamic-c", colorC.getStyle());
  }

  function animate() {
    const elapsed = clock.getElapsedTime();

    pointer.x += (pointer.targetX - pointer.x) * 0.035;
    pointer.y += (pointer.targetY - pointer.y) * 0.035;

    colorState.hue = 192 + Math.sin(elapsed * 0.08) * 42 + Math.cos(elapsed * 0.03) * 18;
    setHueShift(colorState.hue);

    camera.position.x = pointer.x * 0.85;
    camera.position.y = 0.2 + pointer.y * 0.5;
    camera.lookAt(pointer.x * 0.22, pointer.y * 0.14, -10);

    world.rotation.y = elapsed * 0.01 + pointer.x * 0.06;
    world.rotation.x = pointer.y * 0.025;
    world.position.y = Math.sin(elapsed * 0.16) * 0.12;

    nearParticles.points.rotation.y += prefersReducedMotion ? 0.00005 : 0.0002;
    nearParticles.points.rotation.z += prefersReducedMotion ? 0.00002 : 0.00008;

    midParticles.points.rotation.y -= prefersReducedMotion ? 0.00003 : 0.0001;
    farParticles.points.rotation.y += prefersReducedMotion ? 0.00001 : 0.00004;

    arcRings.forEach((mesh, index) => {
      mesh.rotation.x += mesh.userData.speedX * 0.0015;
      mesh.rotation.y += mesh.userData.speedY * 0.0015;
      mesh.position.x = mesh.userData.baseX + pointer.x * (0.18 - index * 0.04);
      mesh.position.y = mesh.userData.baseY + Math.sin(elapsed * (0.12 + index * 0.04)) * (0.12 - index * 0.02);
    });

    glowSpheres.forEach((mesh, index) => {
      mesh.position.x = mesh.userData.baseX + Math.sin(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.16;
      mesh.position.y = mesh.userData.baseY + Math.cos(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.18;
      mesh.scale.setScalar(1 + Math.sin(elapsed * 0.22 + index) * 0.06);
    });

    structuralNodes.forEach((mesh, index) => {
      mesh.position.x = mesh.userData.baseX + Math.sin(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.12;
      mesh.position.y = mesh.userData.baseY + Math.cos(elapsed * mesh.userData.speed + mesh.userData.drift) * 0.14;
      mesh.rotation.x += 0.006;
      mesh.rotation.y += 0.008 + index * 0.00005;
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

    nearParticles.geometry.dispose();
    nearParticles.material.dispose();

    midParticles.geometry.dispose();
    midParticles.material.dispose();

    farParticles.geometry.dispose();
    farParticles.material.dispose();

    arcRings.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });

    glowSpheres.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });

    structuralNodes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
  });
}
