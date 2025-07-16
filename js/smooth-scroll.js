// Smooth scroll functionality
document.addEventListener('DOMContentLoaded', function() {
  const scrollToPortfolioLinks = document.querySelectorAll('.scroll-to-portfolio');
  
  scrollToPortfolioLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Add a highlight effect to make it clear where we've scrolled
        targetSection.classList.add('highlight-section');
          // Scroll to the section with GPU acceleration for smoother scrolling
        const targetPosition = targetSection.offsetTop - 80; // Account for fixed navbar
        
        // Use requestAnimationFrame for smoother animation start
        requestAnimationFrame(() => {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        });
        
        // Remove highlight after a delay
        setTimeout(() => {
          targetSection.classList.remove('highlight-section');
        }, 1500);
      }
    });
  });
});
