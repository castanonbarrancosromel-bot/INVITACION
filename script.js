/* ============================================================
   WEDDING INVITATION - JavaScript
   Ernesto & Olivia · 08/08/2026
   Dark Luxury Redesign
============================================================ */

const WA_NUMBER = '591TUNUMERO'; // ← Cambia por el número real

document.addEventListener('DOMContentLoaded', () => {

  // Actualizar links WhatsApp
  document.querySelectorAll('.rsvp-wa').forEach(btn => {
    const h = btn.getAttribute('href');
    if (h) btn.setAttribute('href', h.replace('591TUNUMERO', WA_NUMBER));
  });

  // ============================================================
  // 1. COUNTDOWN
  // ============================================================
  const weddingDate = new Date('2026-08-08T12:00:00-04:00');

  function updateCountdown() {
    const diff = weddingDate - new Date();
    if (diff <= 0) {
      ['days','hours','minutes','seconds'].forEach((id, i) => {
        document.getElementById(id).textContent = ['¡Es','hoy','el','día!'][i];
      });
      return;
    }
    document.getElementById('days').textContent    = String(Math.floor(diff / 86400000)).padStart(2,'0');
    document.getElementById('hours').textContent   = String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0');
    document.getElementById('minutes').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
    document.getElementById('seconds').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ============================================================
  // 2. FLOATING PARTICLES
  // ============================================================
  const pc   = document.getElementById('particles');
  const emojis = ['✦', '✧', '·', '✦', '✧', '🌸', '✿', '·'];

  function createParticle() {
    const p = document.createElement('span');
    p.className = 'particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left             = Math.random() * 100 + 'vw';
    p.style.fontSize         = (0.5 + Math.random() * 0.9) + 'rem';
    p.style.animationDuration= (8 + Math.random() * 10) + 's';
    p.style.animationDelay   = (Math.random() * 5) + 's';
    p.style.opacity          = (0.2 + Math.random() * 0.4).toString();
    p.style.color            = Math.random() > 0.5 ? '#c9a84c' : 'rgba(255,255,255,0.4)';
    pc.appendChild(p);
    setTimeout(() => p.remove(), 18000);
  }
  for (let i = 0; i < 10; i++) setTimeout(createParticle, i * 500);
  setInterval(createParticle, 2200);

  // ============================================================
  // 3. SCROLL REVEAL
  // ============================================================
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((el, i) => { el.style.transitionDelay = (i * 0.14) + 's'; });
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  // ============================================================
  // 4. WEB AUDIO - Music Box Synthesizer
  // ============================================================
  let audioCtx = null, playing = false, seqTimer = null, seqIdx = 0;
  let masterGain = null, delayNode = null;

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
    audioCtx  = new AC();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.14;
    masterGain.connect(audioCtx.destination);
    delayNode = audioCtx.createDelay(1.0);
    delayNode.delayTime.value = 0.36;
    const fb = audioCtx.createGain(); fb.gain.value = 0.26;
    delayNode.connect(fb); fb.connect(delayNode); delayNode.connect(masterGain);
  }

  function playNote(freq, dur) {
    if (!audioCtx) return;
    const f   = freq * 2;
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'triangle'; osc1.frequency.value = f;
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine'; osc2.frequency.value = f * 2; osc2.detune.value = 7;
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
    const [freq, mult] = melody[seqIdx];
    const B = 0.31;
    playNote(freq, B * mult);
    seqIdx = (seqIdx + 1) % melody.length;
    seqTimer = setTimeout(playStep, B * 1000);
  }

  function toggleMusic() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const btn = document.getElementById('musicBtn');
    playing = !playing;
    if (playing) {
      seqIdx = 0; playStep();
      btn.classList.add('playing'); btn.textContent = '⏸'; btn.title = 'Pausar';
    } else {
      clearTimeout(seqTimer);
      btn.classList.remove('playing'); btn.textContent = '♪'; btn.title = 'Reproducir música';
    }
  }
  document.getElementById('musicBtn').addEventListener('click', toggleMusic);

  // ============================================================
  // 5. SMOOTH SCROLL
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      const t = document.querySelector(this.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ============================================================
  // 6. HERO PARALLAX
  // ============================================================
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (hero && window.scrollY < window.innerHeight) {
      const img = hero.querySelector('.hero-bg-img');
      if (img) img.style.transform = `scale(1.08) translateY(${window.scrollY * 0.18}px)`;
    }
  }, { passive: true });

  // ============================================================
  // 7. HEART EASTER EGG
  // ============================================================
  const heart = document.getElementById('heartBig');
  if (heart) {
    heart.addEventListener('click', () => {
      heart.style.transform = 'scale(2)';
      heart.style.color = '#ff4d6d';
      setTimeout(() => { heart.style.transform = ''; heart.style.color = ''; }, 400);
      for (let i = 0; i < 10; i++) setTimeout(createParticle, i * 80);
    });
    heart.style.cursor = 'pointer';
  }

  // ============================================================
  // 8. PHOTO SLIDER — 15 fotos
  // ============================================================
  const track    = document.getElementById('sliderTrack');
  const slides   = track ? Array.from(track.querySelectorAll('.slide')) : [];
  const dotsWrap = document.getElementById('sliderDots');
  const counter  = document.getElementById('sliderCounter');
  const btnPrev  = document.getElementById('sliderPrev');
  const btnNext  = document.getElementById('sliderNext');

  if (slides.length > 0) {
    let cur = 0, autoTimer = null;
    const total = slides.length;

    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'sl-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Foto ' + (i + 1));
      d.addEventListener('click', () => { stop(); goTo(i); start(); });
      dotsWrap.appendChild(d);
    });

    function goTo(idx) {
      slides[cur].classList.remove('active');
      dotsWrap.children[cur].classList.remove('active');
      cur = (idx + total) % total;
      track.style.transform = `translateX(-${cur * 100}%)`;
      slides[cur].classList.add('active');
      dotsWrap.children[cur].classList.add('active');
      if (counter) counter.textContent = `${cur + 1} / ${total}`;
    }

    function start() { autoTimer = setInterval(() => goTo(cur + 1), 4800); }
    function stop()  { clearInterval(autoTimer); }

    slides[0].classList.add('active');
    btnPrev.addEventListener('click', () => { stop(); goTo(cur - 1); start(); });
    btnNext.addEventListener('click', () => { stop(); goTo(cur + 1); start(); });

    // Swipe táctil
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const d = tx - e.changedTouches[0].clientX;
      if (Math.abs(d) > 40) { stop(); goTo(d > 0 ? cur + 1 : cur - 1); start(); }
    });

    // Pausa hover
    const wrapper = track.closest('.slider-wrap');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', stop);
      wrapper.addEventListener('mouseleave', start);
    }

    // Teclado
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { stop(); goTo(cur - 1); start(); }
      if (e.key === 'ArrowRight') { stop(); goTo(cur + 1); start(); }
    });

    start();
  }

});
