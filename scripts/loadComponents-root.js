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
            // --- FIN DE LA LÓGICA INYECTADA ---
        });

    // Cargar el pie de página
    fetch("./components/footer.html")
        .then(response => response.text())
        .then(data => {
            footerPlaceholder.innerHTML = data;
        });
});