document.addEventListener('DOMContentLoaded', function() {

    // Cambiar el fondo de la navegación al hacer scroll
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animación de elementos al aparecer en pantalla (Scroll Reveal)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // El elemento se activa cuando el 10% es visible
    });

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    // Lógica para los filtros de destinos (ejemplo)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const destinoCards = document.querySelectorAll('.destino-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Manejar clase activa en botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Mostrar u ocultar tarjetas
            destinoCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

});