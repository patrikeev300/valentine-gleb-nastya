// Neon hearts + parallax
const canvas = document.getElementById('hearts');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  for (let i = 0; i < 70; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: Math.random() * 25 + 15,
      speed: Math.random() * 2 + 1,
      rot: Math.random() * 360,
      rotSp: Math.random() * 4 - 2,
      opacity: Math.random() * 0.5 + 0.5
    });
  }

  function drawHeart(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot * Math.PI / 180);
    ctx.fillStyle = `hsl(${330 + Math.random()*40}, 100%, 60%)`;
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#ff4081';
    ctx.beginPath();
    ctx.moveTo(0, -p.size/2);
    ctx.bezierCurveTo(p.size/2, -p.size, p.size, -p.size/3, 0, p.size/2);
    ctx.bezierCurveTo(-p.size, -p.size/3, -p.size/2, -p.size, 0, -p.size/2);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      p.y += p.speed;
      p.rot += p.rotSp;
      if (p.y > canvas.height + 100) {
        p.y = -100;
        p.x = Math.random() * canvas.width;
      }
      drawHeart(p);
    });
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Love Meter с localStorage
let loveLevel = parseInt(localStorage.getItem('loveLevel')) || 0;
function updateLove(points) {
  loveLevel = Math.min(100, loveLevel + points);
  const progress = document.getElementById('loveProgress');
  const percent = document.getElementById('lovePercent');
  if (progress && percent) {
    progress.style.width = loveLevel + '%';
    percent.textContent = loveLevel;
  }
  localStorage.setItem('loveLevel', loveLevel);
  if (loveLevel >= 100) {
    confetti({ particleCount: 300, spread: 120 });
    alert('100% любви! Ты — моя идеальная половинка, Настя! 💖');
  }
}
updateLove(0);

// Fade-in
document.querySelectorAll('.fade-in').forEach(el => {
  setTimeout(() => el.classList.add('visible'), 400);
});

// Countdown до 14 февраля 2026
const countdownEl = document.getElementById('timer');
if (countdownEl) {
  const target = new Date('2026-02-14T19:00:00').getTime();
  function tick() {
    const dist = target - Date.now();
    if (dist < 0) {
      countdownEl.textContent = "Сегодня наш день! 🎉";
      return;
    }
    const d = Math.floor(dist / 86400000);
    const h = Math.floor((dist % 86400000) / 3600000);
    const m = Math.floor((dist % 3600000) / 60000);
    const s = Math.floor((dist % 60000) / 1000);
    countdownEl.textContent = `${d}д ${h}ч ${m}м ${s}с`;
  }
  setInterval(tick, 1000);
  tick();
}

// Убегающая кнопка "Нет"
const noBtn = document.getElementById('noBtn');
if (noBtn) {
  const msgs = ["Настюш, ну пожалуйста 🥺","Сердце говорит ДА!","Последний шанс 😏","Она убегает, потому что ДА лучше 💨"];
  let i = 0;
  noBtn.addEventListener('mouseover', e => {
    const b = e.target;
    b.style.position = 'absolute';
    b.style.left = Math.random() * (window.innerWidth - 200) + 'px';
    b.style.top = Math.random() * (window.innerHeight - 100) + 'px';
    b.textContent = msgs[i % msgs.length];
    i++;
  });
}

// "Да" → typing признание + love + конфетти
const yesBtn = document.getElementById('yesBtn');
if (yesBtn) {
  yesBtn.addEventListener('click', () => {
    updateLove(30);
    const msg = document.getElementById('message');
    const typing = document.getElementById('typingText');
    msg.classList.remove('hidden');
    typing.textContent = '';
    const text = "Настенька... Помнишь, как мы в техникуме первый раз кофе вместе пили? С тех пор каждый день с тобой — лучше предыдущего. Ты мой огонь, моя поддержка, мой самый любимый человек на свете. Люблю тебя безумно сильно и навсегда! 💖";
    let char = 0;
    const typeInt = setInterval(() => {
      if (char < text.length) {
        typing.textContent += text[char++];
      } else {
        clearInterval(typeInt);
      }
    }, 50);

    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
    document.querySelector('.buttons').style.display = 'none';
  });
}

// Мини-игра "Лови сердечки"
const gc = document.getElementById('gameCanvas');
if (gc) {
  const gctx = gc.getContext('2d');
  const startG = document.getElementById('startGameBtn');
  const gScore = document.getElementById('gameScore');
  const gTimer = document.getElementById('gameTimer');
  const gResult = document.getElementById('gameResult');
  const finalG = document.getElementById('finalScore');
  const bonus = document.getElementById('bonusLove');
  const catchS = document.getElementById('catchSound');

  let gRun = false, gScoreVal = 0, gTime = 35, gHearts = [], mouse = {x:0,y:0};

  function newHeart() {
    return {x: Math.random()*(gc.width-60)+30, y:-80, size: Math.random()*40+30, speed: Math.random()*2.5+2 + (gScoreVal > 20 ? 1 : 0)};
  }

  function drawGHeart(h) {
    gctx.save();
    gctx.translate(h.x, h.y);
    gctx.fillStyle = '#ff1493';
    gctx.shadowBlur = 20;
    gctx.shadowColor = '#ff4081';
    gctx.beginPath();
    gctx.moveTo(0, -h.size/2);
    gctx.bezierCurveTo(h.size/2, -h.size, h.size, -h.size/3, 0, h.size/2);
    gctx.bezierCurveTo(-h.size, -h.size/3, -h.size/2, -h.size, 0, -h.size/2);
    gctx.fill();
    gctx.restore();
  }

  function gLoop() {
    if (!gRun) return;
    gctx.clearRect(0,0,gc.width,gc.height);
    gHearts.forEach((h,i) => {
      h.y += h.speed;
      const d = Math.hypot(h.x - mouse.x, h.y - mouse.y);
      if (d < h.size * 0.9) {
        gScoreVal++;
        gScore.textContent = gScoreVal;
        gHearts.splice(i,1);
        gHearts.push(newHeart());
        catchS.currentTime = 0; catchS.play().catch(()=>{});
      }
      if (h.y > gc.height + 100) {
        gHearts.splice(i,1);
        gHearts.push(newHeart());
      }
      drawGHeart(h);
    });
    requestAnimationFrame(gLoop);
  }

  let gTimerId;
  startG.addEventListener('click', () => {
    if (gRun) return;
    gRun = true;
    gScoreVal = 0; gTime = 35;
    gScore.textContent = 0;
    gTimer.textContent = 35;
    gResult.classList.add('hidden');
    startG.disabled = true;
    startG.textContent = "Лови быстрее!";

    gHearts = Array(12).fill().map(newHeart);
    gLoop();

    gTimerId = setInterval(() => {
      gTime--;
      gTimer.textContent = gTime;
      if (gTime <= 0) {
        clearInterval(gTimerId);
        gRun = false;
        finalG.textContent = gScoreVal;
        const bonusVal = Math.min(40, gScoreVal * 2);
        bonus.textContent = bonusVal;
        updateLove(bonusVal);
        gResult.classList.remove('hidden');
        startG.disabled = false;
        startG.textContent = "Ещё разок?";
      }
    }, 1000);
  });

  gc.addEventListener('mousemove', e => {
    const r = gc.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  gc.addEventListener('touchmove', e => {
    e.preventDefault();
    const r = gc.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - r.left;
    mouse.y = e.touches[0].clientY - r.top;
  });
}

// Memory game
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

  photos.sort(() => Math.random() - 0.5);

  let flipped = [];
  let matched = 0;

  photos.forEach(src => {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.innerHTML = `
      <div class="front">❤️</div>
      <div class="back"><img src="${src}" loading="lazy"></div>
    `;
    card.addEventListener('click', () => {
      if (flipped.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flipped.push(card);

        if (flipped.length === 2) {
          setTimeout(() => {
            if (flipped[0].querySelector('img').src === flipped[1].querySelector('img').src) {
              matched += 2;
              updateLove(5);
              confetti({ particleCount: 50, origin: { x: 0.5, y: 0.7 } });
              if (matched === photos.length) {
                document.getElementById('memoryResult').classList.remove('hidden');
                updateLove(30);
              }
            } else {
              flipped.forEach(c => c.classList.remove('flipped'));
            }
            flipped = [];
          }, 1000);
        }
      }
    });
    memoryGrid.appendChild(card);
  });
}

// Лайтбокс для галереи
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

  if (closeBtn) closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.style.display = 'none';
  });
}

// Конверт на invitation
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
    setTimeout(() => alert('Урааа! Готовлюсь к самому лучшему вечеру в нашей жизни 💖'), 1200);
  });
}

// Музыка (автозапуск после первого клика)
const audio = document.getElementById('loveSong');
if (audio) {
  document.addEventListener('click', () => audio.play().catch(() => {}), {once: true});
}