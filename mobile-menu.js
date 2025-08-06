// Mobile menu functionality - Optimized Version
let menuInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log("Mobile menu script loaded");
    // Vermeiden einer doppelten Initialisierung
    if (!menuInitialized) {
        setupMobileMenu();
        menuInitialized = true;
    }
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
    
    console.log("Mobile menu elements found");
    
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
            }
        }
    }
    
    // Anfangszustand sicherstellen - Menü geschlossen
    mobileMenu.classList.add('h-0');
    mobileMenu.classList.remove('h-auto');
    
    // Menü-Status
    let isMenuOpen = false;
    let isAnimating = false;
    
    // Click-Handler hinzufügen
    mobileMenuButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Vermeiden von mehrfachen Klicks während der Animation
        if (isAnimating) return;
        
        isAnimating = true;
        
        // Toggle zwischen offenen und geschlossenen Zuständen
        if (!isMenuOpen) {
            // Menü öffnen
            mobileMenu.classList.remove('h-0');
            mobileMenu.classList.add('h-auto');
            
            // Hamburger zu X animieren
            const hamburger = mobileMenuButton.querySelector('.hamburger-menu');
            if (hamburger) hamburger.classList.add('menu-open');
            
            // Aktuelle Section bestimmen und aktiven Menüpunkt im mobilen Menü hervorheben
            updateActiveMobileMenuItem();
            
            // Menüpunkte nacheinander einblenden - optimierte Animation
            requestAnimationFrame(() => {
                const menuItems = document.querySelectorAll('#mobile-menu .menu-item');
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('show');
                    }, 30 + (index * 30)); // Verkürzte Verzögerung für schnellere Reaktion
                });
                
                // Animation als beendet markieren
                setTimeout(() => {
                    isMenuOpen = true;
                    isAnimating = false;
                }, menuItems.length * 30 + 50);
            });
        } else {
            // Menü schließen
            
            // Hamburger zurückverwandeln
            const hamburger = mobileMenuButton.querySelector('.hamburger-menu');
            if (hamburger) hamburger.classList.remove('menu-open');
            
            // Menüpunkte ausblenden - vereinfachte Animation
            const menuItems = document.querySelectorAll('#mobile-menu .menu-item');
            menuItems.forEach(item => {
                item.classList.remove('show');
            });
            
            // Verzögert das Menü zuklappen
            setTimeout(() => {
                mobileMenu.classList.remove('h-auto');
                mobileMenu.classList.add('h-0');
                
                // Animation als beendet markieren
                isMenuOpen = false;
                isAnimating = false;
            }, 200); // Verkürzte Verzögerung
        }
    });
    
    // Menü schließen, wenn auf einen Menüpunkt geklickt wird
    const menuLinks = document.querySelectorAll('#mobile-menu .nav-item');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isMenuOpen && !isAnimating) {
                mobileMenuButton.click();
            }
        });
    });
    
    console.log("Mobile menu setup complete");
}
