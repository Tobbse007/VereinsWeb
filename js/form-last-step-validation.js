/**
 * Form Validation for Last Step
 * This script specifically handles validation for the last step of the multi-step form.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Überprüfen, ob wir auf der richtigen Seite sind
  const multiStepForm = document.getElementById('multi-step-form');
  
  if (!multiStepForm) return;
  
  // Get the submit button
  const submitButton = document.querySelector('button[type="submit"]');
  
  // Form-Submission Event überschreiben
  multiStepForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Speichere die aktuelle Scrollposition vor der Validierung
    const currentScrollPosition = window.scrollY;
    
    // Validiere die Felder im letzten Schritt
    const lastStep = document.querySelector(`.form-step[data-step="5"]`);
    if (!lastStep) return;
    
    const requiredFields = lastStep.querySelectorAll('[required]');
    let isValid = true;
    
    // Remove all existing error messages first
    clearAllErrors(lastStep);
    
    // Check all required fields
    requiredFields.forEach(field => {
      // For checkboxes
      if (field.type === 'checkbox') {
        if (!field.checked) {
          isValid = false;
          showError(field, 'Bitte stimmen Sie zu, um fortzufahren');
        }
      } 
      // For select fields
      else if (field.tagName === 'SELECT') {
        if (!field.value || field.value === '') {
          isValid = false;
          showError(field, 'Bitte wählen Sie eine Option aus');
        }
      } 
      // For other input fields
      else if (!field.value.trim()) {
        isValid = false;
        showError(field, 'Dieses Feld ist erforderlich');
      }
    });
    
    // If the form is not valid, restore scroll position and exit
    if (!isValid) {
      console.log('Formular ist nicht gültig!');
      setTimeout(() => {
        window.scrollTo({
          top: currentScrollPosition,
          behavior: 'auto'
        });
      }, 100);
      return;
    }
    
    // Show loading indicator and then thank you message
    showLoadingIndicator();
    
    // Simulate processing time (1.5 seconds)
    setTimeout(() => {
      showThankYouMessage();
    }, 1500);
  });
  
  // Utility function to show loading indicator
  function showLoadingIndicator() {
    // Hide all form steps
    const formSteps = document.querySelectorAll('.form-step');
    formSteps.forEach(step => step.classList.add('hidden'));
    
    // Create loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'form-loading-indicator';
    loadingIndicator.className = 'text-center py-12';
    loadingIndicator.innerHTML = `
      <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500 border-r-4 border-primary-300 border-b-4 border-primary-200 border-l-4 border-primary-400"></div>
      <p class="mt-4 text-primary-700 text-lg font-medium">Ihre Anfrage wird verarbeitet...</p>
    `;
    
    // Replace form content with loading indicator
    const formContainer = document.getElementById('multi-step-form').closest('.px-6.py-4') || document.getElementById('multi-step-form').parentNode;
    if (formContainer) {
      // Keep current content but hide it
      Array.from(formContainer.children).forEach(child => {
        if (child.id !== 'form-loading-indicator') {
          child.style.display = 'none';
        }
      });
      
      // Add loading indicator
      formContainer.appendChild(loadingIndicator);
    }
  }
  
  // Utility function to show error messages
  function showError(field, message) {
    // Mark the field as invalid
    field.classList.add('validation-failed', 'border-red-500');
    
    // Find the error container
    let errorContainer;
    if (field.id) {
      errorContainer = document.getElementById(field.id + '-error-container');
    }
    
    // If no specific container was found
    if (!errorContainer) {
      // For checkboxes, add after the label
      if (field.type === 'checkbox') {
        // Create a new container
        errorContainer = document.createElement('div');
        errorContainer.id = field.id + '-error-container';
        errorContainer.className = 'mt-1 ml-6';
        
        // Add it after the parent div
        const parent = field.closest('div');
        parent.parentNode.insertBefore(errorContainer, parent.nextSibling);
      } else {
        // For other fields, add directly after the field
        const parent = field.parentNode;
        errorContainer = document.createElement('div');
        errorContainer.className = 'mt-1';
        parent.appendChild(errorContainer);
      }
    }
    
    // Clear the container first
    errorContainer.innerHTML = '';
    
    // Create and add the error message
    const errorElement = document.createElement('p');
    errorElement.className = 'text-red-500 text-sm error-message';
    errorElement.textContent = message;
    errorContainer.appendChild(errorElement);
  }
  
  // Utility function to clear all errors
  function clearAllErrors(container) {
    const errorMessages = container.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    const invalidFields = container.querySelectorAll('.validation-failed, .border-red-500, .has-error');
    invalidFields.forEach(field => {
      field.classList.remove('validation-failed', 'border-red-500', 'has-error');
    });
  }
  
  // Function to show thank you message
  function showThankYouMessage() {
    // Hide all form steps
    const formSteps = document.querySelectorAll('.form-step');
    formSteps.forEach(step => step.classList.add('hidden'));
    
    // Hide progress indicator
    const progressIndicator = document.getElementById('progress-indicator');
    if (progressIndicator) {
      progressIndicator.style.display = 'none';
    }
    
    // Remove loading indicator if it exists
    const loadingIndicator = document.getElementById('form-loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
    
    // Create thank you message
    const thankYouMessage = document.createElement('div');
    thankYouMessage.className = 'thank-you-message active p-8';
    thankYouMessage.innerHTML = `
      <div class="thank-you-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h3 class="text-2xl font-bold mb-4 text-gray-800">Vielen Dank für Ihre Anfrage!</h3>
      <p class="text-gray-600 mb-6">Wir haben alle Informationen erhalten und werden Ihren kostenlosen Erstentwurf erstellen. Sie hören innerhalb der nächsten 24-48 Stunden von uns.</p>
      
      <div class="p-6 bg-primary-50 rounded-xl border border-primary-100 mb-6">
        <h4 class="font-semibold text-primary-700 mb-2">Ihre nächsten Schritte:</h4>
        <ol class="text-left space-y-3 text-gray-700">
          <li class="flex items-start">
            <span class="flex-shrink-0 bg-primary-100 w-6 h-6 rounded-full flex items-center justify-center text-primary-700 font-bold mr-2">1</span>
            <span>Wir erstellen Ihren kostenlosen Erstentwurf basierend auf Ihren Angaben.</span>
          </li>
          <li class="flex items-start">
            <span class="flex-shrink-0 bg-primary-100 w-6 h-6 rounded-full flex items-center justify-center text-primary-700 font-bold mr-2">2</span>
            <span>Sie erhalten eine E-Mail mit dem Zugang zu Ihrem Erstentwurf.</span>
          </li>
          <li class="flex items-start">
            <span class="flex-shrink-0 bg-primary-100 w-6 h-6 rounded-full flex items-center justify-center text-primary-700 font-bold mr-2">3</span>
            <span>Gemeinsam besprechen wir mögliche Anpassungen und das weitere Vorgehen.</span>
          </li>
        </ol>
      </div>
      
      <a href="pages/kontakt/index.html" class="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-0.5">
        Noch Fragen?
      </a>
    `;
    
    // Replace form content with thank you message
    const formContainer = multiStepForm.closest('.px-6.py-4') || multiStepForm.parentNode;
    if (formContainer) {
      formContainer.innerHTML = '';
      formContainer.appendChild(thankYouMessage);
      
      // Don't scroll - stay at current position
    }
  }
});
