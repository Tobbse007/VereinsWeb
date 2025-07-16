/**
 * Button Text Updater
 * 
 * Dieses Script ändert den Text und die Verlinkung der "Zurück zur Startseite" Buttons
 * in den Erfolgsmeldungen zu "Noch Fragen?" mit einem Link zur Kontaktseite.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Funktion zur Änderung aller Erfolgsmeldungs-Buttons
  function updateSuccessButtons() {
    // Nach einer kurzen Verzögerung ausführen, um sicherzustellen, dass die Elemente existieren
    setTimeout(function() {
      // Alle Buttons in Erfolgsmeldungen finden
      const successButtons = document.querySelectorAll('.thank-you-message a, .py-8.px-8 a');
      
      // Buttons aktualisieren
      successButtons.forEach(button => {
        // Text ändern
        button.textContent = 'Noch Fragen?';
        
        // Link zur Kontaktseite setzen
        button.href = 'pages/kontakt/index.html';
      });
    }, 100);
  }
  
  // Initial ausführen
  updateSuccessButtons();
  
  // Beobachten, ob Erfolgsmeldungen dynamisch eingefügt werden
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        updateSuccessButtons();
      }
    });
  });
  
  // Den gesamten Body beobachten
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Event-Listener für alle Submit-Buttons im Formular
  const submitButtons = document.querySelectorAll('button[type="submit"]');
  submitButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Nach kurzer Verzögerung die Buttons aktualisieren
      setTimeout(updateSuccessButtons, 300);
    });
  });
});
