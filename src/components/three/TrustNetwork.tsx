'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * TrustNetwork — full-viewport Three.js scene rendered behind the landing
 * page hero. 200 instanced nodes, ~250 connection segments, a slow rotation,
 * mouse parallax, and a periodic "verification pulse" that flashes a node
 * from amber → white → green with an expanding ring.
 *
 * Implemented with vanilla Three.js (no fiber) for tightest control over the
 * render loop, instancing, and disposal. Mounts a single canvas, fills its
 * parent, and pauses when the tab is hidden.
 */

const NODE_COUNT       = 200;
const BOX_X            = 120;
const BOX_Y            = 80;
const BOX_Z            = 40;
const CONNECTION_DIST  = 18;
const MAX_NEIGHBORS    = 3;

type NodeKind = 'verified' | 'pending' | 'rejected';

const COLORS: Record<NodeKind, THREE.Color> = {
  verified: new THREE.Color('#00D97E'),
  pending:  new THREE.Color('#F0A500'),
  rejected: new THREE.Color('#F85149'),
};

const COLOR_FLASH_WHITE = new THREE.Color('#FFFFFF');

interface NodeData {
  position:    THREE.Vector3;
  baseScale:   number;
  scaleOffset: number;
  kind:        NodeKind;
  baseColor:   THREE.Color;
  /** Used when a verification pulse is active on this node. */
  pulseStart:  number; // performance.now()-style timestamp; 0 = idle
  pulseFromAmber: boolean;
}

export const TrustNetwork: React.FC<{ className?: string }> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect user preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Scene & camera ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080c10, 0.008);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      400,
    );
    camera.position.set(0, 0, 80);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Generate nodes ─────────────────────────────────────────────────
    const nodes: NodeData[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const r = Math.random();
      const kind: NodeKind = r < 0.7 ? 'verified' : r < 0.9 ? 'pending' : 'rejected';
      nodes.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * BOX_X,
          (Math.random() - 0.5) * BOX_Y,
          (Math.random() - 0.5) * BOX_Z,
        ),
        baseScale:   0.6 + Math.random() * 0.6,
        scaleOffset: Math.random() * Math.PI * 2,
        kind,
        baseColor:   COLORS[kind].clone(),
        pulseStart:  0,
        pulseFromAmber: false,
      });
    }

    // ── Instanced node mesh ────────────────────────────────────────────
    const sphereGeo = new THREE.SphereGeometry(0.5, 10, 10);
    const sphereMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.95,
    });
    const instanced = new THREE.InstancedMesh(sphereGeo, sphereMat, NODE_COUNT);
    instanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Per-instance color attribute
    const instanceColors = new Float32Array(NODE_COUNT * 3);
    nodes.forEach((n, i) => {
      instanceColors[i * 3 + 0] = n.baseColor.r;
      instanceColors[i * 3 + 1] = n.baseColor.g;
      instanceColors[i * 3 + 2] = n.baseColor.b;
    });
    instanced.instanceColor = new THREE.InstancedBufferAttribute(instanceColors, 3);
    sphereMat.vertexColors = true;
    scene.add(instanced);

    // ── Build neighbor list & connection lines ────────────────────────
    type Edge = { a: number; b: number; dist: number };
    const edges: Edge[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < NODE_COUNT; i++) {
      const candidates: Edge[] = [];
      for (let j = 0; j < NODE_COUNT; j++) {
        if (i === j) continue;
        const d = nodes[i].position.distanceTo(nodes[j].position);
        if (d < CONNECTION_DIST) candidates.push({ a: i, b: j, dist: d });
      }
      candidates.sort((x, y) => x.dist - y.dist);
      for (let k = 0; k < Math.min(MAX_NEIGHBORS, candidates.length); k++) {
        const e = candidates[k];
        const key = e.a < e.b ? `${e.a}-${e.b}` : `${e.b}-${e.a}`;
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push(e);
      }
    }

    const positions = new Float32Array(edges.length * 2 * 3);
    const colors    = new Float32Array(edges.length * 2 * 3);
    edges.forEach((e, i) => {
      const pa = nodes[e.a].position;
      const pb = nodes[e.b].position;
      positions[i * 6 + 0] = pa.x;
      positions[i * 6 + 1] = pa.y;
      positions[i * 6 + 2] = pa.z;
      positions[i * 6 + 3] = pb.x;
      positions[i * 6 + 4] = pb.y;
      positions[i * 6 + 5] = pb.z;

      // Take dimmer endpoint's color
      const dimNode = nodes[e.a].kind === 'verified' ? nodes[e.b] : nodes[e.a];
      const c = dimNode.baseColor;
      colors[i * 6 + 0] = c.r; colors[i * 6 + 1] = c.g; colors[i * 6 + 2] = c.b;
      colors[i * 6 + 3] = c.r; colors[i * 6 + 4] = c.g; colors[i * 6 + 5] = c.b;
    });

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    lineGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegments);

    // ── Ripple ring pool (for verification pulses) ─────────────────────
    interface Ripple {
      mesh: THREE.Mesh;
      mat:  THREE.MeshBasicMaterial;
      start: number;
      duration: number;
    }
    const ripples: Ripple[] = [];

    const createRipple = (pos: THREE.Vector3) => {
      const ringGeo = new THREE.RingGeometry(0.5, 0.7, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00d97e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(ringGeo, ringMat);
      mesh.position.copy(pos);
      mesh.lookAt(camera.position);
      scene.add(mesh);
      ripples.push({ mesh, mat: ringMat, start: performance.now(), duration: 1200 });
    };

    // ── Helpers ────────────────────────────────────────────────────────
    const dummy = new THREE.Object3D();
    const tmpColor = new THREE.Color();

    /** Trigger a verification pulse on a random pending or random node. */
    const triggerVerificationPulse = () => {
      // Prefer pending
      const pendingIdx = nodes
        .map((n, i) => (n.kind === 'pending' && n.pulseStart === 0 ? i : -1))
        .filter((i) => i >= 0);
      const idx = pendingIdx.length
        ? pendingIdx[Math.floor(Math.random() * pendingIdx.length)]
        : Math.floor(Math.random() * NODE_COUNT);
      const node = nodes[idx];
      node.pulseStart = performance.now();
      node.pulseFromAmber = node.kind === 'pending';
      createRipple(node.position);
    };

    // Fire one pulse shortly after mount for the "wow at 2s" moment
    const initialPulseTimer = window.setTimeout(triggerVerificationPulse, 1800);
    const pulseInterval = window.setInterval(() => {
      // 1-2 pulses every 3s for a "live" feel
      triggerVerificationPulse();
      if (Math.random() > 0.5) window.setTimeout(triggerVerificationPulse, 700);
    }, 3000);

    // ── Mouse parallax ─────────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Resize ─────────────────────────────────────────────────────────
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', onResize);

    // ── Visibility (pause) ─────────────────────────────────────────────
    let paused = document.hidden;
    const onVisibility = () => {
      paused = document.hidden;
      if (!paused) lastFrame = performance.now();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // ── Render loop ────────────────────────────────────────────────────
    let raf = 0;
    let lastFrame = performance.now();

    const render = () => {
      raf = requestAnimationFrame(render);
      if (paused) return;

      const now = performance.now();
      const dt  = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      const t = now * 0.001;

      // Slow rotation (skip for reduced motion)
      if (!prefersReducedMotion) {
        scene.rotation.y += 0.05 * dt;
        scene.rotation.x = Math.sin(t * 0.1) * 0.08;
      }

      // Mouse parallax on camera
      camera.position.x += (mouseX * 6 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 4 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Update node instances
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i];
        const pulseSec = n.pulseStart === 0 ? -1 : (now - n.pulseStart) / 1000;
        const pulseDur = 1.4;

        // Scale: gentle sin pulse + extra during verification
        const sinPulse = Math.sin(t * 1.2 + n.scaleOffset) * 0.12 + 1.0;
        let scale = n.baseScale * sinPulse;

        if (pulseSec >= 0 && pulseSec < pulseDur) {
          const k = pulseSec / pulseDur; // 0→1
          scale *= 1 + (1 - k) * 0.8; // expand then settle

          // Color: amber → white flash → green
          const flashIn  = 0.25;
          const flashOut = 0.5;
          if (k < flashIn) {
            tmpColor.copy(n.baseColor).lerp(COLOR_FLASH_WHITE, k / flashIn);
          } else if (k < flashOut) {
            tmpColor.copy(COLOR_FLASH_WHITE).lerp(COLORS.verified, (k - flashIn) / (flashOut - flashIn));
          } else {
            tmpColor.copy(COLORS.verified);
          }
          instanceColors[i * 3 + 0] = tmpColor.r;
          instanceColors[i * 3 + 1] = tmpColor.g;
          instanceColors[i * 3 + 2] = tmpColor.b;
        } else if (pulseSec >= pulseDur && n.pulseStart !== 0) {
          // Convert pending → verified after pulse
          if (n.pulseFromAmber) {
            n.kind = 'verified';
            n.baseColor.copy(COLORS.verified);
          }
          n.pulseStart = 0;
          instanceColors[i * 3 + 0] = n.baseColor.r;
          instanceColors[i * 3 + 1] = n.baseColor.g;
          instanceColors[i * 3 + 2] = n.baseColor.b;
        }

        dummy.position.copy(n.position);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        instanced.setMatrixAt(i, dummy.matrix);
      }
      instanced.instanceMatrix.needsUpdate = true;
      if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;

      // Pulse line opacity slightly
      lineMat.opacity = 0.22 + Math.sin(t * 0.6) * 0.06;

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const k = (now - r.start) / r.duration;
        if (k >= 1) {
          scene.remove(r.mesh);
          r.mesh.geometry.dispose();
          r.mat.dispose();
          ripples.splice(i, 1);
          continue;
        }
        const s = 1 + k * 14;
        r.mesh.scale.set(s, s, s);
        r.mat.opacity = (1 - k) * 0.7;
        r.mesh.lookAt(camera.position);
      }

      renderer.render(scene, camera);
    };
    render();

    // ── Cleanup ────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(pulseInterval);
      window.clearTimeout(initialPulseTimer);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);

      ripples.forEach((r) => {
        scene.remove(r.mesh);
        r.mesh.geometry.dispose();
        r.mat.dispose();
      });
      ripples.length = 0;

      sphereGeo.dispose();
      sphereMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      role="presentation"
    />
  );
};

export default TrustNetwork;
