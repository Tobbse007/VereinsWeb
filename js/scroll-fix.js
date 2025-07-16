/**
 * Scroll Fix
 * 
 * Dieses Script verhindert unerwünschtes automatisches Scrollen nach der Formularabsendung.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Den Submit-Button im Formular finden
  const submitButtons = document.querySelectorAll('button[type="submit"]');
  
  // Event-Listener für alle Submit-Buttons
  submitButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      // Aktuelle Scroll-Position speichern
      const currentScrollPosition = window.scrollY;
      
      // Nach einer kurzen Verzögerung zurück zur gespeicherten Position scrollen
      setTimeout(function() {
        window.scrollTo({
          top: currentScrollPosition,
          behavior: 'auto'
        });
      }, 100);
    });
  });
  
  // Wenn wir das Formular haben, überschreiben wir die Scroll-Funktionen
  const multiStepForm = document.getElementById('multi-step-form');
  if (multiStepForm) {
    // Eventlistener für die letzte Seite des Formulars hinzufügen
    const lastFormStep = document.querySelector('.form-step:last-of-type');
    if (lastFormStep) {
      // Submit-Button in diesem Schritt finden
      const submitButton = lastFormStep.querySelector('button[type="submit"]');
      
      if (submitButton) {
        submitButton.addEventListener('click', function(event) {
          // Aktuelle Scroll-Position im Session-Storage speichern
          sessionStorage.setItem('formScrollPosition', window.scrollY);
        });
      }
    }
  }
  
  // Scroll-Position wiederherstellen, wenn im Session-Storage gespeichert
  const savedScrollPosition = sessionStorage.getItem('formScrollPosition');
  if (savedScrollPosition) {
    window.scrollTo(0, parseInt(savedScrollPosition));
    // Nach der Wiederherstellung löschen
    sessionStorage.removeItem('formScrollPosition');
  }
});
