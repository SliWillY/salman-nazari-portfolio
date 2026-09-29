// The toy box: Cinema 4D-style candy and clay primitives, modelled in code at unit size (about 1 across) so the
// engine can scale them freely. Colours come from the --toy-* tokens in global.css (read by the engine into a Palette).
// Every toy is a Group (`object`) the engine moves, turns and squashes; `parts` exposes pieces a story animates
// (the XP bar's fill, the buddy's pupils…). Materials remember their base look so a story can turn them to clay.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const PAINTS = ['sun', 'tangerine', 'grape', 'mint', 'sky', 'bubblegum', 'cherry', 'cream', 'ink'] as const;
export type PaintName = (typeof PAINTS)[number];
export type Palette = Record<PaintName, THREE.Color>;

export type ToyKind =
  | 'ball' | 'cube' | 'cone' | 'torus' | 'donut' | 'pill' | 'worm' | 'coil' | 'bubbles' | 'candycorn' | 'eyeball'
  | 'striped' | 'star' | 'coin' | 'cursor' | 'button' | 'panel' | 'bar' | 'buddy' | 'platform' | 'gem' | 'cross' | 'ridgeball';

export interface Toy {
  kind: ToyKind;
  object: THREE.Group;
  parts: Record<string, THREE.Object3D>;
  materials: THREE.MeshStandardMaterial[];
}

type Look = { roughness?: number; clearcoat?: number; flat?: boolean; vertexColors?: boolean };

/** Materials: glossy candy (clearcoat) on capable screens, a cheaper standard material otherwise. */
export function createKit(palette: Palette, hq: boolean) {
  const materials: THREE.MeshStandardMaterial[] = [];
  const make = (color: THREE.Color, look: Look = {}) => {
    const params = { color: color.clone(), roughness: look.roughness ?? 0.34, metalness: 0, flatShading: look.flat ?? false, vertexColors: look.vertexColors ?? false };
    const material = hq
      ? new THREE.MeshPhysicalMaterial({ ...params, clearcoat: look.clearcoat ?? 0.7, clearcoatRoughness: 0.24 })
      : new THREE.MeshStandardMaterial(params);
    material.userData.base = { color: material.color.clone(), roughness: material.roughness, clearcoat: hq ? (material as THREE.MeshPhysicalMaterial).clearcoat : 0 };
    materials.push(material);
    return material;
  };
  return { palette, make, materials };
}
export type Kit = ReturnType<typeof createKit>;

const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material) => new THREE.Mesh(geometry, material);

/** Solid colour bands along one axis (by vertex position, 0-1 from low to high). */
function bands(geometry: THREE.BufferGeometry, axis: 'x' | 'y', stops: [number, THREE.Color][]) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const [lo, hi] = axis === 'y' ? [box.min.y, box.max.y] : [box.min.x, box.max.x];
  const position = geometry.getAttribute('position');
  const colors = new Float32Array(position.count * 3);
  for (let i = 0; i < position.count; i++) {
    const v = ((axis === 'y' ? position.getY(i) : position.getX(i)) - lo) / (hi - lo || 1);
    const color = stops.find(([until]) => v <= until)?.[1] ?? stops[stops.length - 1][1];
    colors.set([color.r, color.g, color.b], i * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}
const solid = (geometry: THREE.BufferGeometry, color: THREE.Color) => bands(geometry, 'y', [[1, color]]);

/** Push vertices out along their normal by f(vertex) (ridges, ribs). */
function displace(geometry: THREE.BufferGeometry, f: (p: THREE.Vector3) => number, normalAt: (p: THREE.Vector3) => THREE.Vector3) {
  const position = geometry.getAttribute('position');
  const p = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    p.fromBufferAttribute(position, i);
    p.addScaledVector(normalAt(p.clone()), f(p));
    position.setXYZ(i, p.x, p.y, p.z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

const lathe = (profile: [number, number][], segments = 48) => new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments);

function tube(points: THREE.Vector3[], radius: number, segments: number) {
  const curve = new THREE.CatmullRomCurve3(points);
  const body = new THREE.TubeGeometry(curve, segments, radius, 16, false);
  const cap = (at: number) => new THREE.SphereGeometry(radius, 16, 12).translate(...curve.getPoint(at).toArray());
  return { body, start: cap(0), end: cap(1) };
}

function starShape(points: number, outer: number, inner: number) {
  const shape = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = Math.PI / 2 + (i * Math.PI) / points;
    if (i) shape.lineTo(Math.cos(a) * r, Math.sin(a) * r); else shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  return shape;
}

export function buildToy(kind: ToyKind, kit: Kit): Toy {
  const { palette: c, make } = kit;
  const object = new THREE.Group();
  const parts: Record<string, THREE.Object3D> = {};
  const add = (child: THREE.Object3D) => { object.add(child); return child; };
  const before = kit.materials.length;

  switch (kind) {
    case 'ball':
      add(mesh(new THREE.SphereGeometry(0.5, 48, 32), make(c.bubblegum)));
      break;
    case 'cube':
      add(mesh(new RoundedBoxGeometry(0.8, 0.8, 0.8, 5, 0.14), make(c.sky)));
      break;
    case 'cone':
      add(mesh(lathe([[0, -0.42], [0.36, -0.42], [0.42, -0.39], [0.44, -0.34], [0.07, 0.4], [0.035, 0.44], [0, 0.45]]), make(c.sun)));
      break;
    case 'torus':
      add(mesh(new THREE.TorusGeometry(0.34, 0.14, 28, 72), make(c.grape)));
      break;
    case 'donut': {
      const R = 0.33;
      const geometry = displace(new THREE.TorusGeometry(R, 0.15, 32, 140), (p) => 0.018 * Math.cos(Math.atan2(p.y, p.x) * 30), (p) => {
        const u = Math.atan2(p.y, p.x);
        return p.sub(new THREE.Vector3(Math.cos(u) * R, Math.sin(u) * R, 0)).normalize();
      });
      add(mesh(geometry, make(c.sky)));
      break;
    }
    case 'pill':
      add(mesh(new THREE.CapsuleGeometry(0.2, 0.56, 8, 24), make(c.sun)));
      break;
    case 'worm': {
      const { body, start, end } = tube([[-0.46, -0.12, 0], [-0.26, 0.12, 0.06], [-0.05, -0.1, -0.06], [0.14, 0.1, 0.06], [0.31, -0.06, 0], [0.46, 0.14, -0.06]].map((p) => new THREE.Vector3(...p)), 0.075, 160);
      const stops: [number, THREE.Color][] = [[0.12, c.cream], [0.32, c.sun], [0.55, c.tangerine], [0.78, c.cherry], [1, c.grape]];
      const geometry = mergeGeometries([bands(body, 'x', stops), solid(start, c.cream), solid(end, c.grape)]);
      add(mesh(geometry, make(new THREE.Color(1, 1, 1), { vertexColors: true })));
      break;
    }
    case 'coil': {
      const turns = 4.5;
      const points = Array.from({ length: 64 }, (_, i) => {
        const t = (i / 63) * turns * Math.PI * 2;
        return new THREE.Vector3(Math.cos(t) * 0.26, -0.42 + (0.84 * i) / 63, Math.sin(t) * 0.26);
      });
      const { body, start, end } = tube(points, 0.065, 260);
      add(mesh(mergeGeometries([body, start, end]), make(c.grape)));
      break;
    }
    case 'bubbles':
      add(mesh(mergeGeometries([-0.4, -0.2, 0, 0.2, 0.4].map((x) => new THREE.SphereGeometry(0.17, 32, 20).translate(x, 0, 0))), make(c.bubblegum)));
      break;
    case 'candycorn': {
      const geometry = lathe([[0, -0.4], [0.3, -0.4], [0.36, -0.37], [0.38, -0.31], [0.12, 0.38], [0.06, 0.44], [0, 0.46]]);
      add(mesh(bands(geometry, 'y', [[0.36, c.tangerine], [0.72, c.sun], [1, c.cream]]), make(new THREE.Color(1, 1, 1), { vertexColors: true })));
      break;
    }
    case 'eyeball': {
      add(mesh(new THREE.SphereGeometry(0.5, 48, 32), make(c.cream, { roughness: 0.25 })));
      const iris = mesh(new THREE.SphereGeometry(0.503, 48, 12, 0, Math.PI * 2, 0, 0.6).rotateX(Math.PI / 2), make(c.mint, { roughness: 0.3 }));
      const pupil = mesh(new THREE.SphereGeometry(0.507, 32, 8, 0, Math.PI * 2, 0, 0.3).rotateX(Math.PI / 2), make(c.ink, { roughness: 0.15 }));
      add(iris); add(pupil);
      break;
    }
    case 'striped': {
      const profile: [number, number][] = [[0, -0.46], [0.2, -0.46], [0.27, -0.44], [0.3, -0.4]];
      for (let i = 0; i <= 40; i++) {
        const y = -0.4 + (0.8 * i) / 40;
        profile.push([0.3 + 0.045 * (0.5 + 0.5 * Math.cos(((y + 0.4) / 0.8) * Math.PI * 2 * 4)), y]);
      }
      profile.push([0.27, 0.44], [0.2, 0.46], [0, 0.46]);
      const stops: [number, THREE.Color][] = [];
      for (let i = 1; i <= 9; i++) stops.push([i / 9, i % 2 ? c.grape : c.sun]);
      add(mesh(bands(lathe(profile, 56), 'y', stops), make(new THREE.Color(1, 1, 1), { vertexColors: true })));
      break;
    }
    case 'star': {
      const geometry = new THREE.ExtrudeGeometry(starShape(5, 0.5, 0.22), { depth: 0.14, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.06, bevelSegments: 5, curveSegments: 4 }).center();
      add(mesh(geometry, make(c.sun)));
      break;
    }
    case 'coin':
      add(mesh(lathe([[0, -0.08], [0.4, -0.08], [0.45, -0.06], [0.47, 0], [0.45, 0.06], [0.4, 0.08], [0.33, 0.08], [0.31, 0.055], [0, 0.055]], 56).rotateX(Math.PI / 2), make(c.sun, { roughness: 0.25 })));
      break;
    case 'cursor': {
      const shape = new THREE.Shape();
      [[0, 0], [0, -0.9], [0.23, -0.69], [0.41, -1.04], [0.56, -0.97], [0.38, -0.63], [0.68, -0.63]].forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 4 });
      // Tip at the origin: the engine places the cursor by its tip.
      geometry.translate(0, 0, -0.06).scale(0.95, 0.95, 1);
      add(mesh(geometry, make(c.ink, { roughness: 0.2 })));
      break;
    }
    case 'button':
      add(mesh(new RoundedBoxGeometry(1, 0.34, 0.22, 5, 0.11), make(c.grape)));
      break;
    case 'panel': {
      add(mesh(new RoundedBoxGeometry(1, 0.72, 0.08, 4, 0.04), make(c.cream, { roughness: 0.4 })));
      add(mesh(new RoundedBoxGeometry(0.9, 0.08, 0.03, 2, 0.015), make(c.grape))).position.set(0, 0.27, 0.045);
      const line = make(c.cream.clone().lerp(c.ink, 0.22), { roughness: 0.5 });
      add(mesh(new RoundedBoxGeometry(0.46, 0.05, 0.02, 2, 0.01), line)).position.set(-0.2, 0.13, 0.045);
      add(mesh(new RoundedBoxGeometry(0.3, 0.05, 0.02, 2, 0.01), line)).position.set(-0.28, 0.04, 0.045);
      break;
    }
    case 'bar': {
      add(mesh(new RoundedBoxGeometry(1, 0.14, 0.12, 4, 0.06), make(c.cream, { roughness: 0.4 })));
      const fill = mesh(new RoundedBoxGeometry(0.94, 0.09, 0.13, 4, 0.04).translate(0.47, 0, 0), make(c.mint));
      fill.position.x = -0.47;
      fill.scale.x = 0.4;
      parts.fill = add(fill);
      break;
    }
    case 'buddy': {
      add(mesh(new RoundedBoxGeometry(0.86, 0.86, 0.86, 5, 0.26), make(c.mint)));
      // Two simple glossy black eyes.
      const dark = make(c.ink, { roughness: 0.15 });
      const eyes = new THREE.Group();
      for (const x of [-0.18, 0.18]) eyes.add(mesh(new THREE.SphereGeometry(0.11, 24, 16), dark).translateX(x).translateY(0.1).translateZ(0.38));
      parts.eyes = add(eyes);
      add(mesh(new THREE.TorusGeometry(0.11, 0.024, 8, 24, Math.PI).rotateZ(Math.PI), dark)).position.set(0, -0.1, 0.43);
      break;
    }
    case 'platform':
      add(mesh(new RoundedBoxGeometry(1, 0.26, 0.46, 4, 0.1), make(c.tangerine)));
      break;
    case 'gem':
      add(mesh(new THREE.OctahedronGeometry(0.5, 0), make(c.sun, { flat: true, roughness: 0.3 })));
      break;
    case 'cross': {
      const arm = () => new THREE.CapsuleGeometry(0.12, 0.66, 8, 20);
      add(mesh(mergeGeometries([arm().rotateZ(Math.PI / 4), arm().rotateZ(-Math.PI / 4)]), make(c.cherry)));
      break;
    }
    case 'ridgeball': {
      const geometry = displace(new THREE.SphereGeometry(0.47, 64, 64), (p) => 0.028 * Math.cos(Math.asin(Math.max(-1, Math.min(1, p.y / 0.47))) * 22), (p) => p.normalize());
      add(mesh(geometry, make(c.tangerine, { roughness: 0.5, clearcoat: 0.3 })));
      break;
    }
  }
  return { kind, object, parts, materials: kit.materials.slice(before) };
}

/** Turn a toy toward unrendered viewport clay (1) or back to its own look (0). */
export function setClay(toy: Toy, amount: number, clay: THREE.Color) {
  for (const material of toy.materials) {
    const base = material.userData.base as { color: THREE.Color; roughness: number; clearcoat: number };
    if (material.vertexColors) continue;
    material.color.copy(base.color).lerp(clay, amount);
    material.roughness = base.roughness + (0.85 - base.roughness) * amount;
    if ('clearcoat' in material) (material as THREE.MeshPhysicalMaterial).clearcoat = base.clearcoat * (1 - amount);
  }
}

/** Paint a toy's main (first) material another palette colour, e.g. platforms in three colours. */
export function tint(toy: Toy, color: THREE.Color) {
  const material = toy.materials[0];
  material.color.copy(color);
  (material.userData.base as { color: THREE.Color }).color.copy(color);
}
