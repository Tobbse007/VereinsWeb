// Navbar Scroll-Fixing Script
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Navbar-Scroll Script geladen");
    
    // Das Header-Element
    const header = document.querySelector('header');
    
    if (!header) {
        console.error("Header element not found!");
        return;
    }
    
    // Ursprüngliche Position speichern
    const headerOffset = header.offsetTop;
    
    // Funktion, um den Header zu fixieren
    function fixHeader() {
        // Stellen sicher, dass der Header immer an der richtigen Position bleibt
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.left = '0';
        header.style.width = '100%';
        header.style.transform = 'translateZ(0)'; // Hardware-Beschleunigung aktivieren
        header.style.willChange = 'transform'; // Browser-Optimierung für Animationen
        header.style.backfaceVisibility = 'hidden'; // Weitere Performance-Optimierung
    }
    
    // Initial fixieren
    fixHeader();
    
    // Bei Scroll den Header fixiert halten
    window.addEventListener('scroll', function() {
        // requestAnimationFrame für bessere Performance
        window.requestAnimationFrame(fixHeader);
    }, { passive: true });
    
    // Bei Resize den Header anpassen
    window.addEventListener('resize', function() {
        fixHeader();
    }, { passive: true });
});
