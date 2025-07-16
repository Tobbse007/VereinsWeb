// Enhanced Animated Background with Particle System (Based on Test Implementation)
class EnhancedBackground {
    constructor() {
        this.particlesContainer = null;
        
        this.init();
    }
    
    init() {
        this.createBackgroundElements();
        this.createParticleSystem();
        this.addMouseInteraction();
    }
    
    createBackgroundElements() {
        // Create main container
        const container = document.createElement('div');
        container.className = 'animated-bg-container';
        
        // Create gradient spheres
        for (let i = 1; i <= 4; i++) {
            const sphere = document.createElement('div');
            sphere.className = `gradient-sphere sphere-${i}`;
            container.appendChild(sphere);
        }
        
        // Create central glow
        const glow = document.createElement('div');
        glow.className = 'central-glow';
        container.appendChild(glow);
        
        // Create grid overlay with corners
        const grid = document.createElement('div');
        grid.className = 'grid-overlay';
        
        const gridTopLeft = document.createElement('div');
        gridTopLeft.className = 'grid-corner grid-top-left';
        grid.appendChild(gridTopLeft);
        
        const gridBottomRight = document.createElement('div');
        gridBottomRight.className = 'grid-corner grid-bottom-right';
        grid.appendChild(gridBottomRight);
        
        container.appendChild(grid);
        
        // Create noise overlay
        const noise = document.createElement('div');
        noise.className = 'noise-overlay';
        container.appendChild(noise);
        
        // Create floating dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'floating-dots';
        for (let i = 1; i <= 4; i++) {
            const dot = document.createElement('div');
            dot.className = `dot dot-${i}`;
            dotsContainer.appendChild(dot);
        }
        container.appendChild(dotsContainer);
        
        // Create corner accent dots
        const cornerDotsContainer = document.createElement('div');
        cornerDotsContainer.className = 'corner-dots';
        
        const cornerDotTopLeft = document.createElement('div');
        cornerDotTopLeft.className = 'corner-dot corner-dot-top-left';
        cornerDotsContainer.appendChild(cornerDotTopLeft);
        
        const cornerDotBottomRight = document.createElement('div');
        cornerDotBottomRight.className = 'corner-dot corner-dot-bottom-right';
        cornerDotsContainer.appendChild(cornerDotBottomRight);
        
        container.appendChild(cornerDotsContainer);
        
        // Create geometric shapes
        const shapesContainer = document.createElement('div');
        shapesContainer.className = 'geometric-shapes';
        
        const circle = document.createElement('div');
        circle.className = 'shape shape-circle';
        shapesContainer.appendChild(circle);
        
        const square = document.createElement('div');
        square.className = 'shape shape-square';
        shapesContainer.appendChild(square);
        
        const triangle = document.createElement('div');
        triangle.className = 'shape shape-triangle';
        shapesContainer.appendChild(triangle);
        
        container.appendChild(shapesContainer);
        
        // Create particles container
        this.particlesContainer = document.createElement('div');
        this.particlesContainer.className = 'particles-container';
        container.appendChild(this.particlesContainer);
        
        // Insert at the beginning of body
        document.body.insertBefore(container, document.body.firstChild);
    }
    
    createParticleSystem() {
        // Create initial particles like in test
        const particleCount = 80;
        
        for (let i = 0; i < particleCount; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size (small)
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Initial position
        this.resetParticle(particle);
        
        this.particlesContainer.appendChild(particle);
        
        // Animate
        this.animateParticle(particle);
    }

    resetParticle(particle) {
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = '0';
        
        return {
            x: posX,
            y: posY
        };
    }
            
    animateParticle(particle) {
        // Initial position
        const pos = this.resetParticle(particle);
        
        // Random animation properties
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        // Animate with GSAP-like timing
        setTimeout(() => {
            particle.style.transition = `all ${duration}s linear`;
            particle.style.opacity = Math.random() * 0.3 + 0.1;
            
            // Move in a slight direction
            const moveX = pos.x + (Math.random() * 20 - 10);
            const moveY = pos.y - Math.random() * 30; // Move upwards
            
            particle.style.left = `${moveX}%`;
            particle.style.top = `${moveY}%`;
            
            // Reset after animation completes
            setTimeout(() => {
                this.animateParticle(particle);
            }, duration * 1000);
        }, delay * 1000);
    }
    
    addMouseInteraction() {
        let lastParticleTime = 0;
        const throttleDelay = 16; // ~60fps for smoother particle creation
        
        // Mouse interaction - more fluid and responsive
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            
            // Throttle particle creation for better performance
            if (now - lastParticleTime < throttleDelay) return;
            lastParticleTime = now;
            
            // Create multiple particles for more fluid effect
            for (let i = 0; i < 2; i++) {
                setTimeout(() => {
                    // Create particles at mouse position
                    const mouseX = (e.clientX / window.innerWidth) * 100;
                    const mouseY = (e.clientY / window.innerHeight) * 100;
                    
                    // Create temporary particle
                    const particle = document.createElement('div');
                    particle.className = 'particle mouse-particle';
                    
                    // Small size with variation
                    const size = Math.random() * 3 + 1.5;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    
                    // Position at mouse with slight offset
                    const offsetX = (Math.random() - 0.5) * 2;
                    const offsetY = (Math.random() - 0.5) * 2;
                    particle.style.left = `${mouseX + offsetX}%`;
                    particle.style.top = `${mouseY + offsetY}%`;
                    particle.style.opacity = '0.7';
                    
                    // Purple color for mouse particles
                    particle.style.background = 'rgba(139, 92, 246, 0.8)';
                    particle.style.boxShadow = '0 0 6px rgba(139, 92, 246, 0.4)';
                    
                    this.particlesContainer.appendChild(particle);
                    
                    // Immediate animation start for smoother effect
                    requestAnimationFrame(() => {
                        particle.style.transition = 'all 1.5s ease-out';
                        particle.style.left = `${mouseX + (Math.random() * 12 - 6)}%`;
                        particle.style.top = `${mouseY + (Math.random() * 12 - 6)}%`;
                        particle.style.opacity = '0';
                        particle.style.transform = `scale(0.3)`;
                        
                        // Remove after animation
                        setTimeout(() => {
                            if (particle.parentNode) {
                                particle.remove();
                            }
                        }, 1500);
                    });
                }, i * 8); // Slight delay between particles
            }
            
            // Subtle movement of gradient spheres
            const spheres = document.querySelectorAll('.gradient-sphere');
            const moveX = (e.clientX / window.innerWidth - 0.5) * 5;
            const moveY = (e.clientY / window.innerHeight - 0.5) * 5;
            
            spheres.forEach(sphere => {
                sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        new EnhancedBackground();
    }
});

// Export for potential external use
window.EnhancedBackground = EnhancedBackground;