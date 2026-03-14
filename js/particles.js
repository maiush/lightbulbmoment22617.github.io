// Subtle floating particle effect
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle system
const particles = [];
const particleCount = 45;

class Particle {
  constructor() {
    this.reset();
    // Start at random positions for initial render
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -10;
    this.size = Math.random() * 2 + 0.8; // 0.8 to 2.8px
    this.speedY = Math.random() * 0.4 + 0.15; // Very slow fall
    this.speedX = (Math.random() - 0.5) * 0.4; // Gentle drift
    this.opacity = Math.random() * 0.5 + 0.2; // 0.2 to 0.7
    // Add some gentle oscillation
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = Math.random() * 0.01 + 0.005;
    this.drift = Math.random() * 20 + 10;
  }

  update() {
    this.y += this.speedY;
    this.angle += this.angleSpeed;
    this.x += this.speedX + Math.sin(this.angle) * 0.1;

    // Reset if particle goes off screen
    if (this.y > canvas.height + 10) {
      this.reset();
    }
    if (this.x < -10 || this.x > canvas.width + 10) {
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let color;

    // Different subtle colors for each theme
    if (currentTheme === 'extra-dark') {
      color = `rgba(200, 200, 255, ${this.opacity * 0.6})`;
    } else if (currentTheme === 'dark') {
      color = `rgba(150, 180, 220, ${this.opacity})`;
    } else {
      color = `rgba(100, 120, 150, ${this.opacity})`;
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animate);
}

animate();
