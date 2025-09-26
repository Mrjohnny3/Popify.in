document.addEventListener('DOMContentLoaded', () => {
    // Get the preloader element
    const preloader = document.querySelector('.preloader');

    // Hide preloader after page is fully loaded
    window.addEventListener('load', () => {
        // Add hidden class to fade out the preloader
        preloader.classList.add('hidden');

        // Enable scrolling on the body
        document.body.style.overflow = 'auto';

        // Remove preloader from DOM after animation completes
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Disable scrolling while preloader is active
    document.body.style.overflow = 'hidden';
});