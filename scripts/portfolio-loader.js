// 1. Función para cargar los datos del JSON
async function fetchServices() {
    // Ajustar la ruta del JSON según la ubicación del archivo HTML
    const path = window.location.pathname.includes('/pages/')
        ? '../data/servicios.json'
        : 'data/servicios.json';
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.services;
    } catch (error) {
        console.error("Could not fetch services:", error);
        return [];
    }
}

// 2. Función para renderizar las tarjetas de servicio
function renderServiceCards(services, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = ''; // Limpiar el contenedor

    const isPagesDir = window.location.pathname.includes('/pages/');

    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'card service-card animate-on-scroll';

        const imageUrl = isPagesDir ? service.image : service.image.replace('../', '');

        card.innerHTML = `
            <img src="${imageUrl}" alt="${service.title}">
            <div class="card-content">
                <span class="category-tag" style="background-color: ${service.color};">${service.category}</span>
                <h3>${service.title}</h3>
                <p>${service.shortDescription}</p>
                <a href="servicio-detalle.html?id=${service.id}" class="btn-link">Ver más detalles <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        container.appendChild(card);
    });

    // Re-inicializar el observador de animaciones para las nuevas tarjetas
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToAnimate = container.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// 3. Lógica para la página de servicios (servicios.html)
async function initServicesPage() {
    const services = await fetchServices();
    renderServiceCards(services, '.services-grid');

    const filtersBar = document.querySelector('.filters-bar');
    if (!filtersBar) return;

    const categories = ['Todos', ...new Set(services.map(service => service.category))];

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = category;
        if (category === 'Todos') {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            document.querySelectorAll('.filters-bar .filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filteredServices = category === 'Todos'
                ? services
                : services.filter(service => service.category === category);

            renderServiceCards(filteredServices, '.services-grid');
        });
        filtersBar.appendChild(button);
    });
}

// 4. Lógica para la página de detalle (servicio-detalle.html)
async function initServiceDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('id');
    if (!serviceId) return;

    const services = await fetchServices();
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const container = document.querySelector('.service-detail-container');
    if (!container) return;

    document.title = `${service.title} | Cartagena Entertainment`;

    let pointsHtml = '';
    if (service.details.points && service.details.points.length > 0) {
        pointsHtml = `
            <div class="key-points-section">
                <h2>¿Qué Incluye?</h2>
                <ul>
                    ${service.details.points.map(point => `<li><strong>${point.title}:</strong> ${point.description}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="service-detail-left">
            <img src="${service.image}" alt="${service.title}" class="service-main-image">
        </div>
        <div class="service-detail-right">
            <h1>${service.title}</h1>
            <span class="category-tag" style="background-color: ${service.color};">${service.category}</span>
            <p class="main-description">${service.details.mainDescription}</p>
            ${pointsHtml}
            <a href="../index.html#contacto" class="btn btn-primary">Solicitar más información</a>
        </div>
    `;
}

// 5. Lógica para la página de inicio (index.html)
async function initIndexPage() {
    const services = await fetchServices();
    const featuredServices = services.filter(service => service.featured);
    renderServiceCards(featuredServices, '#featured-services-grid');
}

// Lógica de enrutamiento simple
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#featured-services-grid')) {
        initIndexPage();
    }
    if (document.querySelector('.services-grid')) {
        initServicesPage();
    }
    if (document.querySelector('.service-detail-container')) {
        initServiceDetailPage();
    }
});