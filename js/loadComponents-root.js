document.addEventListener("DOMContentLoaded", function() {

    // --- PASO 1: INICIALIZAR LOS SISTEMAS GLOBALES ---
    initializeAnimationObserver();
    observeNewAnimatedElements(document.body);

    // --- PASO 2: CARGAR COMPONENTES HTML (HEADER Y FOOTER) ---
    const headerPlaceholder = document.getElementById('header-placeholder') || document.createElement('div');
    if (!document.getElementById('header-placeholder')) {
        headerPlaceholder.setAttribute('id', 'header-placeholder');
        document.body.prepend(headerPlaceholder);
    }

    const footerPlaceholder = document.getElementById('footer-placeholder') || document.createElement('div');
    if (!document.getElementById('footer-placeholder')) {
        footerPlaceholder.setAttribute('id', 'footer-placeholder');
        document.body.append(footerPlaceholder);
    }

    const fetchHeader = fetch("./components/header.html").then(res => res.text());
    const fetchFooter = fetch("./components/footer.html").then(res => res.text());

    Promise.all([fetchHeader, fetchFooter])
        .then(([headerData, footerData]) => {
            headerPlaceholder.innerHTML = headerData;
            footerPlaceholder.innerHTML = footerData;

            // --- PASO 3: EJECUTAR LA LÓGICA DE LA PÁGINA ESPECÍFICA (INDEX) ---

            // Lógica del menú desplegable y otros elementos del header
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

            // Lógica del dropdown de actividades
            const destinationsDropdownMenu = document.getElementById('destinations-dropdown-menu');
            if (destinationsDropdownMenu) {
                fetch('./data/destinos.json')
                    .then(res => res.json())
                    .then(data => {
                        data.destinos.forEach(destino => {
                            const titleLi = document.createElement('li');
                            titleLi.innerHTML = `<a href="/pages/destino-detalle.html?id=${destino.id}" style="font-weight: bold; color: var(--color-primary);">${destino.nombre}</a>`;
                            destinationsDropdownMenu.appendChild(titleLi);
                            destino.actividades.forEach(actividad => {
                                const li = document.createElement('li');
                                li.innerHTML = `<a href="#">${actividad.titulo}</a>`;
                                destinationsDropdownMenu.appendChild(li);
                            });
                        });
                    });
            }

            // Lógica específica del index
            if (document.querySelector('#featured-services-grid')) {
                initIndexPage();
            }
            if (document.querySelector('#booking-form')) {
                initBookingForm();
            }
        })
        .catch(error => console.error("Error al cargar componentes en root:", error));

    // --- LÓGICA PARA LA BARRA DE BÚSQUEDA (se mantiene separada por su complejidad) ---
    async function initBookingForm() {
        const destinoSelect = document.getElementById('destino-select');
        const servicioSelect = document.getElementById('servicio-select');
        const bookingForm = document.getElementById('booking-form');

        if (!bookingForm) return;

        const [destinosData, serviciosData] = await Promise.all([
            fetch('data/destinos.json').then(res => res.json()),
            fetch('data/servicios.json').then(res => res.json())
        ]);

        destinoSelect.innerHTML = '<option value="todos">Todos los Destinos</option>';
        destinosData.destinos.forEach(destino => {
            const option = document.createElement('option');
            option.value = destino.id;
            option.textContent = destino.nombre;
            destinoSelect.appendChild(option);
        });

        servicioSelect.innerHTML = '<option value="todos">Todos los Servicios</option>';
        const categorias = [...new Set(serviciosData.services.map(s => s.category))];
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            servicioSelect.appendChild(option);
        });

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedCategory = servicioSelect.value;
            const selectedDestinoId = destinoSelect.value;
            const allServices = serviciosData.services;

            let filteredServices = selectedCategory === 'todos' ? allServices : allServices.filter(s => s.category === selectedCategory);

            if (selectedDestinoId !== 'todos') {
                const destino = destinosData.destinos.find(d => d.id === selectedDestinoId);
                if (destino) {
                    const actividadIds = destino.actividades.map(a => a.id);
                    filteredServices = filteredServices.filter(service => actividadIds.includes(service.id));
                }
            }

            renderServiceCards(filteredServices, '#featured-services-grid');
            document.getElementById('results-title').textContent = 'Resultados de tu búsqueda';
            document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
});