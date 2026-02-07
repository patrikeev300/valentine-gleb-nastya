// 1. Падающие сердечки
const canvas = document.getElementById('hearts');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * -100,
    size: Math.random() * 18 + 12,
    speedY: Math.random() * 1.8 + 0.9,
    rotation: Math.random() * 360,
    rotSpeed: Math.random() * 3 - 1.5,
    opacity: Math.random() * 0.4 + 0.6
  };
}

for (let i = 0; i < 50; i++) particles.push(createParticle());

function drawHeart(p) {
  ctx.save();
  ctx.globalAlpha = p.opacity;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation * Math.PI / 180);
  ctx.fillStyle = `hsl(${Math.random()*30 + 330}, 90%, 60%)`;
  ctx.beginPath();
  ctx.moveTo(0, -p.size/2);
  ctx.bezierCurveTo(p.size/2, -p.size, p.size, -p.size/3, 0, p.size/2);
  ctx.bezierCurveTo(-p.size, -p.size/3, -p.size/2, -p.size, 0, -p.size/2);
  ctx.fill();
  ctx.restore();
}

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.y += p.speedY;
    p.rotation += p.rotSpeed;
    if (p.y > canvas.height + 50) {
      p.y = -50;
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

// 2. Fade-in при скролле / загрузке
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));

// 3. Кнопка "Нет" — убегает, меняет текст и размер
const noBtn = document.getElementById('noBtn');
const funnyMessages = [
  "Ой-ой, кнопочка стесняется... 😳",
  "Настюш, ну пожалуйста, подумай ещё разок 🥺",
  "Я же твой Глебик, как можно отказать? 😭",
  "Она убегает, потому что знает — ДА лучше! 💨",
  "Последний шанс сказать ДАААА 😏",
  "Ты серьёзно? Мое сердечко разобьётся... 💔"
];
let msgIdx = 0;
let noClickCount = 0;

noBtn.addEventListener('mouseover', (e) => {
  if (noClickCount > 3) return; // после 4 кликов перестаёт убегать

  const btn = e.target;
  const maxX = window.innerWidth - btn.offsetWidth - 60;
  const maxY = window.innerHeight - btn.offsetHeight - 60;

  btn.style.position = 'absolute';
  btn.style.left = Math.random() * maxX + 'px';
  btn.style.top = Math.random() * maxY + 'px';

  btn.textContent = funnyMessages[msgIdx % funnyMessages.length];
  msgIdx++;

  // Уменьшаем кнопку после каждого раза
  const currentSize = parseFloat(getComputedStyle(btn).fontSize);
  if (currentSize > 14) {
    btn.style.fontSize = (currentSize - 3) + 'px';
    btn.style.padding = (parseFloat(getComputedStyle(btn).padding) - 6) + 'px ' + (parseFloat(getComputedStyle(btn).paddingLeft) - 12) + 'px';
  }
});

noBtn.addEventListener('click', () => {
  noClickCount++;
  noBtn.textContent = "Ладно... но я всё равно тебя ОЧЕНЬ люблю 💔";
  if (noClickCount > 5) noBtn.style.display = 'none';
});

// 4. Кнопка "Да" → конфетти + сообщение
const yesBtn = document.getElementById('yesBtn');
const messageEl = document.getElementById('message');

yesBtn.addEventListener('click', () => {
  messageEl.innerHTML = `УРААААА! 💖💖💖<br>
  Ты — моя самая-самая, Настенька!<br>
  Люблю тебя безумно сильно и навсегда 😘🌟<br>
  Самый счастливый Глеб на планете!`;
  messageEl.classList.add('show');

  // Конфетти взрыв
  const end = Date.now() + 6000;
  (function frame() {
    confetti({
      particleCount: 10,
      angle: 60,
      spread: 70,
      origin: { x: 0 },
      colors: ['#ff0', '#f00', '#ff69b4', '#ba55d3']
    });
    confetti({
      particleCount: 10,
      angle: 120,
      spread: 70,
      origin: { x: 1 },
      colors: ['#ff1493', '#ff4081', '#c2185b']
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  document.querySelector('.buttons').style.display = 'none';
});

// 5. Музыка
const playBtn = document.getElementById('playBtn');
const audio = document.getElementById('loveSong');

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(() => {
      alert("Нажми ещё раз после любого клика по странице — браузер так разрешает музыку");
    });
    playBtn.textContent = "Пауза ♡";
  } else {
    audio.pause();
    playBtn.textContent = "Включи нашу песню ♡";
  }
});