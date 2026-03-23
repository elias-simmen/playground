/* ===== THREE.JS 3D HERO SCENE ===== */
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // ── Scene & Camera ──
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.set(0, 0, 6);

  // ── Lights ──
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x6366f1, 8, 20);
  pointLight1.position.set(4, 4, 4);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x8b5cf6, 6, 20);
  pointLight2.position.set(-4, -3, 2);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0x06b6d4, 4, 15);
  pointLight3.position.set(0, -4, -4);
  scene.add(pointLight3);

  // ── Central torus knot ──
  const torusGeo = new THREE.TorusKnotGeometry(1.3, 0.38, 180, 24, 2, 3);
  const torusMat = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1,
    emissive: 0x3730a3,
    emissiveIntensity: 0.2,
  });
  const torusKnot = new THREE.Mesh(torusGeo, torusMat);
  scene.add(torusKnot);

  // Wireframe overlay on torus
  const wireGeo = new THREE.TorusKnotGeometry(1.32, 0.39, 80, 12, 2, 3);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x818cf8,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  const wireKnot = new THREE.Mesh(wireGeo, wireMat);
  scene.add(wireKnot);

  // ── Floating icosahedrons ──
  const floaters = [];
  const floaterData = [
    { scale: 0.28, orbitR: 3.2, speed: 0.41, phase: 0,       color: 0x6366f1 },
    { scale: 0.18, orbitR: 2.8, speed: 0.28, phase: 1.05,    color: 0x8b5cf6 },
    { scale: 0.22, orbitR: 3.6, speed: 0.35, phase: 2.09,    color: 0x06b6d4 },
    { scale: 0.15, orbitR: 2.4, speed: 0.52, phase: 3.14,    color: 0xec4899 },
    { scale: 0.20, orbitR: 3.0, speed: 0.31, phase: 4.19,    color: 0x10b981 },
    { scale: 0.12, orbitR: 2.6, speed: 0.44, phase: 5.24,    color: 0xf59e0b },
  ];

  floaterData.forEach(d => {
    const geo = new THREE.IcosahedronGeometry(1, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: d.color,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
      emissive: d.color,
      emissiveIntensity: 0.15,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.setScalar(d.scale);
    scene.add(mesh);
    floaters.push({ mesh, ...d });
  });

  // ── Large outer wireframe sphere ──
  const outerGeo = new THREE.IcosahedronGeometry(4.5, 2);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.04,
  });
  const outerSphere = new THREE.Mesh(outerGeo, outerMat);
  scene.add(outerSphere);

  // ── Particle field ──
  const particleCount = 1200;
  const positions = new Float32Array(particleCount * 3);
  const pColors = new Float32Array(particleCount * 3);
  const colorOptions = [
    new THREE.Color(0x6366f1),
    new THREE.Color(0x8b5cf6),
    new THREE.Color(0x06b6d4),
    new THREE.Color(0xec4899),
  ];
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 3.5 + Math.random() * 5;
    positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);
    const c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    pColors[i*3] = c.r; pColors[i*3+1] = c.g; pColors[i*3+2] = c.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });
  const pointCloud = new THREE.Points(pGeo, pMat);
  scene.add(pointCloud);

  // ── Rings ──
  const ringGroup = new THREE.Group();
  [1.9, 2.4, 2.9].forEach((r, i) => {
    const rGeo = new THREE.TorusGeometry(r, 0.008, 8, 120);
    const rMat = new THREE.MeshBasicMaterial({
      color: [0x6366f1, 0x8b5cf6, 0x06b6d4][i],
      transparent: true,
      opacity: 0.25,
    });
    const ring = new THREE.Mesh(rGeo, rMat);
    ring.rotation.x = (i * Math.PI) / 4;
    ring.rotation.y = (i * Math.PI) / 6;
    ringGroup.add(ring);
  });
  scene.add(ringGroup);

  // ── Mouse parallax ──
  let targetRotX = 0, targetRotY = 0;
  let currentRotX = 0, currentRotY = 0;

  window.addEventListener('mousemove', e => {
    targetRotY =  ((e.clientX / window.innerWidth)  - 0.5) * 0.8;
    targetRotX = -((e.clientY / window.innerHeight) - 0.5) * 0.5;
  });

  // ── Scroll fade ──
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  // ── Resize ──
  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // ── Animation loop ──
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Scroll-based opacity (fade as user scrolls down)
    const heroH = document.getElementById('hero')?.offsetHeight || window.innerHeight;
    const opacity = Math.max(0, 1 - scrollY / (heroH * 0.6));
    renderer.domElement.style.opacity = opacity;
    if (opacity <= 0) return;

    // Smooth camera parallax
    currentRotX += (targetRotX - currentRotX) * 0.05;
    currentRotY += (targetRotY - currentRotY) * 0.05;
    scene.rotation.x = currentRotX;
    scene.rotation.y = currentRotY;

    // Main torus rotation
    torusKnot.rotation.x = t * 0.18;
    torusKnot.rotation.y = t * 0.12;
    wireKnot.rotation.x  = t * 0.18;
    wireKnot.rotation.y  = t * 0.12;

    // Morph torus scale with breathing
    const breathe = 1 + Math.sin(t * 0.9) * 0.03;
    torusKnot.scale.setScalar(breathe);
    wireKnot.scale.setScalar(breathe);

    // Outer sphere slow rotation
    outerSphere.rotation.y = t * 0.03;
    outerSphere.rotation.x = t * 0.015;

    // Rings
    ringGroup.rotation.y = t * 0.08;
    ringGroup.rotation.x = t * 0.05;

    // Particle rotation
    pointCloud.rotation.y = t * 0.015;
    pointCloud.rotation.x = t * 0.007;

    // Floaters orbit
    floaters.forEach(f => {
      const angle = t * f.speed + f.phase;
      f.mesh.position.x = Math.cos(angle) * f.orbitR;
      f.mesh.position.y = Math.sin(angle * 0.7) * f.orbitR * 0.5;
      f.mesh.position.z = Math.sin(angle) * f.orbitR * 0.6;
      f.mesh.rotation.x = t * 0.8;
      f.mesh.rotation.y = t * 0.6;
    });

    // Animate lights
    pointLight1.position.x = Math.sin(t * 0.4) * 5;
    pointLight1.position.y = Math.cos(t * 0.3) * 5;
    pointLight2.position.x = Math.cos(t * 0.35) * 5;
    pointLight2.position.z = Math.sin(t * 0.25) * 5;

    renderer.render(scene, camera);
  }
  animate();
})();
