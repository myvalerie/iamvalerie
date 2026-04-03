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

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.08);
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

  const palette = [
    new THREE.Color("#99CDD8"),
    new THREE.Color("#DAE813"),
    new THREE.Color("#FED8D3"),
    new THREE.Color("#F3C382"),
    new THREE.Color("#CF06C4"),
    new THREE.Color("#657166"),
  ];

  const nearParticles = createParticleField({
    count: 620,
    width: 16,
    height: 10,
    depth: 16,
    size: 0.06,
    opacity: 0.42,
    color: "#99CDD8",
  });

  const midParticles = createParticleField({
    count: 1450,
    width: 28,
    height: 16,
    depth: 36,
    size: 0.042,
    opacity: 0.24,
    color: "#F3C382",
  });

  const farParticles = createParticleField({
    count: 1850,
    width: 48,
    height: 28,
    depth: 70,
    size: 0.028,
    opacity: 0.12,
    color: "#FED8D3",
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

  const catMorph = createCatMorphField(880);
  world.add(catMorph.points);

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
      color: new THREE.Color(config.color),
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
      { radius: 4.8, tube: 0.045, x: 0.8, y: 1.2, z: -6.4, rx: 1.02, ry: 0.16, rz: 0.28, opacity: 0.11, color: "#99CDD8" },
      { radius: 7.2, tube: 0.032, x: -0.4, y: -0.2, z: -12.8, rx: 1.12, ry: -0.1, rz: -0.34, opacity: 0.08, color: "#CF06C4" },
      { radius: 9.6, tube: 0.024, x: 0.2, y: 0.6, z: -18.2, rx: 0.96, ry: 0.04, rz: 0.08, opacity: 0.05, color: "#F3C382" },
    ];

    return configs.map((config) => {
      const geometry = new THREE.TorusGeometry(config.radius, config.tube, 24, 220);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.color),
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
      { size: 1.8, x: -5.2, y: 3.0, z: -10.4, color: "#99CDD8", opacity: 0.06 },
      { size: 1.2, x: 5.2, y: -2.0, z: -8.8, color: "#CF06C4", opacity: 0.06 },
      { size: 2.4, x: 1.2, y: 4.0, z: -17.8, color: "#F3C382", opacity: 0.04 },
      { size: 1.1, x: -2.4, y: -3.2, z: -13.0, color: "#FED8D3", opacity: 0.04 },
    ];

    return configs.map((config) => {
      const geometry = new THREE.SphereGeometry(config.size, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.color),
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

    for (let i = 0; i < 30; i += 1) {
      const color = palette[i % palette.length];
      const material = new THREE.MeshBasicMaterial({
        color: color.clone(),
        transparent: true,
        opacity: i % 6 === 1 ? 0.26 : 0.2,
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

  function buildCatOutlinePoints(totalPoints) {
    const points = [];

    function addCurve(curvePoints, samples) {
      for (let i = 0; i < samples; i += 1) {
        const t = i / (samples - 1);
        const p = curvePoints.getPoint(t);
        points.push(p);
      }
    }

    const leftEar = new THREE.QuadraticBezierCurve(
      new THREE.Vector2(-1.65, 0.9),
      new THREE.Vector2(-1.45, 1.55),
      new THREE.Vector2(-1.02, 1.02)
    );

    const headTop = new THREE.CubicBezierCurve(
      new THREE.Vector2(-1.02, 1.02),
      new THREE.Vector2(-0.48, 1.32),
      new THREE.Vector2(0.15, 1.28),
      new THREE.Vector2(0.6, 0.96)
    );

    const rightEar = new THREE.QuadraticBezierCurve(
      new THREE.Vector2(0.6, 0.96),
      new THREE.Vector2(1.0, 1.56),
      new THREE.Vector2(1.22, 0.9)
    );

    const faceFront = new THREE.CubicBezierCurve(
      new THREE.Vector2(1.22, 0.9),
      new THREE.Vector2(1.42, 0.52),
      new THREE.Vector2(1.32, 0.16),
      new THREE.Vector2(1.08, -0.06)
    );

    const chest = new THREE.CubicBezierCurve(
      new THREE.Vector2(1.08, -0.06),
      new THREE.Vector2(0.88, -0.34),
      new THREE.Vector2(0.72, -0.72),
      new THREE.Vector2(0.24, -1.22)
    );

    const back = new THREE.CubicBezierCurve(
      new THREE.Vector2(0.24, -1.22),
      new THREE.Vector2(-0.42, -1.1),
      new THREE.Vector2(-1.08, -0.66),
      new THREE.Vector2(-1.54, -0.08)
    );

    const neckInner = new THREE.CubicBezierCurve(
      new THREE.Vector2(-0.35, 0.54),
      new THREE.Vector2(0.02, 0.36),
      new THREE.Vector2(0.42, 0.24),
      new THREE.Vector2(0.86, 0.02)
    );

    const tail = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-1.5, -0.08, 0),
      new THREE.Vector3(-2.45, 0.28, 0),
      new THREE.Vector3(-2.05, 1.5, 0),
      new THREE.Vector3(-0.94, 1.72, 0)
    );

    addCurve(leftEar, 95);
    addCurve(headTop, 130);
    addCurve(rightEar, 95);
    addCurve(faceFront, 110);
    addCurve(chest, 120);
    addCurve(back, 120);
    addCurve(neckInner, 80);

    for (let i = 0; i < 130; i += 1) {
      const t = i / 129;
      const p = tail.getPoint(t);
      points.push(new THREE.Vector2(p.x, p.y));
    }

    const fillers = [];
    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];
      if (i % 3 === 0) {
        fillers.push(new THREE.Vector2(p.x * 0.82, p.y * 0.82));
      }
      if (i % 5 === 0) {
        fillers.push(new THREE.Vector2(p.x * 0.62, p.y * 0.62));
      }
    }

    const merged = points.concat(fillers);

    while (merged.length < totalPoints) {
      const source = merged[Math.floor(Math.random() * merged.length)];
      merged.push(
        new THREE.Vector2(
          source.x + (Math.random() - 0.5) * 0.08,
          source.y + (Math.random() - 0.5) * 0.08
        )
      );
    }

    return merged.slice(0, totalPoints);
  }

  function createCatMorphField(count) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);

    const outlinePoints = buildCatOutlinePoints(count);

    for (let i = 0; i < count; i += 1) {
      const freeX = (Math.random() - 0.5) * 6.8;
      const freeY = (Math.random() - 0.5) * 4.8;
      const freeZ = -2 - Math.random() * 4.4;

      positions[i * 3] = freeX;
      positions[i * 3 + 1] = freeY;
      positions[i * 3 + 2] = freeZ;

      basePositions[i * 3] = freeX;
      basePositions[i * 3 + 1] = freeY;
      basePositions[i * 3 + 2] = freeZ;

      const outline = outlinePoints[i];
      targetPositions[i * 3] = outline.x * 1.36;
      targetPositions[i * 3 + 1] = outline.y * 1.36;
      targetPositions[i * 3 + 2] = -3.2 + (Math.random() - 0.5) * 0.6;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color("#99CDD8"),
      size: 0.072,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    points.position.set(0.2, 0.2, -1.2);

    return {
      geometry,
      material,
      points,
      basePositions,
      targetPositions,
      count,
    };
  }

  function getCyclingColors(elapsed) {
    const t1 = (Math.sin(elapsed * 0.10) + 1) / 2;
    const t2 = (Math.sin(elapsed * 0.07 + 1.8) + 1) / 2;
    const t3 = (Math.sin(elapsed * 0.05 + 3.2) + 1) / 2;

    const colorA = new THREE.Color().copy(palette[0]).lerp(palette[4], t1).lerp(palette[2], t2 * 0.22);
    const colorB = new THREE.Color().copy(palette[3]).lerp(palette[1], t2 * 0.55).lerp(palette[4], t1 * 0.25);
    const colorC = new THREE.Color().copy(palette[2]).lerp(palette[0], t3 * 0.6).lerp(palette[5], 0.12);

    return { colorA, colorB, colorC };
  }

  function updateCatMorph(elapsed, colorA, colorB, colorC) {
    const morphCycle = 18.0;
    const phase = elapsed % morphCycle;

    let morphStrength = 0;

    if (phase < 5.5) {
      morphStrength = 0;
    } else if (phase < 8.8) {
      morphStrength = (phase - 5.5) / 3.3;
    } else if (phase < 11.6) {
      morphStrength = 1;
    } else if (phase < 15.4) {
      morphStrength = 1 - (phase - 11.6) / 3.8;
    } else {
      morphStrength = 0;
    }

    const positionAttribute = catMorph.geometry.attributes.position;
    const array = positionAttribute.array;

    for (let i = 0; i < catMorph.count; i += 1) {
      const baseX = catMorph.basePositions[i * 3];
      const baseY = catMorph.basePositions[i * 3 + 1];
      const baseZ = catMorph.basePositions[i * 3 + 2];

      const targetX = catMorph.targetPositions[i * 3];
      const targetY = catMorph.targetPositions[i * 3 + 1];
      const targetZ = catMorph.targetPositions[i * 3 + 2];

      const driftX = Math.sin(elapsed * 0.6 + i * 0.037) * 0.08;
      const driftY = Math.cos(elapsed * 0.54 + i * 0.041) * 0.08;
      const driftZ = Math.sin(elapsed * 0.42 + i * 0.029) * 0.05;

      const freeX = baseX + driftX;
      const freeY = baseY + driftY;
      const freeZ = baseZ + driftZ;

      array[i * 3] =
        freeX * (1 - morphStrength) +
        (targetX + pointer.x * 0.26) * morphStrength;

      array[i * 3 + 1] =
        freeY * (1 - morphStrength) +
        (targetY + pointer.y * 0.18) * morphStrength;

      array[i * 3 + 2] =
        freeZ * (1 - morphStrength) +
        targetZ * morphStrength;
    }

    positionAttribute.needsUpdate = true;

    const blendColor = colorA.clone().lerp(colorB, 0.45).lerp(colorC, 0.2);
    catMorph.material.color.copy(blendColor);
    catMorph.material.opacity = 0.24 + morphStrength * 0.58;
    catMorph.material.size = 0.058 + morphStrength * 0.022;

    catMorph.points.rotation.z = Math.sin(elapsed * 0.08) * 0.05;
    catMorph.points.rotation.y = pointer.x * 0.08;
  }

  function animate() {
    const elapsed = clock.getElapsedTime();

    pointer.x += (pointer.targetX - pointer.x) * 0.035;
    pointer.y += (pointer.targetY - pointer.y) * 0.035;

    const { colorA, colorB, colorC } = getCyclingColors(elapsed);

    nearParticles.material.color.copy(colorA);
    midParticles.material.color.copy(colorB);
    farParticles.material.color.copy(colorC);

    arcRings[0].material.color.copy(colorA);
    arcRings[1].material.color.copy(colorB);
    arcRings[2].material.color.copy(colorC);

    glowSpheres[0].material.color.copy(colorA);
    glowSpheres[1].material.color.copy(colorB);
    glowSpheres[2].material.color.copy(colorC);
    glowSpheres[3].material.color.copy(palette[2]);

    structuralNodes.forEach((mesh, index) => {
      if (index % 6 === 0) mesh.material.color.copy(colorA);
      else if (index % 6 === 1) mesh.material.color.copy(palette[1]);
      else if (index % 6 === 2) mesh.material.color.copy(palette[2]);
      else if (index % 6 === 3) mesh.material.color.copy(colorB);
      else if (index % 6 === 4) mesh.material.color.copy(colorC);
      else mesh.material.color.copy(palette[5]);
    });

    updateCatMorph(elapsed, colorA, colorB, colorC);

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

    catMorph.geometry.dispose();
    catMorph.material.dispose();
  });
}
