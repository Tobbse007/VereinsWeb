// Multi-Step Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('multi-step-form');
    if (!form) return;

    const formSteps = form.querySelectorAll('.form-step');
    const progressIndicator = document.getElementById('progress-indicator');
    const currentStepIndicator = document.getElementById('current-step');
    const totalStepsIndicator = document.getElementById('total-steps');
    const progressBar = document.getElementById('progress-bar');

    if (totalStepsIndicator) {
        totalStepsIndicator.textContent = formSteps.length;
    }

    let currentStep = 1;
    
    // Prevent default form submission and handle it manually
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        console.log('Form submission attempted - validating step 5');
        
        // Validate step 5 before submitting
        if (validateStep(5)) {
            console.log('Step 5 validation passed - showing loading screen');
            
            // Erstelle die fehlenden Elemente direkt im Formular-Container
            const formContainer = document.querySelector('.contact-glass');
            
            // Erstelle Ladebildschirm falls er nicht existiert
            let loadingScreen = document.getElementById('loading-screen');
            if (!loadingScreen && formContainer) {
                loadingScreen = document.createElement('div');
                loadingScreen.id = 'loading-screen';
                loadingScreen.className = 'p-8 text-center';
                loadingScreen.innerHTML = `
                    <div class="flex flex-col items-center justify-center space-y-4">
                        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-blue border-t-transparent"></div>
                        <p class="text-lg font-semibold text-gray-700">Ihre Anfrage wird verarbeitet...</p>
                    </div>
                `;
                formContainer.appendChild(loadingScreen);
                console.log('Ladebildschirm dynamisch erstellt');
            }
            
            // Erstelle Erfolgsmeldung falls sie nicht existiert
            let successMessage = document.getElementById('success-message');
            if (!successMessage && formContainer) {
                successMessage = document.createElement('div');
                successMessage.id = 'success-message';
                successMessage.className = 'p-8 text-center hidden';
                successMessage.innerHTML = `
                    <div class="flex flex-col items-center justify-center space-y-4">
                        <div class="bg-green-100 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800">Vielen Dank für Ihre Anfrage!</h3>
                        <p class="text-gray-600 mb-2">Wir haben Ihre Informationen erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.</p>
                        <p class="text-gray-600 mb-4">Im nächsten Schritt besprechen wir gemeinsam Ihre Anforderungen im Detail und erstellen einen ersten Entwurf für Ihren Vereinsauftritt.</p>
                        <button id="contact-button" class="mt-4 inline-block bg-primary-blue text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50 flex items-center">
                            <span>Noch Fragen?</span>
                           
                        </button>
                    </div>
                `;
                formContainer.appendChild(successMessage);
                console.log('Erfolgsmeldung dynamisch erstellt');
                
                // Event-Listener für den "Noch Fragen?" Button hinzufügen
                setTimeout(() => {
                    const contactButton = document.getElementById('contact-button');
                    if (contactButton) {
                        contactButton.addEventListener('click', function() {
                            window.location.href = 'index.html#kontakt';
                        });
                    }
                }, 100);
            }
            
            // Formulareingaben ausblenden
            form.style.display = 'none';
            
            // Progress-Anzeige ausblenden
            if (progressIndicator) {
                progressIndicator.classList.add('hidden');
            }
            
            // Zeige den Ladebildschirm
            if (loadingScreen) {
                loadingScreen.classList.remove('hidden');
                console.log('Ladebildschirm sollte jetzt sichtbar sein');
            }
            
            // Simuliere eine kurze Ladezeit (2 Sekunden)
            setTimeout(function() {
                // Verstecke den Ladebildschirm
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
                
                // Zeige die Erfolgsmeldung
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                    console.log('Erfolgsmeldung sollte jetzt sichtbar sein');
                }
                
                // Sammle die eingegebenen Daten (hier würde in einer echten Anwendung ein AJAX-Request stehen)
                const formData = new FormData(form);
                const formDataObj = {};
                formData.forEach((value, key) => {
                    formDataObj[key] = value;
                });
                console.log('Formulardaten:', formDataObj);
                
                // Keine Weiterleitung zur Kontaktseite mehr
                
            }, 2000);
            
            // Verhindere die normale Formular-Übermittlung, da wir die Daten per AJAX senden würden
            // In einer realen Umgebung würde hier ein AJAX-Call stehen
            return false;
        } else {
            console.log('Step 5 validation failed - preventing form submission');
            // Form validation failed, so don't submit
            return false;
        }
    });

    // Show progress indicator when the form is started
    if (progressIndicator) {
        progressIndicator.classList.remove('hidden');
    }

    // Next step buttons
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function(event) {
            console.log(`Next button clicked in step ${currentStep}`);
            
            // Explizite Validierung für Schritt 2 und "Andere" Vereinsart
            if (currentStep === 2) {
                console.log('SCHRITT 2: Validierung beginnt');
                
                // Basis-Validierung für Schritt 2
                let schritt2Valid = true;
                
                // Vereinsart prüfen
                const vereinsartRadios = document.querySelectorAll('input[name="vereinsart"]');
                let radioSelected = false;
                vereinsartRadios.forEach(radio => {
                    if (radio.checked) radioSelected = true;
                });
                
                if (!radioSelected) {
                    schritt2Valid = false;
                    showError('vereinsart-container', 'Bitte wählen Sie eine Vereinsart aus.');
                } else {
                    clearError('vereinsart-container');
                    
                    // Spezielle Validierung für "Andere" Option
                    const andereSelected = document.querySelector('input[name="vereinsart"][value="andere"]:checked');
                    if (andereSelected) {
                        const andereVereinsartText = document.getElementById('andere-vereinsart-text');
                        if (andereVereinsartText && !andereVereinsartText.value.trim()) {
                            schritt2Valid = false;
                            showError('andere-vereinsart-text', 'Dieses Feld ist erforderlich.');
                            andereVereinsartText.classList.add('border-red-500', 'border-2', 'bg-red-50');
                            andereVereinsartText.focus();
                        } else {
                            clearError('andere-vereinsart-text');
                        }
                    } else {
                        // Fehler für das Spezifikationsfeld zurücksetzen falls vorhanden
                        clearError('andere-vereinsart-text');
                        const andereVereinsartText = document.getElementById('andere-vereinsart-text');
                        if (andereVereinsartText) {
                            andereVereinsartText.classList.remove('border-red-500', 'border-2', 'bg-red-50');
                        }
                    }
                }
                
                // Mitgliederzahl prüfen
                const mitgliederzahlSelect = document.getElementById('mitgliederzahl');
                if (!mitgliederzahlSelect || !mitgliederzahlSelect.value) {
                    schritt2Valid = false;
                    showError('mitgliederzahl', 'Bitte wählen Sie die Anzahl der Mitglieder aus.');
                } else {
                    clearError('mitgliederzahl');
                }
                
                // Vereinsbeschreibung prüfen
                const vereinsbeschreibungTextarea = document.getElementById('vereinsbeschreibung');
                if (!vereinsbeschreibungTextarea || !vereinsbeschreibungTextarea.value.trim()) {
                    schritt2Valid = false;
                    showError('vereinsbeschreibung', 'Bitte geben Sie eine kurze Beschreibung Ihres Vereins ein.');
                } else {
                    clearError('vereinsbeschreibung');
                }
                
                console.log('Schritt 2 Validierung ergebnis:', schritt2Valid ? 'BESTANDEN' : 'FEHLGESCHLAGEN');
                
                if (schritt2Valid) {
                    console.log('Schritt 2 Validierung bestanden - gehe zu Schritt 3');
                    // Hide current step
                    formSteps[currentStep - 1].classList.add('hidden');
                    
                    // Show next step
                    currentStep++;
                    formSteps[currentStep - 1].classList.remove('hidden');
                    
                    // Update progress
                    updateProgress();
                } else {
                    console.log('Schritt 2 Validierung fehlgeschlagen - bleibe auf Schritt 2');
                    event.preventDefault();
                }
                
                return; // Wir kehren hier zurück, um die normale Validierung zu überspringen
            }
            
            // Explizite Validierung für Schritt 3
            if (currentStep === 3) {
                console.log('SCHRITT 3: Validierung beginnt');
                
                // Basis-Validierung für Schritt 3
                let schritt3Valid = true;
                
                // Website Ziele prüfen
                const websiteZieleCheckboxes = document.querySelectorAll('.website-ziel-checkbox');
                let websiteZielSelected = false;
                websiteZieleCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) websiteZielSelected = true;
                });

                if (!websiteZielSelected) {
                    schritt3Valid = false;
                    showError('website-ziele-container', 'Bitte wählen Sie mindestens ein Ziel aus.');
                } else {
                    clearError('website-ziele-container');
                    
                    // Wenn "Andere Anforderungen" ausgewählt ist, prüfen ob das Textfeld ausgefüllt ist
                    const andereAnforderungenCheckbox = document.getElementById('andere-anforderungen-checkbox');
                    if (andereAnforderungenCheckbox && andereAnforderungenCheckbox.checked) {
                        const andereAnforderungenText = document.getElementById('andere-anforderungen-text');
                        if (andereAnforderungenText && !andereAnforderungenText.value.trim()) {
                            schritt3Valid = false;
                            showError('andere-anforderungen-text', 'Bitte beschreiben Sie Ihre Anforderungen.');
                        } else if (andereAnforderungenText) {
                            clearError('andere-anforderungen-text');
                        }
                    }
                }
                
                // Vorhandene Website prüfen
                const vorhandeneWebsiteRadios = document.querySelectorAll('input[name="vorhandene_website"]');
                let vorhandeneWebsiteSelected = false;
                vorhandeneWebsiteRadios.forEach(radio => {
                    if (radio.checked) vorhandeneWebsiteSelected = true;
                });
                
                if (!vorhandeneWebsiteSelected) {
                    schritt3Valid = false;
                    showError('vorhandene-website-container', 'Bitte geben Sie an, ob Ihr Verein bereits eine Website hat.');
                } else {
                    clearError('vorhandene-website-container');
                    
                    // Wenn "Ja" ausgewählt ist, URL prüfen
                    const jaSelected = document.querySelector('input[name="vorhandene_website"][value="ja"]:checked');
                    if (jaSelected) {
                        const websiteUrl = document.getElementById('website-url');
                        if (websiteUrl && !websiteUrl.value.trim()) {
                            schritt3Valid = false;
                            showError('website-url', 'Bitte geben Sie die URL Ihrer aktuellen Website ein.');
                        } else {
                            clearError('website-url');
                        }
                    }
                }
                
                console.log('Schritt 3 Validierung ergebnis:', schritt3Valid ? 'BESTANDEN' : 'FEHLGESCHLAGEN');
                
                if (schritt3Valid) {
                    console.log('Schritt 3 Validierung bestanden - gehe zu Schritt 4');
                    // Hide current step
                    formSteps[currentStep - 1].classList.add('hidden');
                    
                    // Show next step
                    currentStep++;
                    formSteps[currentStep - 1].classList.remove('hidden');
                    
                    // Update progress
                    updateProgress();
                } else {
                    console.log('Schritt 3 Validierung fehlgeschlagen - bleibe auf Schritt 3');
                    event.preventDefault();
                }
                
                return; // Wir kehren hier zurück, um die normale Validierung zu überspringen
            }
            
            // Explizite Validierung für Schritt 4
            if (currentStep === 4) {
                console.log('SCHRITT 4: Validierung beginnt');
                
                // Basis-Validierung für Schritt 4
                let schritt4Valid = true;
                
                // Vereinsfarben prüfen
                const vereinsfarbenRadios = document.querySelectorAll('input[name="vereinsfarben"]');
                let vereinsfarbenSelected = false;
                vereinsfarbenRadios.forEach(radio => {
                    if (radio.checked) vereinsfarbenSelected = true;
                });
                
                if (!vereinsfarbenSelected) {
                    schritt4Valid = false;
                    showError('vereinsfarben-container', 'Bitte geben Sie an, ob Sie bestimmte Vereinsfarben haben.');
                } else {
                    clearError('vereinsfarben-container');
                    
                    // Wenn "Ja" ausgewählt ist, Farbenbeschreibung prüfen
                    const jaSelected = document.querySelector('input[name="vereinsfarben"][value="ja"]:checked');
                    if (jaSelected) {
                        const farbenBeschreibung = document.getElementById('farben-beschreibung');
                        if (farbenBeschreibung && !farbenBeschreibung.value.trim()) {
                            schritt4Valid = false;
                            showError('farben-beschreibung', 'Bitte beschreiben Sie Ihre Vereinsfarben.');
                        } else {
                            clearError('farben-beschreibung');
                        }
                    }
                }
                
                // Funktionen prüfen
                const funktionenCheckboxes = document.querySelectorAll('.funktionen-checkbox');
                let funktionSelected = false;
                funktionenCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) funktionSelected = true;
                });
                
                if (!funktionSelected) {
                    schritt4Valid = false;
                    showError('funktionen-container', 'Bitte wählen Sie mindestens eine Funktion aus.');
                } else {
                    clearError('funktionen-container');
                    
                    // Wenn "Andere Funktionen" ausgewählt ist, prüfen ob das Textfeld ausgefüllt ist
                    const andereFunktionenCheckbox = document.getElementById('andere-funktionen-checkbox');
                    if (andereFunktionenCheckbox && andereFunktionenCheckbox.checked) {
                        const andereFunktionenText = document.getElementById('andere-funktionen-text');
                        if (andereFunktionenText && !andereFunktionenText.value.trim()) {
                            schritt4Valid = false;
                            showError('andere-funktionen-text', 'Bitte beschreiben Sie die gewünschten Funktionen.');
                        } else if (andereFunktionenText) {
                            clearError('andere-funktionen-text');
                        }
                    }
                }
                
                console.log('Schritt 4 Validierung ergebnis:', schritt4Valid ? 'BESTANDEN' : 'FEHLGESCHLAGEN');
                
                if (schritt4Valid) {
                    console.log('Schritt 4 Validierung bestanden - gehe zu Schritt 5');
                    // Hide current step
                    formSteps[currentStep - 1].classList.add('hidden');
                    
                    // Show next step
                    currentStep++;
                    formSteps[currentStep - 1].classList.remove('hidden');
                    
                    // Update progress
                    updateProgress();
                } else {
                    console.log('Schritt 4 Validierung fehlgeschlagen - bleibe auf Schritt 4');
                    event.preventDefault();
                }
                
                return; // Wir kehren hier zurück, um die normale Validierung zu überspringen
            }
            
            // Explizite Validierung für Schritt 5 (Abschluss)
            if (currentStep === 5) {
                console.log('SCHRITT 5: Validierung beginnt');
                
                // Basis-Validierung für Schritt 5
                let schritt5Valid = true;
                
                // Budget prüfen
                const budgetSelect = document.getElementById('budget');
                if (!budgetSelect || !budgetSelect.value) {
                    schritt5Valid = false;
                    showError('budget', 'Bitte wählen Sie ein Budget aus.');
                    budgetSelect.classList.add('border-red-500', 'border-2', 'bg-red-50');
                    budgetSelect.focus();
                } else {
                    clearError('budget');
                    budgetSelect.classList.remove('border-red-500', 'border-2', 'bg-red-50');
                }
                
                // Zeitrahmen prüfen
                const zeitrahmenSelect = document.getElementById('zeitrahmen');
                if (!zeitrahmenSelect || !zeitrahmenSelect.value) {
                    schritt5Valid = false;
                    showError('zeitrahmen', 'Bitte wählen Sie einen Zeitrahmen aus.');
                    zeitrahmenSelect.classList.add('border-red-500', 'border-2', 'bg-red-50');
                    if (budgetSelect && budgetSelect.value) {
                        zeitrahmenSelect.focus();
                    }
                } else {
                    clearError('zeitrahmen');
                    zeitrahmenSelect.classList.remove('border-red-500', 'border-2', 'bg-red-50');
                }
                
                // Datenschutz prüfen
                const datenschutzCheckbox = document.getElementById('datenschutz');
                if (!datenschutzCheckbox || !datenschutzCheckbox.checked) {
                    schritt5Valid = false;
                    showError('datenschutz', 'Bitte stimmen Sie den Datenschutzbestimmungen zu.');
                } else {
                    clearError('datenschutz');
                }
                
                console.log('Schritt 5 Validierung ergebnis:', schritt5Valid ? 'BESTANDEN' : 'FEHLGESCHLAGEN');
                
                if (!schritt5Valid) {
                    console.log('Schritt 5 Validierung fehlgeschlagen - Formular wird nicht abgesendet');
                    event.preventDefault();
                    window.scrollTo({
                        top: document.querySelector('.form-step[data-step="5"]').offsetTop - 50,
                        behavior: 'smooth'
                    });
                    return false;
                } else {
                    console.log('Schritt 5 Validierung bestanden - Formular wird abgesendet');
                    return true;
                }
            }
            
            // Explizite Validierung für Schritt 3
            if (currentStep === 3) {
                console.log('SCHRITT 3: Validierung beginnt');
                
                // Basis-Validierung für Schritt 3
                let schritt3Valid = true;
                
                // Website-Ziele prüfen
                const websiteZieleCheckboxes = document.querySelectorAll('.website-ziel-checkbox');
                let websiteZielSelected = false;
                websiteZieleCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        websiteZielSelected = true;
                    }
                });
                
                if (!websiteZielSelected) {
                    schritt3Valid = false;
                    showError('website-ziele-container', 'Bitte wählen Sie mindestens ein Ziel aus.');
                } else {
                    clearError('website-ziele-container');
                    
                    // Prüfen, ob "Andere Anforderungen" ausgewählt ist und ein Text angegeben wurde
                    const andereAnforderungenCheckbox = document.getElementById('andere-anforderungen-checkbox');
                    if (andereAnforderungenCheckbox && andereAnforderungenCheckbox.checked) {
                        const andereAnforderungenText = document.getElementById('andere-anforderungen-text');
                        if (andereAnforderungenText && !andereAnforderungenText.value.trim()) {
                            schritt3Valid = false;
                            showError('andere-anforderungen-text', 'Bitte beschreiben Sie Ihre Anforderungen.');
                        } else {
                            clearError('andere-anforderungen-text');
                        }
                    } else {
                        clearError('andere-anforderungen-text');
                    }
                }
                
                // Vorhandene Website prüfen
                const vorhandeneWebsiteRadios = document.querySelectorAll('input[name="vorhandene_website"]');
                let vorhandeneWebsiteSelected = false;
                vorhandeneWebsiteRadios.forEach(radio => {
                    if (radio.checked) vorhandeneWebsiteSelected = true;
                });
                
                if (!vorhandeneWebsiteSelected) {
                    schritt3Valid = false;
                    showError('vorhandene-website-container', 'Bitte geben Sie an, ob Ihr Verein bereits eine Website hat.');
                } else {
                    clearError('vorhandene-website-container');
                    
                    // Prüfen, ob "Ja" ausgewählt ist und eine URL angegeben wurde
                    const jaSelected = document.querySelector('input[name="vorhandene_website"][value="ja"]:checked');
                    if (jaSelected) {
                        const websiteUrl = document.getElementById('website-url');
                        if (websiteUrl && !websiteUrl.value.trim()) {
                            schritt3Valid = false;
                            showError('website-url', 'Bitte geben Sie die URL Ihrer aktuellen Website ein.');
                        } else {
                            clearError('website-url');
                        }
                    } else {
                        clearError('website-url');
                    }
                }
                
                console.log('Schritt 3 Validierung ergebnis:', schritt3Valid ? 'BESTANDEN' : 'FEHLGESCHLAGEN');
                
                if (schritt3Valid) {
                    console.log('Schritt 3 Validierung bestanden - gehe zu Schritt 4');
                    // Hide current step
                    formSteps[currentStep - 1].classList.add('hidden');
                    
                    // Show next step
                    currentStep++;
                    formSteps[currentStep - 1].classList.remove('hidden');
                    
                    // Update progress
                    updateProgress();
                } else {
                    console.log('Schritt 3 Validierung fehlgeschlagen - bleibe auf Schritt 3');
                    event.preventDefault();
                }
                
                return; // Wir kehren hier zurück, um die normale Validierung zu überspringen
            }
            
            // Validierung für Schritt 4
            if (currentStep === 4) {
                console.log('SCHRITT 4: Validierung beginnt');
                
                // Basis-Validierung für Schritt 4
                let schritt4Valid = true;
                
                // Vereinsfarben prüfen
                const vereinsfarbenRadios = document.querySelectorAll('input[name="vereinsfarben"]');
                let vereinsfarbenSelected = false;
                vereinsfarbenRadios.forEach(radio => {
                    if (radio.checked) vereinsfarbenSelected = true;
                });
                
                if (!vereinsfarbenSelected) {
                    schritt4Valid = false;
                    showError('vereinsfarben-container', 'Bitte geben Sie an, ob Sie bestimmte Vereinsfarben haben.');
                } else {
                    clearError('vereinsfarben-container');
                    
                    // Prüfen, ob "Ja" ausgewählt ist und eine Farbbeschreibung angegeben wurde
                    const jaSelected = document.querySelector('input[name="vereinsfarben"][value="ja"]:checked');
                    if (jaSelected) {
                        const farbenBeschreibung = document.getElementById('farben-beschreibung');
                        if (farbenBeschreibung && !farbenBeschreibung.value.trim()) {
                            schritt4Valid = false;
                            showError('farben-beschreibung', 'Bitte beschreiben Sie Ihre Vereinsfarben.');
                        } else {
                            clearError('farben-beschreibung');
                        }
                    }
                }
                
                // Funktionen prüfen
                const funktionenCheckboxes = document.querySelectorAll('.funktionen-checkbox');
                let funktionSelected = false;
                funktionenCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) funktionSelected = true;
                });
                
                if (!funktionSelected) {
                    schritt4Valid = false;
                    showError('funktionen-container', 'Bitte wählen Sie mindestens eine Funktion aus.');
                } else {
                    clearError('funktionen-container');
                    
                    // Prüfen, ob "Andere Funktionen" ausgewählt ist und ein Text angegeben wurde
                    const andereFunktionenCheckbox = document.getElementById('andere-funktionen-checkbox');
                    if (andereFunktionenCheckbox && andereFunktionenCheckbox.checked) {
                        const andereFunktionenText = document.getElementById('andere-funktionen-text');
                        if (andereFunktionenText && !andereFunktionenText.value.trim()) {
                            schritt4Valid = false;
                            showError('andere-funktionen-text', 'Bitte beschreiben Sie die gewünschten Funktionen.');
                        } else {
                            clearError('andere-funktionen-text');
                        }
                    } else {
                        clearError('andere-funktionen-text');
                    }
                }
                
                console.log('Schritt 4 Validierung ergebnis:', schritt4Valid ? 'BESTANDEN' : 'FEHLGESCHLAGEN');
                
                if (schritt4Valid) {
                    console.log('Schritt 4 Validierung bestanden - gehe zu Schritt 5');
                    // Hide current step
                    formSteps[currentStep - 1].classList.add('hidden');
                    
                    // Show next step
                    currentStep++;
                    formSteps[currentStep - 1].classList.remove('hidden');
                    
                    // Update progress
                    updateProgress();
                } else {
                    console.log('Schritt 4 Validierung fehlgeschlagen - bleibe auf Schritt 4');
                    event.preventDefault();
                }
                
                return; // Wir kehren hier zurück, um die normale Validierung zu überspringen
            }
            
            // Normale Validierung für alle Schritte
            console.log(`Attempting to validate step ${currentStep}`);
            console.log('Form steps array length:', formSteps.length);
            console.log('Current step index:', currentStep - 1);
            
            // Für Schritt 1 haben wir eine vereinfachte Validierung
            if (currentStep === 1) {
                console.log('SCHRITT 1: Einfache Validierung');
                
                // Basis-Validierung für Schritt 1
                let schritt1Valid = true;
                
                // Felder überprüfen
                const name = document.getElementById('name');
                const email = document.getElementById('email');
                const vereinsname = document.getElementById('vereinsname');
                
                if (!name || !name.value.trim()) {
                    schritt1Valid = false;
                    showError('name', 'Bitte geben Sie Ihren Namen ein.');
                    name.classList.add('border-red-500', 'border-2', 'bg-red-50');
                } else {
                    clearError('name');
                    name.classList.remove('border-red-500', 'border-2', 'bg-red-50');
                }
                
                if (!email || !email.value.trim()) {
                    schritt1Valid = false;
                    showError('email', 'Bitte geben Sie Ihre E-Mail-Adresse ein.');
                    email.classList.add('border-red-500', 'border-2', 'bg-red-50');
                } else if (email && !validateEmail(email.value)) {
                    schritt1Valid = false;
                    showError('email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                    email.classList.add('border-red-500', 'border-2', 'bg-red-50');
                } else {
                    clearError('email');
                    email.classList.remove('border-red-500', 'border-2', 'bg-red-50');
                }
                
                if (!vereinsname || !vereinsname.value.trim()) {
                    schritt1Valid = false;
                    showError('vereinsname', 'Bitte geben Sie den Namen Ihres Vereins ein.');
                    vereinsname.classList.add('border-red-500', 'border-2', 'bg-red-50');
                } else {
                    clearError('vereinsname');
                    vereinsname.classList.remove('border-red-500', 'border-2', 'bg-red-50');
                }
                
                if (schritt1Valid) {
                    console.log('Schritt 1 Validierung bestanden');
                    // Hide current step
                    formSteps[currentStep - 1].classList.add('hidden');
                    
                    // Show next step
                    currentStep++;
                    formSteps[currentStep - 1].classList.remove('hidden');
                    
                    // Update progress
                    updateProgress();
                } else {
                    console.log('Schritt 1 Validierung fehlgeschlagen');
                    event.preventDefault();
                }
                
                return; // Wir kehren hier zurück, um die normale Validierung zu überspringen
            }
            
            if (validateStep(currentStep)) {
                console.log(`Validation passed for step ${currentStep}, moving to step ${currentStep + 1}`);
                
                // Hide current step
                formSteps[currentStep - 1].classList.add('hidden');
                
                // Show next step
                currentStep++;
                formSteps[currentStep - 1].classList.remove('hidden');
                
                // Update progress
                updateProgress();
            } else {
                console.log(`Validation failed for step ${currentStep}, staying on this step`);
            }
        });
    });

    // Previous step buttons
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', () => {
            // Hide current step
            formSteps[currentStep - 1].classList.add('hidden');
            
            // Show previous step
            currentStep--;
            formSteps[currentStep - 1].classList.remove('hidden');
            
            // Update progress
            updateProgress();
        });
    });

    // Update progress indicators
    function updateProgress() {
        if (currentStepIndicator) {
            currentStepIndicator.textContent = currentStep;
        }
        
        if (progressBar) {
            const progressPercentage = (currentStep / formSteps.length) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        }
    }

    // Form validation
    function validateStep(stepNumber) {
        console.log(`Validating step ${stepNumber}`);
        const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (!currentStepElement) {
            console.error(`Step element ${stepNumber} not found`);
            return true;
        }
        
        // DEBUGGING: Erkennung des aktuellen Formularzustands
        console.log('DEBUG: Aktueller Formularstatus für Schritt ' + stepNumber);
        console.log('Form Element:', document.getElementById('multi-step-form'));
        console.log('Form Steps vorhanden:', document.querySelectorAll('.form-step').length);
        console.log('Aktueller Step Element:', currentStepElement);

        let isValid = true;

        // Check all fields with asterisk in their labels (required fields)
        const requiredLabels = currentStepElement.querySelectorAll('label:not(.flex)');
        requiredLabels.forEach(label => {
            if (label.textContent.includes('*')) {
                const inputId = label.getAttribute('for');
                if (inputId) {
                    const inputField = document.getElementById(inputId);
                    if (inputField && !inputField.value.trim()) {
                        isValid = false;
                        showError(inputId, 'Dieses Feld ist erforderlich.');
                    } else if (inputField) {
                        clearError(inputId);
                    }
                }
            }
        });

        // Helper function to check if element is visible
        function isFieldVisible(field) {
            // Check if the field or its container is hidden
            if (!field) return false;
            
            // Wenn es das Feld 'andere-vereinsart-text' ist, nur validieren wenn 'andere' ausgewählt ist
            if (field.id === 'andere-vereinsart-text') {
                const andereSelected = document.querySelector('input[name="vereinsart"][value="andere"]:checked');
                return !!andereSelected; // Nur true wenn "andere" ausgewählt ist
            }
            
            // Für alle anderen Felder: Check ob es sichtbar ist
            return !field.closest('.hidden') && window.getComputedStyle(field).display !== 'none';
        }
        
        // Check fields that are marked as required but only if they're visible
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        console.log(`Found ${requiredFields.length} required fields in step ${stepNumber}`);
        
        requiredFields.forEach(field => {
            // Check if the field or its parent container is hidden
            const visible = isFieldVisible(field);
            console.log(`Field ${field.id || field.name}: visible = ${visible}, value = "${field.value}"`);
            
            if (visible && !field.value.trim()) {
                isValid = false;
                showError(field.id, 'Dieses Feld ist erforderlich.');
            } else if (visible) {
                clearError(field.id);
            } else {
                // Not visible, clear any errors
                clearError(field.id);
            }
        });

        // 4. Check "farben-beschreibung" if "vereinsfarben" is "ja"
        const vereinsfarben = currentStepElement.querySelector('input[name="vereinsfarben"][value="ja"]:checked');
        if (vereinsfarben) {
            const farbenBeschreibung = document.getElementById('farben-beschreibung');
            if (farbenBeschreibung && !farbenBeschreibung.value.trim()) {
                isValid = false;
                showError('farben-beschreibung', 'Bitte beschreiben Sie Ihre Vereinsfarben.');
            } else if (farbenBeschreibung) {
                clearError('farben-beschreibung');
            }
        }
        
        // 5. Check "andere-funktionen-text" if "andere-funktionen-checkbox" is checked
        const andereFunktionenCheckbox = document.getElementById('andere-funktionen-checkbox');
        if (andereFunktionenCheckbox && andereFunktionenCheckbox.checked) {
            const andereFunktionenText = document.getElementById('andere-funktionen-text');
            if (andereFunktionenText && !andereFunktionenText.value.trim()) {
                isValid = false;
                showError('andere-funktionen-text', 'Bitte beschreiben Sie die gewünschten Funktionen.');
            } else if (andereFunktionenText) {
                clearError('andere-funktionen-text');
            }
        }

        // 5. Check for required groups like radio buttons and checkboxes
        switch(stepNumber) {
            case 1:
                // Validate email format
                const emailField = document.getElementById('email');
                if (emailField && emailField.value && !validateEmail(emailField.value)) {
                    isValid = false;
                    showError('email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                }
                break;

            case 2:
                // Wir überspringen diese Validierung, da wir bereits eine spezielle Validierung für Schritt 2 haben
                console.log('Schritt 2 Validierung wird übersprungen, da wir eine spezielle Validierung verwenden');
                break;

            case 3:
                // Wir überspringen diese Validierung, da wir bereits eine spezielle Validierung für Schritt 3 haben
                console.log('Schritt 3 Validierung wird übersprungen, da wir eine spezielle Validierung verwenden');
                break;

            case 4:
                // Wir überspringen diese Validierung, da wir bereits eine spezielle Validierung für Schritt 4 haben
                console.log('Schritt 4 Validierung wird übersprungen, da wir eine spezielle Validierung verwenden');
                break;
                
            case 5:
                // Budget prüfen
                const budgetSelect = document.getElementById('budget');
                if (!budgetSelect || !budgetSelect.value) {
                    isValid = false;
                    showError('budget', 'Bitte wählen Sie ein Budget aus.');
                } else {
                    clearError('budget');
                }
                
                // Zeitrahmen prüfen
                const zeitrahmenSelect = document.getElementById('zeitrahmen');
                if (!zeitrahmenSelect || !zeitrahmenSelect.value) {
                    isValid = false;
                    showError('zeitrahmen', 'Bitte wählen Sie einen Zeitrahmen aus.');
                } else {
                    clearError('zeitrahmen');
                }
                
                // Datenschutz prüfen
                const datenschutzCheckbox = document.getElementById('datenschutz');
                if (!datenschutzCheckbox || !datenschutzCheckbox.checked) {
                    isValid = false;
                    showError('datenschutz', 'Bitte stimmen Sie den Datenschutzbestimmungen zu.');
                } else {
                    clearError('datenschutz');
                }
                break;
        }

        console.log(`Step ${stepNumber} validation result: ${isValid}`);
        
        // Extra Debug für Schritt 2
        if (stepNumber === 2) {
            console.log('----------- SCHRITT 2 VALIDIERUNG ENDE -----------');
            console.log('VALIDIERUNG ERGEBNIS: ' + (isValid ? 'BESTANDEN' : 'NICHT BESTANDEN'));
            
            // Falls "Andere" ausgewählt ist, prüfen wir nochmal explizit das Feld
            const andereSelected = document.querySelector('input[name="vereinsart"][value="andere"]:checked');
            if (andereSelected) {
                const andereText = document.getElementById('andere-vereinsart-text');
                if (andereText) {
                    console.log('Spezifikationsfeld Inhalt: "' + andereText.value + '"');
                    if (!andereText.value.trim()) {
                        console.log('WARNUNG: Spezifikationsfeld ist leer, sollte aber nicht weitergehen!');
                        isValid = false;
                    }
                }
            }
        }
        
        return isValid;
    }

    function showError(fieldId, message) {
        console.log(`Showing error for ${fieldId}: ${message}`);
        let errorContainer = document.getElementById(`${fieldId}-error-container`) || 
                            document.getElementById(`${fieldId.replace('container', 'error-container')}`);
        
        // Wenn kein Container gefunden wurde, erstellen wir einen neben dem Feld
        if (!errorContainer) {
            console.log(`Kein Error-Container für ${fieldId} gefunden. Erstelle neuen Container.`);
            const field = document.getElementById(fieldId);
            if (field && field.parentNode) {
                errorContainer = document.createElement('div');
                errorContainer.id = `${fieldId}-error-container`;
                errorContainer.className = 'mt-1';
                field.parentNode.insertBefore(errorContainer, field.nextSibling);
            }
        }
        
        if (errorContainer) {
            // Verbesserte Darstellung der Fehlermeldung mit Icon
            const errorIcon = '<svg class="inline-block w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>';
            errorContainer.innerHTML = errorIcon + message;
            errorContainer.classList.add('text-red-500', 'text-sm', 'font-bold', 'flex', 'items-center', 'mt-2');
            // Make sure the error container is not hidden
            errorContainer.style.display = 'flex';
            
            // Also add a red border to the input field for visual feedback
            const inputField = document.getElementById(fieldId);
            if (inputField) {
                inputField.classList.add('border-red-500', 'border-2', 'bg-red-50');
            }
        } else {
            console.warn(`No error container found for ${fieldId}, creating one`);
            // If no error container exists, create one
            const inputField = document.getElementById(fieldId);
            if (inputField && inputField.parentNode) {
                const newErrorContainer = document.createElement('div');
                newErrorContainer.id = `${fieldId}-error-container`;
                newErrorContainer.className = 'mt-2 text-red-500 text-sm font-bold flex items-center';
                
                // Fehlermeldung mit Icon
                const errorIcon = '<svg class="inline-block w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>';
                newErrorContainer.innerHTML = errorIcon + message;
                
                // Insert after the input field
                inputField.parentNode.insertBefore(newErrorContainer, inputField.nextSibling);
                
                // Add red border to the input
                inputField.classList.add('border-red-500');
            } else {
                console.error(`Could not find input field ${fieldId} to attach error message`);
            }
        }
    }

    function clearError(fieldId) {
        const errorContainer = document.getElementById(`${fieldId}-error-container`) || 
                              document.getElementById(`${fieldId.replace('container', 'error-container')}`);
        if (errorContainer) {
            errorContainer.innerHTML = '';
            errorContainer.style.display = 'none';
        }
        
        // Remove error styling from the input field
        const inputField = document.getElementById(fieldId);
        if (inputField) {
            inputField.classList.remove('border-red-500', 'border-2', 'bg-red-50');
        }
    }
    
    // Spezielle Funktion zum Validieren des "andere-vereinsart-text"-Feldes
    function validateAndereVereinsart() {
        const andereSelected = document.querySelector('input[name="vereinsart"][value="andere"]:checked');
        const andereVereinsartText = document.getElementById('andere-vereinsart-text');
        const andereVereinsartContainer = document.getElementById('andere-vereinsart');
        
        console.log(`validateAndereVereinsart wird aufgerufen, andereSelected=${!!andereSelected}`);
        
        // Wichtig: Wenn "Andere" NICHT ausgewählt ist, immer erfolgreich validieren
        if (!andereSelected) {
            console.log('ANDERE NICHT GEWÄHLT - Keine Validierung nötig, immer gültig');
            
            // Sicherstellen, dass das Feld ausgeblendet ist
            if (andereVereinsartContainer) {
                andereVereinsartContainer.classList.add('hidden');
                andereVereinsartContainer.style.display = 'none';
            }
            
            // Validierungsfehler zurücksetzen und Feld als valide markieren
            if (andereVereinsartText) {
                andereVereinsartText.setCustomValidity('');
                andereVereinsartText.classList.remove('border-red-500', 'border-2', 'bg-red-50');
                // Sicherstellen, dass das required-Attribut entfernt wird
                andereVereinsartText.removeAttribute('required');
            }
            
            // Fehlermeldung ausblenden
            const errorContainer = document.getElementById('andere-vereinsart-text-error-container');
            if (errorContainer) {
                errorContainer.textContent = "";
                errorContainer.style.display = 'none';
            }
            
            return true; // IMMER true wenn "Andere" nicht ausgewählt ist
        }
        
        // Ab hier nur wenn "Andere" ausgewählt ist
        
        // Sicherstellen, dass das Feld sichtbar ist
        if (andereVereinsartContainer) {
            andereVereinsartContainer.classList.remove('hidden');
            andereVereinsartContainer.style.display = 'block';
        }
        
        // Sicherstellen, dass das Feld als erforderlich markiert ist
        if (andereVereinsartText) {
            andereVereinsartText.setAttribute('required', 'required');
        }
        
        // Wenn das Textfeld leer ist
        if (andereVereinsartText && !andereVereinsartText.value.trim()) {
            console.log('Validierung für andere-vereinsart-text fehlgeschlagen - LEERES FELD');
            
            // Direktes Styling des Feldes für deutlichere Fehlermeldung
            andereVereinsartText.classList.add('border-red-500', 'border-2', 'bg-red-50');
            
            // Direktes Anzeigen der Fehlermeldung
            const errorContainer = document.getElementById('andere-vereinsart-text-error-container');
            if (errorContainer) {
                errorContainer.textContent = "Dieses Feld ist erforderlich.";
                errorContainer.style.display = 'block';
            }
            
            // Fokus setzen und Feld hervorheben
            andereVereinsartText.focus();
            
            // Native HTML5-Validierung auslösen
            andereVereinsartText.setCustomValidity('Dieses Feld ist erforderlich.');
            
            return false; // Validierung fehlgeschlagen
        } else {
            // Wenn das Feld ausgefüllt ist, Custom Validity zurücksetzen
            if (andereVereinsartText) {
                andereVereinsartText.setCustomValidity('');
            }
        }
        
        return true; // Validierung erfolgreich
    }

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Show conditional fields based on selection
    document.querySelectorAll('input[name="vereinsart"]').forEach(radio => {
        radio.addEventListener('change', function() {
            console.log(`Vereinsart changed to ${this.value}`);
            const andereVereinsart = document.getElementById('andere-vereinsart');
            const andereVereinsartText = document.getElementById('andere-vereinsart-text');
            const errorContainer = document.getElementById('andere-vereinsart-text-error-container');
            
            // WICHTIG: Immer erst mögliche Fehler zurücksetzen
            if (errorContainer) {
                errorContainer.innerHTML = '';
                errorContainer.style.display = 'none';
            }
            
            if (andereVereinsartText) {
                andereVereinsartText.classList.remove('border-red-500', 'border-2', 'bg-red-50');
                andereVereinsartText.setCustomValidity(''); // Wichtig: HTML5 Validation zurücksetzen
            }
            
            if (this.value === 'andere' && andereVereinsart) {
                console.log('Showing andere vereinsart field');
                // Zuerst sichtbar machen
                andereVereinsart.classList.remove('hidden');
                andereVereinsart.style.display = 'block';
                
                // When showing the field, make sure it has focus for better UX
                if (andereVereinsartText) {
                    // When showing, make sure the field has focus and is marked as required
                    andereVereinsartText.setAttribute('required', 'required'); 
                    andereVereinsartText.setAttribute('data-required', 'true');
                    // Clear any previous value and make sure there's no error message left
                    andereVereinsartText.value = andereVereinsartText.value || '';
                    andereVereinsartText.focus();
                }
            } else if (andereVereinsart) {
                console.log('Hiding andere vereinsart field');
                andereVereinsart.classList.add('hidden');
                andereVereinsart.style.display = 'none';
                
                // When hiding, remove the required attribute
                if (andereVereinsartText) {
                    andereVereinsartText.removeAttribute('required');
                    andereVereinsartText.removeAttribute('data-required');
                }
            }
        });
    });

    // Show conditional fields for website URL
    document.querySelectorAll('input[name="vorhandene_website"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const websiteUrlContainer = document.getElementById('bestehende-website-url');
            if (websiteUrlContainer) {
                if (this.value === 'ja') {
                    websiteUrlContainer.classList.remove('hidden');
                    websiteUrlContainer.style.display = 'block';
                    
                    const websiteUrl = document.getElementById('website-url');
                    if (websiteUrl) {
                        websiteUrl.setAttribute('required', 'required');
                        websiteUrl.focus();
                    }
                } else {
                    websiteUrlContainer.classList.add('hidden');
                    websiteUrlContainer.style.display = 'none';
                    
                    const websiteUrl = document.getElementById('website-url');
                    if (websiteUrl) {
                        websiteUrl.removeAttribute('required');
                        // Clear any validation errors
                        websiteUrl.setCustomValidity('');
                        clearError('website-url');
                    }
                }
            }
        });
    });

    // Show conditional fields for vereinsfarben
    document.querySelectorAll('input[name="vereinsfarben"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const vereinsfarbenDetails = document.getElementById('vereinsfarben-details');
            if (vereinsfarbenDetails) {
                if (this.value === 'ja') {
                    vereinsfarbenDetails.classList.remove('hidden');
                    vereinsfarbenDetails.style.display = 'block';
                    
                    const farbenBeschreibung = document.getElementById('farben-beschreibung');
                    if (farbenBeschreibung) {
                        farbenBeschreibung.setAttribute('required', 'required');
                        farbenBeschreibung.focus();
                    }
                } else {
                    vereinsfarbenDetails.classList.add('hidden');
                    vereinsfarbenDetails.style.display = 'none';
                    
                    const farbenBeschreibung = document.getElementById('farben-beschreibung');
                    if (farbenBeschreibung) {
                        farbenBeschreibung.removeAttribute('required');
                        // Clear any validation errors
                        farbenBeschreibung.setCustomValidity('');
                        clearError('farben-beschreibung');
                    }
                }
            }
        });
    });

    // Show conditional field for andere anforderungen
    const andereAnforderungenCheckbox = document.getElementById('andere-anforderungen-checkbox');
    if (andereAnforderungenCheckbox) {
        andereAnforderungenCheckbox.addEventListener('change', function() {
            const andereAnforderungenFeld = document.getElementById('andere-anforderungen-feld');
            if (andereAnforderungenFeld) {
                if (this.checked) {
                    andereAnforderungenFeld.classList.remove('hidden');
                    andereAnforderungenFeld.style.display = 'block';
                    
                    const andereAnforderungenText = document.getElementById('andere-anforderungen-text');
                    if (andereAnforderungenText) {
                        andereAnforderungenText.setAttribute('required', 'required');
                        andereAnforderungenText.focus();
                    }
                } else {
                    andereAnforderungenFeld.classList.add('hidden');
                    andereAnforderungenFeld.style.display = 'none';
                    
                    const andereAnforderungenText = document.getElementById('andere-anforderungen-text');
                    if (andereAnforderungenText) {
                        andereAnforderungenText.removeAttribute('required');
                        // Clear any validation errors
                        andereAnforderungenText.setCustomValidity('');
                        clearError('andere-anforderungen-text');
                    }
                }
            }
        });
    }

    // Show conditional field for andere funktionen
    const andereFunktionenCheckbox = document.getElementById('andere-funktionen-checkbox');
    if (andereFunktionenCheckbox) {
        andereFunktionenCheckbox.addEventListener('change', function() {
            const andereFunktionenFeld = document.getElementById('andere-funktionen-feld');
            if (andereFunktionenFeld) {
                if (this.checked) {
                    andereFunktionenFeld.classList.remove('hidden');
                    andereFunktionenFeld.style.display = 'block';
                    
                    const andereFunktionenText = document.getElementById('andere-funktionen-text');
                    if (andereFunktionenText) {
                        andereFunktionenText.setAttribute('required', 'required');
                        andereFunktionenText.focus();
                    }
                } else {
                    andereFunktionenFeld.classList.add('hidden');
                    andereFunktionenFeld.style.display = 'none';
                    
                    const andereFunktionenText = document.getElementById('andere-funktionen-text');
                    if (andereFunktionenText) {
                        andereFunktionenText.removeAttribute('required');
                        // Clear any validation errors
                        andereFunktionenText.setCustomValidity('');
                        clearError('andere-funktionen-text');
                    }
                }
            }
        });
    }
});
