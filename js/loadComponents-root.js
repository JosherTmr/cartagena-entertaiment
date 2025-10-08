document.addEventListener("DOMContentLoaded", function() {
    // --- LÓGICA EXISTENTE PARA CARGAR HEADER Y FOOTER ---
    const headerPlaceholder = document.createElement('div');
    headerPlaceholder.setAttribute('id', 'header-placeholder');
    document.body.prepend(headerPlaceholder);

    const footerPlaceholder = document.createElement('div');
    footerPlaceholder.setAttribute('id', 'footer-placeholder');
    document.body.append(footerPlaceholder);

    // Cargar el encabezado
    fetch("./components/header.html")
        .then(response => response.text())
        .then(data => {
            headerPlaceholder.innerHTML = data;
            // ... (toda la lógica existente del header, menú móvil, scroll, etc. va aquí)

            // --- INICIO DE LÓGICA INYECTADA ---
            const header = document.querySelector('.main-header');
            const menuToggle = document.querySelector('.menu-toggle');
            const mainNav = document.querySelector('.main-nav');

            if (menuToggle && mainNav) {
                menuToggle.addEventListener('click', () => {
                    mainNav.classList.toggle('is-open');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                });
            }

            let lastScrollTop = 0;
            window.addEventListener('scroll', () => {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop > lastScrollTop && scrollTop > 150) {
                    header.style.top = `-${header.offsetHeight}px`;
                } else {
                    header.style.top = '0';
                }
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            });
            // ... (resto de la lógica inyectada existente)
            // --- FIN DE LÓGICA INYECTADA ---
        });

    // Cargar el pie de página
    fetch("./components/footer.html")
        .then(response => response.text())
        .then(data => {
            footerPlaceholder.innerHTML = data;
        });

    // --- NUEVA LÓGICA PARA LA BARRA DE BÚSQUEDA DEL HOME ---
    async function initBookingForm() {
        const destinoSelect = document.getElementById('destino-select');
        const servicioSelect = document.getElementById('servicio-select');
        const bookingForm = document.getElementById('booking-form');

        if (!bookingForm) return; // Si no estamos en el index, no hacer nada

        // 1. Cargar datos de los JSON
        const [destinosData, serviciosData] = await Promise.all([
            fetch('data/destinos.json').then(res => res.json()),
            fetch('data/servicios.json').then(res => res.json())
        ]);

        // 2. Poblar dropdown de Destinos
        destinoSelect.innerHTML = '<option value="todos">Todos los Destinos</option>';
        destinosData.destinos.forEach(destino => {
            const option = document.createElement('option');
            option.value = destino.id;
            option.textContent = destino.nombre;
            destinoSelect.appendChild(option);
        });

        // 3. Poblar dropdown de Servicios
        servicioSelect.innerHTML = '<option value="todos">Todos los Servicios</option>';
        const categorias = [...new Set(serviciosData.services.map(s => s.category))];
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            servicioSelect.appendChild(option);
        });

        // 4. Añadir Event Listener al formulario
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evitar que la página se recargue

            const selectedCategory = servicioSelect.value;
            const allServices = serviciosData.services;

            const filteredServices = selectedCategory === 'todos'
                ? allServices.filter(s => s.featured) // Si es "todos", mostrar destacados
                : allServices.filter(s => s.category === selectedCategory);

            // 5. Renderizar los resultados
            const resultsContainer = document.getElementById('featured-services-grid');
            const resultsTitle = document.getElementById('results-title');

            // La función renderServiceCards viene de 'portfolio-loader.js'
            // Asegúrate de que ese script esté cargado en index.html
            if (typeof renderServiceCards === 'function') {
                renderServiceCards(filteredServices, '#featured-services-grid');
            } else {
                console.error('La función renderServiceCards no está definida. Asegúrate de que portfolio-loader.js se cargue antes.');
            }

            // Cambiar el título de la sección
            resultsTitle.textContent = selectedCategory === 'todos'
                ? 'Nuestros Servicios Exclusivos'
                : `Resultados para "${selectedCategory}"`;

            // Scroll suave hacia la sección de resultados
            document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Inicializar la barra de búsqueda
    initBookingForm();
});