// Smooth Scrolling für alle Menü-Links
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing smooth scrolling");
    
    // Alle Nav-Items (Desktop + Mobile) auswählen
    const navLinks = document.querySelectorAll('.nav-item');
    
    // Sicherstellen, dass initial das erste Element aktiv ist
    if (navLinks.length > 0) {
        navLinks.forEach(link => link.setAttribute('data-active', 'false'));
        navLinks[0].setAttribute('data-active', 'true');
        
        // Wenn ein Menu-Indicator existiert, positionieren wir ihn zum ersten Element
        const menuIndicator = document.getElementById('menu-indicator');
        if (menuIndicator) {
            moveIndicatorToItem(menuIndicator, navLinks[0]);
        }
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Verhindere das Standard-Verhalten des Links
            e.preventDefault();
            
            // Hole den Ziel-Anker aus dem href-Attribut
            const targetId = this.getAttribute('href');
            
            // Prüfe, ob es ein interner Link ist (#something)
            if (targetId && targetId.startsWith('#')) {
                // Sonderfall: Skip #home, da wir es entfernt haben
                if (targetId === '#home') {
                    console.log("Home link clicked, but we've removed this section");
                    return;
                }
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    console.log(`Scrolling to section: ${targetId}`);
                    
                    // Bei Mobile-Menü: Menü schließen nach Klick
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && mobileMenu.classList.contains('h-auto')) {
                        const mobileMenuButton = document.getElementById('mobile-menu-button');
                        if (mobileMenuButton) {
                            mobileMenuButton.click(); // Klicke den Button, um das Menü zu schließen
                        }
                    }
                    
                    // Smooth Scroll zur Zielsektion
                    window.scrollTo({
                        top: targetSection.offsetTop - 80, // Offset für die Navbar
                        behavior: 'smooth'
                    });
                    
                    // Aktives Menü-Item aktualisieren
                    navLinks.forEach(navLink => {
                        navLink.setAttribute('data-active', 'false');
                    });
                    this.setAttribute('data-active', 'true');
                    
                    // Wenn es einen Menu-Indicator gibt, bewege ihn zum aktiven Item (nur für Desktop)
                    if (window.innerWidth >= 768) {
                        const menuIndicator = document.getElementById('menu-indicator');
                        if (menuIndicator) {
                            // Verwende die zentrale Funktion für konsistente Positionierung
                            moveIndicatorToItem(menuIndicator, this);
                        }
                    }
                }
            }
        });
    });
    
    console.log("Smooth scrolling initialized");
});

// Hilfsfunktion zur Positionierung des Indikators (falls nicht schon vorhanden)
function moveIndicatorToItem(indicator, item) {
    if (!indicator || !item) return;
    
    // Stelle sicher, dass der Indikator sichtbar ist
    indicator.style.opacity = '1';
    indicator.style.visibility = 'visible';
    indicator.style.width = `${item.offsetWidth}px`;
    indicator.style.transform = `translateX(${item.offsetLeft}px)`;
}
