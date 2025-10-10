// --- LIBRERÍA DE ANIMACIÓN CENTRALIZADA ---

// La variable se declara aquí para que sea accesible globalmente por los scripts.
let animationObserver;

// Esta función INICIA el observador. Solo se debe llamar UNA VEZ.
function initializeAnimationObserver() {
    if (animationObserver) return; // Previene doble inicialización

    animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
}

// Esta función USA el observador para registrar nuevos elementos.
function observeNewAnimatedElements(container) {
    if (!animationObserver || !container) {
        console.error('El observador de animación no está inicializado o el contenedor no existe.');
        return;
    }
    const elements = container.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => animationObserver.observe(el));
}