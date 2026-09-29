// World stories for the home scene: which toys make up each world's icon and how they act it out.
// A story is a pure timeline: frame(t) gives every part's pose in stage units (x right, y up, z toward the viewer;
// 1 = the stage's size), so the engine can spring the toys in from wherever they float, loop the story, or jump to
// the finished pose (`still`) for reduced motion. apply() drives details (the XP fill, clay → render); events()
// fires the confetti between two times. Motion follows motion-graphics habits: anticipation, overshoot, squash.
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
  /** Mirror the story in Arabic (the Games run goes toward the inline end). */
  mirror: boolean;
  frame(t: number, rtl: boolean): Frame;
  apply?(t: number, toys: Record<string, Toy>, rtl: boolean, kit: Kit): void;
  events?(from: number, to: number, hooks: Hooks, rtl: boolean): void;
  /** Extra meshes owned by the story (in stage units, not turned with the frame). */
  extras?(kit: Kit): THREE.Object3D[];
  updateExtras?(t: number, extras: THREE.Object3D[], rtl: boolean): void;
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
// the bar drains at the start of every cycle. The bar fills from the inline start (right in Arabic).
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
  mirror: false,
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
  apply(t, toys, rtl) {
    const b = uxBeats(t);
    const fill = easeOut(span(b.c, b.fill, 0.55));
    const level = b.first || b.c >= b.fill ? lerp(0.35, 1, fill) + 0.06 * Math.sin(Math.PI * fill) : lerp(1, 0.35, easeInOut(span(b.c, 0, 0.4)));
    const bar = toys.bar.parts.fill;
    bar.position.x = rtl ? 0.47 : -0.47;
    bar.scale.x = (rtl ? -1 : 1) * Math.min(level, 1.04);
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
// buddy runs back. Mirrored in Arabic.
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
  mirror: true,
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
// The classic primitives (cube, cone, sphere, torus) fly in as untextured viewport clay and stack into a still life.
// A render region sweeps across in reading direction, leaving them glossy and coloured behind it, a sparkle pops,
// and the finished piece keeps turning on its turntable.
const RENDER = { sweepStart: 1.25, sweepLength: 0.85, sparkle: 2.15 };
const renderPoses: Record<string, PartPose> = {
  cube: { p: [-0.07, -0.2, 0], s: 0.34, r: [0, 0.55, 0] },
  cone: { p: [-0.07, 0.13, 0], s: 0.3, r: [0, 0.4, 0] },
  sphere: { p: [0.23, -0.25, 0.08], s: 0.22 },
  torus: { p: [0.2, 0.09, -0.12], s: 0.36, r: [1.05, 0.35, 0.3] }
};
const turnYaw = (t: number) => -0.35 + 0.32 * Math.max(0, t - 0.4);
const sweepX = (t: number, rtl: boolean) => { const x = lerp(-0.62, 0.62, span(t, RENDER.sweepStart, RENDER.sweepLength)); return rtl ? -x : x; };
const render: Story = {
  parts: { cube: { kind: 'cube' }, cone: { kind: 'cone' }, sphere: { kind: 'ball' }, torus: { kind: 'torus' } },
  still: 2.7,
  mirror: false,
  frame(t) {
    const parts: Record<string, PartPose> = {};
    Object.entries(renderPoses).forEach(([name, pose], k) => {
      const land = thump(t, 0.55 + k * 0.08, 0.2);
      parts[name] = { ...pose, sq: 0.15 * land };
    });
    return { yaw: turnYaw(t), pitch: 0.2, parts };
  },
  apply(t, toys, rtl, kit) {
    const clay = kit.palette.cream.clone().lerp(kit.palette.ink, 0.12);
    const x = sweepX(t, rtl);
    const yaw = turnYaw(t);
    for (const [name, pose] of Object.entries(renderPoses)) {
      // Screen x of the part after the turntable turn: the sweep reaches it there.
      const px = pose.p[0] * Math.cos(yaw) + pose.p[2] * Math.sin(yaw);
      const done = rtl ? clamp01((px - x) / 0.14) : clamp01((x - px) / 0.14);
      setClay(toys[name], 1 - done, clay);
    }
  },
  extras(kit) {
    const scan = new THREE.Mesh(new THREE.BoxGeometry(0.012, 1.02, 0.01), new THREE.MeshBasicMaterial({ color: kit.palette.cream, transparent: true, opacity: 0, depthWrite: false }));
    const band = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.02), new THREE.MeshBasicMaterial({ color: kit.palette.cream, transparent: true, opacity: 0, depthWrite: false }));
    const shape = new THREE.Shape();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 ? 0.09 : 0.5;
      const a = (i * Math.PI) / 4 + Math.PI / 2;
      if (i) shape.lineTo(Math.cos(a) * r, Math.sin(a) * r); else shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    const sparkle = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 }).center(), kit.make(kit.palette.sun, { roughness: 0.2 }));
    return [scan, band, sparkle];
  },
  updateExtras(t, [scan, band, sparkle], rtl) {
    const v = span(t, RENDER.sweepStart, RENDER.sweepLength);
    const active = v > 0 && v < 1;
    const x = sweepX(t, rtl);
    (scan as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>).material.opacity = active ? 0.9 : 0;
    scan.position.set(x, 0, 0.3);
    // The rendered side gets a faint wash, like the render region in a viewport.
    const wash = (band as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>).material;
    wash.opacity = active ? 0.12 : 0;
    const left = rtl ? x : -0.62;
    const right = rtl ? 0.62 : x;
    band.scale.x = Math.max(0.001, right - left);
    band.position.set((left + right) / 2, 0, 0.29);
    const g = span(t, RENDER.sparkle, 0.4);
    sparkle.scale.setScalar(0.14 * pop(g) * (g >= 1 ? 1 + 0.1 * Math.sin(t * 3) : 1));
    sparkle.position.set(0.34, 0.38, 0.3);
    sparkle.rotation.z = -0.9 * (1 - easeOut(g)) + (g >= 1 ? 0.15 * Math.sin(t * 1.3) : 0);
  },
  events(from, to, hooks) {
    if (crossed(from, to, RENDER.sparkle)) hooks.burst([0.34, 0.38, 0.3], 16, true);
  }
};

/** Keyed by the card item's `icon`. */
export const stories: Record<string, Story> = { ux, game, render };
