const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

window.enableFireworks = false;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ⭐ ESTRELLAS CON PARPADEO
const stars = Array.from({ length: 200 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2 + 0.5,
  o: Math.random(),
  speed: Math.random() * 0.015 + 0.005
}));

// 🎆 FUEGOS ARTIFICIALES
class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * canvas.height * 0.4 + 50;
    this.vy = -8 - Math.random() * 4;
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.y += this.vy;
      this.vy += 0.15;
      if (this.y <= this.targetY) {
        this.explode();
      }
    } else {
      this.particles.forEach(p => p.update());
      this.particles = this.particles.filter(p => p.life > 0);
    }
  }

  explode() {
    this.exploded = true;
    const count = 80 + Math.random() * 40;
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.x, this.y, this.color));
    }
  }

  draw() {
    if (!this.exploded) {
      // Cohete subiendo
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      this.particles.forEach(p => p.draw());
    }
  }

  isDead() {
    return this.exploded && this.particles.length === 0;
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 1;
    this.color = color;
    this.decay = Math.random() * 0.015 + 0.01;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravedad
    this.vx *= 0.99; // fricción
    this.life -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

let fireworks = [];

function animate() {
  // Limpiar el canvas completamente solo si hay fuegos artificiales
  if (window.enableFireworks) {
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    // Sin fuegos, limpiar completamente para que solo se vean estrellas
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Dibujar estrellas con parpadeo continuo
  stars.forEach(s => {
    // Actualizar opacidad para parpadeo
    s.o += s.speed;
    if (s.o > 1) {
      s.o = 1;
      s.speed = -Math.abs(s.speed);
    } else if (s.o < 0.2) {
      s.o = 0.2;
      s.speed = Math.abs(s.speed);
    }

    ctx.save();
    ctx.globalAlpha = s.o;
    ctx.fillStyle = "white";
    ctx.shadowBlur = 4;
    ctx.shadowColor = "white";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Dibujar fuegos artificiales (solo si están activados)
  if (window.enableFireworks) {
    // Crear nuevos fuegos artificiales aleatoriamente
    if (Math.random() < 0.08) {
      fireworks.push(new Firework());
    }

    fireworks.forEach(f => {
      f.update();
      f.draw();
    });
    fireworks = fireworks.filter(f => !f.isDead());
  }

  requestAnimationFrame(animate);
}

animate();