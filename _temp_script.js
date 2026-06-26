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

