// ────────────────────────────────────────
// Общие переменные и функции
// ────────────────────────────────────────

// Безопасная работа с LocalStorage
function getStorage(key, def) {
  try { return localStorage.getItem(key) || def; } catch { return def; }
}
function setStorage(key, val) {
  try { localStorage.setItem(key, val); } catch {}
}

// ────────────────────────────────────────
// Love Meter
// ────────────────────────────────────────

let loveLevel = parseInt(getStorage('loveLevel', 0));

function updateLove(points = 0) {
  const oldLevel = loveLevel;
  loveLevel = Math.min(100, loveLevel + points);

  if (loveLevel !== oldLevel) {
    setStorage('loveLevel', loveLevel);
  }

  const progress = document.getElementById('loveProgress');
  const percent = document.getElementById('lovePercent');
  
  if (progress && percent) {
    progress.style.width = loveLevel + '%';
    percent.textContent = loveLevel;
  }

  // Финал (только при переходе границы 100)
  if (loveLevel >= 100 && oldLevel < 100) {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 } });
    }
    setTimeout(() => alert('100% — ты моя навсегда, Настя ❤️'), 500);
  }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  updateLove(0);
  
  // Fade-in
  document.querySelectorAll('.fade-in').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 180 + 300);
  });

  // Музыка (автозапуск по первому клику)
  const song = document.getElementById('loveSong');
  if (song) {
    document.addEventListener('click', () => {
      song.play().catch(() => {});
    }, { once: true });
  }
});

// ────────────────────────────────────────
// Анимация лепестков (Фон)
// ────────────────────────────────────────

const petalCanvas = document.getElementById('petals') || document.getElementById('hearts');
if (petalCanvas) {
  const ctx = petalCanvas.getContext('2d');
  let petals = [];

  function resize() {
    petalCanvas.width = window.innerWidth;
    petalCanvas.height = window.innerHeight;
  }

  function initPetals() {
    petals = [];
    for (let i = 0; i < 45; i++) {
      petals.push({
        x: Math.random() * petalCanvas.width,
        y: Math.random() * -petalCanvas.height,
        size: Math.random() * 18 + 10,
        speed: Math.random() * 1.5 + 0.5,
        rot: Math.random() * 360,
        rotSp: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.5 + 0.5
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
    petals.forEach(p => {
      p.y += p.speed;
      p.rot += p.rotSp;
      if (p.y > petalCanvas.height + p.size) {
        p.y = -p.size;
        p.x = Math.random() * petalCanvas.width;
      }
      
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = '#ff6b81';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  initPetals();
  animate();
}

// ────────────────────────────────────────
// Главная страница (Кнопки и Текст)
// ────────────────────────────────────────

const noBtn = document.getElementById('noBtn');
if (noBtn) {
  noBtn.addEventListener('mouseover', () => {
    const maxX = window.innerWidth - noBtn.offsetWidth - 20;
    const maxY = window.innerHeight - noBtn.offsetHeight - 20;
    noBtn.style.position = 'absolute';
    noBtn.style.left = Math.max(10, Math.random() * maxX) + 'px';
    noBtn.style.top = Math.max(10, Math.random() * maxY) + 'px';
  });
}

const yesBtn = document.getElementById('yesBtn');
if (yesBtn) {
  yesBtn.addEventListener('click', () => {
    updateLove(30);
    const msg = document.getElementById('message');
    const textEl = document.getElementById('typingText');
    
    if (msg) msg.classList.remove('hidden');
    document.querySelector('.buttons').style.display = 'none';

    if (textEl) {
      textEl.textContent = '';
      const text = "Сегодня 14 февраля. Помнишь, как всё начиналось? С тех пор мы прошли кучу всего вместе — Гермес, Тоби, однушка, маркетплейсы, планы. Ты — лучшее, что со мной случалось. Люблю тебя.";
      let i = 0;
      const timer = setInterval(() => {
        textEl.textContent += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(timer);
      }, 50);
    }
    
    if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 80 });
  });
}

const randomMemoryBtn = document.getElementById('randomMemoryBtn');
if (randomMemoryBtn) {
  const memories = [
    "Помнишь, как мы в Питере ели тако?",
    "Первый раз, когда Гермес спал у тебя на шее — ты чуть не задохнулась от счастья",
    "Как Тоби первый раз увидел снег",
    "Когда мы праздновали первую продажу на вб",
  ];
  randomMemoryBtn.addEventListener('click', () => {
    const textEl = document.getElementById('randomMemoryText');
    if (textEl) {
      textEl.textContent = memories[Math.floor(Math.random() * memories.length)];
      textEl.classList.remove('hidden');
      updateLove(5);
    }
  });
}

// ────────────────────────────────────────
// Memory Game (ИСПРАВЛЕННАЯ)
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

  let hasFlippedCard = false;
  let lockBoard = false; // Блокировка нажатий во время анимации
  let firstCard, secondCard;
  let matchedCount = 0;
  const totalPairs = photos.length / 2;

  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  function createBoard() {
    memoryGrid.innerHTML = '';
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    matchedCount = 0;
    
    document.getElementById('pairsFound').textContent = '0';
    document.getElementById('memoryResult')?.classList.add('hidden');

    shuffle([...photos]).forEach(src => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.dataset.value = src;
      // Структура точно под твой CSS
      card.innerHTML = `
        <div class="front">❤️</div>
        <div class="back"><img src="${src}" alt="img"></div>
      `;
      card.addEventListener('click', flipCard);
      memoryGrid.appendChild(card);
    });
  }

  function flipCard() {
    // 1. Если доска заблокирована (ждем анимацию) - выходим
    if (lockBoard) return;
    // 2. Если кликнули на ту же карту - выходим
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
      // Первый клик
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    // Второй клик
    secondCard = this;
    checkForMatch();
  }

  function checkForMatch() {
    let isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
      disableCards();
    } else {
      unflipCards();
    }
  }

  function disableCards() {
    // Совпадение! Блокируем карты, но НЕ плату.
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    matchedCount++;
    document.getElementById('pairsFound').textContent = matchedCount;
    updateLove(5);
    
    if (typeof confetti === 'function') confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    
    const sound = document.getElementById('matchSound');
    if (sound) { sound.currentTime = 0; sound.play().catch(()=>{}); }

    resetBoard(); // Сбрасываем переменные для следующего хода

    if (matchedCount === totalPairs) {
      setTimeout(() => {
        document.getElementById('memoryResult')?.classList.remove('hidden');
        updateLove(30);
      }, 500);
    }
  }

  function unflipCards() {
    lockBoard = true; // Блокируем доску, пока карты переворачиваются обратно
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetBoard(); // Разблокируем после анимации
    }, 1000);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  document.getElementById('restartMemory')?.addEventListener('click', createBoard);
  createBoard();
}

// ────────────────────────────────────────
// Лайтбокс (Галерея)
// ────────────────────────────────────────

const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.querySelector('.close');

  // Делегирование событий (работает для всех фото внутри .photo-grid)
  document.querySelector('.photo-grid')?.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      lightboxImg.src = e.target.src;
      lightbox.style.display = 'flex'; // Используем display: flex как в CSS по умолчанию для показа
    }
  });

  const closeLightbox = () => { lightbox.style.display = 'none'; };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// ────────────────────────────────────────
// Мини-игра (Ловля сердец)
// ────────────────────────────────────────

const gameCanvas = document.getElementById('gameCanvas');
if (gameCanvas) {
  const ctx = gameCanvas.getContext('2d');
  const startBtn = document.getElementById('startGameBtn');
  let animationId;
  let gameRunning = false;
  let score = 0;
  let mouse = { x: 0, y: 0 };
  let hearts = [];

  function resizeGame() {
    // Подстройка под CSS размеры
    const rect = gameCanvas.getBoundingClientRect();
    gameCanvas.width = rect.width;
    gameCanvas.height = rect.height;
  }
  
  // Вызываем resize, когда элемент становится видимым или при загрузке
  setTimeout(resizeGame, 100); 

  class Heart {
    constructor() {
      this.x = Math.random() * (gameCanvas.width - 40) + 20;
      this.y = -40;
      this.size = Math.random() * 20 + 15;
      this.speed = Math.random() * 2 + 1.5;
    }
    draw() {
      ctx.fillStyle = '#ff4081';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    update() {
      this.y += this.speed;
    }
  }

  function loop() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Добавляем новые сердца
    if (Math.random() < 0.03) hearts.push(new Heart());

    hearts.forEach((h, index) => {
      h.update();
      h.draw();

      // Проверка клика/ховера (упрощено до дистанции)
      const dist = Math.hypot(h.x - mouse.x, h.y - mouse.y);
      if (dist < h.size + 10) {
        score++;
        document.getElementById('gameScore').textContent = score;
        hearts.splice(index, 1);
        const sound = document.getElementById('catchSound');
        if(sound) { sound.currentTime=0; sound.play().catch(()=>{}); }
      }
      
      // Удаление упавших
      if (h.y > gameCanvas.height + 20) hearts.splice(index, 1);
    });

    animationId = requestAnimationFrame(loop);
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (gameRunning) return;
      resizeGame();
      gameRunning = true;
      score = 0;
      hearts = [];
      document.getElementById('gameScore').textContent = '0';
      document.getElementById('gameResult').classList.add('hidden');
      startBtn.disabled = true;

      loop();

      // Таймер
      let timeLeft = 35;
      const timerEl = document.getElementById('gameTimer');
      timerEl.textContent = timeLeft;
      
      const timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          gameRunning = false;
          cancelAnimationFrame(animationId);
          document.getElementById('finalScore').textContent = score;
          document.getElementById('bonusLove').textContent = Math.floor(score / 2);
          document.getElementById('gameResult').classList.remove('hidden');
          updateLove(Math.floor(score / 2));
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
  
  // Поддержка тача
  gameCanvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const rect = gameCanvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  }, { passive: false });
}