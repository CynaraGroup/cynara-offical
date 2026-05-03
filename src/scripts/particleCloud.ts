import * as THREE from 'three';
import gsap from 'gsap';

type ParticleCloudWindow = Window &
  typeof globalThis & {
    particleCloudAbortController?: AbortController;
  };

const particleWindow = window as ParticleCloudWindow;
const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
const smoothstep = (value: number) => {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};
const animationModes = [
  {
    title: { zh: '柔和波浪', en: 'Soft Wave' },
    desc: { zh: '旗帜像布料一样轻轻起伏。', en: 'The flag gently moves like soft fabric.' },
  },
  {
    title: { zh: '呼吸展开', en: 'Breathing Bloom' },
    desc: { zh: '粒子随呼吸感向外舒展再回落。', en: 'Particles expand outward and settle back.' },
  },
  {
    title: { zh: '扫描涟漪', en: 'Scanning Ripple' },
    desc: { zh: '一束涟漪从旗面扫过。', en: 'A ripple beam scans across the flag.' },
  },
  {
    title: { zh: '粒子聚散', en: 'Particle Burst' },
    desc: { zh: '旗帜短暂散开，再重新聚合。', en: 'The flag disperses briefly, then reforms.' },
  },
  {
    title: { zh: '龙卷漩涡', en: 'Tornado Vortex' },
    desc: { zh: '粒子汇聚成螺旋上升的漩涡。', en: 'Particles converge into a rising spiral vortex.' },
  },
  {
    title: { zh: '双螺旋', en: 'DNA Helix' },
    desc: { zh: '旗帜扭转成双螺旋结构。', en: 'The flag twists into a double-helix shape.' },
  },
  {
    title: { zh: '心跳脉冲', en: 'Heartbeat Pulse' },
    desc: { zh: '粒子随心跳节奏扩散与收缩。', en: 'Particles pulse rhythmically like a heartbeat.' },
  },
  {
    title: { zh: '星系漩涡', en: 'Galaxy Spiral' },
    desc: { zh: '粒子沿旋臂轨道环绕运动。', en: 'Particles orbit along spiral galaxy arms.' },
  },
  {
    title: { zh: '能量球体', en: 'Energy Sphere' },
    desc: { zh: '粒子重组为一个旋转的3D能量球。', en: 'Particles reform into a spinning 3D energy sphere.' },
  },
  {
    title: { zh: '赛博矩阵', en: 'Cyber Matrix' },
    desc: { zh: '粒子对齐成数字化的三维网格结构。', en: 'Particles align into a digitized 3D grid structure.' },
  },
  {
    title: { zh: '流星坠落', en: 'Meteor Shower' },
    desc: { zh: '粒子化作流星阵列斜向划过空间。', en: 'Particles turn into meteors streaking diagonally across space.' },
  },
  {
    title: { zh: '时空隧道', en: 'Wormhole Tunnel' },
    desc: { zh: '粒子卷曲成穿越时空的圆柱隧道。', en: 'Particles curl into a cylindrical wormhole tunnel.' },
  },
];
const flagPresets = {
  trans: {
    colors: ['#5bcffb', '#f5a9b8', '#ffffff', '#f5a9b8', '#5bcffb'],
  },
  rainbow: {
    colors: ['#e40303', '#ff8c00', '#ffed00', '#008026', '#004dff', '#750787'],
  },
} as const;
type FlagName = keyof typeof flagPresets;

function initParticleCloud() {
  particleWindow.particleCloudAbortController?.abort();

  const container = document.querySelector<HTMLElement>('[data-particle-cloud]');
  if (!container) {
    return;
  }

  const abortController = new AbortController();
  particleWindow.particleCloudAbortController = abortController;
  const { signal } = abortController;
  const controls = document.querySelector<HTMLElement>('[data-particle-controls]');
  const resetButton = document.querySelector<HTMLButtonElement>('[data-particle-reset]');
  const flagButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-particle-flag]'));
  const prevButton = document.querySelector<HTMLButtonElement>('[data-particle-prev]');
  const nextButton = document.querySelector<HTMLButtonElement>('[data-particle-next]');
  const modeTitle = document.querySelector<HTMLElement>('[data-particle-mode-title]');
  const modeDesc = document.querySelector<HTMLElement>('[data-particle-mode-desc]');
  const lang = document.documentElement.lang === 'en' ? 'en' : 'zh';
  let currentMode = 0;
  let currentFlag: FlagName = 'trans';
  let modeStartedAt = 0;
  let flagSwitchedAt = 0;

  container.replaceChildren();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  const pointer = new THREE.Vector2();
  const previousPointer = new THREE.Vector2();
  const dragRotation = new THREE.Vector2();
  const dragVelocity = new THREE.Vector2();
  let isDragging = false;
  const clock = new THREE.Clock();
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const columns = isMobile ? 150 : 260;
  const rows = isMobile ? 90 : 150;
  const particleCount = columns * rows;
  const positions = new Float32Array(particleCount * 3);
  const basePositions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const seeds = new Float32Array(particleCount);
  const stripeColors = flagPresets.trans.colors.map((color) => new THREE.Color(color));
  let cursor = 0;

  for (let row = 0; row < rows; row += 1) {
    const yRatio = rows <= 1 ? 0 : row / (rows - 1);
    const stripeIndex = Math.min(stripeColors.length - 1, Math.floor(yRatio * stripeColors.length));
    const baseColor = stripeColors[stripeIndex];

    for (let column = 0; column < columns; column += 1) {
      const xRatio = columns <= 1 ? 0 : column / (columns - 1);
      const i3 = cursor * 3;
      const wave = Math.sin(xRatio * Math.PI * 6 + yRatio * Math.PI * 1.8) * 0.045;
      const edgeFalloff = Math.sin(xRatio * Math.PI) * 0.04;
      const shimmer = randomRange(0.92, 1.08);

      basePositions[i3] = (xRatio - 0.5) * 6.4 + randomRange(-0.008, 0.008);
      basePositions[i3 + 1] = (0.5 - yRatio) * 3.9 + randomRange(-0.008, 0.008);
      basePositions[i3 + 2] = wave + edgeFalloff + randomRange(-0.012, 0.012);
      positions[i3] = basePositions[i3];
      positions[i3 + 1] = basePositions[i3 + 1];
      positions[i3 + 2] = basePositions[i3 + 2];
      colors[i3] = Math.min(1, baseColor.r * shimmer);
      colors[i3 + 1] = Math.min(1, baseColor.g * shimmer);
      colors[i3 + 2] = Math.min(1, baseColor.b * shimmer);
      seeds[cursor] = Math.random() * Math.PI * 2;
      cursor += 1;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: isMobile ? 0.036 : 0.026,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
  });

  const flag = new THREE.Points(geometry, material);
  scene.add(flag);

  camera.position.set(0, 0, 7.6);
  renderer.setClearColor('#000000', 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const resize = () => {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const onPointerDown = (event: PointerEvent) => {
    if ((event.target as HTMLElement).closest('button, a')) return;
    isDragging = true;
    dragVelocity.set(0, 0);
    const rect = container.getBoundingClientRect();
    previousPointer.set(
      ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      -((event.clientY - rect.top) / rect.height - 0.5) * 2
    );
    pointer.copy(previousPointer);
    container.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      -((event.clientY - rect.top) / rect.height - 0.5) * 2
    );
    if (isDragging) {
      const dx = pointer.x - previousPointer.x;
      const dy = pointer.y - previousPointer.y;
      dragVelocity.set(dx, dy);
      dragRotation.x += dx * 1.8;
      dragRotation.y += dy * 1.2;
      previousPointer.copy(pointer);
    }
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  const updateModeCopy = () => {
    const mode = animationModes[currentMode];
    if (modeTitle) {
      modeTitle.textContent = mode.title[lang];
    }
    if (modeDesc) {
      modeDesc.textContent = mode.desc[lang];
    }
  };

  const applyFlagColors = (flagName: FlagName) => {
    const presetColors = flagPresets[flagName].colors.map((color) => new THREE.Color(color));
    const colorAttribute = geometry.getAttribute('color');

    for (let row = 0; row < rows; row += 1) {
      const yRatio = rows <= 1 ? 0 : row / (rows - 1);
      const stripeIndex = Math.min(presetColors.length - 1, Math.floor(yRatio * presetColors.length));
      const baseColor = presetColors[stripeIndex];

      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        const shimmer = 0.94 + Math.sin(seeds[index] * 17.3) * 0.06;
        colorAttribute.setXYZ(
          index,
          Math.min(1, baseColor.r * shimmer),
          Math.min(1, baseColor.g * shimmer),
          Math.min(1, baseColor.b * shimmer)
        );
      }
    }

    colorAttribute.needsUpdate = true;
  };

  const switchFlag = (flagName: FlagName) => {
    if (flagName === currentFlag) {
      return;
    }

    currentFlag = flagName;
    flagSwitchedAt = clock.getElapsedTime();
    applyFlagColors(flagName);

    flagButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.particleFlag === flagName);
    });
  };

  const switchMode = (direction: 1 | -1) => {
    currentMode = (currentMode + direction + animationModes.length) % animationModes.length;
    modeStartedAt = clock.getElapsedTime();
    updateModeCopy();

    if (controls) {
      controls.classList.remove('is-switching');
      window.requestAnimationFrame(() => {
        controls.classList.add('is-switching');
      });
    }
  };

  const animate = () => {
    if (signal.aborted) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    const positionAttribute = geometry.getAttribute('position');
    const modeElapsed = elapsed - modeStartedAt;
    const modeProgress = Math.min(1, modeElapsed / 3.6);
    const modeIndex = currentMode;
    const modeStrength = smoothstep(modeElapsed / 0.72);
    const settleStrength = 1 - modeStrength;

    // Apply drag inertia when not dragging
    if (!isDragging) {
      dragRotation.x += dragVelocity.x * 1.8;
      dragRotation.y += dragVelocity.y * 1.2;
      dragVelocity.x *= 0.94;
      dragVelocity.y *= 0.94;
      if (Math.abs(dragVelocity.x) < 0.0001) dragVelocity.x = 0;
      if (Math.abs(dragVelocity.y) < 0.0001) dragVelocity.y = 0;
    }

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        const i3 = index * 3;
        const xRatio = columns <= 1 ? 0 : column / (columns - 1);
        const yRatio = rows <= 1 ? 0 : row / (rows - 1);
        const baseX = basePositions[i3];
        const baseY = basePositions[i3 + 1];
        const baseZ = basePositions[i3 + 2];
        const centeredX = xRatio - 0.5;
        const centeredY = 0.5 - yRatio;
        const seed = seeds[index];
        const flagSwitchBurst = Math.max(0, 1 - (elapsed - flagSwitchedAt) / 0.9);
        let nextX = baseX;
        let nextY = baseY;
        let nextZ = baseZ;

        if (modeIndex === 0) {
          nextZ += Math.sin(xRatio * Math.PI * 7 + elapsed * 1.35) * 0.075;
          nextZ += Math.sin(yRatio * Math.PI * 5 + elapsed * 0.8) * 0.034;
        } else if (modeIndex === 1) {
          const breathe = Math.sin(elapsed * 1.2 + seed) * 0.07;
          nextX += centeredX * breathe;
          nextY += centeredY * breathe;
          nextZ += Math.cos(elapsed * 1.5 + seed) * 0.12;
        } else if (modeIndex === 2) {
          const scan = (elapsed * 0.32 + seed * 0.02) % 1.45 - 0.22;
          const distance = Math.abs(yRatio - scan);
          const ripple = Math.max(0, 1 - distance * 9);
          nextZ += ripple * 0.42 + Math.sin(xRatio * Math.PI * 12 + elapsed * 2.1) * 0.045;
          nextX += Math.sin(elapsed * 1.8 + yRatio * Math.PI * 8) * ripple * 0.035;
        } else if (modeIndex === 3) {
          const burst = Math.sin(modeProgress * Math.PI);
          const radial = Math.hypot(centeredX, centeredY) + 0.08;
          nextX += (centeredX / radial) * burst * (0.38 + Math.sin(seed) * 0.16);
          nextY += (centeredY / radial) * burst * (0.2 + Math.cos(seed) * 0.1);
          nextZ += Math.sin(elapsed * 1.9 + seed) * 0.22 * burst;
        } else if (modeIndex === 4) {
          // Tornado Vortex — particles spiral upward in a funnel
          const radial = Math.hypot(centeredX, centeredY) + 0.01;
          const angle = Math.atan2(centeredY, centeredX) + elapsed * 1.6 + radial * 4.5;
          const lift = Math.sin(elapsed * 0.9 + seed * 2.3) * 0.28;
          const spiralRadius = radial * (0.7 + Math.sin(elapsed * 1.1 + seed) * 0.3);
          nextX = Math.cos(angle) * spiralRadius * 6.4;
          nextY = baseY + lift;
          nextZ = Math.sin(angle) * spiralRadius * 1.2 + Math.sin(elapsed * 2.4 + seed) * 0.06;
        } else if (modeIndex === 5) {
          // DNA Helix — flag twists into a double helix structure
          const twist = Math.sin(yRatio * Math.PI * 3 + elapsed * 1.4) * 1.2;
          const helixPhase = yRatio * Math.PI * 6 + elapsed * 2.2;
          const strand = Math.sin(seed * 100) > 0 ? 1 : -1;
          const helixX = Math.cos(helixPhase) * 0.35 * strand;
          const helixZ = Math.sin(helixPhase) * 0.55 * strand;
          nextX = baseX * Math.cos(twist * 0.15) + helixX * (1 - Math.abs(centeredX) * 0.5);
          nextZ = baseZ + helixZ + Math.sin(elapsed * 1.8 + seed) * 0.04;
          nextY = baseY + Math.sin(elapsed * 0.7 + xRatio * Math.PI * 4) * 0.06;
        } else if (modeIndex === 6) {
          // Heartbeat Pulse — rhythmic double-beat radial pulse
          const heartPhase = (elapsed * 2.8 + seed * 0.3) % (Math.PI * 2);
          const beat1 = Math.max(0, Math.sin(heartPhase)) ** 3;
          const beat2 = Math.max(0, Math.sin(heartPhase + 0.55)) ** 5 * 0.5;
          const pulse = (beat1 + beat2) * 0.35;
          const radial = Math.hypot(centeredX, centeredY) + 0.05;
          nextX += (centeredX / radial) * pulse;
          nextY += (centeredY / radial) * pulse * 0.6;
          nextZ += pulse * Math.sin(seed * 7.7 + elapsed) * 0.6;
          nextZ += Math.sin(xRatio * Math.PI * 8 + elapsed * 3.2) * 0.02;
        } else if (modeIndex === 7) {
          // Galaxy Spiral — particles orbit in spiral arms (slow & majestic)
          const angle = Math.atan2(centeredY, centeredX);
          const radial = Math.hypot(centeredX, centeredY) + 0.01;
          const armCount = 3;
          const spiralAngle = angle + elapsed * 0.18 + radial * 5.0;
          const armPhase = Math.sin(spiralAngle * armCount) * 0.5 + 0.5;
          const orbitSpeed = 0.28 / (radial + 0.3);
          const orbitAngle = angle + elapsed * orbitSpeed;
          const driftOut = Math.sin(elapsed * 0.3 + seed) * 0.06;
          nextX = Math.cos(orbitAngle) * (radial + driftOut) * 6.4;
          nextY = Math.sin(orbitAngle) * (radial + driftOut) * 3.9;
          nextZ = armPhase * 0.28 + Math.sin(elapsed * 0.8 + seed) * 0.04;
        } else if (modeIndex === 8) {
          // Energy Sphere — wraps into a 3D globe
          const theta = xRatio * Math.PI * 2 + elapsed * 0.5; // Longitude (spinning)
          const phi = yRatio * Math.PI; // Latitude
          const radius = 2.4 + Math.sin(elapsed * 2.5 + seed) * 0.15;
          nextX = Math.sin(phi) * Math.cos(theta) * radius;
          nextY = Math.cos(phi) * radius;
          nextZ = Math.sin(phi) * Math.sin(theta) * radius;
        } else if (modeIndex === 9) {
          // Cyber Matrix — snaps to a rigid 3D grid
          const gridCols = 24;
          const gridRows = 16;
          const snappedX = Math.round(centeredX * gridCols) / gridCols;
          const snappedY = Math.round(centeredY * gridRows) / gridRows;
          const snappedZ = Math.round(Math.sin(xRatio * Math.PI * 6 + yRatio * Math.PI * 4) * 3) / 3;
          const pulse = Math.sin(elapsed * 4.0 + snappedX * 15 + snappedY * 15) * 0.15;
          nextX = snappedX * 6.4;
          nextY = snappedY * 3.9;
          nextZ = snappedZ * 0.6 + pulse;
        } else if (modeIndex === 10) {
          // Meteor Shower — diagonal falling streaks
          const fallSpeed = 4.2;
          const timeOffset = seed * 100;
          const dropY = (-(elapsed * fallSpeed + timeOffset) % 6.0) + 3.0;
          const trailLength = 0.8;
          // Stretch particles along the fall vector based on their local random index
          const stretch = (seed % trailLength);
          nextX = baseX + dropY * 0.4 + stretch * 0.4; // Diagonal drift
          nextY = dropY + stretch;
          nextZ = baseZ + Math.sin(elapsed * 2.0 + seed) * 0.1;
        } else if (modeIndex === 11) {
          // Wormhole Tunnel — curls into a cylinder
          const tunnelRadius = 1.8 + Math.sin(yRatio * Math.PI * 3 + elapsed * 1.5) * 0.3;
          const tunnelAngle = xRatio * Math.PI * 4 + elapsed * 0.8;
          nextX = Math.cos(tunnelAngle) * tunnelRadius;
          nextZ = Math.sin(tunnelAngle) * tunnelRadius;
          nextY = baseY * 1.2;
        }

        positionAttribute.setXYZ(
          index,
          THREE.MathUtils.lerp(baseX, nextX, modeStrength) + Math.sin(elapsed * 0.9 + seed) * 0.004 * settleStrength + centeredX * flagSwitchBurst * 0.08,
          THREE.MathUtils.lerp(baseY, nextY, modeStrength) + centeredY * flagSwitchBurst * 0.04,
          THREE.MathUtils.lerp(baseZ, nextZ, modeStrength) + Math.sin(seed + elapsed * 3.2) * flagSwitchBurst * 0.18
        );
      }
    }

    positionAttribute.needsUpdate = true;

    // Drag rotation + idle breathing
    flag.rotation.y = dragRotation.x + Math.sin(elapsed * 0.22) * 0.025;
    flag.rotation.x = -dragRotation.y + Math.sin(elapsed * 0.28) * 0.018;
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  };

  resize();
  updateModeCopy();
  animate();

  window.addEventListener('resize', resize, { passive: true, signal });
  container.addEventListener('pointerdown', onPointerDown, { signal });
  container.addEventListener('pointermove', onPointerMove, { passive: true, signal });
  container.addEventListener('pointerup', onPointerUp, { signal });
  container.addEventListener('pointercancel', onPointerUp, { signal });
  resetButton?.addEventListener('click', () => {
    gsap.killTweensOf(dragRotation);
    gsap.killTweensOf(dragVelocity);
    gsap.to(dragRotation, { x: 0, y: 0, duration: 1.2, ease: 'power3.out' });
    gsap.to(dragVelocity, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
  }, { signal });
  prevButton?.addEventListener('click', () => switchMode(-1), { signal });
  nextButton?.addEventListener('click', () => switchMode(1), { signal });
  flagButtons.forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        const flagName = button.dataset.particleFlag;
        if (flagName === 'trans' || flagName === 'rainbow') {
          switchFlag(flagName);
        }
      },
      { signal }
    );
  });
  document.addEventListener(
    'astro:before-swap',
    () => {
      abortController.abort();
    },
    { once: true, signal }
  );

  signal.addEventListener(
    'abort',
    () => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      renderer.domElement.remove();
    },
    { once: true }
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParticleCloud, { once: true });
} else {
  initParticleCloud();
}

document.addEventListener('astro:page-load', initParticleCloud);
