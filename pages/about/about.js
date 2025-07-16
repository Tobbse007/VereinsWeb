/**
 * About page specific JS functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize any about-specific functionality
  initTeamHoverEffects();
});

/**
 * Add subtle hover effects for team members
 */
function initTeamHoverEffects() {
  const teamMembers = document.querySelectorAll('.team-member');
  
  teamMembers.forEach(member => {
    member.addEventListener('mouseenter', function() {
      this.classList.add('shadow-lg');
      this.style.transform = 'translateY(-5px)';
    });
    
    member.addEventListener('mouseleave', function() {
      this.classList.remove('shadow-lg');
      this.style.transform = 'translateY(0)';
    });
  });
}
