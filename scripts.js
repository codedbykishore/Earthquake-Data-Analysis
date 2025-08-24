// scripts.js
// This file is an ES module that creates a rotating globe in #globe-container.
// Put this file next to index.html and run a local server to load it (http://localhost:8000).

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/controls/OrbitControls.js";

// Target container
const container = document.getElementById("globe-container");
if (!container) {
  console.warn("scripts.js: #globe-container not found.");
} else {
  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.style.display = "block";

  // Clear any previous content inside container then append canvas
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  // Scene & Camera
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xaaaaaa, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 3, 5);
  scene.add(dirLight);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 6);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.4;
  controls.enableZoom = false; /* Permanently disable zoom */

  // Earth texture (hosted)
  const textureLoader = new THREE.TextureLoader();
  const EARTH_TEXTURE_URL = "https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg";
  const earthTexture = textureLoader.load(EARTH_TEXTURE_URL);

  // Create globe
  const RADIUS = 2.0;
  const sphereGeo = new THREE.SphereGeometry(RADIUS, 64, 64);
  const sphereMat = new THREE.MeshPhongMaterial({
    map: earthTexture,
    shininess: 5
  });
  const globe = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(globe);

  // Optional subtle atmosphere (slightly larger, transparent)
  const atmosphereGeo = new THREE.SphereGeometry(RADIUS * 1.01, 48, 48);
  const atmosphereMat = new THREE.MeshBasicMaterial({
    color: 0x66aaff,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  scene.add(atmosphere);

  // Resize handler (keeps canvas sized to container)
  function resizeRendererToContainer() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  // Initial resize
  resizeRendererToContainer();

  // Observe size changes (handles responsive layout)
  const ro = new ResizeObserver(() => {
    resizeRendererToContainer();
  });
  ro.observe(container);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    // slow auto-rotation
    globe.rotation.y += 0.003;
    // update controls (damping)
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Clean up on page unload if needed (optional)
  window.addEventListener("unload", () => {
    ro.disconnect();
    renderer.dispose();
  });

  // Set initial globe position
  const heroGlobe = document.querySelector('.hero-globe');
  if (heroGlobe) {
    heroGlobe.classList.add('initial-position');
  }

  // Scroll-based animation
  function handleScroll() {
    const scrollPosition = window.scrollY;
    const triggerPosition = 200; // Adjust this value to control when the animation triggers

    if (heroGlobe) {
      if (scrollPosition > triggerPosition) {
        heroGlobe.classList.remove('initial-position');
        heroGlobe.classList.add('background-position');
      } else {
        heroGlobe.classList.remove('background-position');
        heroGlobe.classList.add('initial-position');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial call to set the initial state

  // --- Small note for you: ---
  // - To change texture, edit EARTH_TEXTURE_URL above.
  // - To change globe size, edit RADIUS.
  // - To add earthquake markers later, add code that converts lat/lon to 3D coords on this sphere and adds Meshes.
}
