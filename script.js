// Падающие лепестки роз (вместо сердец)
const canvas = document.getElementById('petals');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const petals = Array(45).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
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
    ctx.clearRect(0,0,canvas.width,canvas.height);
    petals.forEach(p => {
      p.y += p.speed;
      p.rot += p.rotSp;
      if (p.y > canvas.height + 50) {
        p.y = -50;
        p.x = Math.random() * canvas.width;
      }
      drawPetal(p);
    });
    requestAnimationFrame(animatePetals);
  }
  animatePetals();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Love Meter
let loveLevel = parseInt(localStorage.getItem('loveLevel')) || 0;
function updateLove(points) {
  loveLevel = Math.min(100, loveLevel + points);
  document.getElementById('loveProgress').style.width = loveLevel + '%';
  document.getElementById('lovePercent').textContent = loveLevel;
  localStorage.setItem('loveLevel', loveLevel);

  if (loveLevel >= 100) {
    confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 } });
    alert('100% — ты моя навсегда, Настя ❤️');
  }
}
updateLove(0);

// Fade-in
document.querySelectorAll('.fade-in').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), i * 180 + 300);
});

// "Нет" убегает
const noBtn = document.getElementById('noBtn');
if (noBtn) {
  noBtn.addEventListener('mouseover', () => {
    noBtn.style.position = 'absolute';
    noBtn.style.left = Math.random() * (window.innerWidth - 220) + 'px';
    noBtn.style.top = Math.random() * (window.innerHeight - 120) + 'px';
  });
}

// "Да" → typing + love
const yesBtn = document.getElementById('yesBtn');
if (yesBtn) {
  yesBtn.addEventListener('click', () => {
    updateLove(30);
    const msg = document.getElementById('message');
    const textEl = document.getElementById('typingText');
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
  });
}

// Воспоминание дня
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
    document.getElementById('randomMemoryText').textContent = random;
    document.getElementById('randomMemoryText').classList.remove('hidden');
    updateLove(5);
  });
}

// Мини-игра (лепестки)
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

  let running = false, score = 0, time = 35, petalsGame = [], mouse = {x:0,y:0};

  function createPetal() {
    return {
      x: Math.random() * (gameCanvas.width - 60) + 30,
      y: -80,
      size: Math.random() * 35 + 20,
      speed: Math.random() * 2 + 1.2
    };
  }

  function drawPetalGame(p) {
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
    ctx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
    petalsGame.forEach((p, i) => {
      p.y += p.speed;
      const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dist < p.size * 1.2) {
        score++;
        scoreEl.textContent = score;
        petalsGame.splice(i,1);
        petalsGame.push(createPetal());
        sound.currentTime = 0; sound.play().catch(()=>{});
      }
      if (p.y > gameCanvas.height + 80) {
        petalsGame.splice(i,1);
        petalsGame.push(createPetal());
      }
      drawPetalGame(p);
    });
    requestAnimationFrame(gameLoop);
  }

  startBtn.addEventListener('click', () => {
    if (running) return;
    running = true; score = 0; time = 35;
    scoreEl.textContent = 0;
    timerEl.textContent = 35;
    resultEl.classList.add('hidden');
    startBtn.disabled = true;

    petalsGame = Array(12).fill().map(createPetal);
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

// Музыка после первого взаимодействия
const song = document.getElementById('loveSong');
if (song) {
  document.addEventListener('click', () => song.play().catch(() => {}), {once: true});
}