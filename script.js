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
  // 4. YOUTUBE MUSIC — autoplay de fondo al cargar la página
  //    "Te Amaré" · Laura Pausini & Miguel Bosé
  //    https://youtu.be/W7---s02QaQ
  // ============================================================
  const YT_VIDEO_ID = 'W7---s02QaQ';
  let ytPlayer  = null;
  let ytReady   = false;
  let ytPlaying = false;

  // Contenedor invisible para el iframe de YT
  const ytWrap = document.createElement('div');
  ytWrap.id = 'yt-player-container';
  ytWrap.style.cssText =
    'position:fixed;width:1px;height:1px;bottom:0;left:0;opacity:0;pointer-events:none;z-index:-1;';
  document.body.appendChild(ytWrap);

  // Toast "toca para activar sonido" (por si el browser bloquea autoplay)
  const toast = document.createElement('div');
  toast.id = 'music-toast';
  toast.innerHTML = '🎵 Toca en cualquier lugar para activar la música';
  toast.style.cssText = `
    position:fixed;bottom:100px;left:50%;transform:translateX(-50%) translateY(20px);
    background:rgba(201,168,76,0.92);color:#111;padding:10px 22px;border-radius:50px;
    font-family:'Montserrat',sans-serif;font-size:0.72rem;letter-spacing:0.15em;
    opacity:0;transition:opacity 0.5s,transform 0.5s;pointer-events:none;z-index:9999;
    white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,0.3);`;
  document.body.appendChild(toast);

  function showToast() {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 4000);
  }

  function updateBtn(playing) {
    const btn = document.getElementById('musicBtn');
    ytPlaying = playing;
    if (playing) {
      btn.classList.add('playing'); btn.textContent = '⏸'; btn.title = 'Pausar música';
    } else {
      btn.classList.remove('playing'); btn.textContent = '♪'; btn.title = 'Reproducir música';
    }
  }

  // Llamado automáticamente por la API de YouTube
  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('yt-player-container', {
      videoId: YT_VIDEO_ID,
      playerVars: {
        autoplay:        1,          // intentar autoplay
        mute:            1,          // empieza muted (navegadores lo permiten)
        controls:        0,
        disablekb:       1,
        fs:              0,
        iv_load_policy:  3,
        modestbranding:  1,
        rel:             0,
        loop:            1,
        playlist:        YT_VIDEO_ID // necesario para loop
      },
      events: {
        onReady: function (e) {
          ytReady = true;
          e.target.setVolume(75);
          // Intentar quitar mute inmediatamente
          try {
            e.target.unMute();
            e.target.playVideo();
          } catch (_) {}
        },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.PLAYING) {
            // Verificar si aún está muted (browser bloqueó audio)
            if (ytPlayer.isMuted()) {
              // Esperar primer toque del usuario para activar
              showToast();
              const unlock = () => {
                ytPlayer.unMute();
                ytPlayer.setVolume(75);
                document.removeEventListener('click', unlock);
                document.removeEventListener('touchstart', unlock);
                toast.style.opacity = '0';
              };
              document.addEventListener('click', unlock, { once: true });
              document.addEventListener('touchstart', unlock, { once: true });
            }
            updateBtn(true);
          } else if (
            e.data === YT.PlayerState.PAUSED ||
            e.data === YT.PlayerState.ENDED
          ) {
            updateBtn(false);
          }
        }
      }
    });
  };

  // Cargar la API de YouTube inmediatamente al abrir la página
  (function loadYTScript() {
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  })();

  // Botón ♪ — pausa / reanuda
  function toggleMusic() {
    if (!ytReady) return;
    if (ytPlaying) {
      ytPlayer.pauseVideo();
    } else {
      if (ytPlayer.isMuted()) ytPlayer.unMute();
      ytPlayer.playVideo();
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
