// Footer Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const footerForm = document.getElementById('footer-contact-form');
    
    if (footerForm) {
        // Add input focus effects
        const formInputs = footerForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('input-focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('input-focused');
                }
            });
        });
        
        // Form submission handler
        footerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const nameInput = footerForm.querySelector('input[type="text"]');
            const emailInput = footerForm.querySelector('input[type="email"]');
            const messageInput = footerForm.querySelector('textarea');
            const checkboxInput = document.getElementById('footer-datenschutz');
            
            // Validate form
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                showFormMessage(footerForm, 'Bitte füllen Sie alle Pflichtfelder aus.', 'error');
                return;
            }
            
            // Check if checkbox is checked
            if (!checkboxInput.checked) {
                showFormMessage(footerForm, 'Bitte akzeptieren Sie die Datenschutzerklärung.', 'error');
                return;
            }
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showFormMessage(footerForm, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
                return;
            }
            
            // Add loading state to button
            const submitButton = footerForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span> Wird gesendet...';
            
            // Here you would normally send the form data to your server
            // For demo purposes, we'll just simulate a successful submission with a delay
            setTimeout(() => {
                // Remove any existing message
                const existingMessage = footerForm.querySelector('.footer-form-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                // Show success message
                showFormMessage(footerForm, 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir werden uns in Kürze bei Ihnen melden.', 'success');
                
                // Reset form
                footerForm.reset();
                
                // Reset button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                
                // Remove success message after 6 seconds
                setTimeout(() => {
                    const message = footerForm.querySelector('.footer-form-message');
                    if (message) {
                        fadeOut(message, function() {
                            message.remove();
                        });
                    }
                }, 6000);
            }, 1500);
        });
    }
    
    // Add highlight effect to social media icons
    const socialLinks = document.querySelectorAll('.footer-social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseover', function() {
            socialLinks.forEach(otherLink => {
                if (otherLink !== link) {
                    otherLink.style.opacity = '0.6';
                }
            });
        });
        
        link.addEventListener('mouseout', function() {
            socialLinks.forEach(otherLink => {
                otherLink.style.opacity = '1';
            });
        });
    });
});

// Helper function to show form messages with animation
function showFormMessage(form, message, type) {
    // Remove any existing message
    const existingMessage = form.querySelector('.footer-form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `footer-form-message footer-form-${type}`;
    messageElement.style.opacity = '0';
    messageElement.textContent = message;
    
    // Add message to form
    form.appendChild(messageElement);
    
    // Fade in animation
    setTimeout(() => {
        fadeIn(messageElement);
    }, 10);
}

// Fade in helper
function fadeIn(element, callback) {
    let opacity = 0;
    element.style.opacity = opacity;
    
    const fadeInInterval = setInterval(() => {
        if (opacity < 1) {
            opacity += 0.1;
            element.style.opacity = opacity;
        } else {
            clearInterval(fadeInInterval);
            if (callback) callback();
        }
    }, 30);
}

// Fade out helper
function fadeOut(element, callback) {
    let opacity = 1;
    element.style.opacity = opacity;
    
    const fadeOutInterval = setInterval(() => {
        if (opacity > 0) {
            opacity -= 0.1;
            element.style.opacity = opacity;
        } else {
            clearInterval(fadeOutInterval);
            if (callback) callback();
        }
    }, 30);
}
