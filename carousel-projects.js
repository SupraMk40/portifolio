(() => {
  const root = document.getElementById('projectsCarousel');
  if (!root) return;

  const listEl = root.querySelector('[data-carousel-list]');
  const titleEl = root.querySelector('[data-project-title]');
  const metaEl = root.querySelector('[data-project-meta]');
  const styleEl = root.querySelector('[data-project-style]');
  const heroImgEl = root.querySelector('[data-project-hero]');
  const openBtnEl = root.querySelector('[data-project-open]');

  const prevBtn = root.querySelector('[data-carousel-prev]');
  const nextBtn = root.querySelector('[data-carousel-next]');

  let projects = [];
  let index = 0;

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function render() {
    if (!projects.length) return;

    index = clamp(index, 0, projects.length - 1);
    const p = projects[index];

    // Light feedback for perceived performance + a11y
    if (titleEl) {
      titleEl.style.opacity = '0.6';
      titleEl.textContent = p.nome || '';
      titleEl.style.transition = 'opacity 160ms ease';
      requestAnimationFrame(() => {
        titleEl.style.opacity = '1';
      });
    }

    if (metaEl) metaEl.textContent = p.segmento ? `Segmento: ${p.segmento}` : '';
    if (styleEl) styleEl.textContent = p.estilo ? `Estilo de design: ${p.estilo}` : '';


    if (heroImgEl && p.imageHeroUrl) {
      heroImgEl.src = p.imageHeroUrl;
      heroImgEl.alt = p.nome || 'Projeto';
    }

    if (openBtnEl) {
      openBtnEl.href = p.urlProjeto || '#';
    }

    // Paginação/carregamento progressivo (opcional)
    if (listEl) {
      const dots = listEl.querySelectorAll('[data-dot]');
      dots.forEach((d, i) => d.setAttribute('aria-current', i === index ? 'true' : 'false'));
    }

    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === projects.length - 1;
  }

  function buildDots() {
    if (!listEl) return;
    listEl.innerHTML = '';
    projects.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'projects-dot';
      btn.setAttribute('data-dot', '');
      btn.setAttribute('aria-label', `Projeto ${i + 1}`);
      btn.setAttribute('aria-current', i === index ? 'true' : 'false');
      btn.addEventListener('click', () => {
        index = i;
        render();
      });
      listEl.appendChild(btn);
    });
  }

  async function load() {
    try {
      const res = await fetch('./projects.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      projects = Array.isArray(data?.projetos) ? data.projetos : [];

      if (!projects.length) {
        root.innerHTML = '<div class="text-white/70">Nenhum projeto encontrado.</div>';
        return;
      }

      index = 0;
      buildDots();
      render();
    } catch (e) {
      root.innerHTML = '<div class="text-white/70">Falha ao carregar projetos.</div>';
    }
  }

  prevBtn?.addEventListener('click', () => {
    index -= 1;
    render();
  });

  nextBtn?.addEventListener('click', () => {
    index += 1;
    render();
  });

  // Teclado
  document.addEventListener('keydown', (ev) => {
    if (!root.contains(document.activeElement)) {
      if (ev.key === 'ArrowLeft') {
        index -= 1;
        render();
      }
      if (ev.key === 'ArrowRight') {
        index += 1;
        render();
      }
    }
  });

  load();
})();

