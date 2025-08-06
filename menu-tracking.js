// Menü-Indikator und aktiven Menüpunkt beim Scrollen aktualisieren
document.addEventListener('DOMContentLoaded', function() {
    console.log("Menu-tracking.js geladen, aber deaktiviert zugunsten von menu-fix.js");
    // Diese Datei ist deaktiviert, da menu-fix.js eine bessere Implementierung bietet
    // Die Funktionalität wurde in menu-fix.js übernommen
    return;

    // Der folgende Code ist deaktiviert
    /*
    // Selektiere alle benötigten Elemente
    const menuItems = document.querySelectorAll('.nav-item');
    const menuIndicator = document.getElementById('menu-indicator');
    
    // Funktion zum Bewegen des Indikators zu einem bestimmten Menüpunkt
    function moveIndicatorToItem(item) {
        if (!menuIndicator || !item) return;
        
        // Position und Größe des Menüpunkts bestimmen
        const rect = item.getBoundingClientRect();
        const navContainer = document.getElementById('nav-container');
        const containerRect = navContainer.getBoundingClientRect();
        
        // Berechne die Position relativ zum Container
        const width = rect.width;
        const left = item.offsetLeft;
        
        // Indikator positionieren
        menuIndicator.style.width = `${width}px`;
        menuIndicator.style.transform = `translateX(${left}px)`;
        menuIndicator.style.opacity = '1';
        menuIndicator.style.visibility = 'visible';
    }
    */
    
    // Aktiven Menüpunkt basierend auf der Section ID setzen
    function setActiveMenuItem(activeId) {
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            
            if (href && href === `#${activeId}`) {
                // Aktiven Menüpunkt markieren
                item.classList.add('text-primary-blue', 'font-semibold');
                
                // Indikator bewegen
                moveIndicatorToItem(item);
            } else {
                // Deaktiviere andere Menüpunkte
                item.classList.remove('text-primary-blue', 'font-semibold');
            }
        });
    }
    
    // Aktuelle Section ermitteln
    function getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        let currentSection = sections[0]?.getAttribute('id') || 'leistungen';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        return currentSection;
    }
    
    // Initialisierung: setze aktiven Menüpunkt
    function initActiveMenuItem() {
        const currentSection = getCurrentSection();
        setActiveMenuItem(currentSection);
    }
    
    // Hover-Effekte für Menüpunkte
    menuItems.forEach(item => {
        // Mouse Enter: Indikator zum Menüpunkt bewegen
        item.addEventListener('mouseenter', () => {
            moveIndicatorToItem(item);
            
            // Datei-Attribute setzen für Hover-Zustand
            menuIndicator.setAttribute('data-hover', 'true');
            
            // Text hervorheben
            item.classList.add('text-primary-blue');
        });
        
        // Mouse Leave: Indikator zum aktiven Menüpunkt zurücksetzen
        item.addEventListener('mouseleave', () => {
            // Hover-Zustand entfernen
            menuIndicator.removeAttribute('data-hover');
            
            // Text zurücksetzen, wenn nicht aktiver Menüpunkt
            const activeSection = getCurrentSection();
            const href = item.getAttribute('href');
            
            if (href !== `#${activeSection}`) {
                item.classList.remove('text-primary-blue');
            }
            
            // Indikator zum aktiven Menüpunkt zurücksetzen
            const activeItem = document.querySelector(`.nav-item[href="#${activeSection}"]`);
            if (activeItem) {
                moveIndicatorToItem(activeItem);
            }
        });
        
        // Klick auf Menüpunkt
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Aktiven Menüpunkt sofort setzen für bessere UX
            setActiveMenuItem(targetId.substring(1));
            
            // Zu Ziel-Element scrollen
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Scroll-Handling
    let isScrolling = false;
    
    function handleScroll() {
        if (isScrolling) return;
        isScrolling = true;
        
        requestAnimationFrame(() => {
            // Wenn kein Hover aktiv ist, Indikator zum aktiven Menüpunkt bewegen
            if (!menuIndicator.hasAttribute('data-hover')) {
                const currentSection = getCurrentSection();
                setActiveMenuItem(currentSection);
            }
            
            isScrolling = false;
        });
    }
    
    // Initialisierung und Event-Listener
    initActiveMenuItem();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('load', initActiveMenuItem);
    
    // Auch beim Resize aktualisieren (für responsive Layouts)
    window.addEventListener('resize', initActiveMenuItem);
});

// Rest des Scripts bleibt bestehen, z.B. Counter-Animation
function startCounterAnimation() {
    const counterElement = document.querySelector('#priceCounter span');
    if (!counterElement) return;
    
    // Counter-Werte
    const startValue = 0;
    const endValue = 99;
    const duration = 2000; // 2 Sekunden
    
    // Startzeit
    const startTime = Date.now();
    
    // Easing-Funktion: Am Anfang schnell, am Ende langsamer
    function easeOutQuad(t) {
        return t * (2 - t);
    }
    
    // Animation-Loop
    function updateCounter() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime < duration) {
            // Aktuellen Wert mit Easing berechnen
            const linearProgress = elapsedTime / duration;
            const easedProgress = easeOutQuad(linearProgress);
            const currentValue = Math.floor(startValue + easedProgress * (endValue - startValue));
            
            // Wert anzeigen
            counterElement.textContent = currentValue;
            
            // Nächsten Frame anfordern
            requestAnimationFrame(updateCounter);
        } else {
            // Animation beenden und Endwert setzen
            counterElement.textContent = endValue;
        }
    }
    
    // Animation starten
    updateCounter();
}

// FAQ Toggle Funktion
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('svg');
    
    // Toggle answer visibility
    answer.classList.toggle('hidden');
    
    // Rotate arrow icon
    if (answer.classList.contains('hidden')) {
        icon.classList.remove('rotate-180');
    } else {
        icon.classList.add('rotate-180');
    }
}
    // Alternativmethode, um die aktuelle Section zu finden
    function findCurrentSection() {
        // Beste Übereinstimmung
        let bestMatch = null;
        let bestVisibility = 0;
        
        // Prüfe jede Section, wie viel davon im Viewport ist
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Wie viel von der Section ist im Viewport sichtbar?
            // Berechne den sichtbaren Anteil in Pixeln
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(viewportHeight, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            // Prozentsatz der Sichtbarkeit relativ zur Viewport-Höhe
            const visibilityPercent = (visibleHeight / viewportHeight) * 100;
            
            console.log(`Section ${section.id}: Sichtbarkeit ${visibilityPercent.toFixed(1)}%`);
            
            // Wenn diese Section mehr sichtbar ist als die bisherige beste
            if (visibilityPercent > bestVisibility) {
                bestVisibility = visibilityPercent;
                bestMatch = section.id;
            }
        });
        
        return bestMatch;
    }
    
    // Verwende die Alternativmethode für die aktuelle Section
    function setActiveNavItemAlt() {
        // Finde die aktuell am meisten sichtbare Section
        const currentSection = findCurrentSection();
        console.log(`Aktuell beste Section: ${currentSection}`);
        
        if (!currentSection) {
            console.log('❌ Keine Section gefunden');
            return;
        }
        
        // Entferne active-Status von allen Menüpunkten
        navItems.forEach(item => {
            item.removeAttribute('data-active');
            item.classList.remove('text-primary-blue');
            item.classList.remove('font-semibold');
        });
        
        // Setze active-Status für den aktuellen Menüpunkt
        const activeItem = document.querySelector(`.nav-item[href="#${currentSection}"]`);
        
        if (activeItem) {
            console.log(`✅ Aktiver Menüpunkt gesetzt: ${activeItem.textContent.trim()}`);
            
            // Menüpunkt markieren
            activeItem.setAttribute('data-active', 'true');
            activeItem.classList.add('text-primary-blue');
            activeItem.classList.add('font-semibold');
            
            // Bewege den Indikator, wenn kein Hover aktiv ist
            if (menuIndicator && !menuIndicator.hasAttribute('data-hover')) {
                const width = activeItem.offsetWidth;
                const left = activeItem.offsetLeft;
                
                menuIndicator.style.width = `${width}px`;
                menuIndicator.style.transform = `translateX(${left}px)`;
                menuIndicator.style.opacity = '1';
                menuIndicator.style.visibility = 'visible';
            }
        } else {
            console.log(`❌ Kein Menüpunkt für Section "${currentSection}" gefunden`);
        }
    }
    
    // Hover-Effekt für Menüpunkte
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (menuIndicator) {
                // Hover-Status setzen
                menuIndicator.setAttribute('data-hover', 'true');
                
                // Indikator positionieren
                const width = item.offsetWidth;
                const left = item.offsetLeft;
                
                menuIndicator.style.width = `${width}px`;
                menuIndicator.style.transform = `translateX(${left}px)`;
                menuIndicator.style.opacity = '1';
                menuIndicator.style.visibility = 'visible';
                
                // Text-Farbe setzen
                item.classList.add('text-primary-blue');
                item.classList.add('font-semibold');
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (menuIndicator) {
                // Hover-Status entfernen
                menuIndicator.removeAttribute('data-hover');
                
                // Text-Farbe zurücksetzen, wenn nicht aktiv
                if (!item.hasAttribute('data-active')) {
                    item.classList.remove('text-primary-blue');
                    item.classList.remove('font-semibold');
                }
                
                // Indikator zum aktiven Menüpunkt zurücksetzen
                setActiveNavItemAlt();
            }
        });
    });
    
    // Aktualisiere beim Scrollen
    window.addEventListener('scroll', setActiveNavItemAlt);
    
    // Initial ausführen
    setActiveNavItemAlt();
    
    // Nochmal ausführen, wenn alle Bilder geladen sind
    window.addEventListener('load', setActiveNavItemAlt);
    
    // Nach kurzem Delay nochmal ausführen
    setTimeout(setActiveNavItemAlt, 500);
    
    // Regelmäßig aktualisieren
    setInterval(setActiveNavItemAlt, 1000);
});

