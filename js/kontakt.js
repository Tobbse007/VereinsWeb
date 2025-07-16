// Mehrseitiges Kontaktformular Funktionalität

document.addEventListener('DOMContentLoaded', function() {
  const multiStepForm = document.getElementById('multi-step-form');
  const progressIndicator = document.getElementById('progress-indicator');
  const formSteps = document.querySelectorAll('.form-step');
  const nextButtons = document.querySelectorAll('.next-step');
  const prevButtons = document.querySelectorAll('.prev-step');
  const progressBar = document.getElementById('progress-bar');
  const currentStepEl = document.getElementById('current-step');
  const totalStepsEl = document.getElementById('total-steps');
  
  // Initiale Einstellungen
  let currentStep = 1;
  const totalSteps = formSteps.length;
  
  if (totalStepsEl) totalStepsEl.textContent = totalSteps;
  
  // Initialisiere zusätzliche abhängige Formularfelder
  setupDependentFields();
  
  // Zeige den Fortschrittsindikator direkt an
  if (progressIndicator) progressIndicator.classList.remove('hidden');
  
  // Stelle sicher, dass der erste Schritt angezeigt wird
  formSteps.forEach(step => step.classList.add('hidden'));
  const firstStep = document.querySelector(`.form-step[data-step="1"]`);
  if (firstStep) firstStep.classList.remove('hidden');
  updateProgressBar();
  
  // Event-Listener für "Weiter"-Buttons
  if (nextButtons) {
    nextButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (validateCurrentStep()) {
          goToNextStep();
        }
      });
    });
  }
  
  // Event-Listener für "Zurück"-Buttons
  if (prevButtons) {
    prevButtons.forEach(button => {
      button.addEventListener('click', () => {
        goToPrevStep();
      });
    });
  }
  
  // Zum nächsten Schritt gehen
  function goToNextStep() {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const nextFormStep = document.querySelector(`.form-step[data-step="${currentStep + 1}"]`);
    
    // Prüfe, ob wir den letzten Schritt erreicht haben
    if (currentStep < totalSteps) {
      // Aktuellen Schritt ausblenden
      currentFormStep.classList.add('hidden');
      
      // Nächsten Schritt einblenden
      nextFormStep.classList.remove('hidden');
      
      // Fortschritt aktualisieren
      currentStep++;
      updateProgressBar();
      
      // Nach oben scrollen
      window.scrollTo({
        top: multiStepForm.offsetTop - 100,
        behavior: 'smooth'
      });
    } else {
      // Wenn wir beim letzten Schritt sind, das Formular absenden
      // multiStepForm.submit();
      
      // ALTERNATIV: Zum Testen einfach eine Erfolgsmeldung anzeigen
      showSuccessMessage();
    }
  }
  
  // Zum vorherigen Schritt gehen
  function goToPrevStep() {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const prevFormStep = document.querySelector(`.form-step[data-step="${currentStep - 1}"]`);
    
    if (currentStep > 1) {
      // Aktuellen Schritt ausblenden
      currentFormStep.classList.add('hidden');
      
      // Vorherigen Schritt einblenden
      prevFormStep.classList.remove('hidden');
      
      // Fortschritt aktualisieren
      currentStep--;
      updateProgressBar();
      
      // Nach oben scrollen
      window.scrollTo({
        top: multiStepForm.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  }
  
  // Fortschrittsbalken aktualisieren
  function updateProgressBar() {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    if (progressBar) progressBar.style.width = `${progressPercentage}%`;
    if (currentStepEl) currentStepEl.textContent = currentStep;
  }
  
  // Validieren des aktuellen Schritts
  function validateCurrentStep() {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    let isValid = true;
    
    // Prüfe alle required Felder im aktuellen Schritt
    const requiredFields = currentFormStep.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
        isValid = false;
        showError(field, field.type === 'checkbox' 
                 ? 'Bitte stimmen Sie zu, um fortzufahren' 
                 : 'Dieses Feld ist erforderlich');
      } else {
        clearError(field);
      }
    });
    
    // E-Mail Validierung für Schritt 1
    if (currentStep === 1) {
      const emailInput = document.getElementById('email');
      if (emailInput && emailInput.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
          showError(emailInput, 'Bitte geben Sie eine gültige E-Mail-Adresse ein');
          isValid = false;
        }
      }
    }
    
    // Spezielle Validierung für Schritt 2 (Über Ihren Verein)
    if (currentStep === 2) {
      // Prüfe, ob mindestens ein Radio-Button für Vereinsart ausgewählt ist
      const vereinsartContainer = currentFormStep.querySelector('#vereinsart-container');
      const vereinsartErrorContainer = currentFormStep.querySelector('#vereinsart-error-container');
      const vereinsartRadios = currentFormStep.querySelectorAll('.vereinsart-radio');
      const isAnyRadioChecked = Array.from(vereinsartRadios).some(radio => radio.checked);
      
      if (!isAnyRadioChecked) {
        isValid = false;
        
        // Spezielle Behandlung für die Fehlermeldung der Vereinsart
        clearError(vereinsartErrorContainer);
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm error-message';
        errorElement.textContent = 'Bitte wählen Sie eine Art des Vereins aus';
        vereinsartErrorContainer.appendChild(errorElement);
        vereinsartContainer.classList.add('has-error');
      } else {
        clearError(vereinsartErrorContainer);
        vereinsartContainer.classList.remove('has-error');
      }
      
      // Prüfe, ob bei "Andere Vereinsart" ein Text eingegeben wurde
      const andereVereinartRadio = currentFormStep.querySelector('input[name="vereinsart"][value="andere"]');
      const andereVereinartText = document.getElementById('andere-vereinsart-text');
      
      if (andereVereinartRadio && andereVereinartRadio.checked) {
        if (!andereVereinartText.value.trim()) {
          isValid = false;
          showError(andereVereinartText, 'Bitte beschreiben Sie Ihre Vereinsart');
        } else {
          clearError(andereVereinartText);
        }
      }
    }
    
    // Spezielle Validierung für Schritt 3 (Website Anforderungen)
    if (currentStep === 3) {
      // Prüfe, ob mindestens eine Website-Ziel-Checkbox ausgewählt ist
      const websiteZielContainer = currentFormStep.querySelector('#website-ziele-container');
      const websiteZielErrorContainer = currentFormStep.querySelector('#website-ziele-error-container');
      const websiteZielCheckboxes = currentFormStep.querySelectorAll('.website-ziel-checkbox');
      const isAnyCheckboxChecked = Array.from(websiteZielCheckboxes).some(checkbox => checkbox.checked);
      
      if (!isAnyCheckboxChecked) {
        isValid = false;
        
        // Spezielle Behandlung für die Fehlermeldung der Website-Ziele
        clearError(websiteZielErrorContainer);
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm error-message';
        errorElement.textContent = 'Bitte wählen Sie mindestens ein Ziel für Ihre Website aus';
        websiteZielErrorContainer.appendChild(errorElement);
        websiteZielContainer.classList.add('has-error');
      } else {
        clearError(websiteZielErrorContainer);
        websiteZielContainer.classList.remove('has-error');
      }
      
      // Prüfe, ob bei "Andere Anforderungen" ein Text eingegeben wurde
      const andereAnforderungenCheckbox = currentFormStep.querySelector('#andere-anforderungen-checkbox');
      const andereAnforderungenText = currentFormStep.querySelector('#andere-anforderungen-text');
      
      if (andereAnforderungenCheckbox && andereAnforderungenCheckbox.checked) {
        if (!andereAnforderungenText.value.trim()) {
          isValid = false;
          showError(andereAnforderungenText, 'Bitte beschreiben Sie Ihre Anforderungen');
        } else {
          clearError(andereAnforderungenText);
        }
      }
      
      // Prüfe, ob eine Option für "Vorhandene Website" ausgewählt wurde
      const vorhandeneWebsiteContainer = currentFormStep.querySelector('#vorhandene-website-container');
      const vorhandeneWebsiteErrorContainer = currentFormStep.querySelector('#vorhandene-website-error-container');
      const vorhandeneWebsiteRadios = currentFormStep.querySelectorAll('.vorhandene-website-radio');
      const isAnyVorhandeneWebsiteChecked = Array.from(vorhandeneWebsiteRadios).some(radio => radio.checked);
      
      if (!isAnyVorhandeneWebsiteChecked) {
        isValid = false;
        
        // Spezielle Behandlung für die Fehlermeldung der vorhandenen Website
        clearError(vorhandeneWebsiteErrorContainer);
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm error-message';
        errorElement.textContent = 'Bitte geben Sie an, ob Ihr Verein bereits eine Website hat';
        vorhandeneWebsiteErrorContainer.appendChild(errorElement);
        vorhandeneWebsiteContainer.classList.add('has-error');
      } else {
        clearError(vorhandeneWebsiteErrorContainer);
        vorhandeneWebsiteContainer.classList.remove('has-error');
      }
      
      // Prüfe, ob bei "Ja" zur vorhandenen Website eine URL eingegeben wurde
      const jaVorhandeneWebsiteRadio = currentFormStep.querySelector('input[name="vorhandene_website"][value="ja"]');
      const websiteUrlInput = document.getElementById('website-url');
      const websiteUrlErrorContainer = document.getElementById('website-url-error-container');
      
      if (jaVorhandeneWebsiteRadio && jaVorhandeneWebsiteRadio.checked && websiteUrlInput) {
        if (!websiteUrlInput.value.trim()) {
          isValid = false;
          
          // Spezielle Behandlung für die Fehlermeldung der Website-URL
          clearError(websiteUrlErrorContainer);
          const errorElement = document.createElement('p');
          errorElement.className = 'text-red-500 text-sm error-message';
          errorElement.textContent = 'Bitte geben Sie die URL Ihrer aktuellen Website ein';
          websiteUrlErrorContainer.appendChild(errorElement);
        } else {
          clearError(websiteUrlErrorContainer);
        }
      }
    }
    
    // Spezielle Validierung für Schritt 4 (Design und Funktionen)
    if (currentStep === 4) {
      // Prüfe, ob eine Option für Vereinsfarben ausgewählt wurde
      const vereinsfarbenContainer = currentFormStep.querySelector('#vereinsfarben-container');
      const vereinsfarbenErrorContainer = currentFormStep.querySelector('#vereinsfarben-error-container');
      const vereinsfarbenRadios = currentFormStep.querySelectorAll('.vereinsfarben-radio');
      const isAnyVereinsfarbenChecked = Array.from(vereinsfarbenRadios).some(radio => radio.checked);
      
      if (!isAnyVereinsfarbenChecked) {
        isValid = false;
        
        // Spezielle Behandlung für die Fehlermeldung der Vereinsfarben
        clearError(vereinsfarbenErrorContainer);
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm error-message';
        errorElement.textContent = 'Bitte geben Sie an, ob Sie Vereinsfarben haben';
        vereinsfarbenErrorContainer.appendChild(errorElement);
        vereinsfarbenContainer.classList.add('has-error');
      } else {
        clearError(vereinsfarbenErrorContainer);
        vereinsfarbenContainer.classList.remove('has-error');
      }
        // Prüfe, ob bei "Ja" zu Vereinsfarben die Farben angegeben wurden
      const jaVereinsfarbenRadio = currentFormStep.querySelector('input[name="vereinsfarben"][value="ja"]');
      const vereinsfarbenTextInput = document.getElementById('farben-beschreibung');
      
      if (jaVereinsfarbenRadio && jaVereinsfarbenRadio.checked && vereinsfarbenTextInput) {
        if (!vereinsfarbenTextInput.value.trim()) {
          isValid = false;
          showError(vereinsfarbenTextInput, 'Bitte beschreiben Sie Ihre Vereinsfarben');
        } else {
          clearError(vereinsfarbenTextInput);
        }
      }
        // Prüfe, ob mindestens eine Funktions-Checkbox ausgewählt ist
      const funktionenContainer = currentFormStep.querySelector('#funktionen-container');
      const funktionenErrorContainer = currentFormStep.querySelector('#funktionen-error-container');
      const funktionCheckboxes = currentFormStep.querySelectorAll('.funktionen-checkbox');
      const isAnyFunktionChecked = Array.from(funktionCheckboxes).some(checkbox => checkbox.checked);
      
      if (!isAnyFunktionChecked) {
        isValid = false;
        
        // Spezielle Behandlung für die Fehlermeldung der Funktionen
        clearError(funktionenErrorContainer);
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm error-message';
        errorElement.textContent = 'Bitte wählen Sie mindestens eine gewünschte Funktion aus';
        funktionenErrorContainer.appendChild(errorElement);
        funktionenContainer.classList.add('has-error');
      } else {
        clearError(funktionenErrorContainer);
        funktionenContainer.classList.remove('has-error');
      }
      
      // Prüfe, ob bei "Andere Funktionen" ein Text eingegeben wurde
      const andereFunktionenCheckbox = currentFormStep.querySelector('#andere-funktionen-checkbox');
      const andereFunktionenText = currentFormStep.querySelector('#andere-funktionen-text');
      
      if (andereFunktionenCheckbox && andereFunktionenCheckbox.checked && andereFunktionenText) {
        if (!andereFunktionenText.value.trim()) {
          isValid = false;
          showError(andereFunktionenText, 'Bitte beschreiben Sie die gewünschten Funktionen');
        } else {
          clearError(andereFunktionenText);
        }
      }
    }
    
    return isValid;
  }
    // Fehlermeldung anzeigen
  function showError(field, message) {
    // Füge Fehlerklasse hinzu
    field.classList.add('validation-failed');
    
    // Für Input-Felder
    if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA' || field.tagName === 'SELECT') {
      field.classList.add('border-red-500');
      
      // Suche nach dem Fehlercontainer
      let errorContainer;
      const fieldId = field.id;
      if (fieldId) {
        errorContainer = document.getElementById(fieldId + '-error-container');
      }
      
      // Wenn kein spezifischer Fehlercontainer gefunden wird, suche nach einem allgemeinen
      if (!errorContainer) {
        errorContainer = field.nextElementSibling;
        if (errorContainer && !errorContainer.classList.contains('mt-1')) {
          errorContainer = null;
        }
      }
      
      // Wenn immer noch kein Fehlercontainer gefunden wurde, füge die Fehlermeldung direkt nach dem Feld ein
      if (errorContainer) {
        clearError(errorContainer);
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm error-message';
        errorElement.textContent = message;
        errorContainer.appendChild(errorElement);
      } else {
        // Fallback: Füge die Fehlermeldung direkt nach dem Feld ein
        clearError(field);
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm mt-1 error-message';
        errorElement.textContent = message;
        field.parentElement.appendChild(errorElement);
      }
    } 
    // Für Container (z.B. Radio-Buttons, Checkboxen)
    else {
      field.classList.add('has-error');
    }
  }
  
  // Fehlermeldungen entfernen
  function clearError(field) {
    if (!field) return;
    
    // Wenn es ein Error-Container ist
    if (field.classList.contains('mt-1') || field.id.includes('error-container')) {
      // Alle Fehlermeldungen entfernen
      const errorMessages = field.querySelectorAll('.error-message');
      errorMessages.forEach(msg => msg.remove());
    } 
    // Wenn es ein Formularfeld ist
    else {
      field.classList.remove('border-red-500');
      field.classList.remove('validation-failed');
    } 
    field.classList.remove('has-error');
    field.classList.remove('validation-failed');
  }
  
  // Erfolgsmeldung anzeigen
  function showSuccessMessage() {
    // Formular ausblenden
    multiStepForm.style.display = 'none';
    
    // Container für die Erfolgsmeldung
    const formContainer = document.querySelector('.glass.rounded-2xl');
    
    // Erfolgsmeldung erstellen
    const successMessage = document.createElement('div');
    successMessage.className = 'py-8 px-8';
    successMessage.innerHTML = `
      <div class="text-center">
        <div class="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        
        <a href="#" class="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-0.5">
          Zurück zur Startseite
        </a>
      </div>
    `;
    
    // Fortschrittsanzeige ausblenden
    const progressContainer = formContainer.querySelector('.bg-white.border-b');
    if (progressContainer) {
      progressContainer.style.display = 'none';
    }
    
    // Formularcontainer leeren und Erfolgsmeldung einfügen
    const formContent = formContainer.querySelector('.p-8');
    formContent.innerHTML = '';
    formContent.appendChild(successMessage);
    
    // Nach oben scrollen, damit die Nachricht sichtbar ist
    window.scrollTo({
      top: formContainer.offsetTop - 100,
      behavior: 'smooth'
    });
  }
  
  // Abhängige Formularfelder einrichten
  function setupDependentFields() {
    // Für Vereinsart "Andere"
    const vereinsartRadios = document.querySelectorAll('input[name="vereinsart"]');
    const andereVereinartField = document.getElementById('andere-vereinsart');
    const andereVereinartText = document.getElementById('andere-vereinsart-text');
    
    if (vereinsartRadios.length > 0 && andereVereinartField) {
      vereinsartRadios.forEach(radio => {
        radio.addEventListener('change', function() {
          if (this.value === 'andere' && this.checked) {
            andereVereinartField.classList.remove('hidden');
            // Wenn "Andere" ausgewählt wird, setze required für das Textfeld
            if (andereVereinartText) andereVereinartText.setAttribute('required', '');
          } else {
            andereVereinartField.classList.add('hidden');
            // Wenn eine andere Option ausgewählt wird, entferne required
            if (andereVereinartText) andereVereinartText.removeAttribute('required');
          }
        });
      });
    }
    
    // Für Andere Anforderungen
    const andereAnforderungenCheckbox = document.getElementById('andere-anforderungen-checkbox');
    const andereAnforderungenFeld = document.getElementById('andere-anforderungen-feld');
    const andereAnforderungenText = document.getElementById('andere-anforderungen-text');
    
    if (andereAnforderungenCheckbox && andereAnforderungenFeld) {
      andereAnforderungenCheckbox.addEventListener('change', function() {
        if (this.checked) {
          andereAnforderungenFeld.classList.remove('hidden');
          // Wenn die Checkbox ausgewählt wird, setze required für das Textfeld
          if (andereAnforderungenText) andereAnforderungenText.setAttribute('required', '');
        } else {
          andereAnforderungenFeld.classList.add('hidden');
          // Wenn die Checkbox nicht ausgewählt ist, entferne required
          if (andereAnforderungenText) andereAnforderungenText.removeAttribute('required');
        }
      });
    }
    
    // Für vorhandene Website
    const vorhandeneWebsiteRadios = document.querySelectorAll('input[name="vorhandene_website"]');
    const bestehendeWebsiteUrl = document.getElementById('bestehende-website-url');
    const websiteUrlInput = document.getElementById('website-url');
    
    if (vorhandeneWebsiteRadios.length > 0 && bestehendeWebsiteUrl) {
      vorhandeneWebsiteRadios.forEach(radio => {
        radio.addEventListener('change', function() {
          if (this.value === 'ja' && this.checked) {
            bestehendeWebsiteUrl.classList.remove('hidden');
            // Wenn "Ja" ausgewählt wird, setze required für das URL-Feld
            if (websiteUrlInput) websiteUrlInput.setAttribute('required', '');
          } else {
            bestehendeWebsiteUrl.classList.add('hidden');
            // Wenn "Nein" ausgewählt wird, entferne required
            if (websiteUrlInput) websiteUrlInput.removeAttribute('required');
          }
        });
      });
    }
      // Für Vereinsfarben
    const vereinsfarbenRadios = document.querySelectorAll('input[name="vereinsfarben"]');
    const vereinsfarbenText = document.getElementById('vereinsfarben-details');
    const vereinsfarbenTextInput = document.getElementById('farben-beschreibung');
    
    if (vereinsfarbenRadios.length > 0 && vereinsfarbenText) {
      vereinsfarbenRadios.forEach(radio => {
        radio.addEventListener('change', function() {
          if (this.value === 'ja' && this.checked) {
            vereinsfarbenText.classList.remove('hidden');
            // Wenn "Ja" ausgewählt wird, setze required für das Textfeld
            if (vereinsfarbenTextInput) vereinsfarbenTextInput.setAttribute('required', '');
          } else {
            vereinsfarbenText.classList.add('hidden');
            // Wenn "Nein" ausgewählt wird, entferne required
            if (vereinsfarbenTextInput) vereinsfarbenTextInput.removeAttribute('required');
          }
        });
      });
    }
    
    // Für andere Funktionen
    const andereFunktionenCheckbox = document.getElementById('andere-funktionen-checkbox');
    const andereFunktionenFeld = document.getElementById('andere-funktionen-feld');
    const andereFunktionenText = document.getElementById('andere-funktionen-text');
    
    if (andereFunktionenCheckbox && andereFunktionenFeld) {
      andereFunktionenCheckbox.addEventListener('change', function() {
        if (this.checked) {
          andereFunktionenFeld.classList.remove('hidden');
          // Wenn die Checkbox ausgewählt wird, setze required für das Textfeld
          if (andereFunktionenText) andereFunktionenText.setAttribute('required', '');
        } else {
          andereFunktionenFeld.classList.add('hidden');
          // Wenn die Checkbox nicht ausgewählt ist, entferne required
          if (andereFunktionenText) andereFunktionenText.removeAttribute('required');
        }
      });
    }
  }
});
  
  // Initialisiere zusätzliche abhängige Formularfelder
  setupDependentFields();
  
  // Zeige den Fortschrittsindikator direkt an
  if (progressIndicator) progressIndicator.classList.remove('hidden');
  
  // Stelle sicher, dass der erste Schritt angezeigt wird
  formSteps.forEach(step => step.classList.add('hidden'));
  const firstStep = document.querySelector(`.form-step[data-step="1"]`);
  if (firstStep) firstStep.classList.remove('hidden');
  updateProgressBar();
  
  // Event-Listener für "Weiter"-Buttons
  if (nextButtons) {
    nextButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (validateCurrentStep()) {
          goToNextStep();
        }
      });
    });
  }
  
  // Event-Listener für "Zurück"-Buttons
  if (prevButtons) {
    prevButtons.forEach(button => {
      button.addEventListener('click', () => {
        goToPrevStep();
      });
    });
  }
  
  // Event-Listener für das Formular-Submit
  if (multiStepForm) {
    multiStepForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      if (validateCurrentStep()) {
        // Hier würde normalerweise der Code für die Formularübermittlung stehen
        // z.B. mit fetch API oder AJAX
        
        // Für diesen Prototyp zeigen wir nur eine Erfolgsmeldung an
        showSuccessMessage();
      }
    });
  }
  
  // Validiere den aktuellen Schritt
  function validateCurrentStep() {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    let isValid = true;
    
    // Prüfe alle required Felder im aktuellen Schritt
    const requiredFields = currentFormStep.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
        isValid = false;
        showError(field, field.type === 'checkbox' 
                 ? 'Bitte stimmen Sie zu, um fortzufahren' 
                 : 'Dieses Feld ist erforderlich');
      } else {
        clearError(field);
      }
    });
    
    // E-Mail Validierung für Schritt 1
    if (currentStep === 1) {
      const emailInput = document.getElementById('email');
      if (emailInput && emailInput.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
          showError(emailInput, 'Bitte geben Sie eine gültige E-Mail-Adresse ein');
          isValid = false;
        }
      }
    }    // Spezielle Validierung für Schritt 2 (Über Ihren Verein)
    if (currentStep === 2) {
      // Prüfe, ob mindestens ein Radio-Button für Vereinsart ausgewählt ist
      const vereinsartContainer = currentFormStep.querySelector('#vereinsart-container');
      const vereinsartErrorContainer = currentFormStep.querySelector('#vereinsart-error-container');
      const vereinsartRadios = currentFormStep.querySelectorAll('.vereinsart-radio');
      const isAnyRadioChecked = Array.from(vereinsartRadios).some(radio => radio.checked);
      
      if (!isAnyRadioChecked) {
        isValid = false;
        
        // Spezielle Behandlung für die Fehlermeldung der Vereinsart
        clearError(vereinsartErrorContainer);
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm error-message';
        errorElement.textContent = 'Bitte wählen Sie eine Art des Vereins aus';
        vereinsartErrorContainer.appendChild(errorElement);
        vereinsartContainer.classList.add('has-error');
      } else {
        clearError(vereinsartErrorContainer);
        vereinsartContainer.classList.remove('has-error');
      }
      
      // Prüfe, ob bei "Andere Vereinsart" ein Text eingegeben wurde
      const andereVereinartRadio = currentFormStep.querySelector('input[name="vereinsart"][value="andere"]');
      const andereVereinartText = document.getElementById('andere-vereinsart-text');
      
      if (andereVereinartRadio && andereVereinartRadio.checked) {
        if (!andereVereinartText.value.trim()) {
          isValid = false;
          showError(andereVereinartText, 'Bitte beschreiben Sie Ihre Vereinsart');
        } else {
          clearError(andereVereinartText);
        }
      }
    }
      // Spezielle Validierung für Schritt 3 (Website Anforderungen)
    if (currentStep === 3) {
      // Prüfe, ob mindestens eine Website-Ziel-Checkbox ausgewählt ist
      const websiteZielContainer = currentFormStep.querySelector('#website-ziele-container');
      const websiteZielErrorContainer = currentFormStep.querySelector('#website-ziele-error-container');
      const websiteZielCheckboxes = currentFormStep.querySelectorAll('.website-ziel-checkbox');
      const isAnyCheckboxChecked = Array.from(websiteZielCheckboxes).some(checkbox => checkbox.checked);
      
      if (!isAnyCheckboxChecked) {
        isValid = false;
        
        // Spezielle Behandlung für die Fehlermeldung der Website-Ziele
        clearError(websiteZielErrorContainer);
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm error-message';
        errorElement.textContent = 'Bitte wählen Sie mindestens ein Ziel für Ihre Website aus';
        websiteZielErrorContainer.appendChild(errorElement);
        websiteZielContainer.classList.add('has-error');
      } else {
        clearError(websiteZielErrorContainer);
        websiteZielContainer.classList.remove('has-error');
      }
        // Prüfe, ob bei "Andere Anforderungen" ein Text eingegeben wurde
      const andereAnforderungenCheckbox = currentFormStep.querySelector('#andere-anforderungen-checkbox');
      const andereAnforderungenText = currentFormStep.querySelector('#andere-anforderungen-text');
      
      if (andereAnforderungenCheckbox && andereAnforderungenCheckbox.checked) {
        if (!andereAnforderungenText.value.trim()) {
          isValid = false;
          showError(andereAnforderungenText, 'Bitte beschreiben Sie Ihre Anforderungen');
        } else {
          clearError(andereAnforderungenText);
        }
      }
    // Prüfe, ob eine Option für "Vorhandene Website" ausgewählt wurde
      const vorhandeneWebsiteContainer = currentFormStep.querySelector('#vorhandene-website-container');
      const vorhandeneWebsiteErrorContainer = currentFormStep.querySelector('#vorhandene-website-error-container');
      const vorhandeneWebsiteRadios = currentFormStep.querySelectorAll('.vorhandene-website-radio');
      const isAnyVorhandeneWebsiteChecked = Array.from(vorhandeneWebsiteRadios).some(radio => radio.checked);
        if (!isAnyVorhandeneWebsiteChecked) {
        isValid = false;
        
        // Spezielle Behandlung für die Fehlermeldung der vorhandenen Website
        clearError(vorhandeneWebsiteErrorContainer);
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm error-message';
        errorElement.textContent = 'Bitte geben Sie an, ob Ihr Verein bereits eine Website hat';
        vorhandeneWebsiteErrorContainer.appendChild(errorElement);
        vorhandeneWebsiteContainer.classList.add('has-error');
      } else {
        clearError(vorhandeneWebsiteErrorContainer);
        vorhandeneWebsiteContainer.classList.remove('has-error');
      }
      
      // Prüfe, ob bei "Ja" zur vorhandenen Website eine URL eingegeben wurde
      const jaVorhandeneWebsiteRadio = currentFormStep.querySelector('input[name="vorhandene_website"][value="ja"]');
      const websiteUrlInput = document.getElementById('website-url');
      const websiteUrlErrorContainer = document.getElementById('website-url-error-container');
      
      if (jaVorhandeneWebsiteRadio && jaVorhandeneWebsiteRadio.checked && websiteUrlInput) {
        if (!websiteUrlInput.value.trim()) {
          isValid = false;
          
          // Spezielle Behandlung für die Fehlermeldung der Website-URL
          clearError(websiteUrlErrorContainer);
          const errorElement = document.createElement('p');
          errorElement.className = 'text-red-500 text-sm error-message';
          errorElement.textContent = 'Bitte geben Sie die URL Ihrer aktuellen Website ein';
          websiteUrlErrorContainer.appendChild(errorElement);
        } else {
          clearError(websiteUrlErrorContainer);
        }
      }
    }// Spezielle Validierung für Schritt 4 (Design und Funktionen)
    if (currentStep === 4) {
      // Prüfe, ob eine Option für Vereinsfarben ausgewählt wurde
      const vereinsfarbenContainer = currentFormStep.querySelector('#vereinsfarben-container');
      const vereinsfarbenErrorContainer = currentFormStep.querySelector('#vereinsfarben-error-container');
      const vereinsfarbenRadios = currentFormStep.querySelectorAll('.vereinsfarben-radio');
      const isAnyVereinsfarbenChecked = Array.from(vereinsfarbenRadios).some(radio => radio.checked);
      
      if (!isAnyVereinsfarbenChecked) {
        isValid = false;
        
        // Spezielle Behandlung für die Fehlermeldung der Vereinsfarben
        clearError(vereinsfarbenErrorContainer);
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm error-message';
        errorElement.textContent = 'Bitte geben Sie an, ob Sie Vereinsfarben haben';
        vereinsfarbenErrorContainer.appendChild(errorElement);
        vereinsfarbenContainer.classList.add('has-error');
      } else {
        clearError(vereinsfarbenErrorContainer);
        vereinsfarbenContainer.classList.remove('has-error');
      }
      
      // Prüfe, ob bei "Ja" für Vereinsfarben ein Text eingegeben wurde
      const jaVereinsfarbenRadio = currentFormStep.querySelector('input[name="vereinsfarben"][value="ja"]');
      const farbenBeschreibungInput = document.getElementById('farben-beschreibung');
      
      if (jaVereinsfarbenRadio && jaVereinsfarbenRadio.checked && farbenBeschreibungInput) {
        if (!farbenBeschreibungInput.value.trim()) {
          isValid = false;
          showError(farbenBeschreibungInput, 'Bitte beschreiben Sie Ihre Vereinsfarben');
        } else {
          clearError(farbenBeschreibungInput);
        }
      }
      
      // Prüfe, ob mindestens eine Funktions-Checkbox ausgewählt ist
      const funktionenContainer = currentFormStep.querySelector('#funktionen-container');
      const funktionenErrorContainer = currentFormStep.querySelector('#funktionen-error-container');
      const funktionenCheckboxes = currentFormStep.querySelectorAll('.funktionen-checkbox');
      const isAnyFunktionenChecked = Array.from(funktionenCheckboxes).some(checkbox => checkbox.checked);
      
      if (!isAnyFunktionenChecked) {
        isValid = false;
        
        // Spezielle Behandlung für die Fehlermeldung der Funktionen
        clearError(funktionenErrorContainer);
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm error-message';
        errorElement.textContent = 'Bitte wählen Sie mindestens eine Funktion für Ihre Website aus';
        funktionenErrorContainer.appendChild(errorElement);
        funktionenContainer.classList.add('has-error');
      } else {
        clearError(funktionenErrorContainer);
        funktionenContainer.classList.remove('has-error');
      }
      
      // Prüfe, ob bei "Andere Funktionen" ein Text eingegeben wurde
      const andereFunktionenCheckbox = currentFormStep.querySelector('#andere-funktionen-checkbox');
      const andereFunktionenText = document.getElementById('andere-funktionen-text');
      
      if (andereFunktionenCheckbox && andereFunktionenCheckbox.checked && andereFunktionenText) {
        if (!andereFunktionenText.value.trim()) {
          isValid = false;
          showError(andereFunktionenText, 'Bitte beschreiben Sie die gewünschten Funktionen');
        } else {
          clearError(andereFunktionenText);
        }
      }
    }
    
    // Spezielle Validierung für Schritt 5 (Abschluss)
    if (currentStep === 5) {
      // Datenschutz-Checkbox validieren
      const datenschutzCheckbox = document.getElementById('datenschutz');
      if (datenschutzCheckbox && !datenschutzCheckbox.checked) {
        isValid = false;
        showError(datenschutzCheckbox, 'Bitte stimmen Sie der Datenschutzerklärung zu, um fortzufahren');
      } else if (datenschutzCheckbox) {
        clearError(datenschutzCheckbox);
      }
    }
    
    return isValid;
  }
  
  // Zum nächsten Schritt gehen
  function goToNextStep() {
    formSteps.forEach(step => step.classList.add('hidden'));
    currentStep++;
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('hidden');
    updateProgressBar();
  }
  
  // Zum vorherigen Schritt gehen
  function goToPrevStep() {
    formSteps.forEach(step => step.classList.add('hidden'));
    currentStep--;
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('hidden');
    updateProgressBar();
  }
  
  // Aktualisiere den Fortschrittsbalken
  function updateProgressBar() {
    if (currentStepEl) currentStepEl.textContent = currentStep;
    if (progressBar) progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
  }
    // Einrichtung von abhängigen Formularfeldern
  function setupDependentFields() {
    // Für Vereinsart "Andere"
    const vereinsartRadios = document.querySelectorAll('input[name="vereinsart"]');
    const andereVereinartField = document.getElementById('andere-vereinsart');
    const andereVereinartText = document.getElementById('andere-vereinsart-text');
    
    if (vereinsartRadios.length > 0 && andereVereinartField) {
      vereinsartRadios.forEach(radio => {
        radio.addEventListener('change', function() {
          if (this.value === 'andere' && this.checked) {
            andereVereinartField.classList.remove('hidden');
            // Wenn "Andere" ausgewählt wird, setze required für das Textfeld
            if (andereVereinartText) andereVereinartText.setAttribute('required', '');
          } else {
            andereVereinartField.classList.add('hidden');
            // Wenn eine andere Option ausgewählt wird, entferne required
            if (andereVereinartText) andereVereinartText.removeAttribute('required');
          }
        });
      });
    }
      // Für Andere Anforderungen
    const andereAnforderungenCheckbox = document.getElementById('andere-anforderungen-checkbox');
    const andereAnforderungenFeld = document.getElementById('andere-anforderungen-feld');
    const andereAnforderungenText = document.getElementById('andere-anforderungen-text');
    
    if (andereAnforderungenCheckbox && andereAnforderungenFeld) {
      andereAnforderungenCheckbox.addEventListener('change', function() {
        if (this.checked) {
          andereAnforderungenFeld.classList.remove('hidden');
          // Wenn die Checkbox ausgewählt wird, setze required für das Textfeld
          if (andereAnforderungenText) andereAnforderungenText.setAttribute('required', '');
        } else {
          andereAnforderungenFeld.classList.add('hidden');
          // Wenn die Checkbox nicht ausgewählt ist, entferne required
          if (andereAnforderungenText) andereAnforderungenText.removeAttribute('required');
        }
      });
    }
      // Für vorhandene Website
    const vorhandeneWebsiteRadios = document.querySelectorAll('input[name="vorhandene_website"]');
    const bestehendeWebsiteUrl = document.getElementById('bestehende-website-url');
    const websiteUrlInput = document.getElementById('website-url');
    
    if (vorhandeneWebsiteRadios.length > 0 && bestehendeWebsiteUrl) {
      vorhandeneWebsiteRadios.forEach(radio => {
        radio.addEventListener('change', function() {
          if (this.value === 'ja' && this.checked) {
            bestehendeWebsiteUrl.classList.remove('hidden');
            // Wenn "Ja" ausgewählt wird, setze required für das URL-Feld
            if (websiteUrlInput) websiteUrlInput.setAttribute('required', '');
          } else {
            bestehendeWebsiteUrl.classList.add('hidden');
            // Wenn "Nein" ausgewählt wird, entferne required
            if (websiteUrlInput) websiteUrlInput.removeAttribute('required');
          }
        });
      });
    }    // Für Vereinsfarben
    const vereinsfarbenRadios = document.querySelectorAll('input[name="vereinsfarben"]');
    const vereinsfarbenDetails = document.getElementById('vereinsfarben-details');
    const farbenBeschreibungInput = document.getElementById('farben-beschreibung');
    
    if (vereinsfarbenRadios.length > 0 && vereinsfarbenDetails) {
      vereinsfarbenRadios.forEach(radio => {
        radio.addEventListener('change', function() {
          if (this.value === 'ja' && this.checked) {
            vereinsfarbenDetails.classList.remove('hidden');
            // Wenn "Ja" ausgewählt wird, setze required für das Textfeld
            if (farbenBeschreibungInput) farbenBeschreibungInput.setAttribute('required', '');
          } else {
            vereinsfarbenDetails.classList.add('hidden');
            // Wenn "Nein" ausgewählt wird, entferne required
            if (farbenBeschreibungInput) farbenBeschreibungInput.removeAttribute('required');
          }
        });
      });
    }
    
    // Für Andere Funktionen
    const andereFunktionenCheckbox = document.getElementById('andere-funktionen-checkbox');
    const andereFunktionenFeld = document.getElementById('andere-funktionen-feld');
    const andereFunktionenText = document.getElementById('andere-funktionen-text');
    
    if (andereFunktionenCheckbox && andereFunktionenFeld) {
      andereFunktionenCheckbox.addEventListener('change', function() {
        if (this.checked) {
          andereFunktionenFeld.classList.remove('hidden');
          // Wenn die Checkbox ausgewählt wird, setze required für das Textfeld
          if (andereFunktionenText) andereFunktionenText.setAttribute('required', '');
        } else {
          andereFunktionenFeld.classList.add('hidden');
          // Wenn die Checkbox nicht ausgewählt ist, entferne required
          if (andereFunktionenText) andereFunktionenText.removeAttribute('required');
        }
      });
    }
  }
  // Fehlermeldung anzeigen
  function showError(field, message) {
    clearError(field);
    
    const errorElement = document.createElement('p');
    errorElement.className = 'text-red-500 text-sm mt-1 error-message';
    errorElement.textContent = message;
    
    // Unterschiedliche Behandlung je nach Elementtyp
    if (field.type === 'checkbox' || field.type === 'radio') {
      // Bei Checkbox oder Radio ist das Parent-Element anders
      field.closest('label').parentElement.appendChild(errorElement);
      field.classList.add('validation-failed');
    } else if (field.tagName) {
      // Standardelemente mit tagName (inputs, textareas, etc.)
      field.parentElement.appendChild(errorElement);
      field.classList.add('border-red-500');
      field.classList.add('validation-failed');
    } else {
      // Container oder andere Nicht-Standardelemente
      field.appendChild(errorElement);
      field.classList.add('has-error');
    }
  }  // Fehlermeldung entfernen  function clearError(field) {
    let parent;
    
    if (!field) return;
      if (field.id === 'vereinsart-error-container' || 
        field.id === 'website-ziele-error-container' || 
        field.id === 'vorhandene-website-error-container' ||
        field.id === 'vereinsfarben-error-container' ||
        field.id === 'funktionen-error-container' ||
        field.id === 'website-url-error-container') {
      // Spezielle Behandlung für die dedizierten Fehlercontainer
      parent = field;
    } else if (field.type === 'checkbox' || field.type === 'radio') {
      parent = field.closest('label').parentElement;
    } else if (field.tagName) {
      parent = field.parentElement;
    } else {
      // Container oder andere Nicht-Standardelemente
      parent = field;
    }
    
    const errorElement = parent.querySelector('.error-message');
    
    if (errorElement) {
      parent.removeChild(errorElement);
    }
    
    if (field.tagName) {      field.classList.remove('border-red-500');
      field.classList.remove('validation-failed');
    } else {
      field.classList.remove('has-error');
    }
    field.classList.remove('validation-failed');
  }
  
  // Erfolgsmeldung anzeigen
  function showSuccessMessage() {
    // Formular ausblenden
    multiStepForm.style.display = 'none';
    
    // Container für die Erfolgsmeldung
    const formContainer = document.querySelector('.glass.rounded-2xl');
    
    // Erfolgsmeldung erstellen
    const successMessage = document.createElement('div');
    successMessage.className = 'py-8 px-8';
    successMessage.innerHTML = `
      <div class="text-center">
        <div class="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        
        <a href="#" class="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-0.5">
          Zurück zur Startseite
        </a>
      </div>
    `;
    
    // Fortschrittsanzeige ausblenden
    const progressContainer = formContainer.querySelector('.bg-white.border-b');
    if (progressContainer) {
      progressContainer.style.display = 'none';
    }
    
    // Formularcontainer leeren und Erfolgsmeldung einfügen
    const formContent = formContainer.querySelector('.p-8');
    formContent.innerHTML = '';
    formContent.appendChild(successMessage);
    
    // Nach oben scrollen, damit die Nachricht sichtbar ist
    window.scrollTo({
      top: formContainer.offsetTop - 100,
      behavior: 'smooth'
    });
  }
});
