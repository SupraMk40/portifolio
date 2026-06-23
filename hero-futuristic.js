// Placeholder hero (sem React). Mantém compatibilidade com seu layout atual.
// Versão completa (Three.js) depende de adicionarmos dependências via <script type="module">.
(() => {
  const mount = document.getElementById('hero-3d');
  if (!mount) return;

  // fallback visual
  const overlay = document.createElement('div');
  overlay.className = 'hero-3d-overlay';
  mount.appendChild(overlay);

  let raf = 0;
  let t0 = performance.now();

  const animate = () => {
    const t = (performance.now() - t0) / 1000;
    overlay.style.transform = `translate3d(0, ${Math.sin(t * 0.9) * 6}px, 0)`;
    raf = requestAnimationFrame(animate);
  };

  raf = requestAnimationFrame(animate);

  // Reduce motion
  const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (mq && mq.matches) cancelAnimationFrame(raf);
})();

