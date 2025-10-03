const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');
let locked = false;
let currentSeed = Date.now();

function randomSeed(seed) {
  // Simple seeded random generator
  let s = seed % 2147483647;
  return function() {
    s = (s * 48271) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function drawAbstractArt(seed) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const rand = randomSeed(seed);
  // Draw random shapes
  for (let i = 0; i < 12; i++) {
    ctx.save();
    ctx.globalAlpha = 0.3 + rand() * 0.5;
    ctx.translate(rand() * canvas.width, rand() * canvas.height);
    ctx.rotate(rand() * Math.PI * 2);
    const shapeType = Math.floor(rand() * 3);
    ctx.beginPath();
    if (shapeType === 0) {
      // Abstract polygon
      const sides = 3 + Math.floor(rand() * 5);
      const radius = 30 + rand() * 70;
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = `hsl(${rand()*360},70%,70%)`;
      ctx.fill();
    } else if (shapeType === 1) {
      // Symbolic arc
      ctx.arc(0, 0, 40 + rand()*60, rand()*Math.PI, rand()*Math.PI*2);
      ctx.strokeStyle = `hsl(${rand()*360},60%,60%)`;
      ctx.lineWidth = 4 + rand()*8;
      ctx.stroke();
    } else {
      // Mythic ellipse
      ctx.ellipse(0, 0, 30 + rand()*60, 20 + rand()*40, rand()*Math.PI, 0, Math.PI*2);
      ctx.fillStyle = `hsl(${rand()*360},80%,80%)`;
      ctx.fill();
    }
    ctx.restore();
  }
  status.textContent = locked ? 'Moment fixed (locked).' : 'Pattern is fluid.';
}

function randomizeArt() {
  if (locked) return;
  currentSeed = Date.now() + Math.floor(Math.random()*10000);
  drawAbstractArt(currentSeed);
}

document.getElementById('randomize').addEventListener('click', randomizeArt);
document.getElementById('lock').addEventListener('click', () => {
  locked = true;
  status.textContent = 'Moment fixed (locked).';
});
document.getElementById('save').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'abstract-myth.png';
  link.href = canvas.toDataURL();
  link.click();
  status.textContent = 'Image saved.';
});

canvas.addEventListener('click', randomizeArt);
window.addEventListener('keydown', (e) => {
  if (e.key === 'r') randomizeArt();
  if (e.key === 'l') locked = !locked;
  if (e.key === 's') document.getElementById('save').click();
});

drawAbstractArt(currentSeed);
