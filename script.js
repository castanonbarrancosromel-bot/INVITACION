/* ============================================================
   WEDDING INVITATION - JavaScript
   Ernesto & Olivia · 08/08/2026
============================================================ */

/* ---- CONFIGURA TU NÚMERO DE WHATSAPP AQUÍ ---- */
/* Pon el número sin el signo + ni espacios, ej: 59170012345 */
const WA_NUMBER = '591TUNUMERO';

document.addEventListener('DOMContentLoaded', () => {

  // Actualizar links de WhatsApp con el número configurado
  document.querySelectorAll('.rsvp-wa-btn').forEach(btn => {
    const href = btn.getAttribute('href');
    if (href) btn.setAttribute('href', href.replace('591TUNUMERO', WA_NUMBER));
  });

  // ============================================================
  // 1. COUNTDOWN TIMER - Sábado 8 de agosto 2026, 12:00 PM
  // ============================================================
  const weddingDate = new Date('2026-08-08T12:00:00-04:00'); // Bolivia UTC-4

  function updateCountdown() {
    const now  = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent    = '¡Es';
      document.getElementById('hours').textContent   = 'hoy';
      document.getElementById('minutes').textContent = 'el';
      document.getElementById('seconds').textContent = 'día!';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent    = String(days).padStart(2, '0');
    document.getElementById('hours').textContent   = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ============================================================
  // 2. FLOATING PETALS
  // ============================================================
  const petalsContainer = document.getElementById('petals');
  const petalEmojis = ['🌸', '🌷', '✿', '🌺', '❀', '🌼', '🏵'];

  function createPetal() {
    const petal = document.createElement('span');
    petal.classList.add('petal');
    petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    petal.style.left              = Math.random() * 100 + 'vw';
    petal.style.fontSize          = (0.8 + Math.random() * 1.2) + 'rem';
    petal.style.animationDuration = (6 + Math.random() * 8) + 's';
    petal.style.animationDelay    = (Math.random() * 4) + 's';
    petal.style.opacity           = (0.4 + Math.random() * 0.5).toString();
    petalsContainer.appendChild(petal);
    setTimeout(() => petal.remove(), 14000);
  }

  for (let i = 0; i < 12; i++) { setTimeout(createPetal, i * 400); }
  setInterval(createPetal, 1800);

  // ============================================================
  // 3. SCROLL REVEAL
  // ============================================================
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((el, i) => { el.style.transitionDelay = (i * 0.15) + 's'; });
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(
    '.family-card, .padrino-card, .dress-item, .song-card, .closing-monogram'
  ).forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    sectionObserver.observe(el);
  });

  // ============================================================
  // 4. WEB AUDIO - Romantic Music Box Synthesizer
  //    (Funciona sin internet, sin archivos de audio externos)
  // ============================================================
  let audioCtx     = null;
  let musicPlaying = false;
  let seqTimer     = null;
  let seqIndex     = 0;
  let masterGain   = null;
  let delayNode    = null;

  // Melodía romántica (Te Amaré / balada en Do Mayor y La menor)
  const melody = [
    [261.63,1],[329.63,1],[392.00,1],[523.25,2],[392.00,1],[329.63,1],
    [246.94,1],[293.66,1],[392.00,1],[493.88,2],[392.00,1],[293.66,1],
    [220.00,1],[261.63,1],[329.63,1],[440.00,2],[329.63,1],[261.63,1],
    [174.61,1],[220.00,1],[261.63,1],[349.23,2],[261.63,1],[220.00,1],
    [523.25,1],[587.33,1],[659.25,2],[523.25,1],[587.33,1],[659.25,2],
    [493.88,1],[523.25,1],[587.33,2],[493.88,1],[523.25,1],[587.33,2],
    [349.23,1],[392.00,1],[440.00,2],[523.25,1],[440.00,1],[392.00,1],
    [392.00,2],[440.00,1],[493.88,1],[587.33,2],[392.00,1],[493.88,1]
  ];

  function initAudio() {
    if (audioCtx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx   = new AC();

    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.14;
    masterGain.connect(audioCtx.destination);

    // Eco suave para efecto de sala
    delayNode = audioCtx.createDelay(1.0);
    delayNode.delayTime.value = 0.36;
    const fbGain = audioCtx.createGain();
    fbGain.gain.value = 0.26;
    delayNode.connect(fbGain);
    fbGain.connect(delayNode);
    delayNode.connect(masterGain);
  }

  function playNote(freq, dur) {
    if (!audioCtx) return;
    const f = freq * 2; // Octava arriba = tono de caja de música

    // Oscilador principal (cálido triangular)
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.value = f;

    // Sobretono brillante
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = f * 2;
    osc2.detune.value = 7;

    const g1 = audioCtx.createGain();
    g1.gain.setValueAtTime(0, audioCtx.currentTime);
    g1.gain.linearRampToValueAtTime(0.28, audioCtx.currentTime + 0.018);
    g1.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur * 1.8);

    const g2 = audioCtx.createGain();
    g2.gain.setValueAtTime(0, audioCtx.currentTime);
    g2.gain.linearRampToValueAtTime(0.14, audioCtx.currentTime + 0.012);
    g2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur * 0.85);

    osc1.connect(g1); g1.connect(masterGain); g1.connect(delayNode);
    osc2.connect(g2); g2.connect(masterGain); g2.connect(delayNode);

    osc1.start(); osc1.stop(audioCtx.currentTime + dur * 2.5);
    osc2.start(); osc2.stop(audioCtx.currentTime + dur * 2.5);
  }

  function playStep() {
    const [freq, mult] = melody[seqIndex];
    const BASE = 0.31;
    playNote(freq, BASE * mult);
    seqIndex = (seqIndex + 1) % melody.length;
    seqTimer = setTimeout(playStep, BASE * 1000);
  }

  function toggleMusic() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const musicBtn = document.getElementById('musicBtn');
    musicPlaying   = !musicPlaying;

    if (musicPlaying) {
      seqIndex = 0;
      playStep();
      musicBtn.classList.add('playing');
      musicBtn.textContent = '⏸';
      musicBtn.title = 'Pausar música';
    } else {
      clearTimeout(seqTimer);
      musicBtn.classList.remove('playing');
      musicBtn.textContent = '♪';
      musicBtn.title = 'Reproducir música';
    }
  }

  document.getElementById('musicBtn').addEventListener('click', toggleMusic);

  // ============================================================
  // 5. SMOOTH SCROLL
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ============================================================
  // 6. PARALLAX HERO
  // ============================================================
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (hero && scrolled < window.innerHeight) {
      hero.style.backgroundPositionY = (scrolled * 0.4) + 'px';
    }
  }, { passive: true });

  // ============================================================
  // 7. HEART CLICK EASTER EGG
  // ============================================================
  const heartBig = document.querySelector('.heart-big');
  if (heartBig) {
    heartBig.addEventListener('click', () => {
      heartBig.style.transform = 'scale(1.8)';
      heartBig.style.color     = '#e8386d';
      setTimeout(() => { heartBig.style.transform = ''; heartBig.style.color = ''; }, 400);
      for (let i = 0; i < 8; i++) { setTimeout(createPetal, i * 100); }
    });
    heartBig.style.cursor = 'pointer';
  }

});
