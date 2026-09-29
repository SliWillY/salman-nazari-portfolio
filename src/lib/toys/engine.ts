// Toy studio engine (three.js): candy toys floating in a sun gradient, like a Cinema 4D motion-graphics loop.
// - Layout: every toy gets a resting spot away from the page's text (and the worlds' stages), in a seeded,
//   evenly spread composition that is recomputed on resize. Toys bob, turn and breathe around their spot.
// - Play: the pointer nudges toys aside, the eyeball follows it, a click (or tap) makes a toy jump; now and then
//   a toy hops on its own.
// - Scene mode (home): hovering / focusing a world springs its toys out of the float onto its stage, where its
//   story (stories.ts) plays; leaving sends them back. Touch screens: the world nearest the middle plays, taking
//   turns. Confetti (paper dots) drifts and bursts.
// - Banner mode (world pages): the world's toys and a few others float; no stories.
// Colours and lighting come from CSS tokens (--toy-*), so light and dark are the same studio in different light.
// Reduced motion: no drift, no stories in motion (the finished pose appears), a frame is drawn only on change.
// The loop runs only while the canvas is on screen and the tab is visible.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildToy, createKit, PAINTS, tint, type Kit, type Palette, type Toy, type ToyKind } from './models';
import type { Frame, Story, V3 } from './stories';

export interface World { link: HTMLAnchorElement; stage: HTMLElement; story: Story }
export interface Options {
  worlds?: World[];                        // scene mode: worlds with stories
  float: { kind: ToyKind; paint?: string }[]; // toys that only float
  avoid: () => Element[];                  // keep resting toys clear of these
  confetti: number;
  seed?: number;
  /** Base toy size as a share of the canvas's shorter side (small for the tall home stage, large for short banners). */
  size?: number;
}

type Body = {
  toy: Toy; size: number; weight: number;
  anchor: THREE.Vector3; phase: [number, number, number]; spin: THREE.Vector3; spinSpeed: number; rest: THREE.Quaternion;
  pos: THREE.Vector3; vel: THREE.Vector3; quat: THREE.Quaternion; scale: number; scaleVel: number; squash: number;
  push: THREE.Vector3; pushVel: THREE.Vector3;
  world: WorldState | null; part: string; since: number; hop: number; eye: boolean;
};
type WorldState = World & { parts: Record<string, Body>; center: THREE.Vector2; size: number; group: THREE.Group; extras: THREE.Object3D[]; t0: number; told: number };

// How big each toy floats, relative to the base size.
const SIZE: Partial<Record<ToyKind, number>> = {
  panel: 1.55, bar: 1.35, button: 1.05, star: 0.95, cursor: 0.7, platform: 1.15, buddy: 0.85, coin: 0.8, cube: 0.95, cone: 0.95,
  ball: 0.85, torus: 1.05, eyeball: 1.15, worm: 1.6, coil: 1.15, candycorn: 0.95, striped: 1.05, bubbles: 1.35, gem: 0.8,
  cross: 0.85, ridgeball: 1, donut: 1.15, pill: 0.95
};
const FLAT = new Set<ToyKind>(['panel', 'bar', 'button', 'star', 'coin', 'cursor', 'platform']);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
/** Small seeded random numbers, so the composition is the same on every visit. */
function random(seed: number) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export function mountToys(root: HTMLElement, canvas: HTMLCanvasElement, options: Options) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const touch = matchMedia('(hover: none)');
  const narrow = matchMedia('(max-width: 700px)');
  const hq = !touch.matches && !narrow.matches;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: (devicePixelRatio || 1) < 1.5, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return; // no WebGL: the page works the same, just without toys
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, hq ? 1.75 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.setClearColor(0, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  const camera = new THREE.PerspectiveCamera(18, 1, 10, 40000);
  const fill = new THREE.HemisphereLight();
  const key = new THREE.DirectionalLight();
  key.position.set(-0.7, 1.1, 1.3);
  const rim = new THREE.DirectionalLight();
  rim.position.set(0.9, 0.4, -1);
  scene.add(fill, key, rim);

  const style = () => getComputedStyle(root);
  const token = (name: string) => style().getPropertyValue(name).trim();
  const palette = Object.fromEntries(PAINTS.map((name) => [name, new THREE.Color().setStyle(token(`--toy-${name}`) || 'white')])) as Palette;
  const kit: Kit = createKit(palette, hq);

  function readLight() {
    const n = (name: string, fallback: number) => parseFloat(token(name)) || fallback;
    scene.environmentIntensity = n('--toy-env', 1);
    key.intensity = n('--toy-key', 1.5);
    key.color.setStyle(token('--toy-key-color') || 'white');
    rim.intensity = n('--toy-rim', 1);
    rim.color.setStyle(token('--toy-rim-color') || 'white');
    fill.intensity = n('--toy-fill', 0.5);
    fill.color.setStyle(token('--toy-key-color') || 'white');
    fill.groundColor.setStyle(token('--toy-ground-color') || 'white');
  }
  readLight();

  // ---------- toys ----------
  const bodies: Body[] = [];
  const rand = random(options.seed ?? 11);
  function makeBody(kind: ToyKind, paint?: string): Body {
    const toy = buildToy(kind, kit);
    if (paint && paint in palette) tint(toy, palette[paint as keyof Palette]);
    scene.add(toy.object);
    // Flat toys (a screen, a coin…) keep facing the viewer and turn in their own plane, so they never float edge-on.
    const flat = FLAT.has(kind);
    const spin = new THREE.Vector3(rand() - 0.5, rand() - 0.5, flat ? 2.5 : rand() - 0.5).normalize();
    const tilt = flat ? 0.5 : 1.4;
    const body: Body = {
      toy, size: 0, weight: SIZE[kind] ?? 1,
      anchor: new THREE.Vector3(), phase: [rand() * 6.28, rand() * 6.28, rand() * 6.28], spin, spinSpeed: (0.15 + rand() * 0.3) * (rand() < 0.5 ? -1 : 1) * (flat ? 0.6 : 1),
      rest: new THREE.Quaternion().setFromEuler(new THREE.Euler((rand() - 0.5) * tilt, (rand() - 0.5) * tilt, (rand() - 0.5) * 1.2)),
      pos: new THREE.Vector3(), vel: new THREE.Vector3(), quat: new THREE.Quaternion(), scale: 0, scaleVel: 0, squash: 0,
      push: new THREE.Vector3(), pushVel: new THREE.Vector3(),
      world: null, part: '', since: -10, hop: -10, eye: kind === 'eyeball'
    };
    body.quat.copy(body.rest);
    bodies.push(body);
    return body;
  }
  const worlds: WorldState[] = (options.worlds ?? []).map((world) => {
    const parts: Record<string, Body> = {};
    for (const [name, { kind, paint }] of Object.entries(world.story.parts)) parts[name] = makeBody(kind, paint);
    const group = new THREE.Group();
    const extras = world.story.extras?.(kit) ?? [];
    extras.forEach((extra) => { extra.visible = false; group.add(extra); }); // shown only while the story plays
    scene.add(group);
    return { ...world, parts, center: new THREE.Vector2(), size: 0, group, extras, t0: 0, told: 0 };
  });
  for (const { kind, paint } of options.float) makeBody(kind, paint);

  // Paper confetti: flat discs that drift down, flipping over, and bursts that fly out and fall.
  const disc = new THREE.CylinderGeometry(0.5, 0.5, 0.07, 20);
  const paper = new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0 });
  const colors = [palette.sun, palette.tangerine, palette.grape, palette.mint, palette.sky, palette.bubblegum, palette.cherry, palette.cream];
  const drift = new THREE.InstancedMesh(disc, paper, Math.max(1, options.confetti));
  const burstCount = 90;
  const bursts = new THREE.InstancedMesh(disc, paper, burstCount);
  scene.add(drift, bursts);
  const flakes = Array.from({ length: options.confetti }, (_, i) => ({
    x: rand(), y: rand(), z: (rand() - 0.5) * 300, size: 7 + rand() * 9, fall: 5 + rand() * 12, sway: rand() * 6.28,
    axis: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(), turn: 0.6 + rand() * 1.6, color: colors[i % colors.length]
  }));
  flakes.forEach((flake, i) => drift.setColorAt(i, flake.color));
  drift.count = flakes.length;
  const pieces = Array.from({ length: burstCount }, () => ({ life: 0, pos: new THREE.Vector3(), vel: new THREE.Vector3(), axis: new THREE.Vector3(1, 0, 0), turn: 0, size: 10 }));
  pieces.forEach((_, i) => bursts.setColorAt(i, colors[i % colors.length]));
  let nextPiece = 0;
  const pluses: { sprite: THREE.Sprite; life: number; y: number }[] = [];
  const plusTexture = (() => {
    const text = document.createElement('canvas');
    text.width = 256; text.height = 128;
    const g = text.getContext('2d')!;
    g.font = '800 96px "DM Sans", system-ui, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    g.lineWidth = 14; g.strokeStyle = `#${palette.ink.getHexString()}`; g.strokeText('+1', 128, 68);
    g.fillStyle = `#${palette.cream.getHexString()}`; g.fillText('+1', 128, 68);
    const texture = new THREE.CanvasTexture(text);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  })();

  // ---------- layout ----------
  let w = 0, h = 0, rtl = false;
  const toWorld = (x: number, y: number) => new THREE.Vector2(x - w / 2, h / 2 - y);
  let exclusions: DOMRect[] = [];
  function layout() {
    const frame = canvas.getBoundingClientRect();
    rtl = style().direction === 'rtl';
    const local = (r: DOMRect) => new DOMRect(r.left - frame.left, r.top - frame.top, r.width, r.height);
    exclusions = options.avoid().map((el) => local(el.getBoundingClientRect())).filter((r) => r.width && r.height);
    for (const world of worlds) {
      const r = local(world.stage.getBoundingClientRect());
      world.size = Math.min(r.width, r.height);
      world.center.copy(toWorld(r.left + r.width / 2, r.top + r.height / 2));
      world.group.position.set(world.center.x, world.center.y, 0);
      world.group.scale.setScalar(world.size);
      exclusions.push(r);
    }
    // Resting spots: largest toys first, each the best-spread of many seeded candidates clear of the text.
    const base = clamp(Math.min(w, h) * (options.size ?? (narrow.matches ? 0.11 : 0.078)), 36, 110);
    const pick = random(options.seed ?? 11);
    const placed: { x: number; y: number; r: number }[] = [];
    const order = [...bodies].sort((a, b) => b.weight - a.weight);
    for (const body of order) {
      body.size = base * body.weight;
      const r = body.size * 0.55;
      let best = { x: w / 2, y: h / 2, score: -Infinity };
      for (let i = 0; i < 90; i++) {
        const x = r + pick() * Math.max(1, w - 2 * r);
        const y = r + pick() * Math.max(1, h - 2 * r);
        const overlap = exclusions.reduce((sum, e) => {
          const dx = Math.max(e.left - x, 0, x - e.right);
          const dy = Math.max(e.top - y, 0, y - e.bottom);
          return sum + Math.max(0, r + 14 - Math.hypot(dx, dy));
        }, 0);
        const spread = placed.reduce((min, p) => Math.min(min, Math.hypot(p.x - x, p.y - y) - p.r - r), Math.min(w, h));
        const score = spread - overlap * 6;
        if (score > best.score) best = { x, y, score };
      }
      placed.push({ x: best.x, y: best.y, r });
      const at = toWorld(best.x, best.y);
      body.anchor.set(at.x, at.y, (pick() - 0.5) * 220);
      if (!body.scale) { body.pos.copy(body.anchor); body.scale = reduced.matches ? body.size : 0; }
    }
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    w = rect.width; h = rect.height;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.set(0, 0, h / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    camera.updateProjectionMatrix();
    layout();
    wake();
  }

  // ---------- pointer ----------
  const pointer = { x: 0, y: 0, active: false };
  const raycaster = new THREE.Raycaster();
  root.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const frame = canvas.getBoundingClientRect();
    const at = toWorld(event.clientX - frame.left, event.clientY - frame.top);
    Object.assign(pointer, { x: at.x, y: at.y, active: true });
    wake();
  }, { passive: true });
  root.addEventListener('pointerleave', () => { pointer.active = false; });
  // Click or tap on a toy (not on a link): it jumps and sheds a little confetti.
  root.addEventListener('pointerdown', (event) => {
    if ((event.target as Element).closest('a, button')) return;
    const frame = canvas.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2(((event.clientX - frame.left) / w) * 2 - 1, -((event.clientY - frame.top) / h) * 2 + 1), camera);
    const hit = raycaster.intersectObjects(bodies.filter((b) => !b.world).map((b) => b.toy.object), true)[0];
    const body = hit && bodies.find((b) => b.toy.object === hit.object || b.toy.object.getObjectById(hit.object.id));
    if (!body) return;
    body.hop = time;
    burst(body.pos.clone(), 10, body.size * 0.8);
    wake();
  });

  // ---------- confetti ----------
  function burst(at: THREE.Vector3, count: number, spread = 1) {
    if (reduced.matches) return;
    for (let i = 0; i < count; i++) {
      const piece = pieces[nextPiece];
      nextPiece = (nextPiece + 1) % burstCount;
      const a = Math.random() * Math.PI * 2;
      const speed = (160 + Math.random() * 260) * Math.min(1.4, 0.6 + spread / 200);
      piece.life = 1;
      piece.pos.copy(at);
      piece.vel.set(Math.cos(a) * speed, Math.abs(Math.sin(a)) * speed * 0.9 + 120, (Math.random() - 0.5) * 200);
      piece.axis.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      piece.turn = 6 + Math.random() * 10;
      piece.size = 8 + Math.random() * 8;
    }
  }

  // ---------- stories ----------
  let active: WorldState | null = null;
  const hooks = (world: WorldState, frame: Frame) => ({
    burst: (at: V3, count = 24, fixed = false) => burst(storyToWorld(world, frame, at, fixed), count, world.size),
    plus: (at: V3) => {
      if (reduced.matches) return;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: plusTexture, transparent: true, depthWrite: false }));
      const p = storyToWorld(world, frame, at, false);
      sprite.position.copy(p);
      sprite.scale.set(world.size * 0.26, world.size * 0.13, 1);
      scene.add(sprite);
      pluses.push({ sprite, life: 1, y: p.y });
    }
  });
  const flipped = (world: WorldState) => world.story.mirror && rtl;
  function frameQuat(world: WorldState, frame: Frame) {
    const yaw = (frame.yaw ?? 0) * (flipped(world) ? -1 : 1);
    return new THREE.Quaternion().setFromEuler(new THREE.Euler(frame.pitch ?? 0, yaw, 0, 'XYZ'));
  }
  function storyToWorld(world: WorldState, frame: Frame, [x, y, z]: V3, fixed: boolean) {
    const v = new THREE.Vector3(flipped(world) ? -x : x, y, z);
    if (!fixed) v.applyQuaternion(frameQuat(world, frame));
    return v.multiplyScalar(world.size).add(new THREE.Vector3(world.center.x, world.center.y, 0));
  }
  function activate(world: WorldState) {
    if (active === world) return;
    if (active) leave(active);
    layout(); // the stage may have moved (fonts, resize)
    active = world;
    world.t0 = time;
    world.told = -0.001;
    for (const [name, body] of Object.entries(world.parts)) Object.assign(body, { world, part: name, since: time });
    for (const other of worlds) other.link.classList.toggle('is-active', other === world);
    wake();
  }
  function leave(world: WorldState) {
    for (const body of Object.values(world.parts)) {
      Object.assign(body, { world: null, since: time });
      body.vel.add(new THREE.Vector3((Math.random() - 0.5) * 300, 200 + Math.random() * 200, 0));
    }
    world.extras.forEach((extra) => (extra.visible = false));
    world.link.classList.remove('is-active');
    if (active === world) active = null;
    wake();
  }
  const deactivate = () => { if (active) leave(active); };

  // ---------- simulation ----------
  let time = 0;
  const tmp = new THREE.Vector3();
  const tmpQuat = new THREE.Quaternion();
  const spinQuat = new THREE.Quaternion();
  const look = new THREE.Object3D();
  function step(dt: number) {
    const still = reduced.matches;
    // The active world's story: poses for its toys, details, extras and confetti.
    const targets = new Map<Body, { pos: THREE.Vector3; quat: THREE.Quaternion; scale: number; squash: number }>();
    if (active) {
      const world = active;
      const t = still ? world.story.still : time - world.t0;
      const frame = world.story.frame(t, rtl);
      const q = frameQuat(world, frame);
      for (const [name, pose] of Object.entries(frame.parts)) {
        const body = world.parts[name];
        if (!body) continue;
        const [rx, ry, rz] = pose.r ?? [0, 0, 0];
        const flip = flipped(world);
        targets.set(body, {
          pos: storyToWorld(world, frame, pose.p, false),
          quat: q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, flip ? -ry : ry, flip ? -rz : rz))),
          scale: pose.hide ? 0 : pose.s * world.size,
          squash: pose.sq ?? 0
        });
      }
      world.story.apply?.(t, Object.fromEntries(Object.entries(world.parts).map(([n, b]) => [n, b.toy])), rtl, kit);
      world.extras.forEach((extra) => (extra.visible = true));
      world.story.updateExtras?.(t, world.extras, rtl);
      if (!still) world.story.events?.(world.told, t, hooks(world, frame), rtl);
      world.told = t;
    }

    for (const body of bodies) {
      const target = targets.get(body);
      const age = time - body.since;
      let squash = 0;
      if (target) {
        squash = target.squash;
        if (still) { body.pos.copy(target.pos); body.quat.copy(target.quat); body.scale = target.scale; }
        else if (age < 0.9) {
          // Spring in with overshoot, stiffening as it arrives, so every toy lands with a little bounce.
          const k = 70 + 520 * (age / 0.9) ** 2;
          const c = 2 * Math.sqrt(k) * 0.62;
          body.vel.addScaledVector(tmp.copy(target.pos).sub(body.pos), k * dt).addScaledVector(body.vel, -c * dt);
          body.pos.addScaledVector(body.vel, dt);
          body.quat.slerp(target.quat, 1 - Math.exp(-dt * 7));
        } else {
          body.pos.lerp(target.pos, 1 - Math.exp(-dt * 26));
          body.vel.set(0, 0, 0);
          body.quat.slerp(target.quat, 1 - Math.exp(-dt * 18));
        }
        if (!still) {
          body.scaleVel += ((target.scale - body.scale) * 190 - body.scaleVel * 15) * dt;
          body.scale = Math.max(0, body.scale + body.scaleVel * dt);
        }
      } else {
        // Floating: bob, sway, turn; nudged aside by the pointer; back home with a soft spring.
        const [a, b, c] = body.phase;
        tmp.copy(body.anchor);
        if (!still) {
          tmp.x += Math.sin(time * 0.5 + a) * body.size * 0.14;
          tmp.y += Math.sin(time * 0.8 + b) * body.size * 0.2;
          tmp.z += Math.sin(time * 0.45 + c) * body.size * 0.35;
          // Pointer: push away within reach.
          let px = 0, py = 0;
          if (pointer.active) {
            const dx = body.pos.x - pointer.x, dy = body.pos.y - pointer.y;
            const d = Math.hypot(dx, dy) || 1;
            const reach = 150 + body.size * 0.6;
            if (d < reach) { px = (dx / d) * (reach - d) * 0.6; py = (dy / d) * (reach - d) * 0.6; }
          }
          body.pushVel.x += ((px - body.push.x) * 40 - body.pushVel.x * 9) * dt;
          body.pushVel.y += ((py - body.push.y) * 40 - body.pushVel.y * 9) * dt;
          body.push.addScaledVector(body.pushVel, dt);
          tmp.add(body.push);
          // Jump (clicked, or now and then on its own).
          const hop = time - body.hop;
          if (hop < 0.7) { tmp.y += Math.sin(Math.PI * (hop / 0.7)) * body.size * 0.9; squash = hop < 0.12 ? 0.3 * Math.sin(Math.PI * hop / 0.12) : -0.12 * Math.sin(Math.PI * (hop / 0.7)); }
          const k = age < 1.5 ? 22 : 30;
          const damping = 2 * Math.sqrt(k) * 0.7;
          body.vel.addScaledVector(tmp.sub(body.pos), k * dt).addScaledVector(body.vel, -damping * dt);
          body.pos.addScaledVector(body.vel, dt);
        } else body.pos.copy(tmp);
        if (body.eye && pointer.active && !still) {
          look.position.copy(body.pos);
          look.lookAt(pointer.x, pointer.y, camera.position.z * 0.35);
          body.quat.slerp(look.quaternion, 1 - Math.exp(-dt * 6));
        } else {
          const hop = time - body.hop;
          spinQuat.setFromAxisAngle(body.spin, still ? 0 : time * body.spinSpeed + (hop < 0.7 ? Math.sin(Math.PI * hop / 0.7) * 3 : 0));
          tmpQuat.copy(body.rest).multiply(spinQuat);
          body.quat.slerp(tmpQuat, still ? 1 : 1 - Math.exp(-dt * 3));
        }
        const size = body.size;
        if (still) body.scale = size;
        else {
          body.scaleVel += ((size - body.scale) * 120 - body.scaleVel * 12) * dt;
          body.scale = Math.max(0, body.scale + body.scaleVel * dt);
        }
      }
      body.squash += (squash - body.squash) * (still ? 1 : 1 - Math.exp(-dt * 30));
      const s = body.scale;
      body.toy.object.position.copy(body.pos);
      body.toy.object.quaternion.copy(body.quat);
      body.toy.object.scale.set(s * (1 + body.squash * 0.5), s * (1 - body.squash), s * (1 + body.squash * 0.5));
      body.toy.object.visible = s > 0.5;
    }

    // Drifting confetti: falls slowly, sways, flips like paper, wraps from the bottom to the top.
    const m = new THREE.Matrix4();
    flakes.forEach((flake, i) => {
      if (!still) { flake.y += (flake.fall * dt) / h; if (flake.y > 1.05) flake.y -= 1.1; }
      const at = toWorld(flake.x * w + Math.sin(time * 0.7 + flake.sway) * 14, flake.y * h);
      spinQuat.setFromAxisAngle(flake.axis, still ? flake.sway : time * flake.turn + flake.sway);
      m.compose(tmp.set(at.x, at.y, flake.z), spinQuat, new THREE.Vector3(flake.size, flake.size, flake.size));
      drift.setMatrixAt(i, m);
    });
    drift.instanceMatrix.needsUpdate = true;
    pieces.forEach((piece, i) => {
      if (piece.life > 0) {
        piece.life -= dt / 1.4;
        piece.vel.y -= 620 * dt;
        piece.vel.multiplyScalar(1 - 1.4 * dt);
        piece.pos.addScaledVector(piece.vel, dt);
      }
      const size = piece.life > 0 ? piece.size * Math.min(1, piece.life * 4) : 0;
      spinQuat.setFromAxisAngle(piece.axis, time * piece.turn);
      m.compose(piece.pos, spinQuat, new THREE.Vector3(size, size, size));
      bursts.setMatrixAt(i, m);
    });
    bursts.instanceMatrix.needsUpdate = true;
    for (let i = pluses.length - 1; i >= 0; i--) {
      const plus = pluses[i];
      plus.life -= dt / 0.9;
      plus.sprite.position.y = plus.y + (1 - plus.life) * 60;
      plus.sprite.material.opacity = Math.min(1, plus.life * 3);
      if (plus.life <= 0) { scene.remove(plus.sprite); plus.sprite.material.dispose(); pluses.splice(i, 1); }
    }
  }

  // ---------- loop ----------
  let visible = false;
  let last = 0;
  let nextHop = 3;
  let running = false;
  const canRun = () => visible && !document.hidden && w > 0;
  function frame(now: number) {
    if (!canRun()) { renderer.setAnimationLoop(null); running = false; return; }
    let elapsed = Math.min(0.1, Math.max(0, (now - last) / 1000));
    last = now;
    while (elapsed > 1e-4) { const dt = Math.min(elapsed, 1 / 60); time += dt; step(dt); elapsed -= dt; }
    // Now and then a floating toy hops on its own.
    if (time > nextHop) {
      const free = bodies.filter((b) => !b.world);
      if (free.length) free[Math.floor(Math.random() * free.length)].hop = time;
      nextHop = time + 2.5 + Math.random() * 2.5;
    }
    renderer.render(scene, camera);
  }
  function wake() {
    if (!canRun()) return;
    if (reduced.matches) { step(0); renderer.render(scene, camera); return; }
    if (!running) { running = true; last = performance.now(); renderer.setAnimationLoop(frame); }
  }

  // ---------- worlds: hover, focus, touch ----------
  let intro = 0;
  for (const world of worlds) {
    const { link } = world;
    link.addEventListener('pointerenter', (event) => { if (event.pointerType !== 'touch') { clearTimeout(intro); activate(world); } });
    link.addEventListener('pointerleave', (event) => { if (event.pointerType !== 'touch' && active === world && !link.matches(':focus-visible')) deactivate(); });
    link.addEventListener('focus', () => { if (link.matches(':focus-visible')) { clearTimeout(intro); activate(world); } });
    link.addEventListener('blur', () => { if (active === world && !link.matches(':hover')) deactivate(); });
  }
  // Pointer screens: the first world plays once on arrival, so the scene shows what it does.
  if (worlds.length && !touch.matches && !reduced.matches) {
    intro = window.setTimeout(() => {
      if (active || !visible) return;
      const first = worlds[0];
      activate(first);
      intro = window.setTimeout(() => { if (active === first && !first.link.matches(':hover, :focus-visible')) deactivate(); }, first.story.still * 1000 + 900);
    }, 1200);
  }
  // Touch screens: the world nearest the middle of the screen plays; while several are in view they take turns.
  let turnTimer = 0;
  let scrollFrame = 0;
  const inView = () => worlds.filter(({ link }) => { const r = link.getBoundingClientRect(); return r.bottom > innerHeight * 0.12 && r.top < innerHeight * 0.88; });
  const middle = (world: WorldState) => { const r = world.link.getBoundingClientRect(); return Math.abs(r.top + r.height / 2 - innerHeight / 2); };
  function takeTurns() {
    clearTimeout(turnTimer);
    if (!touch.matches || reduced.matches) return;
    turnTimer = window.setTimeout(() => {
      const list = inView();
      if (visible && list.length > 1) activate(list[(list.findIndex((world) => world === active) + 1) % list.length]);
      takeTurns();
    }, 5200);
  }
  function pickNearest() {
    if (!touch.matches || !worlds.length) return;
    const list = inView();
    if (!visible || !list.length) { deactivate(); return; }
    activate(list.reduce((a, b) => (middle(b) < middle(a) ? b : a)));
    takeTurns();
  }
  addEventListener('scroll', () => {
    if (!touch.matches || scrollFrame || !worlds.length) return;
    scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; pickNearest(); });
  }, { passive: true });

  // ---------- lifecycle ----------
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { wake(); pickNearest(); } else if (touch.matches) deactivate();
  }, { rootMargin: '80px' }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
  new ResizeObserver(resize).observe(canvas);
  document.fonts?.ready.then(() => { layout(); wake(); });
  const relight = () => { readLight(); setTimeout(() => { readLight(); wake(); }, 320); wake(); };
  new MutationObserver(relight).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', relight);
  reduced.addEventListener('change', () => { layout(); wake(); });
  resize();
}
