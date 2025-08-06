document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
    
    // Zähler-Animation starten, wenn die Seite geladen ist
    setTimeout(() => {
        console.log("Attempting to start counter animation");
        startCounterAnimation();
    }, 1000);
    
    // Stelle sicher, dass der Indikator initial gesetzt wird
    setTimeout(() => {
        const menuIndicator = document.getElementById('menu-indicator');
        const activeItem = document.querySelector('.nav-item[data-active="true"]') || document.querySelector('.nav-item');
        
        if (menuIndicator && activeItem) {
            // Verwende die zentrale Funktion für konsistente Positionierung
            moveIndicatorToItem(menuIndicator, activeItem);
        }
    }, 100);

    // Smooth Scrolling für alle Menü-Links aktivieren
    initSmoothScrolling();

    // Scroll Animation für Elemente
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-element');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animation').forEach(element => {
        observer.observe(element);
    });
    
    // Feature Cards Hover-Effekt bei sichtbaren Karten (mobile)
    const featureCardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Nur auf Mobilgeräten aktivieren
            if (window.innerWidth < 768) {
                if (entry.isIntersecting) {
                    // Alle aktiven Cards zurücksetzen
                    document.querySelectorAll('.hover-active').forEach(card => {
                        if (card !== entry.target) {
                            card.classList.remove('hover-active');
                        }
                    });
                    
                    // Hover-Effekt hinzufügen
                    entry.target.classList.add('hover-active');
                    
                    // Nach Timeout wieder entfernen, wenn nicht mehr im Viewport
                    setTimeout(() => {
                        if (!isElementInViewport(entry.target)) {
                            entry.target.classList.remove('hover-active');
                        }
                    }, 3000);
                } else {
                    // Hover-Effekt entfernen, wenn nicht mehr sichtbar
                    entry.target.classList.remove('hover-active');
                }
            }
        });
    }, { 
        threshold: 0.7, // Karte muss zu 70% sichtbar sein
        rootMargin: '0px' 
    });
    
    // Alle Feature-Karten beobachten
    document.querySelectorAll('.group.relative.bg-white.p-6.rounded-2xl').forEach(card => {
        featureCardObserver.observe(card);
    });
    
    // Hilfsfunktion: Prüft, ob Element im Viewport ist
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Mobile Navigation wird jetzt von mobile-menu.js behandelt
    // initMobileMenu wurde entfernt, um Konflikte zu vermeiden
    
    // Funktion, um den Indikator zu bewegen und sichtbar zu machen - disabled for new menu tracking
    function moveIndicatorToItem(indicator, item) {
        // Disabled - using new menu-tracking.js
        return;
    }

    // Navbar Menu Indicator Setup
    function setupMenuIndicator() {
        const menuIndicator = document.getElementById('menu-indicator');
        const navItems = document.querySelectorAll('.nav-item');
        
        if (menuIndicator && navItems.length > 0) {
            // Setze den Indicator auf den aktiven Menu-Punkt
            function setIndicatorPosition(item) {
                // Verwende die allgemeine Funktion
                moveIndicatorToItem(menuIndicator, item);
                
                // Setze den aktiven Menüpunkt Text auf blau
                navItems.forEach(navItem => {
                    if (navItem === item) {
                        navItem.classList.add('text-primary-blue');
                        navItem.classList.add('font-semibold');
                    } else {
                        // Nur entfernen, wenn nicht der aktuelle aktive Punkt
                        if(!navItem.hasAttribute('data-active')) {
                            navItem.classList.remove('text-primary-blue');
                            navItem.classList.remove('font-semibold');
                        }
                    }
                });
            }
            
            // Setze initial den Indicator auf den aktiven Punkt
            const activeItem = document.querySelector('.nav-item[data-active="true"]');
            if (activeItem) {
                setIndicatorPosition(activeItem);
            }
            
            // Aktualisiere den Indicator beim Hover
            navItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    // Markiere den Indikator als im Hover-Zustand
                    menuIndicator.setAttribute('data-hover', 'true');
                    // Speichere den Menüpunkt für den Hover
                    menuIndicator.setAttribute('data-hover-item', item.getAttribute('href'));
                    
                    // Bewege den Indikator und mache ihn etwas breiter für bessere Sichtbarkeit
                    const width = item.offsetWidth + 5; // Etwas breiter für bessere Sichtbarkeit
                    const left = item.offsetLeft - 2.5; // Zentriert
                    
                    menuIndicator.style.width = `${width}px`;
                    menuIndicator.style.transform = `translateX(${left}px)`;
                    menuIndicator.style.opacity = '1';
                    menuIndicator.style.visibility = 'visible';
                    
                    // Hervorheben des Textes
                    item.classList.add('text-primary-blue');
                    item.classList.add('font-semibold');
                });
                
                item.addEventListener('mouseleave', () => {
                    // Wenn Maus das Element verlässt, entferne das Hover-Attribut
                    menuIndicator.removeAttribute('data-hover');
                    menuIndicator.removeAttribute('data-hover-item');
                    
                    // Setze Textfarbe zurück, wenn nicht aktiv
                    if (!item.hasAttribute('data-active')) {
                        item.classList.remove('text-primary-blue');
                        item.classList.remove('font-semibold');
                    }
                });
            });
            
            // Container für alle Nav-Items
            const navContainer = navItems[0].parentElement;
            
            // Setze den Indicator zurück zum aktiven Item, wenn die Maus den Bereich verlässt
            navContainer.addEventListener('mouseleave', () => {
                // Entferne Hover-Attribut
                menuIndicator.removeAttribute('data-hover');
                menuIndicator.removeAttribute('data-hover-item');
                
                const activeItem = document.querySelector('.nav-item[data-active="true"]');
                if (activeItem) {
                    setIndicatorPosition(activeItem);
                }
            });
        }
    }
    
    // Initialisiere den Menu-Indicator - disabled for new menu tracking
    // setupMenuIndicator();
    
    // Aktive Menüpunkte basierend auf Scroll-Position setzen - disabled for new menu tracking
    function setActiveNavItemOnScroll() {
        // Disabled - using new menu-tracking.js
        return;
    }
    
    // Disabled - using new menu-tracking.js
    // setActiveNavItemOnScroll();
    
    // Periodische Überprüfung und Wiederherstellung des Indikators - disabled for new menu tracking
    function ensureMenuIndicatorIsVisible() {
        // Disabled - using new menu-tracking.js
        return;
    }
    
    // Disabled - using new menu-tracking.js
    // setInterval(ensureMenuIndicatorIsVisible, 500);

    // Smooth Scrolling für Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Schließe mobile Navigation beim Klick
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                
                // Scrolle zu dem Element mit Offset für die Navbar
                const navbarHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Funktion zum Ein-/Ausblenden der weiteren Features im Mobile-Modus
    window.toggleMoreFeatures = function() {
        const mobileHiddenFeatures = document.querySelectorAll('.mobile-hidden-feature');
        const showMoreButton = document.getElementById('showMoreButton');
        const showLessButton = document.getElementById('showLessButton');
        
        // Toggle der Feature-Anzeige
        mobileHiddenFeatures.forEach(feature => {
            feature.classList.toggle('md:block');
            feature.classList.toggle('hidden');
        });
        
        // Toggle der Button-Anzeige
        showMoreButton.classList.toggle('hidden');
        showLessButton.classList.toggle('hidden');
        
        // Nach dem Einblenden der Features, beobachte sie für Hover-Effekte
        if (!showMoreButton.classList.contains('hidden')) {
            // "Mehr anzeigen" wurde geklickt, neue Karten werden angezeigt
            document.querySelectorAll('.mobile-hidden-feature:not(.hidden)').forEach(card => {
                // Wenn die Karte jetzt sichtbar ist, beobachte sie
                featureCardObserver.observe(card);
            });
        }
    };
});

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

// Funktion für die Zähler-Animation
function startCounterAnimation() {
    console.log("Starting counter animation");
    const priceCounter = document.getElementById('priceCounter');
    
    if (!priceCounter) {
        console.error("Price counter element not found");
        return;
    }
    
    const counterElement = priceCounter.querySelector('span');
    
    if (!counterElement) {
        console.error("Counter span element not found");
        return;
    }
    
    console.log("Counter element found:", counterElement);
    
    // Counter-Werte
    const startValue = 0;
    const endValue = 99;
    const duration = 2000; // 2 Sekunden
    
    // Startzeit
    const startTime = Date.now();
    
    // Easing-Funktion: Am Anfang schnell, am Ende langsamer (easeOutQuad)
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
            console.log("Counter animation completed");
        }
    }
    
    // Animation starten
    counterElement.textContent = startValue;
    requestAnimationFrame(updateCounter);
}

// Smooth Scrolling Funktion für alle Menü-Links
function initSmoothScrolling() {
    console.log("Initializing smooth scrolling");
    
    // Alle Nav-Items (Desktop + Mobile) und Footer-Links auswählen
    const navLinks = document.querySelectorAll('.nav-item');
    const footerServiceLinks = document.querySelectorAll('.footer-services-links a');
    
    // Map der IDs zu Modal-IDs
    const idToModalMap = {
        "#webdesign": "modal-feature-1",
        "#content-management": "modal-feature-3",
        "#hosting": "modal-feature-5",
        "#seo": "modal-feature-2",
        "#support": "modal-feature-4",
        "#individual-solutions": "modal-feature-6"
    };
    
    // Funktion für das Smooth Scrolling
    function handleSmoothScroll(e, link) {
        // Verhindere das Standard-Verhalten des Links
        e.preventDefault();
        
        // Hole den Ziel-Anker aus dem href-Attribut
        const targetId = link.getAttribute('href');
        
        // Prüfe, ob es ein interner Link ist (#something)
        if (targetId && targetId.startsWith('#')) {
            // Für Footer-Service-Links immer zur Leistungen-Sektion scrollen
            const isFooterServiceLink = link.closest('.footer-services-links') !== null;
            const scrollTarget = isFooterServiceLink ? document.querySelector('#leistungen') : document.querySelector(targetId);
            
            if (scrollTarget) {
                console.log(`Scrolling to section: ${isFooterServiceLink ? '#leistungen' : targetId}`);
                
                // Bei Mobile-Menü: Das Menü wird jetzt von mobile-menu.js verwaltet
                // Mobile-Menü Schließen wurde hier entfernt, um Konflikte zu vermeiden
                
                // Smooth Scroll zur Zielsektion
                window.scrollTo({
                    top: scrollTarget.offsetTop - 80, // Offset für die Navbar
                    behavior: 'smooth'
                });
                
                // Aktives Menü-Item aktualisieren (nur für Hauptnavigation)
                if (link.classList.contains('nav-item')) {
                    navLinks.forEach(navLink => {
                        navLink.setAttribute('data-active', 'false');
                    });
                    link.setAttribute('data-active', 'true');
                }
                
                // Öffne das entsprechende Modal für Service-Links im Footer
                if (isFooterServiceLink && idToModalMap[targetId]) {
                    setTimeout(() => {
                        if (typeof openModal === 'function') {
                            openModal(idToModalMap[targetId]);
                        }
                    }, 800); // Kurze Verzögerung nach dem Scrollen
                }
            }
        }
    }
    
    // Event-Listener für Nav-Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            handleSmoothScroll(e, this);
        });
    });
    
    // Event-Listener für Footer-Service-Links
    footerServiceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            handleSmoothScroll(e, this);
        });
    });
    
    console.log("Smooth scrolling initialized");
}
