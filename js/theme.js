// Theme cycle order: light → dark → extra-dark → light
const themes = ['light', 'dark', 'extra-dark'];

// Initialize theme from localStorage or default to light
(function() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Activate lantern overlay if extra-dark
  if (currentTheme === 'extra-dark') {
    setTimeout(() => {
      document.getElementById('lantern-overlay').classList.add('active');
    }, 100);
  }
})();

// Lantern/spotlight effect for extra-dark mode
const lanternOverlay = document.getElementById('lantern-overlay');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

function updateSpotlight(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  const x = (mouseX / window.innerWidth) * 100;
  const y = (mouseY / window.innerHeight) * 100;
  document.documentElement.style.setProperty('--cursor-x', x + '%');
  document.documentElement.style.setProperty('--cursor-y', y + '%');
}

// Theme toggle functionality with pull animation
const themeToggle = document.getElementById('theme-toggle');
let isAnimating = false;

themeToggle.addEventListener('click', function(e) {
  if (isAnimating) return;

  isAnimating = true;

  // Add pulling class for animation
  this.classList.add('pulling');

  // Wait for pull down animation
  setTimeout(() => {
    // Cycle to next theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const currentIndex = themes.indexOf(currentTheme);
    const newIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[newIndex];

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Handle extra-dark mode spotlight
    if (newTheme === 'extra-dark') {
      // Set initial position to where the click happened (the pull chain)
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--cursor-x', x + '%');
      document.documentElement.style.setProperty('--cursor-y', y + '%');

      // Enable mouse tracking
      document.addEventListener('mousemove', updateSpotlight);
      // Activate overlay
      setTimeout(() => {
        lanternOverlay.classList.add('active');
      }, 100);
    } else {
      // Disable mouse tracking
      document.removeEventListener('mousemove', updateSpotlight);
      lanternOverlay.classList.remove('active');
    }

    // Remove pulling class to spring back
    themeToggle.classList.remove('pulling');

    // Reset animation lock
    setTimeout(() => {
      isAnimating = false;
    }, 150);
  }, 100);
});

// Start with spotlight tracking if already in extra-dark mode
if (document.documentElement.getAttribute('data-theme') === 'extra-dark') {
  document.addEventListener('mousemove', updateSpotlight);
}
