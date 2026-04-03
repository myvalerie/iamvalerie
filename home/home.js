import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeHeroScene();
});

function initializeHeroScene() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const heroVisual = canvas.closest(".hero-visual");
  if (!heroVisual) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 8.4);

  const pointer = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  };

  const clock = new THREE.Clock();

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
  scene.add(ambientLight);

  const pointLightA = new THREE.PointLight(0xffd7ea, 2.6, 18, 2);
  pointLightA.position.set(2.8, 1.8, 3.8);
  scene.add(pointLightA);

  const pointLightB = new THREE.PointLight(0xf6c58f, 2.1, 20, 2);
  pointLightB.position.set(-3.4, -1.8, 4.6);
  scene.add(pointLightB);

  const pointLightC = new THREE.PointLight(0xd9b8ff, 1.4, 16, 2);
  pointLightC.position.set(0.4, 2.6, 2.8);
  scene.add(pointLightC);

  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  const haloGroup = new THREE.Group();
  mainGroup.add(haloGroup);

  const orbMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xfff5f8,
    metalness: 0.18,
    roughness: 0.14,
    transmission: 0.28,
    transparent: true,
    opacity: 0.94,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    sheen: 0.8,
    sheenColor: new THREE.Color("#ffd8e8"),
    emissive: new THREE.Color("#f4c1d4"),
    emissiveIntensity: 0.2,
  });

  const orb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.28, 14),
    orbMaterial
  );
  mainGroup.add(orb);

  const wireOrb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.72, 2),
    new THREE.MeshBasicMaterial({
      color: 0xd69f72,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })
  );
  mainGroup.add(wireOrb);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xf0ba87,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
  });

  const ringOne = new THREE.Mesh(
    new THREE.TorusGeometry(2.08, 0.018, 18, 220),
    ringMaterial.clone()
  );
  ringOne.rotation.x = 0.9;
  ringOne.rotation.y = 0.28;
  haloGroup.add(ringOne);

  const ringTwo = new THREE.Mesh(
    new THREE.TorusGeometry(2.52, 0.018, 18, 220),
    ringMaterial.clone()
  );
  ringTwo.rotation.x = 1.18;
  ringTwo.rotation.y = -0.46;
  ringTwo.rotation.z = 0.55;
  ringTwo.material.opacity = 0.11;
  haloGroup.add(ringTwo);

  const ringThree = new THREE.Mesh(
    new THREE.TorusGeometry(3.04, 0.015, 18, 220),
    ringMaterial.clone()
  );
  ringThree.rotation.x = 0.38;
  ringThree.rotation.y = 0.72;
  ringThree.rotation.z = -0.22;
  ringThree.material.opacity = 0.08;
  haloGroup.add(ringThree);

  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 900;
  const starsPositions = new Float32Array(starsCount * 3);
  const starsSizes = new Float32Array(starsCount);

  for (let i = 0; i < starsCount; i += 1) {
    const i3 = i * 3;
    const radius = 3.6 + Math.random() * 3.2;
    const angle = Math.random() * Math.PI * 2;
    const spreadY = (Math.random() - 0.5) * 4.6;

    starsPositions[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.2;
    starsPositions[i3 + 1] = spreadY;
    starsPositions[i3 + 2] = (Math.random() - 0.5) * 4.6;
    starsSizes[i] = Math.random() * 1.8 + 0.4;
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starsPositions, 3)
  );
  starsGeometry.setAttribute(
    "size",
    new THREE.BufferAttribute(starsSizes, 1)
  );

  const starsMaterial = new THREE.PointsMaterial({
    color: 0xd5a478,
    size: 0.035,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const stars = new THREE.Points(starsGeometry, starsMaterial);
  stars.rotation.x = 0.22;
  mainGroup.add(stars);

  const blushGlow = new THREE.Mesh(
    new THREE.SphereGeometry(1.78, 40, 40),
    new THREE.MeshBasicMaterial({
      color: 0xffdce8,
      transparent: true,
      opacity: 0.08,
    })
  );
  mainGroup.add(blushGlow);

  const lavenderGlow = new THREE.Mesh(
    new THREE.SphereGeometry(2.32, 40, 40),
    new THREE.MeshBasicMaterial({
      color: 0xe1c7ff,
      transparent: true,
      opacity: 0.045,
    })
  );
  mainGroup.add(lavenderGlow);

  const dustGroup = new THREE.Group();
  scene.add(dustGroup);

  const dustGeometry = new THREE.BufferGeometry();
  const dustCount = 220;
  const dustPositions = new Float32Array(dustCount * 3);

  for (let i = 0; i < dustCount; i += 1) {
    const i3 = i * 3;
    dustPositions[i3] = (Math.random() - 0.5) * 11;
    dustPositions[i3 + 1] = (Math.random() - 0.5) * 6.8;
    dustPositions[i3 + 2] = (Math.random() - 0.5) * 5.2;
  }

  dustGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(dustPositions, 3)
  );

  const dustMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.018,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const dust = new THREE.Points(dustGeometry, dustMaterial);
  dustGroup.add(dust);

  function resizeScene() {
    const width = heroVisual.clientWidth;
    const height = heroVisual.clientHeight;

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function onPointerMove(event) {
    const rect = heroVisual.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    pointer.targetX = x;
    pointer.targetY = y;
  }

  function onPointerLeave() {
    pointer.targetX = 0;
    pointer.targetY = 0;
  }

  heroVisual.addEventListener("mousemove", onPointerMove);
  heroVisual.addEventListener("mouseleave", onPointerLeave);
  window.addEventListener("resize", resizeScene);

  let animationFrameId = null;
  let destroyed = false;

  function animate() {
    if (destroyed) return;

    const elapsed = clock.getElapsedTime();

    pointer.x += (pointer.targetX - pointer.x) * 0.045;
    pointer.y += (pointer.targetY - pointer.y) * 0.045;

    mainGroup.rotation.y += 0.0016;
    mainGroup.rotation.x += 0.0007;

    mainGroup.rotation.y += pointer.x * 0.0018;
    mainGroup.rotation.x += -pointer.y * 0.0012;

    mainGroup.position.x = pointer.x * 0.35;
    mainGroup.position.y = pointer.y * 0.22;

    orb.rotation.x = elapsed * 0.22;
    orb.rotation.y = elapsed * 0.38;

    wireOrb.rotation.x = -elapsed * 0.1;
    wireOrb.rotation.y = elapsed * 0.18;
    wireOrb.rotation.z = elapsed * 0.08;

    ringOne.rotation.z = elapsed * 0.24;
    ringTwo.rotation.z = -elapsed * 0.14;
    ringThree.rotation.z = elapsed * 0.08;

    blushGlow.scale.setScalar(1 + Math.sin(elapsed * 0.9) * 0.03);
    lavenderGlow.scale.setScalar(1 + Math.cos(elapsed * 0.7) * 0.04);

    stars.rotation.y = elapsed * 0.03;
    stars.rotation.z = Math.sin(elapsed * 0.2) * 0.08;

    dustGroup.rotation.y = -elapsed * 0.02;
    dustGroup.rotation.x = Math.cos(elapsed * 0.16) * 0.04;
    dust.position.y = Math.sin(elapsed * 0.4) * 0.08;

    pointLightA.position.x = 2.8 + Math.cos(elapsed * 0.8) * 0.4;
    pointLightA.position.y = 1.8 + Math.sin(elapsed * 0.9) * 0.24;

    pointLightB.position.x = -3.4 + Math.sin(elapsed * 0.7) * 0.34;
    pointLightB.position.y = -1.8 + Math.cos(elapsed * 0.6) * 0.22;

    pointLightC.position.x = 0.4 + Math.sin(elapsed * 0.55) * 0.45;

    renderer.render(scene, camera);
    animationFrameId = window.requestAnimationFrame(animate);
  }

  resizeScene();
  animate();

  window.addEventListener("beforeunload", destroyScene);

  function destroyScene() {
    destroyed = true;

    heroVisual.removeEventListener("mousemove", onPointerMove);
    heroVisual.removeEventListener("mouseleave", onPointerLeave);
    window.removeEventListener("resize", resizeScene);
    window.removeEventListener("beforeunload", destroyScene);

    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
    }

    starsGeometry.dispose();
    starsMaterial.dispose();
    dustGeometry.dispose();
    dustMaterial.dispose();
    orb.geometry.dispose();
    orb.material.dispose();
    wireOrb.geometry.dispose();
    wireOrb.material.dispose();
    ringOne.geometry.dispose();
    ringOne.material.dispose();
    ringTwo.geometry.dispose();
    ringTwo.material.dispose();
    ringThree.geometry.dispose();
    ringThree.material.dispose();
    blushGlow.geometry.dispose();
    blushGlow.material.dispose();
    lavenderGlow.geometry.dispose();
    lavenderGlow.material.dispose();

    renderer.dispose();
  }
}
