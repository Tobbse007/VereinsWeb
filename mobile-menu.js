// Mobile menu functionality - Simplified Version
document.addEventListener('DOMContentLoaded', function() {
    console.log("Mobile menu script loaded");
    setupMobileMenu();
});

function setupMobileMenu() {
    console.log("Setting up mobile menu...");
    
    // Elemente selektieren
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Prüfen, ob die Elemente existieren
    if (!mobileMenuButton) {
        console.error("Mobile menu button not found!");
        return;
    }
    
    if (!mobileMenu) {
        console.error("Mobile menu not found!");
        return;
    }
    
    console.log("Mobile menu elements found:", { 
        button: mobileMenuButton, 
        menu: mobileMenu 
    });
    
    // Funktion zum Aktualisieren des aktiven Menüpunkts im mobilen Menü
    function updateActiveMobileMenuItem() {
        // Aktuelle Section bestimmen
        let currentSection = null;
        const sections = document.querySelectorAll('section[id]');
        let maxVisibleArea = 0;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Wie viel von der Section ist im Viewport sichtbar?
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(viewportHeight, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            // Gewichtung: Sections weiter oben im Viewport bekommen mehr Gewicht
            const positionWeight = 1 - (rect.top > 0 ? rect.top / viewportHeight : 0);
            const visibleArea = visibleHeight * positionWeight;
            
            if (visibleArea > maxVisibleArea) {
                maxVisibleArea = visibleArea;
                currentSection = section.id;
            }
        });
        
        if (currentSection) {
            // Alle mobilen Menüpunkte zurücksetzen
            const mobileMenuItems = document.querySelectorAll('#mobile-menu .nav-item');
            mobileMenuItems.forEach(item => {
                item.classList.remove('text-primary-blue');
                item.classList.remove('border-primary-blue');
                item.classList.remove('bg-primary-blue/5');
                item.removeAttribute('data-active');
            });
            
            // Aktiven Menüpunkt hervorheben
            const activeItem = document.querySelector(`#mobile-menu .nav-item[href="#${currentSection}"]`);
            if (activeItem) {
                activeItem.classList.add('text-primary-blue');
                activeItem.classList.add('border-primary-blue');
                activeItem.classList.add('bg-primary-blue/5');
                activeItem.setAttribute('data-active', 'true');
                console.log(`Aktiver mobiler Menüpunkt: ${activeItem.textContent.trim()}`);
            }
        }
    }
    
    // Anfangszustand sicherstellen - Menü geschlossen
    mobileMenu.classList.add('h-0');
    mobileMenu.classList.remove('h-auto');
    
    // Click-Handler hinzufügen
    mobileMenuButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        console.log("Mobile menu button clicked");
        
        // Toggle zwischen offenen und geschlossenen Zuständen
        if (mobileMenu.classList.contains('h-0')) {
            // Menü öffnen
            console.log("Opening menu");
            mobileMenu.classList.remove('h-0');
            mobileMenu.classList.add('h-auto');
            
            // Hamburger zu X animieren
            const hamburger = mobileMenuButton.querySelector('.hamburger-menu');
            if (hamburger) hamburger.classList.add('menu-open');
            
            // Aktuelle Section bestimmen und aktiven Menüpunkt im mobilen Menü hervorheben
            updateActiveMobileMenuItem();
            
            // Menüpunkte nacheinander einblenden
            const menuItems = document.querySelectorAll('#mobile-menu .menu-item');
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('show');
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50 + (index * 50));
            });
        } else {
            // Menü schließen
            console.log("Closing menu");
            
            // Hamburger zurückverwandeln
            const hamburger = mobileMenuButton.querySelector('.hamburger-menu');
            if (hamburger) hamburger.classList.remove('menu-open');
            
            // Menüpunkte ausblenden
            const menuItems = document.querySelectorAll('#mobile-menu .menu-item');
            menuItems.forEach(item => {
                item.classList.remove('show');
                item.style.opacity = '0';
                item.style.transform = 'translateY(10px)';
            });
            
            // Verzögert das Menü zuklappen
            setTimeout(() => {
                mobileMenu.classList.remove('h-auto');
                mobileMenu.classList.add('h-0');
            }, 300);
        }
    });
    
    // Menü schließen, wenn auf einen Menüpunkt geklickt wird
    const menuLinks = document.querySelectorAll('#mobile-menu .nav-item');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuButton.click();
        });
    });
    
    console.log("Mobile menu setup complete");
}
