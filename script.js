// Общие сердечки на фоне
const canvas = document.getElementById('hearts');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: -60,
      size: Math.random() * 22 + 14,
      speed: Math.random() * 1.6 + 0.9,
      rot: Math.random() * 360,
      rotSp: Math.random() * 3 - 1.5,
      opacity: Math.random() * 0.5 + 0.55
    };
  }

  for (let i = 0; i < 55; i++) particles.push(createParticle());

  function drawHeart(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot * Math.PI / 180);
    ctx.fillStyle = `hsl(${330 + Math.random()*30}, 95%, 65%)`;
    ctx.beginPath();
    ctx.moveTo(0, -p.size/2);
    ctx.bezierCurveTo(p.size/2, -p.size, p.size, -p.size/3, 0, p.size/2);
    ctx.bezierCurveTo(-p.size, -p.size/3, -p.size/2, -p.size, 0, -p.size/2);
    ctx.fill();
    ctx.restore();
  }

  function animateHearts() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      p.y += p.speed;
      p.rot += p.rotSp;
      if (p.y > canvas.height + 60) {
        p.y = -60;
        p.x = Math.random() * canvas.width;
      }
      drawHeart(p);
    });
    requestAnimationFrame(animateHearts);
  }
  animateHearts();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Fade-in при появлении
document.querySelectorAll('.fade-in').forEach(el => {
  setTimeout(() => el.classList.add('visible'), 300);
});

// Таймер обратного отсчёта до 14 февраля 2026
const countdownEl = document.getElementById('timer');
if (countdownEl) {
  const targetDate = new Date('2026-02-14T19:00:00').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      countdownEl.innerHTML = "УРА! Сегодня наш день! 🎉";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownEl.innerHTML = `${days} дн ${hours} ч ${minutes} мин ${seconds} сек`;
  }

  setInterval(updateTimer, 1000);
  updateTimer();
}

// Убегающая кнопка "Нет"
const noBtn = document.getElementById('noBtn');
if (noBtn) {
  const funny = [
    "Ой, Настюш... ну пожалуйста 🥺",
    "Кнопка стесняется, но сердце говорит ДА!",
    "Я же твой Глебик... как можно отказать? 😭",
    "Она убегает, потому что знает — ДА лучше 💨",
    "Последний шанс сказать ДААА 😏"
  ];
  let idx = 0;

  noBtn.addEventListener('mouseover', e => {
    const btn = e.target;
    const maxX = window.innerWidth - btn.offsetWidth - 80;
    const maxY = window.innerHeight - btn.offsetHeight - 80;

    btn.style.position = 'absolute';
    btn.style.left = Math.random() * maxX + 'px';
    btn.style.top = Math.random() * maxY + 'px';

    btn.textContent = funny[idx % funny.length];
    idx++;
  });
}

// Кнопка "Да" → сообщение + переход на приглашение
const yesBtn = document.getElementById('yesBtn');
if (yesBtn) {
  yesBtn.addEventListener('click', () => {
    const msg = document.getElementById('message');
    msg.innerHTML = `УРАААА! 💖💖💖<br>Ты сделала меня самым счастливым!<br>Переходи скорее → <a href="invitation.html" style="color:#ff4081; font-weight:bold;">Открыть приглашение</a>`;
    msg.style.opacity = 1;

    // Конфетти
    const end = Date.now() + 5000;
    (function frame() {
      confetti({ particleCount: 9, angle: 60, spread: 70, origin: { x: 0 } });
      confetti({ particleCount: 9, angle: 120, spread: 70, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    document.querySelector('.buttons').style.display = 'none';
  });
}

// Мини-игра
const gameCanvas = document.getElementById('gameCanvas');
if (gameCanvas) {
  const ctx = gameCanvas.getContext('2d');
  const startBtn = document.getElementById('startGameBtn');
  const scoreEl = document.getElementById('gameScore');
  const timerEl = document.getElementById('gameTimer');
  const resultEl = document.getElementById('gameResult');
  const finalScore = document.getElementById('finalScore');
  const catchSound = document.getElementById('catchSound');

  let running = false;
  let score = 0;
  let time = 35;
  let hearts = [];
  let mouse = { x: 0, y: 0 };

  function spawnHeart() {
    return {
      x: Math.random() * (gameCanvas.width - 50) + 25,
      y: -60,
      size: Math.random() * 35 + 28,
      speed: Math.random() * 2.2 + 1.8 + (score > 20 ? 0.6 : 0)
    };
  }

  function drawHeart(h) {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.fillStyle = '#ff1493';
    ctx.beginPath();
    ctx.moveTo(0, -h.size/2);
    ctx.bezierCurveTo(h.size/2, -h.size, h.size, -h.size/3, 0, h.size/2);
    ctx.bezierCurveTo(-h.size, -h.size/3, -h.size/2, -h.size, 0, -h.size/2);
    ctx.fill();
    ctx.restore();
  }

  function gameLoop() {
    if (!running) return;

    ctx.clearRect(0,0,gameCanvas.width,gameCanvas.height);

    hearts.forEach((h,i) => {
      h.y += h.speed;

      const dx = h.x - mouse.x;
      const dy = h.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < h.size * 0.9) {
        score++;
        scoreEl.textContent = score;
        hearts.splice(i,1);
        hearts.push(spawnHeart());
        catchSound.currentTime = 0;
        catchSound.play().catch(()=>{});
      }

      if (h.y > gameCanvas.height + 60) {
        hearts.splice(i,1);
        hearts.push(spawnHeart());
      }

      drawHeart(h);
    });

    requestAnimationFrame(gameLoop);
  }

  let timerId;
  startBtn.addEventListener('click', () => {
    if (running) return;
    running = true;
    score = 0;
    time = 35;
    scoreEl.textContent = 0;
    timerEl.textContent = 35;
    resultEl.classList.add('hidden');
    startBtn.disabled = true;
    startBtn.textContent = "Лови!";

    hearts = [];
    for (let i = 0; i < 10; i++) hearts.push(spawnHeart());

    gameLoop();

    timerId = setInterval(() => {
      time--;
      timerEl.textContent = time;
      if (time <= 0) {
        clearInterval(timerId);
        running = false;
        finalScore.textContent = score;
        resultEl.classList.remove('hidden');
        startBtn.disabled = false;
        startBtn.textContent = "Ещё раз?";
      }
    }, 1000);
  });

  gameCanvas.addEventListener('mousemove', e => {
    const r = gameCanvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });

  gameCanvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const r = gameCanvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - r.left;
    mouse.y = e.touches[0].clientY - r.top;
  });
}

// Музыка
const music = document.getElementById('loveSong');
if (music) {
  document.addEventListener('click', () => {
    if (music.paused) music.play().catch(()=>{});
  }, { once: true });
}

// Галерея — лайтбокс
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.querySelector('.close');

if (lightbox) {
  document.querySelectorAll('.photo-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.style.display = 'flex';
    });
  });

  closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.style.display = 'none';
  });
}

// Конверт на странице приглашения
const envelope = document.getElementById('envelope');
if (envelope) {
  envelope.addEventListener('click', () => {
    envelope.style.transform = 'rotateX(180deg)';
    setTimeout(() => {
      document.getElementById('invitationContent').classList.remove('hidden');
      envelope.style.display = 'none';
    }, 800);
  });
}

const acceptInv = document.getElementById('acceptInvitation');
if (acceptInv) {
  acceptInv.addEventListener('click', () => {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    setTimeout(() => {
      alert('Урааа! Готовлюсь к самому лучшему вечеру в нашей жизни 💖');
    }, 1200);
  });
}