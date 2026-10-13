// A burst of candy confetti from a point on screen: a handful of the worlds' shapes fly out and fall away.
// Used when the email is copied (contact block) and when the brief is downloaded. Styles: .contact-confetti in global.css.
const COLOURS = ['--toy-tangerine', '--toy-sun', '--toy-grape', '--toy-mint', '--toy-sky', '--toy-bubblegum'];
const SHAPES = ['--shape-star', '--shape-triangle', '--shape-dpad', '--shape-tile'];
const still = matchMedia('(prefers-reduced-motion: reduce)');
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

export function burst(x: number, y: number) {
  if (still.matches) return;
  for (let k = 0; k < 14; k++) {
    const piece = document.createElement('i');
    piece.className = 'contact-confetti';
    piece.setAttribute('aria-hidden', 'true');
    piece.style.cssText = `left: ${x}px; top: ${y}px; --candy-shape: var(${pick(SHAPES)}); background: var(${pick(COLOURS)});`;
    document.body.append(piece);
    const angle = (k / 14) * Math.PI * 2 + Math.random() * 0.4;
    const reach = 50 + Math.random() * 70;
    const dx = Math.cos(angle) * reach;
    const dy = Math.sin(angle) * reach - 30;
    const spin = (Math.random() - 0.5) * 540;
    piece.animate([
      { transform: 'translate(-50%, -50%) scale(.4) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(calc(-50% + ${dx * 1.2}px), calc(-50% + ${dy + 90}px)) scale(.8) rotate(${spin}deg)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 300, easing: 'cubic-bezier(.2, .7, .4, 1)' }).finished.then(() => piece.remove());
  }
}
