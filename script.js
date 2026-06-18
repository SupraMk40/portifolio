(() => {
  const videoUrl =
    'https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8';

  const bgVideo = document.getElementById('bgVideo');
  const openContactBtn = document.getElementById('openContact');
  const toggleEmailBtn = document.getElementById('toggleEmail');
  const emailBox = document.getElementById('emailBox');
  const emailForm = document.getElementById('emailForm');
  const emailInput = document.getElementById('emailInput');
  const emailSuccess = document.getElementById('emailSuccess');

  // Typewriter placeholder
  const placeholderText = 'seu@email.com';
  let phIndex = 0;
  let phTimer = null;

  function startTypewriter() {
    if (!emailInput) return;
    emailInput.value = '';
    emailInput.placeholder = '';
    phIndex = 0;
    clearInterval(phTimer);

    phTimer = setInterval(() => {
      phIndex++;
      emailInput.placeholder = placeholderText.slice(0, phIndex);
      if (phIndex >= placeholderText.length) {
        clearInterval(phTimer);
      }
    }, 55);
  }

  function openEmail() {
    if (!emailBox) return;
    emailBox.classList.remove('hidden');
    emailBox.scrollIntoView({ block: 'center', behavior: 'smooth' });
    emailInput?.focus();
    if (emailInput.placeholder !== placeholderText) startTypewriter();
  }

  function toggleEmail() {
    if (!emailBox) return;
    const isHidden = emailBox.classList.contains('hidden');
    if (isHidden) openEmail();
    else emailBox.classList.add('hidden');
  }

  // Email form
  emailForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    emailSuccess?.classList.remove('hidden');
    if (emailSuccess) emailSuccess.textContent = 'Obrigado! Entrarei em contato em breve.';

    // keep UI premium: disable submit briefly
    const submitBtn = emailForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar';
      }, 900);
    }

    // optional: clear input
    if (emailInput) emailInput.value = '';
  });

  openContactBtn?.addEventListener('click', openEmail);
  toggleEmailBtn?.addEventListener('click', toggleEmail);

  // Background video with hls.js
  async function initVideo() {
    if (!bgVideo) return;

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    try {
      if (isSafari || !window.Hls || !window.Hls.isSupported()) {
        // Safari (or native HLS) fallback
        bgVideo.src = videoUrl;
        await bgVideo.play().catch(() => {});
        return;
      }

      const hls = new window.Hls({
        autoStart: true,
        startLevel: 0,
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(bgVideo);

      hls.on(window.Hls.Events.ERROR, (event, data) => {
        // Fail silently but keep premium feel.
        // If needed, you could attempt recovery.
        // console.warn('HLS error', data);
      });

      bgVideo.muted = true;
      bgVideo.playsInline = true;
      bgVideo.loop = true;

      await bgVideo.play().catch(() => {});

    } catch (err) {
      // final fallback
      try {
        bgVideo.src = videoUrl;
        await bgVideo.play().catch(() => {});
      } catch {}
    }
  }

// Render Projects Gallery
  async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    try {
      const res = await fetch('./projects.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const projects = Array.isArray(data?.projetos) ? data.projetos : [];

      if (projects.length === 0) {
        grid.innerHTML =
          '<div class="text-white/70 col-span-full text-center py-10">Nenhum projeto encontrado.</div>';
        return;
      }

      grid.innerHTML = projects
        .map((p) => {
          const title = p?.titulo ?? '';
          const descricao = p?.descricao ?? '';
          const imageUrl = p?.imageUrl ?? '';
          const tags = Array.isArray(p?.tags) ? p.tags : [];

          const tagsHtml = tags
            .slice(0, 4)
            .map(
              (t) =>
                `<span class="projects-tag inline-flex items-center rounded-full glass-pill px-3 py-1 text-[11px] text-white/80">${escapeHtml(
                  String(t)
                )}</span>`
            )
            .join('');

          return `
            <article class="projects-card glass-panel relative overflow-hidden rounded-2xl">
              <div class="projects-media absolute inset-0">
                <img
                  class="projects-img h-full w-full object-cover"
                  src="${imageUrl}"
                  alt="${escapeHtml(title)}"
                  loading="lazy"
                  decoding="async"
                />
                <div class="projects-overlay absolute inset-0" aria-hidden="true"></div>
                <div class="noise-overlay absolute inset-0 pointer-events-none"></div>
              </div>

              <div class="relative h-full p-5 flex flex-col justify-end">
                <div class="projects-meta">
                  <h3 class="projects-title text-lg font-medium tracking-tight">${escapeHtml(
                    title
                  )}</h3>
                  <p class="projects-desc mt-1 text-sm text-white/70 leading-[1.55]">${escapeHtml(
                    descricao
                  )}</p>
                  <div class="projects-tags mt-4 flex flex-wrap gap-2">
                    ${tagsHtml}
                  </div>
                </div>
              </div>
            </article>
          `;
        })
        .join('');
    } catch (err) {
      const grid = document.getElementById('projectsGrid');
      if (!grid) return;
      grid.innerHTML =
        '<div class="text-white/70 col-span-full text-center py-10">Falha ao carregar projetos.</div>';
    }
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '&#039;');
  }

  // Start
  document.addEventListener('DOMContentLoaded', () => {
    initVideo();
    startTypewriter();
    loadProjects();
  });
})();


