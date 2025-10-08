document.addEventListener("DOMContentLoaded", function() {
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

            // --- LÓGICA DEL HEADER INYECTADA ---
            const header = document.querySelector('.main-header');
            const menuToggle = document.querySelector('.menu-toggle');
            const mainNav = document.querySelector('.main-nav');

            // 1. Lógica para el menú móvil
            if (menuToggle && mainNav) {
                menuToggle.addEventListener('click', () => {
                    mainNav.classList.toggle('is-open');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                });
            }

            // 2. Lógica para el scroll del header
            let lastScrollTop = 0;
            window.addEventListener('scroll', () => {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop > lastScrollTop && scrollTop > 150) {
                    // Scroll hacia abajo
                    header.style.top = `-${header.offsetHeight}px`;
                } else {
                    // Scroll hacia arriba
                    header.style.top = '0';
                }
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            });

            // --- LÓGICA PARA EL DROPDOWN DE SERVICIOS ---
            const servicesDropdownMenu = document.getElementById('services-dropdown-menu');
            if (servicesDropdownMenu) {
                fetch('data/servicios.json')
                    .then(res => res.json())
                    .then(serviceData => {
                        const categories = [...new Set(serviceData.services.map(service => service.category))];

                        const allServicesLi = document.createElement('li');
                        allServicesLi.innerHTML = `<a href="/pages/servicios.html">Todos los Servicios</a>`;
                        servicesDropdownMenu.appendChild(allServicesLi);

                        categories.forEach(category => {
                            const li = document.createElement('li');
                            const categoryParam = encodeURIComponent(category);
                            li.innerHTML = `<a href="/pages/servicios.html?category=${categoryParam}">${category}</a>`;
                            servicesDropdownMenu.appendChild(li);
                        });
                    })
                    .catch(error => console.error('Error loading service categories:', error));
            }

            // --- LÓGICA PARA EL DROPDOWN DE DESTINOS Y EL SUMMARY CARD ---
            const destinationsDropdownMenu = document.getElementById('destinations-dropdown-menu');
            const summaryContainer = document.getElementById('dynamic-activity-summary');

            if (destinationsDropdownMenu && summaryContainer) {
                // 1. Poblar el dropdown
                fetch('data/destinos.json')
                    .then(res => res.json())
                    .then(data => {
                        const allActivities = data.destinos.flatMap(destino => destino.actividades);
                        const uniqueActivities = [...new Map(allActivities.map(item => [item['id'], item])).values()];

                        uniqueActivities.forEach(activity => {
                            const li = document.createElement('li');
                            li.innerHTML = `<a href="#" data-activity-id="${activity.id}">${activity.titulo}</a>`;
                            destinationsDropdownMenu.appendChild(li);
                        });

                        // 2. Añadir el event listener después de poblar el dropdown
                        destinationsDropdownMenu.addEventListener('click', (e) => {
                            if (e.target.tagName === 'A' && e.target.dataset.activityId) {
                                e.preventDefault();
                                const activityId = e.target.dataset.activityId;
                                const selectedActivity = allActivities.find(act => act.id === activityId);

                                if (selectedActivity) {
                                    renderActivitySummary(selectedActivity);
                                }
                            }
                        });
                    })
                    .catch(error => console.error('Error loading or processing destinations:', error));
            }

            function renderActivitySummary(activity) {
                const imageUrl = activity.imagen.startsWith('../') ? activity.imagen.substring(2) : activity.imagen;

                summaryContainer.innerHTML = `
                    <div class="summary-card animate-on-scroll is-visible">
                        <img src="${imageUrl}" alt="${activity.titulo}" loading="lazy">
                        <div class="summary-content">
                            <h3>${activity.titulo}</h3>
                            <p>${activity.descripcionCorta}</p>
                            <a href="#" class="btn btn-primary">Ver más</a>
                        </div>
                    </div>
                `;
                summaryContainer.style.display = 'block';
                summaryContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            // --- FIN DE LA LÓGICA INYECTADA ---
        });

    // Cargar el pie de página
    fetch("./components/footer.html")
        .then(response => response.text())
        .then(data => {
            footerPlaceholder.innerHTML = data;
        });
});