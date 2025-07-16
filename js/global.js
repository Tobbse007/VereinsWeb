/**
 * Global JavaScript functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initSmoothScrolling();
  setupRevealAnimations();
  fixScrollingIssues();
  initPortfolioSmoothScroll();
});

/**
 * Fix for scrolling issues
 */
function fixScrollingIssues() {
  // Ensure body is scrollable
  document.body.style.overflow = 'auto';
  document.body.style.height = 'auto';
  
  // Force redraw to fix potential scroll locks
  window.addEventListener('load', function() {
    setTimeout(function() {
      window.scrollTo(0, 1);
      window.scrollTo(0, 0);
    }, 100);
  });
}

/**
 * Navigation functionality
 */
function initNavigation() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('hidden');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Highlight active navigation item
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-item');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath === href || currentPath.endsWith(href))) {
      link.setAttribute('aria-current', 'page');
    }
  });
  
  // Navbar hover animation
  initNavHoverEffect();
}

/**
 * Navbar hover animation effect
 */
function initNavHoverEffect() {
  const navContainer = document.getElementById('navbar-menu');
  const navItems = document.querySelectorAll('.nav-item');
  
  if (navContainer && navItems.length > 0) {
    // Initialize the active item position
    const activeItem = document.querySelector('.nav-item[aria-current="page"]');
    if (activeItem) {
      const itemRect = activeItem.getBoundingClientRect();
      const containerRect = navContainer.getBoundingClientRect();
      const relativeLeft = itemRect.left - containerRect.left;
      
      // Set initial position for active item
      navContainer.style.setProperty('--pseudo-opacity', '1');
      navContainer.style.setProperty('--pseudo-left', `${relativeLeft}px`);
      navContainer.style.setProperty('--pseudo-width', `${itemRect.width}px`);
    }
    
    // Set up hover effects
    navItems.forEach((item) => {
      item.addEventListener('mouseenter', function() {
        const itemRect = item.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();
        const relativeLeft = itemRect.left - containerRect.left;
        
        // Update the background indicator
        navContainer.style.setProperty('--hover-left', `${relativeLeft}px`);
        navContainer.style.setProperty('--hover-width', `${itemRect.width}px`);
        
        // Show and position the background
        navContainer.style.setProperty('--pseudo-opacity', '1');
        navContainer.style.setProperty('--pseudo-left', `${relativeLeft}px`);
        navContainer.style.setProperty('--pseudo-width', `${itemRect.width}px`);
      });
    });
    
    // When mouse leaves nav container, highlight active item or hide background
    navContainer.addEventListener('mouseleave', function() {
      const activeItem = document.querySelector('.nav-item[aria-current="page"]');
      
      if (activeItem) {
        const itemRect = activeItem.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();
        const relativeLeft = itemRect.left - containerRect.left;
        
        navContainer.style.setProperty('--pseudo-opacity', '1');
        navContainer.style.setProperty('--pseudo-left', `${relativeLeft}px`);
        navContainer.style.setProperty('--pseudo-width', `${itemRect.width}px`);
      } else {
        navContainer.style.setProperty('--pseudo-opacity', '0');
      }
    });
  }
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = document.querySelector('nav')?.getBoundingClientRect().height || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Reveal animations on scroll
 */
function setupRevealAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  
  if (elements.length === 0 || !window.IntersectionObserver) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Counter animation
 * @param {HTMLElement} element - Element containing the number to animate
 * @param {Number} target - Final number to count to
 * @param {Number} duration - Animation duration in milliseconds
 */
function animateCounter(element, target, duration = 2000) {
  if (!element) return;
  
  const startTime = performance.now();
  const startValue = 0;
  
  // Kürzere Gesamtdauer für schnellere Animation
  const reducedDuration = Math.min(duration, 1500);
  
  // Easing-Funktion: Schnell am Anfang, langsamer zum Ende
  const easeOutQuad = t => t * (2 - t);
  
  const updateCounter = (timestamp) => {
    // Berechnet die verstrichene Zeit
    const elapsed = timestamp - startTime;
    
    // Berechnet den Fortschritt (0 bis 1)
    const progress = Math.min(elapsed / reducedDuration, 1);
    
    // Wendet die Ease-Out-Funktion auf den Fortschritt an
    const easedProgress = easeOutQuad(progress);
    
    // Berechnet den aktuellen Wert
    const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
    
    // Aktualisiert den Text
    element.textContent = currentValue;
    
    // Fortsetzung der Animation, wenn nicht abgeschlossen
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      // Sicherstellen, dass der endgültige Wert exakt angezeigt wird
      element.textContent = target;
    }
  };
  
  requestAnimationFrame(updateCounter);
}

/**
 * Initialize smooth scrolling to portfolio section
 */
function initPortfolioSmoothScroll() {
  const scrollToPortfolioLinks = document.querySelectorAll('.scroll-to-portfolio');
  
  scrollToPortfolioLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Add a highlight effect to make it clear where we've scrolled
        targetSection.classList.add('highlight-section');
        
        // Scroll to the section
        window.scrollTo({
          top: targetSection.offsetTop - 80, // Account for fixed navbar
          behavior: 'smooth'
        });
        
        // Remove highlight after a delay
        setTimeout(() => {
          targetSection.classList.remove('highlight-section');
        }, 1500);
      }
    });
  });
}
