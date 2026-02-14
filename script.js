// ────────────────────────────────────────
// Общие переменные и функции
// ────────────────────────────────────────

// ────────────────────────────────────────
// Love Meter — с надёжной инициализацией
// ────────────────────────────────────────

let loveLevel = parseInt(localStorage.getItem('loveLevel')) || 0;

// Функция обновления — теперь с защитой от повторных вызовов без изменений
function updateLove(points = 0) {
  const oldLevel = loveLevel;
  loveLevel = Math.min(100, loveLevel + points);

  // Сохраняем только если изменилось
  if (loveLevel !== oldLevel) {
    localStorage.setItem('loveLevel', loveLevel);
  }

  // Обновляем визуально, если элементы есть
  const progress = document.getElementById('loveProgress');
  const percent = document.getElementById('lovePercent');
  if (progress && percent) {
    progress.style.width = loveLevel + '%';
    percent.textContent = loveLevel;
  }

  // Финал только один раз
  if (loveLevel >= 100 && oldLevel < 100) {
    confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 } });
    alert('100% — ты моя навсегда, Настя ❤️');
  }
}

// Один-единственный вызов при полной загрузке страницы
window.addEventListener('load', () => {
  updateLove(0); // применяем текущее сохранённое значение
}, { once: true })

// Fade-in анимация
document.querySelectorAll('.fade-in').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), i * 180 + 300);
});

// Автозапуск музыки после первого клика
const song = document.getElementById('loveSong');
if (song) {
  document.addEventListener('click', () => song.play().catch(() => {}), { once: true });
}

// ────────────────────────────────────────
// Анимация падающих лепестков (один canvas на всю страницу)
// ────────────────────────────────────────

const petalCanvas = document.getElementById('petals') || document.getElementById('hearts');
if (petalCanvas) {
  const ctx = petalCanvas.getContext('2d');
  petalCanvas.width = window.innerWidth;
  petalCanvas.height = window.innerHeight;

  const petals = Array(45).fill().map(() => ({
    x: Math.random() * petalCanvas.width,
    y: Math.random() * -petalCanvas.height,
    size: Math.random() * 18 + 10,
    speed: Math.random() * 1.2 + 0.7,
    rot: Math.random() * 360,
    rotSp: Math.random() * 2 - 1,
    opacity: Math.random() * 0.5 + 0.5
  }));

  function drawPetal(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot * Math.PI / 180);
    ctx.fillStyle = '#ff6b81';
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animatePetals() {
    ctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
    petals.forEach(p => {
      p.y += p.speed;
      p.rot += p.rotSp;
      if (p.y > petalCanvas.height + 50) {
        p.y = -50;
        p.x = Math.random() * petalCanvas.width;
      }
      drawPetal(p);
    });
    requestAnimationFrame(animatePetals);
  }

  animatePetals();

  window.addEventListener('resize', () => {
    petalCanvas.width = window.innerWidth;
    petalCanvas.height = window.innerHeight;
  });
}

// ────────────────────────────────────────
// Главная страница (index.html)
// ────────────────────────────────────────

const noBtn = document.getElementById('noBtn');
if (noBtn) {
  noBtn.addEventListener('mouseover', () => {
    noBtn.style.position = 'absolute';
    noBtn.style.left = Math.random() * (window.innerWidth - 220) + 'px';
    noBtn.style.top = Math.random() * (window.innerHeight - 120) + 'px';
  });
}

const yesBtn = document.getElementById('yesBtn');
if (yesBtn) {
  yesBtn.addEventListener('click', () => {
    updateLove(30);
    const msg = document.getElementById('message');
    const textEl = document.getElementById('typingText');
    if (msg && textEl) {
      msg.classList.remove('hidden');
      textEl.textContent = '';
      const text = "Сегодня 14 февраля. Помнишь, как всё начиналось в Питере? С тех пор мы прошли кучу всего вместе — Гермес, Тоби, однушка, маркетплейсы, планы на Вьетнам. Ты — лучшее, что со мной случалось. Люблю тебя.";
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) textEl.textContent += text[i++];
        else clearInterval(interval);
      }, 55);
      confetti({ particleCount: 100, spread: 80 });
      document.querySelector('.buttons').style.display = 'none';
    }
  });
}

const randomMemoryBtn = document.getElementById('randomMemoryBtn');
if (randomMemoryBtn) {
  const memories = [
    "Помнишь, как мы в Питере ели шаурму на набережной и замёрзли?",
    "Первый раз, когда Гермес спал у тебя на шее — ты чуть не задохнулась от счастья",
    "Как Тоби первый раз увидел снег и просто лёг в сугроб мордой вниз",
    "Когда мы праздновали первую продажу на 100к — танцевали на кухне до утра",
    "Тот вечер, когда решили: «Всё, едем во Вьетнам, как только сможем»"
  ];

  randomMemoryBtn.addEventListener('click', () => {
    const random = memories[Math.floor(Math.random() * memories.length)];
    const textEl = document.getElementById('randomMemoryText');
    if (textEl) {
      textEl.textContent = random;
      textEl.classList.remove('hidden');
      updateLove(5);
    }
  });
}

// ────────────────────────────────────────
// Мини-игра на главной (лепестки)
// ────────────────────────────────────────

const gameCanvas = document.getElementById('gameCanvas');
if (gameCanvas) {
  const ctx = gameCanvas.getContext('2d');
  const startBtn = document.getElementById('startGameBtn');
  const scoreEl = document.getElementById('gameScore');
  const timerEl = document.getElementById('gameTimer');
  const resultEl = document.getElementById('gameResult');
  const finalScoreEl = document.getElementById('finalScore');
  const bonusEl = document.getElementById('bonusLove');
  const sound = document.getElementById('catchSound');

  let running = false, score = 0, time = 35, gamePetals = [], mouse = { x: 0, y: 0 };

  function createGamePetal() {
    return {
      x: Math.random() * (gameCanvas.width - 60) + 30,
      y: -80,
      size: Math.random() * 35 + 20,
      speed: Math.random() * 2 + 1.2
    };
  }

  function drawGamePetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.fillStyle = '#ff6b81';
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function gameLoop() {
    if (!running) return;
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gamePetals.forEach((p, i) => {
      p.y += p.speed;
      const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dist < p.size * 1.2) {
        score++;
        scoreEl.textContent = score;
        gamePetals.splice(i, 1);
        gamePetals.push(createGamePetal());
        if (sound) {
          sound.currentTime = 0;
          sound.play().catch(() => {});
        }
      }
      if (p.y > gameCanvas.height + 80) {
        gamePetals.splice(i, 1);
        gamePetals.push(createGamePetal());
      }
      drawGamePetal(p);
    });
    requestAnimationFrame(gameLoop);
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (running) return;
      running = true; score = 0; time = 35;
      scoreEl.textContent = 0;
      timerEl.textContent = 35;
      resultEl.classList.add('hidden');
      startBtn.disabled = true;

      gamePetals = Array(12).fill().map(createGamePetal);
      gameLoop();

      const timerId = setInterval(() => {
        time--;
        timerEl.textContent = time;
        if (time <= 0) {
          clearInterval(timerId);
          running = false;
          finalScoreEl.textContent = score;
          const bonus = Math.floor(score * 1.2);
          bonusEl.textContent = bonus;
          updateLove(bonus);
          resultEl.classList.remove('hidden');
          startBtn.disabled = false;
        }
      }, 1000);
    });
  }

  gameCanvas.addEventListener('mousemove', e => {
    const rect = gameCanvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  gameCanvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const rect = gameCanvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  });
}

// ────────────────────────────────────────
// Memory Game
// ────────────────────────────────────────

const memoryGrid = document.getElementById('memoryGrid');
if (memoryGrid) {
  const photos = [
    'assets/photo-1.jpg', 'assets/photo-1.jpg',
    'assets/photo-2.jpg', 'assets/photo-2.jpg',
    'assets/photo-3.jpg', 'assets/photo-3.jpg',
    'assets/photo-4.jpg', 'assets/photo-4.jpg',
    'assets/photo-5.jpg', 'assets/photo-5.jpg',
    'assets/photo-6.jpg', 'assets/photo-6.jpg'
  ];

  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  const totalPairs = photos.length / 2;

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function createMemoryBoard() {
    memoryGrid.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    const pairsFound = document.getElementById('pairsFound');
    if (pairsFound) pairsFound.textContent = '0';
    document.getElementById('memoryResult')?.classList.add('hidden');

    const shuffled = shuffle([...photos]);

    shuffled.forEach(src => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.dataset.value = src;
      card.innerHTML = `
        <div class="front">❤️</div>
        <div class="back"><img src="${src}" alt="воспоминание" loading="lazy"></div>
      `;
      card.addEventListener('click', () => flipCard(card));
      memoryGrid.appendChild(card);
      cards.push(card);
    });
  }

  function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
      card.classList.add('flipped');
      flippedCards.push(card);

      if (flippedCards.length === 2) checkForMatch();
    }
  }

  function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
      matchedPairs++;
      const pairsFound = document.getElementById('pairsFound');
      if (pairsFound) pairsFound.textContent = matchedPairs;
      updateLove(5);

      card1.classList.add('matched');
      card2.classList.add('matched');

      const matchSound = document.getElementById('matchSound');
      if (matchSound) {
        matchSound.currentTime = 0;
        matchSound.play().catch(() => {});
      }

      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

      flippedCards = [];

      if (matchedPairs === totalPairs) {
        setTimeout(() => {
          document.getElementById('memoryResult')?.classList.remove('hidden');
          updateLove(30);
        }, 800);
      }
    } else {
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
      }, 1200);
    }
  }

  document.getElementById('restartMemory')?.addEventListener('click', createMemoryBoard);

  createMemoryBoard();
}

// ────────────────────────────────────────
// Лайтбокс для галереи
// ────────────────────────────────────────

const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const img = document.getElementById('lightboxImg');
  const close = document.querySelector('.close');

  document.querySelectorAll('.photo-item img').forEach(photo => {
    photo.addEventListener('click', () => {
      if (img) img.src = photo.src;
      lightbox.style.display = 'flex';
    });
  });

  if (close) close.addEventListener('click', () => lightbox.style.display = 'none');

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.style.display = 'none';
  });
}

// Инициализация love-meter при загрузке
updateLove(0);