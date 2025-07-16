/**
 * Hero Section JavaScript Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize price counter
  initPriceCounter();
  
  // Initialize the highlight animation
  initHighlightAnimation();
});

/**
 * Initialize the price counter animation in the hero section
 */
function initPriceCounter() {
  const counter = document.getElementById('price-counter');
  if (counter) {
    // Import the animation function from global.js
    if (typeof animateCounter === 'function') {
      // Schnellere Animation mit 1300ms statt 2500ms
      animateCounter(counter, 150, 1300);
    }
  }
}

/**
 * Initialize the highlight animation
 * This will restart the animation when the user scrolls to the hero section
 */
function initHighlightAnimation() {
  const heroHighlight = document.querySelector('.hero-highlight');
  if (!heroHighlight) return;
  
  // Initial animation is handled by CSS
  // For scroll reanimation:
  window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    const rect = heroSection.getBoundingClientRect();
    // If hero section is in viewport
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      // Reset and restart the animation
      heroHighlight.classList.remove('reset-highlight');
      void heroHighlight.offsetWidth; // Trigger reflow
      heroHighlight.classList.add('reset-highlight');
    }
  });
}
