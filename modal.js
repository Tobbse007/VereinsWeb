// Modal Functions that work with the index.html implementation

function nextModal(currentModalId, nextModalId) {
    // Make sure the backdrop stays visible
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop.classList.contains('hidden')) {
        backdrop.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
        }, 10);
    }
    
    // Get the current modal
    const currentModal = document.getElementById(currentModalId);
    if (currentModal) {
        const modalContent = currentModal.querySelector('.bg-white');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        
        setTimeout(() => {
            // Just hide the current modal, but DON'T close the backdrop
            currentModal.classList.add('hidden');
            
            // Open the next modal
            const nextModal = document.getElementById(nextModalId);
            if (nextModal) {
                nextModal.classList.remove('hidden');
                const nextModalContent = nextModal.querySelector('.bg-white');
                setTimeout(() => {
                    nextModalContent.classList.remove('scale-95', 'opacity-0');
                    nextModalContent.classList.add('scale-100', 'opacity-100');
                }, 10);
            }
        }, 300);
    }
    
    // Ensure body still has overflow:hidden to prevent background scrolling
    // while allowing modal content to scroll
    document.body.style.overflow = 'hidden';
}

function prevModal(currentModalId, prevModalId) {
    // Make sure the backdrop stays visible
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop.classList.contains('hidden')) {
        backdrop.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
        }, 10);
    }
    
    // Get the current modal
    const currentModal = document.getElementById(currentModalId);
    if (currentModal) {
        const modalContent = currentModal.querySelector('.bg-white');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        
        setTimeout(() => {
            // Just hide the current modal, but DON'T close the backdrop
            currentModal.classList.add('hidden');
            
            // Open the previous modal
            const prevModal = document.getElementById(prevModalId);
            if (prevModal) {
                prevModal.classList.remove('hidden');
                const prevModalContent = prevModal.querySelector('.bg-white');
                setTimeout(() => {
                    prevModalContent.classList.remove('scale-95', 'opacity-0');
                    prevModalContent.classList.add('scale-100', 'opacity-100');
                }, 10);
            }
        }, 300);
    }
    
    // Ensure body still has overflow:hidden to prevent background scrolling
    // while allowing modal content to scroll
    document.body.style.overflow = 'hidden';
}

// Note: Event listeners for closing modals are now in index.html
// The code below is no longer used but kept for reference

/*
// Close modals when clicking outside of modal content
document.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            const modalId = modal.getAttribute('id');
            closeModal(modalId);
        }
    });
});

// Close modals when escape key is pressed
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (!modal.classList.contains('hidden')) {
                const modalId = modal.getAttribute('id');
                closeModal(modalId);
            }
        });
    }
});
*/
