import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Leaf3DCanvasProps {
  onLoaded?: () => void;
}

export const Leaf3DCanvas: React.FC<Leaf3DCanvasProps> = ({ onLoaded }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check for user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // WebGL support check
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        if (onLoaded) onLoaded();
        return;
      }
    } catch {
      setHasWebGL(false);
      if (onLoaded) onLoaded();
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b291e, 0.04);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // 2. High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Ultra-HD Procedural Texture Generation (2048 x 2048)
    const createLeafTexture = () => {
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 2048;
      texCanvas.height = 2048;
      const ctx = texCanvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      // Botanical Chlorophyll Base Gradient
      const baseGrad = ctx.createLinearGradient(0, 0, 2048, 2048);
      baseGrad.addColorStop(0, '#176B45'); // Vibrant Rich Emerald
      baseGrad.addColorStop(0.25, '#123D2A'); // Deep Forest Green
      baseGrad.addColorStop(0.65, '#1A5F3C'); // Lush Leaf Green
      baseGrad.addColorStop(1, '#0B291E'); // Dark Botanical Base
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, 2048, 2048);

      // Organic Translucent Leaf Margin Glow
      const edgeGrad = ctx.createRadialGradient(1024, 1024, 600, 1024, 1024, 1020);
      edgeGrad.addColorStop(0, 'rgba(0,0,0,0)');
      edgeGrad.addColorStop(0.8, 'rgba(168, 191, 160, 0.08)');
      edgeGrad.addColorStop(1, 'rgba(220, 232, 213, 0.22)');
      ctx.fillStyle = edgeGrad;
      ctx.fillRect(0, 0, 2048, 2048);

      // Micro-grain cell structure simulation
      const imgData = ctx.getImageData(0, 0, 2048, 2048);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 16) {
        const noise = (Math.random() - 0.5) * 14;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 1.3));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.8));
      }
      ctx.putImageData(imgData, 0, 0);

      // Finely Articulated Lateral Banana-Leaf Veins
      const midX = 1024;
      ctx.lineWidth = 2.2;
      for (let y = 80; y < 1960; y += 12) {
        const veinAlpha = 0.2 + (Math.sin(y * 0.05) * 0.08);
        ctx.strokeStyle = `rgba(168, 191, 160, ${veinAlpha})`;

        // Left Lateral Vein
        ctx.beginPath();
        ctx.moveTo(midX, y);
        const cpX1 = midX - 380;
        const cpY1 = y - 40;
        const endX1 = 120 + Math.random() * 60;
        const endY1 = y - 75;
        ctx.quadraticCurveTo(cpX1, cpY1, endX1, endY1);
        ctx.stroke();

        // Right Lateral Vein
        ctx.beginPath();
        ctx.moveTo(midX, y);
        const cpX2 = midX + 380;
        const cpY2 = y - 40;
        const endX2 = 1928 - Math.random() * 60;
        const endY2 = y - 75;
        ctx.quadraticCurveTo(cpX2, cpY2, endX2, endY2);
        ctx.stroke();
      }

      // Strong Central Spine / Midrib (Petiole)
      const midribGrad = ctx.createLinearGradient(980, 0, 1068, 0);
      midribGrad.addColorStop(0, 'rgba(11, 41, 30, 0.9)');
      midribGrad.addColorStop(0.3, 'rgba(49, 94, 67, 0.95)');
      midribGrad.addColorStop(0.5, 'rgba(197, 164, 109, 0.85)'); // Golden vein highlight
      midribGrad.addColorStop(0.7, 'rgba(49, 94, 67, 0.95)');
      midribGrad.addColorStop(1, 'rgba(11, 41, 30, 0.9)');
      ctx.fillStyle = midribGrad;
      ctx.fillRect(1008, 40, 32, 1968);

      // Fine golden highlight running down spine
      ctx.strokeStyle = 'rgba(248, 246, 238, 0.55)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(1024, 40);
      ctx.lineTo(1024, 2000);
      ctx.stroke();

      const texture = new THREE.CanvasTexture(texCanvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    };

    // Bump Map for tactile surface relief
    const createBumpMap = () => {
      const bCanvas = document.createElement('canvas');
      bCanvas.width = 1024;
      bCanvas.height = 1024;
      const bCtx = bCanvas.getContext('2d');
      if (!bCtx) return new THREE.Texture();

      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, 1024, 1024);

      // Spine protrusion
      bCtx.fillStyle = '#ffffff';
      bCtx.fillRect(500, 0, 24, 1024);

      // Lateral veins in relief
      bCtx.strokeStyle = '#d0d0d0';
      bCtx.lineWidth = 2.5;
      for (let y = 16; y < 1010; y += 14) {
        bCtx.beginPath();
        bCtx.moveTo(512, y);
        bCtx.lineTo(30, y - 40);
        bCtx.moveTo(512, y);
        bCtx.lineTo(994, y - 40);
        bCtx.stroke();
      }

      return new THREE.CanvasTexture(bCanvas);
    };

    const leafColorTex = createLeafTexture();
    const leafBumpTex = createBumpMap();

    // 4. Realistic Parametric Banana Leaf 3D Mesh
    const uSegments = 64;
    const vSegments = 48;
    const leafGeom = new THREE.BufferGeometry();
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const length = 5.6; // leaf height in 3D units

    for (let i = 0; i <= uSegments; i++) {
      const u = i / uSegments; // 0 (stem base) to 1 (pointed apex)
      const y = (u - 0.5) * length;

      // Realistic leaf outline curve (tapered base, full body, pointed apex)
      let widthFactor = Math.sin(u * Math.PI);
      widthFactor = Math.pow(widthFactor, 0.65) * (1.0 - 0.28 * u);
      const halfWidth = 1.95 * widthFactor;

      // Spine longitudinal arching
      const stemArch = Math.sin(u * Math.PI) * 0.48 - (u - 0.5) * 0.3;

      for (let j = 0; j <= vSegments; j++) {
        const v = j / vSegments; // 0 (left edge) to 1 (right edge)
        const vOffset = (v - 0.5) * 2; // -1 to 1

        const x = vOffset * halfWidth;

        // Realistic transverse downward curl (trough in center, drooping edges)
        const crossCurl = -Math.pow(Math.abs(vOffset), 1.75) * (0.38 + 0.22 * Math.sin(u * Math.PI));

        // Subtle organic ripples along outer margins
        const edgeRipple = Math.sin(vOffset * 7.5 + u * 11.0) * 0.05 * Math.pow(Math.abs(vOffset), 1.5);

        const z = stemArch + crossCurl + edgeRipple;

        positions.push(x, y, z);
        uvs.push(v, u);
      }
    }

    for (let i = 0; i < uSegments; i++) {
      for (let j = 0; j < vSegments; j++) {
        const a = i * (vSegments + 1) + j;
        const b = (i + 1) * (vSegments + 1) + j;
        const c = (i + 1) * (vSegments + 1) + (j + 1);
        const d = i * (vSegments + 1) + (j + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    leafGeom.setIndex(indices);
    leafGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    leafGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    leafGeom.computeVertexNormals();

    // 5. Waxy High-End Physical Material
    const leafMaterial = new THREE.MeshPhysicalMaterial({
      map: leafColorTex,
      bumpMap: leafBumpTex,
      bumpScale: 0.05,
      roughness: 0.34,
      metalness: 0.05,
      clearcoat: 0.85, // Waxy dew gloss
      clearcoatRoughness: 0.14,
      transmission: 0.16, // Light filtering through leaf
      thickness: 0.35,
      side: THREE.DoubleSide,
      shadowSide: THREE.DoubleSide,
    });

    const leafMesh = new THREE.Mesh(leafGeom, leafMaterial);
    leafMesh.castShadow = true;
    leafMesh.receiveShadow = true;

    // Raised Midrib Spine Geometry
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -length * 0.58, -0.25),
      new THREE.Vector3(0, -length * 0.3, 0.16),
      new THREE.Vector3(0, 0, 0.44),
      new THREE.Vector3(0, length * 0.3, 0.28),
      new THREE.Vector3(0, length * 0.52, -0.05),
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 48, 0.05, 10, false);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x315e43,
      roughness: 0.3,
      metalness: 0.1,
    });
    const stemMesh = new THREE.Mesh(stemGeom, stemMat);
    stemMesh.castShadow = true;

    // Leaf Assembly Group
    const leafGroup = new THREE.Group();
    leafGroup.add(leafMesh);
    leafGroup.add(stemMesh);

    // 6. Water Droplets with Realistic Glass Refraction
    const dropletMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      opacity: 1,
      transparent: true,
      roughness: 0.02,
      ior: 1.333, // True refractive index of pure water!
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
    });

    const dropletPositions = [
      { x: 0.45, y: 0.75, z: 0.34, r: 0.09 },
      { x: 0.62, y: 0.6, z: 0.28, r: 0.055 },
      { x: -0.65, y: -0.45, z: 0.24, r: 0.095 },
      { x: -0.78, y: -0.32, z: 0.18, r: 0.06 },
      { x: 0.18, y: -1.2, z: 0.16, r: 0.075 },
      { x: -0.32, y: 1.35, z: 0.26, r: 0.08 },
      { x: 0.85, y: -0.25, z: 0.12, r: 0.07 },
      { x: -0.08, y: 0.22, z: 0.42, r: 0.12 }, // Hero sparkling central droplet
      { x: 0.28, y: 1.8, z: 0.18, r: 0.05 },
    ];

    const dropGeoms: THREE.BufferGeometry[] = [];
    dropletPositions.forEach((pos) => {
      const dropGeom = new THREE.SphereGeometry(pos.r, 20, 20);
      dropGeoms.push(dropGeom);
      dropGeom.scale(1, 1, 0.6); // slight flatten
      const dropMesh = new THREE.Mesh(dropGeom, dropletMat);
      dropMesh.position.set(pos.x, pos.y, pos.z);
      dropMesh.castShadow = true;
      leafGroup.add(dropMesh);
    });

    // Initial position & scale for dramatic entrance
    leafGroup.scale.set(0.04, 0.04, 0.04);
    leafGroup.rotation.set(0.6, -0.8, 0.35);
    scene.add(leafGroup);

    // 7. Cinematic Lighting Rig
    // Warm morning golden sun
    const sunLight = new THREE.DirectionalLight(0xfffaea, 3.2);
    sunLight.position.set(6, 8, 7);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0008;
    scene.add(sunLight);

    // Emerald ambient fill
    const ambientLight = new THREE.AmbientLight(0x123D2A, 2.0);
    scene.add(ambientLight);

    // Golden rim light for leaf silhouette
    const rimLight = new THREE.DirectionalLight(0xC5A46D, 2.5);
    rimLight.position.set(-7, -4, -4);
    scene.add(rimLight);

    // Subtle coastal water bounce
    const waterBounce = new THREE.PointLight(0xA8BFA0, 1.4, 20);
    waterBounce.position.set(0, -5, 5);
    scene.add(waterBounce);

    // 8. Floating Dew Bokeh Particles
    const particleCount = 75;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount * 3; p += 3) {
      particlePositions[p] = (Math.random() - 0.5) * 14;
      particlePositions[p + 1] = (Math.random() - 0.5) * 12;
      particlePositions[p + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xC5A46D,
      size: 0.045,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 9. Interactive Drag & Mouse Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const drag = { active: false, startX: 0, startY: 0, rotX: 0, rotY: 0, targetRotX: 0, targetRotY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      if (drag.active) {
        const deltaX = (e.clientX - drag.startX) * 0.005;
        const deltaY = (e.clientY - drag.startY) * 0.005;
        drag.targetRotY = drag.rotY + deltaX;
        drag.targetRotX = drag.rotX + deltaY;
      } else {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;
        mouse.targetX = normX * 0.45;
        mouse.targetY = normY * 0.35;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Allow drag on canvas container
      if ((e.target as HTMLElement).tagName === 'CANVAS') {
        drag.active = true;
        drag.startX = e.clientX;
        drag.startY = e.clientY;
        setIsInteracting(true);
      }
    };

    const handleMouseUp = () => {
      if (drag.active) {
        drag.active = false;
        drag.rotX = drag.targetRotX;
        drag.rotY = drag.targetRotY;
        setTimeout(() => setIsInteracting(false), 800);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // 10. GSAP ScrollTrigger Integration (Scroll Interaction)
    let scrollProgressObj = { value: 0 };

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        scrollProgressObj.value = self.progress;
      },
    });

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 11. Entrance Animation Sequence (Phase 1: Tiny -> Full Realistic 3D Leaf)
    const startTime = performance.now();
    const entranceDuration = 2.4; // 2.4 seconds smooth growth
    let entranceDone = false;

    if (onLoaded) onLoaded();

    // 12. Main 60FPS Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const elapsedSinceStart = (performance.now() - startTime) / 1000;

      // Mouse & Drag smoothing
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Drag decay back to home
      if (!drag.active) {
        drag.targetRotX *= 0.95;
        drag.targetRotY *= 0.95;
      }

      // Smooth cubic-out entrance growth
      const t = Math.min(elapsedSinceStart / entranceDuration, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      const isMobile = window.innerWidth < 768;
      const targetBaseScale = isMobile ? 0.8 : 1.18;
      const currentScale = 0.04 + (targetBaseScale - 0.04) * ease;

      // Scroll progression effects
      const sp = scrollProgressObj.value;
      const scrollScaleFactor = Math.max(0.3, 1 - sp * 0.38);

      leafGroup.scale.set(
        currentScale * scrollScaleFactor,
        currentScale * scrollScaleFactor,
        currentScale * scrollScaleFactor
      );

      // Organic gentle wind harmonic oscillations
      const windSwayX = prefersReducedMotion ? 0 : Math.sin(elapsedTime * 1.3) * 0.06;
      const windSwayY = prefersReducedMotion ? 0 : Math.cos(elapsedTime * 1.0) * 0.07;
      const windSwayZ = prefersReducedMotion ? 0 : Math.sin(elapsedTime * 1.6) * 0.05;
      const floatY = prefersReducedMotion ? 0 : Math.sin(elapsedTime * 1.4) * 0.16;

      // Scroll-based translation: glides gracefully towards the right side of the screen
      const scrollOffsetX = sp * 2.8;
      const scrollOffsetY = -sp * 1.4;
      const scrollRotationY = sp * 1.35;
      const scrollRotationZ = sp * 0.45;

      // Leaf position in 3D
      const basePosX = isMobile ? 0 : 0.85;
      leafGroup.position.x = basePosX + scrollOffsetX + mouse.x * 0.55;
      leafGroup.position.y = floatY + scrollOffsetY + mouse.y * 0.45;
      leafGroup.position.z = -sp * 1.6;

      // Leaf rotation in 3D
      leafGroup.rotation.x =
        0.3 * (1 - ease) + 0.14 + windSwayX + mouse.y * 0.22 + drag.targetRotX;
      leafGroup.rotation.y =
        -0.7 * (1 - ease) + 0.38 + windSwayY + scrollRotationY + mouse.x * 0.32 + drag.targetRotY;
      leafGroup.rotation.z =
        0.25 * (1 - ease) - 0.14 + windSwayZ - scrollRotationZ;

      // Slowly rotate dew particles
      particles.rotation.y = elapsedTime * 0.025;
      particles.rotation.x = elapsedTime * 0.012;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      scrollTriggerInstance.kill();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      leafGeom.dispose();
      leafMaterial.dispose();
      stemGeom.dispose();
      stemMat.dispose();
      dropGeoms.forEach((g) => g.dispose());
      dropletMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      leafColorTex.dispose();
      leafBumpTex.dispose();
    };
  }, [onLoaded]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full z-10 overflow-hidden cursor-grab active:cursor-grabbing"
      aria-label="3D Interactive Tropical Leaf Visualization"
    >
      {/* Interactive 3D Hint Pill */}
      <div className="absolute bottom-16 right-8 z-20 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#123D2A]/80 border border-[#176B45]/50 backdrop-blur-md text-[10px] uppercase tracking-widest text-[#DCE8D5]/80 select-none pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D] animate-ping" />
        <span>Drag to Inspect Leaf &bull; Scroll to Transition</span>
      </div>

      {!hasWebGL && (
        <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none">
          <img
            src="/assets/ila-kochi-logo-white.png"
            alt="ILA Leaf Symbol"
            className="w-72 h-72 object-contain animate-leaf-float drop-shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
