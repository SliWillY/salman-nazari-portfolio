// World stories for the home scene: which toys make up each world's icon and how they act it out.
// A story is a pure timeline: frame(t) gives every part's pose in stage units (x right, y up, z toward the viewer;
// 1 = the stage's size), so the engine can spring the toys in from wherever they float, loop the story, or jump to
// the finished pose (`still`) for reduced motion. apply() drives details (the XP fill, clay → render); events()
// fires the confetti between two times. Motion follows motion-graphics habits: anticipation, overshoot, squash.
// Stories are written left to right; in Arabic the engine plays them mirrored (positions, turns and the toys
// themselves), and `rtl` tells a story so its own extras and details can follow.
import * as THREE from 'three';
import { setClay, type Kit, type PaintName, type Toy, type ToyKind } from './models';

export type V3 = [number, number, number];
export interface PartPose {
  p: V3;
  r?: V3;          // euler, radians
  s: number;       // size in stage units
  sq?: number;     // squash (+) / stretch (−) along local y
  hide?: boolean;  // shrink away (popped / not yet there)
}
export interface Frame { parts: Record<string, PartPose>; yaw?: number; pitch?: number }
/** Event positions are in the parts' space (mirrored and turned with the frame), unless `fixed` (plain stage space). */
export interface Hooks { burst(at: V3, count?: number, fixed?: boolean): void; plus(at: V3): void }
export interface Story {
  parts: Record<string, { kind: ToyKind; paint?: PaintName }>;
  still: number;
  frame(t: number, rtl: boolean): Frame;
  apply?(t: number, toys: Record<string, Toy>, rtl: boolean, kit: Kit): void;
  events?(from: number, to: number, hooks: Hooks, rtl: boolean): void;
  /** Extra meshes owned by the story (in stage units, not turned with the frame). */
  extras?(kit: Kit): THREE.Object3D[];
  updateExtras?(t: number, extras: THREE.Object3D[], rtl: boolean): void;
  /** Put the toys back to their own look when the story stops (they float on as themselves). */
  reset?(toys: Record<string, Toy>, kit: Kit): void;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const span = (t: number, start: number, length: number) => clamp01((t - start) / length);
const lerp = (a: number, b: number, v: number) => a + (b - a) * v;
const easeOut = (v: number) => 1 - (1 - v) ** 3;
const easeInOut = (v: number) => (v < 0.5 ? 4 * v ** 3 : 1 - (-2 * v + 2) ** 3 / 2);
/** 0 → 1.25 → 1: a pop with overshoot. */
const pop = (v: number) => (v <= 0 ? 0 : v >= 1 ? 1 : v < 0.6 ? 1.25 * easeOut(v / 0.6) : 1.25 - 0.25 * easeInOut((v - 0.6) / 0.4));
/** A quick squash that settles: 0 → 1 → 0 over the window. */
const thump = (t: number, at: number, length = 0.18) => { const v = span(t, at, length); return v > 0 && v < 1 ? Math.sin(Math.PI * v) : 0; };
/** Did the time `at` pass between `from` (exclusive) and `to` (inclusive), in a loop of `cycle` starting at `start`? */
function crossed(from: number, to: number, at: number, start = 0, cycle = Infinity) {
  if (to < start + at) return false;
  if (cycle === Infinity) return from < start + at && to >= start + at;
  const k = Math.floor((to - start - at) / cycle);
  const when = start + at + k * cycle;
  return from < when && to >= when;
}

// ---------- UX & Gamification: "interaction → reward" ----------
// A screen lands, a button and an XP bar snap onto it; a cursor swoops in and clicks (button squashes), the bar fills
// with a little elastic stretch, and a star badge pops out with a spin and a burst of confetti. The star scatters and
// the bar drains at the start of every cycle.
// Sits a little low on its stage, so the screen stays clear of the heading above the first world.
const UX = { first: 3.2, cycle: 2.9, click: [0.05, -0.12, 0.2] as V3, away: [0.34, -0.34, 0.12] as V3, badge: [0.36, 0.34, 0.14] as V3 };
function uxBeats(t: number) {
  const first = t < UX.first;
  const c = first ? t : (t - UX.first) % UX.cycle;
  const s = first ? 0.35 : 0;
  return { c, first, glide: 0.3 + s, click: 0.8 + s, fill: 0.92 + s, badge: 1.45 + s };
}
const ux: Story = {
  parts: { panel: { kind: 'panel' }, button: { kind: 'button' }, bar: { kind: 'bar' }, star: { kind: 'star' }, cursor: { kind: 'cursor' } },
  still: 2.5,
  frame(t) {
    const b = uxBeats(t);
    const press = thump(b.c, b.click, 0.16);
    const glide = easeOut(span(b.c, b.glide, 0.45));
    const away = b.first || b.c >= b.glide ? 1 - glide : easeInOut(span(b.c, 0, 0.3));
    const grow = span(b.c, b.badge, 0.45);
    return {
      yaw: -0.32 + 0.05 * Math.sin(t * 0.8),
      pitch: 0.14,
      parts: {
        panel: { p: [0, 0.04, 0], s: 0.84, sq: -0.04 * press },
        button: { p: [0, -0.08, 0.07 - 0.02 * press], s: 0.34, sq: 0.22 * press },
        bar: { p: [0, -0.43, 0.03], s: 0.78 },
        star: { p: UX.badge, s: 0.3 * pop(grow), r: [0, t * 1.4, -1.4 * (1 - easeOut(grow))], hide: b.c < b.badge },
        cursor: { p: [UX.click[0] + UX.away[0] * away, UX.click[1] + UX.away[1] * away, UX.click[2] + UX.away[2] * away - 0.03 * press], s: 0.15, r: [0.2, -0.25, 0.28] }
      }
    };
  },
  apply(t, toys) {
    const b = uxBeats(t);
    const fill = easeOut(span(b.c, b.fill, 0.55));
    const level = b.first || b.c >= b.fill ? lerp(0.35, 1, fill) + 0.06 * Math.sin(Math.PI * fill) : lerp(1, 0.35, easeInOut(span(b.c, 0, 0.4)));
    const bar = toys.bar.parts.fill;
    bar.position.x = -0.47; // fills from the left (from the right in Arabic, mirrored)
    bar.scale.x = Math.min(level, 1.04);
  },
  events(from, to, hooks) {
    const badgeAt = (first: boolean) => (first ? 1.45 + 0.35 + 0.2 : 1.45 + 0.2);
    if (crossed(from, to, badgeAt(true))) hooks.burst(UX.badge, 26);
    if (crossed(from, to, badgeAt(false), UX.first, UX.cycle)) hooks.burst(UX.badge, 26);
  }
};

// ---------- Games Dev: "build a level, play it" ----------
// Three platforms snap into a staircase, a coin spins above the last one, the buddy drops in with a squash, hops
// across and head-butts the coin, which pops into confetti and a "+1". A new coin appears at the far end and the
// buddy runs back.
const GAME = {
  platforms: [[-0.3, -0.28], [0, -0.1], [0.3, 0.08]] as [number, number][],
  lift: 0.108, // platform centre → buddy centre
  first: 3.1, cycle: 2.7, hop: 0.38, coinUp: 0.3
};
const standOn = (k: number): [number, number] => [GAME.platforms[k][0], GAME.platforms[k][1] + GAME.lift];
function gameRun(t: number) {
  if (t < GAME.first) return { c: t, first: true, dir: 1, coin: 0.3, drop: 0.5, hop1: 0.85, hop2: 1.28 };
  const k = 1 + Math.floor((t - GAME.first) / GAME.cycle);
  return { c: (t - GAME.first) % GAME.cycle, first: false, dir: k % 2 ? -1 : 1, coin: 0, drop: -1, hop1: 0.45, hop2: 0.88 };
}
type Run = ReturnType<typeof gameRun>;
function hopAt(v: number, from: [number, number], to: [number, number], peak: number, apex: number): [number, number] {
  const x = lerp(from[0], to[0], easeInOut(clamp01(v / (apex + (1 - apex) * 0.4))));
  const y = v < apex ? lerp(from[1], peak, 1 - (1 - v / apex) ** 2) : lerp(peak, to[1], ((v - apex) / (1 - apex)) ** 2);
  return [x, y];
}
function buddy(r: Run) {
  const order = r.dir === 1 ? [0, 1, 2] : [2, 1, 0];
  const [a, b, c] = order.map(standOn);
  const coinY = c[1] + GAME.coinUp;
  const apex = coinY - 0.075 - 0.069 + 0.012;
  if (r.first && r.c < r.hop1) {
    const v = span(r.c, r.drop, 0.24);
    return { pos: [a[0], lerp(a[1] + 0.55, a[1], v * v)] as [number, number], landed: r.c - (r.drop + 0.24), air: v < 1 };
  }
  if (r.c < r.hop2) {
    const v = span(r.c, r.hop1, GAME.hop);
    return { pos: hopAt(v, a, b, Math.max(a[1], b[1]) + 0.12, 0.5), landed: r.c - (r.hop1 + GAME.hop), air: v > 0 && v < 1 };
  }
  const v = span(r.c, r.hop2, GAME.hop);
  return { pos: hopAt(v, b, c, apex, 0.8), landed: r.c - (r.hop2 + GAME.hop), air: v > 0 && v < 1 };
}
const bumpOf = (r: Run) => r.hop2 + GAME.hop * 0.8;
const game: Story = {
  parts: {
    p1: { kind: 'platform', paint: 'tangerine' }, p2: { kind: 'platform', paint: 'grape' }, p3: { kind: 'platform', paint: 'sky' },
    buddy: { kind: 'buddy' }, coin: { kind: 'coin' }
  },
  still: 1.58, // the buddy at the top of its jump, right under the coin
  frame(t) {
    const r = gameRun(t);
    const { pos, landed, air } = buddy(r);
    // Squash on landing, stretch in the air, a little idle breathing.
    const sq = landed >= 0 && landed < 0.18 ? 0.28 * Math.sin((Math.PI * landed) / 0.18) : air ? -0.1 : landed > 0.3 ? 0.03 * Math.sin(t * 5) : 0;
    const [cx, cy] = standOn(r.dir === 1 ? 2 : 0);
    const bump = bumpOf(r);
    const spin = span(r.c, bump, 0.16);
    const coinIn = span(r.c, r.coin, 0.4);
    const parts: Record<string, PartPose> = {};
    GAME.platforms.forEach(([x, y], k) => {
      const land = r.first ? thump(t, 0.35 + k * 0.1, 0.2) : 0;
      parts[`p${k + 1}`] = { p: [x, y, 0], s: 0.3, sq: 0.18 * land, r: [0, 0.2, 0] };
    });
    parts.buddy = { p: [pos[0], pos[1] - 0.069 * sq * 0.5, 0.02], s: 0.16, sq, r: [0, r.dir === 1 ? 0.35 : -0.35, 0] };
    parts.coin = {
      p: [cx, cy + GAME.coinUp + 0.06 * spin, 0.02], s: 0.16 * (spin > 0 ? 1 + 0.3 * spin : pop(coinIn)),
      r: [0, 0.9 * Math.sin(t * 2.2) + spin * 10, 0], hide: spin >= 1 || coinIn <= 0 // wobbles facing the viewer, whirls on the bump
    };
    return { yaw: -0.3, pitch: 0.12, parts };
  },
  apply(t, toys) {
    const r = gameRun(t);
    toys.buddy.parts.eyes.position.x = 0.035 * r.dir;
  },
  events(from, to, hooks) {
    const popAt = (dir: number) => {
      const [x, y] = standOn(dir === 1 ? 2 : 0);
      const at: V3 = [x, y + GAME.coinUp + 0.06, 0.05];
      hooks.burst(at, 30);
      hooks.plus(at);
    };
    if (crossed(from, to, 1.28 + GAME.hop * 0.8 + 0.16)) popAt(1);
    if (crossed(from, to, 0.88 + GAME.hop * 0.8 + 0.16, GAME.first, GAME.cycle)) popAt((1 + Math.floor((to - GAME.first) / GAME.cycle)) % 2 ? -1 : 1);
  }
};

// ---------- 3D Renders: "model → render" ----------
// Modelling: the classic primitives arrive as viewport wireframes and settle into a still life on a turntable (a cube
// with a cone on it, a ball resting in a torus), then fill in as grey clay under their wires. Rendering: a render
// region's corner marks snap around the scene and a scan line sweeps across in reading direction; behind it the wires
// go, the clay turns to glossy candy and a soft contact shadow appears. A sparkle pops and the finished piece keeps
// turning on its turntable.
const FLOOR = -0.26; // the turntable's top
const RENDER = { clay: 0.75, sweepStart: 1.5, sweepLength: 0.8, sparkle: 2.4, pitch: 0.26 };
const renderPoses: Record<string, PartPose> = {
  cube: { p: [-0.13, FLOOR + 0.136, -0.02], s: 0.34, r: [0, 0.5, 0] },
  cone: { p: [-0.13, FLOOR + 0.272 + 0.126, -0.02], s: 0.3, r: [0, 0.5, 0] },
  torus: { p: [0.19, FLOOR + 0.042, 0.1], s: 0.3, r: [Math.PI / 2, 0, 0] },
  sphere: { p: [0.19, FLOOR + 0.042 + 0.099, 0.1], s: 0.2 }
};
const turnYaw = (t: number) => -0.35 + 0.32 * Math.max(0, t - 0.4);
const sweepX = (t: number, rtl: boolean) => { const x = lerp(-0.52, 0.52, span(t, RENDER.sweepStart, RENDER.sweepLength)); return rtl ? -x : x; };
/** How far the render has passed a point at screen x (0 → 1). */
const rendered = (t: number, x: number, rtl: boolean) => {
  if (t >= RENDER.sweepStart + RENDER.sweepLength + 0.1) return 1;
  const sweep = sweepX(t, rtl);
  return t < RENDER.sweepStart ? 0 : rtl ? clamp01((x - sweep) / 0.14) : clamp01((sweep - x) / 0.14);
};
/** Viewport wireframes (quads, like a modelling app), matching each toy's unit-size geometry. */
function wireFor(kind: string, kit: Kit) {
  const line = new THREE.LineBasicMaterial({ color: kit.palette.ink, transparent: true, opacity: 0.7 });
  let geometry: THREE.BufferGeometry;
  if (kind === 'cube') {
    // A box cage, three quads a side.
    const points: number[] = [];
    const h = 0.41;
    for (let i = 0; i <= 3; i++) {
      const v = -h + (2 * h * i) / 3;
      for (const f of [h, -h]) {
        points.push(v, -h, f, v, h, f, -h, v, f, h, v, f); // front / back
        points.push(f, v, -h, f, v, h, f, -h, v, f, h, v); // sides
        points.push(v, f, -h, v, f, h, -h, f, v, h, f, v); // top / bottom
      }
    }
    geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  } else {
    const source = kind === 'cone' ? new THREE.ConeGeometry(0.45, 0.88, 12, 3).translate(0, 0.015, 0)
      : kind === 'torus' ? new THREE.TorusGeometry(0.34, 0.145, 8, 18)
      : new THREE.SphereGeometry(0.505, 14, 10);
    geometry = new THREE.EdgesGeometry(source, 1); // quads only: no diagonals
    source.dispose();
  }
  const wire = new THREE.LineSegments(geometry, line);
  wire.visible = false;
  return wire;
}
/** A soft round shadow, drawn once. */
function shadowTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const g = canvas.getContext('2d')!;
  const gradient = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(0,0,0,0.55)');
  gradient.addColorStop(0.55, 'rgba(0,0,0,0.25)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gradient;
  g.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}
/** A part's look: 0 wire only, then clay filling in under the wire, then (behind the sweep) the rendered candy. */
function setLook(toy: Toy, fill: number, done: number, clay: THREE.Color) {
  const solid = toy.object.children[0] as THREE.Mesh;
  solid.visible = fill > 0;
  for (const material of toy.materials) {
    const fading = fill < 1;
    if (material.transparent !== fading) { material.transparent = fading; material.needsUpdate = true; }
    material.opacity = fill;
  }
  setClay(toy, 1 - done, clay);
  const wire = toy.parts.wire as THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial> | undefined;
  if (wire) { wire.visible = done < 1; wire.material.opacity = 0.7 * (1 - done); }
}
const render: Story = {
  parts: { cube: { kind: 'cube', paint: 'sky' }, cone: { kind: 'cone', paint: 'sun' }, sphere: { kind: 'ball', paint: 'bubblegum' }, torus: { kind: 'torus', paint: 'grape' } },
  still: 2.9,
  frame(t) {
    const parts: Record<string, PartPose> = {};
    Object.entries(renderPoses).forEach(([name, pose], k) => {
      const land = thump(t, 0.55 + k * 0.08, 0.2);
      parts[name] = { ...pose, sq: 0.15 * land };
    });
    return { yaw: turnYaw(t), pitch: RENDER.pitch, parts };
  },
  apply(t, toys, rtl, kit) {
    const clay = kit.palette.cream.clone().lerp(kit.palette.ink, 0.45);
    const yaw = turnYaw(t);
    Object.entries(renderPoses).forEach(([name, pose], k) => {
      const toy = toys[name];
      if (!toy.parts.wire) toy.object.add((toy.parts.wire = wireFor(toy.kind, kit)));
      // Screen x of the part after the turntable turn (mirrored in Arabic): the sweep reaches it there.
      const px = (rtl ? -1 : 1) * (pose.p[0] * Math.cos(yaw) + pose.p[2] * Math.sin(yaw));
      setLook(toy, easeOut(span(t, RENDER.clay + k * 0.1, 0.3)), rendered(t, px, rtl), clay);
    });
  },
  reset(toys) {
    for (const toy of Object.values(toys)) {
      setLook(toy, 1, 1, new THREE.Color());
      if (toy.parts.wire) toy.parts.wire.visible = false;
    }
  },
  extras(kit) {
    // The turntable (a disc with a soft shadow on it), turned with the scene's pitch.
    const floor = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.05, 64), kit.make(kit.palette.cream, { roughness: 0.45, clearcoat: 0.3 }));
    disc.position.y = FLOOR - 0.025;
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.62), new THREE.MeshBasicMaterial({ map: shadowTexture(), color: kit.palette.ink, transparent: true, opacity: 0, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = FLOOR + 0.002;
    floor.add(disc, shadow);
    // The render region: four corner marks and a scan line.
    const mark = new THREE.MeshBasicMaterial({ color: kit.palette.ink, transparent: true, opacity: 0, depthWrite: false });
    const region = new THREE.Group();
    for (const [x, y] of [[-1, 1], [1, 1], [1, -1], [-1, -1]]) {
      const corner = new THREE.Group();
      corner.add(new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.014).translate(-0.06 * x, 0, 0), mark));
      corner.add(new THREE.Mesh(new THREE.PlaneGeometry(0.014, 0.12).translate(0, -0.06 * y, 0), mark));
      corner.position.set(0.52 * x, 0.4 * y, 0);
      region.add(corner);
    }
    const scan = new THREE.Mesh(new THREE.PlaneGeometry(0.014, 0.8), new THREE.MeshBasicMaterial({ color: kit.palette.cream, transparent: true, opacity: 0, depthWrite: false }));
    const shape = new THREE.Shape();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 ? 0.09 : 0.5;
      const a = (i * Math.PI) / 4 + Math.PI / 2;
      if (i) shape.lineTo(Math.cos(a) * r, Math.sin(a) * r); else shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    const sparkle = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 }).center(), kit.make(kit.palette.sun, { roughness: 0.2 }));
    return [floor, region, scan, sparkle];
  },
  updateExtras(t, [floor, region, scan, sparkle], rtl) {
    // Turntable: pops in first, clay until the sweep passes its middle, then cream with the shadow on it.
    const done = rendered(t, 0, rtl);
    floor.rotation.set(RENDER.pitch, 0, 0);
    floor.scale.setScalar(pop(span(t, 0.1, 0.4)));
    const [disc, shadow] = floor.children as THREE.Mesh[];
    const discMaterial = disc.material as THREE.MeshStandardMaterial;
    const base = discMaterial.userData.base as { color: THREE.Color };
    discMaterial.color.copy(base.color).lerp(new THREE.Color(base.color).offsetHSL(0, -0.3, -0.18), 1 - done);
    (shadow.material as THREE.MeshBasicMaterial).opacity = 0.65 * done;
    // Render region: corners snap in, the scan line runs, both fade once it is done.
    const v = span(t, RENDER.sweepStart, RENDER.sweepLength);
    const show = span(t, RENDER.sweepStart - 0.2, 0.2) * (1 - span(t, RENDER.sweepStart + RENDER.sweepLength + 0.1, 0.3));
    region.scale.setScalar(lerp(1.15, 1, easeOut(span(t, RENDER.sweepStart - 0.2, 0.25))));
    region.position.set(0, -0.02, 0.3);
    region.children.forEach((corner) => ((corner.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.75 * show);
    ((scan as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = v > 0 && v < 1 ? 0.95 : 0;
    scan.position.set(sweepX(t, rtl), -0.02, 0.3);
    const g = span(t, RENDER.sparkle, 0.4);
    sparkle.scale.setScalar(0.14 * pop(g) * (g >= 1 ? 1 + 0.1 * Math.sin(t * 3) : 1));
    sparkle.position.set(rtl ? -0.36 : 0.36, 0.3, 0.3); // top right (top left in Arabic, where the burst is mirrored too)
    sparkle.rotation.z = (rtl ? -1 : 1) * (-0.9 * (1 - easeOut(g)) + (g >= 1 ? 0.15 * Math.sin(t * 1.3) : 0));
  },
  events(from, to, hooks) {
    if (crossed(from, to, RENDER.sparkle)) hooks.burst([0.36, 0.3, 0.3], 18, true);
  }
};

/** Keyed by the card item's `icon`. */
export const stories: Record<string, Story> = { ux, game, render };
