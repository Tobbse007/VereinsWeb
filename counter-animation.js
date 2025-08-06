// Counter Animation Script
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - waiting to start counter animation");
    
    // Start the counter animation after a delay to ensure DOM is fully processed
    setTimeout(function() {
        console.log("Starting counter animation");
        startCounterAnimation();
    }, 1000);
});

function startCounterAnimation() {
    console.log("Running counter animation function");
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
