// Enhanced Portfolio Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-button');
  const portfolioItems = document.querySelectorAll('.glass-portfolio');
  const portfolioGrid = document.querySelector('.portfolio-grid');
  const portfolioWrappers = document.querySelectorAll('.portfolio-item-wrapper');
  
  // Set initial active state on "Alle" button
  document.querySelector('.filter-button[data-filter="all"]').classList.add('active');
  
  // Ensure all portfolio items have uniform heights
  equalizeCardHeights();
  
  // Ensure all portfolio items are properly initialized with shadows
  ensureShadowVisibility();
  
  // Add subtle floating animation to decorative elements
  animateDecorativeElements();
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Remove active class from all buttons
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('clicked'); // Remove ripple effect class
      });
      
      // Add active and clicked classes to the button
      this.classList.add('active');
      this.classList.add('clicked');
      
      // Remove the ripple effect after animation completes
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 700);
      
      const filter = this.getAttribute('data-filter');
      // Enhanced animation for the grid
      portfolioGrid.style.opacity = '0.5';
      portfolioGrid.style.transform = 'translateY(10px) scale(0.99)';
      portfolioGrid.style.paddingBottom = '30px'; // Extra padding during animation to ensure shadows are fully visible
      
      setTimeout(() => {
        if (filter === 'all') {
          // Show all items with staggered animation
          portfolioItems.forEach((item, index) => {
            // Set initial hidden state
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.display = 'block';
            
            // Staggered appearance with slight delay for each item
            setTimeout(() => {
              item.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50 * index);
          });
        } else {
          // Filter items with improved animation
          portfolioItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            if (category.includes(filter)) {
              // Set initial hidden state
              item.style.opacity = '0';
              item.style.transform = 'translateY(20px)';
              item.style.display = 'block';
              
              // Enhanced staggered appearance with more natural timing
              setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              }, 60 * index); // Slightly longer delay for more noticeable staggering
            } else {
              item.style.display = 'none';
            }
          });
        }
        
        // Restore grid appearance with enhanced animation
        portfolioGrid.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
        portfolioGrid.style.opacity = '1';
        portfolioGrid.style.transform = 'translateY(0) scale(1)';
        
        // Extra delay for shadow adjustment after filtering
        setTimeout(() => {
          ensureShadowVisibility();
          equalizeCardHeights(); // Re-equalize heights after filtering
        }, 600);
      }, 300);
    });
    
    // Add hover sound effect for accessibility
    button.addEventListener('mouseenter', () => {
      button.style.transition = 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)';
    });
  });
  
  /**
   * Function to ensure shadow visibility for all portfolio items
   * This helps prevent shadow clipping issues
   */
  function ensureShadowVisibility() {
    portfolioWrappers.forEach(wrapper => {
      const item = wrapper.querySelector('.glass-portfolio');
      if (item && window.getComputedStyle(item).display !== 'none') {
        // Force shadow recalculation
        wrapper.style.paddingBottom = '16px';
        
        // Trigger browser repaint
        void wrapper.offsetWidth;
        
        // Restore normal padding
        wrapper.style.paddingBottom = '12px';
      }
    });
  }
  
  /**
   * Function to equalize the heights of all portfolio cards
   * This ensures a uniform grid appearance
   */
  function equalizeCardHeights() {
    // Reset heights first
    portfolioItems.forEach(item => {
      if (window.getComputedStyle(item).display !== 'none') {
        const content = item.querySelector('.p-6.bg-white\\/10');
        if (content) {
          content.style.height = 'auto';
        }
      }
    });
    
    // Find the tallest content area
    let maxHeight = 0;
    portfolioItems.forEach(item => {
      if (window.getComputedStyle(item).display !== 'none') {
        const content = item.querySelector('.p-6.bg-white\\/10');
        if (content) {
          maxHeight = Math.max(maxHeight, content.offsetHeight);
        }
      }
    });
    
    // Apply the tallest height to all content areas
    if (maxHeight > 0) {
      portfolioItems.forEach(item => {
        if (window.getComputedStyle(item).display !== 'none') {
          const content = item.querySelector('.p-6.bg-white\\/10');
          if (content) {
            content.style.height = maxHeight + 'px';
          }
        }
      });
    }
  }
  
  /**
   * Function to add subtle animations to decorative elements
   * Creates a more lively section appearance
   */
  function animateDecorativeElements() {
    const decorElements = document.querySelectorAll('#portfolio > div[class*="absolute"]');
    
    decorElements.forEach((elem, index) => {
      // Add a subtle pulse animation with different delays
      elem.style.animation = `pulse-soft ${8 + index * 2}s infinite ease-in-out ${index}s alternate`;
    });
  }
  
  // Handle window resize events to maintain equal heights
  window.addEventListener('resize', debounce(function() {
    equalizeCardHeights();
  }, 250));
  
  /**
   * Simple debounce function to prevent excessive executions
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
});
