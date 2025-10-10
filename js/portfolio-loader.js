// 1. Función para renderizar las tarjetas de servicio
function renderServiceCards(services, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = ''; // Limpiar el contenedor

    const isPagesDir = window.location.pathname.includes('/pages/');

    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'card service-card animate-on-scroll';

        const imageUrl = isPagesDir ? service.image : service.image.replace('../', '');
        const detailUrl = isPagesDir ? `servicio-detalle.html?id=${service.id}` : `pages/servicio-detalle.html?id=${service.id}`;

        card.innerHTML = `
            <img src="${imageUrl}" alt="${service.title}">
            <div class="card-content">
                <span class="category-tag" style="background-color: ${service.color};">${service.category}</span>
                <h3>${service.title}</h3>
                <p>${service.shortDescription}</p>
                <a href="${detailUrl}" class="btn-link">Ver más detalles <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        container.appendChild(card);
    });

    // Llama a la función global para que el observador central se encargue de las nuevas tarjetas
    if (typeof observeNewAnimatedElements === 'function') {
        observeNewAnimatedElements(container);
    }
}

// 2. Función para obtener los servicios
async function fetchServices(jsonPath) {
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Could not fetch services:", error);
        return { services: [] };
    }
}

// 3. Lógica de inicialización para cada tipo de página
async function initIndexPage() {
    const data = await fetchServices('data/servicios.json');
    const featuredServices = data.services.filter(service => service.featured);
    renderServiceCards(featuredServices, '#featured-services-grid');
}

async function initServicesPage() {
    const data = await fetchServices('../data/servicios.json');
    const allServices = data.services;
    const containerSelector = '.services-grid';
    const filtersContainerSelector = '.filters-bar';

    const params = new URLSearchParams(window.location.search);
    let currentCategory = params.get('category') || 'Todos';

    const filtersBar = document.querySelector(filtersContainerSelector);

    const filterAndRender = (category) => {
        const servicesToRender = category === 'Todos'
            ? allServices
            : allServices.filter(service => service.category === category);
        renderServiceCards(servicesToRender, containerSelector);

        document.querySelectorAll(`${filtersContainerSelector} .filter-btn`).forEach(btn => {
            btn.classList.toggle('active', btn.textContent === category);
        });
    };

    if (filtersBar) {
        const categories = ['Todos', ...new Set(allServices.map(s => s.category))];
        filtersBar.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = category;
            button.onclick = () => {
                currentCategory = category;
                filterAndRender(currentCategory);
                const url = new URL(window.location);
                url.searchParams.set('category', currentCategory);
                if (currentCategory === 'Todos') url.searchParams.delete('category');
                history.pushState({}, '', url);
            };
            filtersBar.appendChild(button);
        });
    }

    filterAndRender(currentCategory);

    window.onpopstate = () => {
        const popParams = new URLSearchParams(window.location.search);
        currentCategory = popParams.get('category') || 'Todos';
        filterAndRender(currentCategory);
    };
}

async function initServiceDetailPage() {
    const data = await fetchServices('../data/servicios.json');
    const serviceId = new URLSearchParams(window.location.search).get('id');
    const service = data.services.find(s => s.id === serviceId);

    if (!service) return;

    document.title = `${service.title} | AventuraCaribe`;
    const container = document.querySelector('.service-detail-container');
    if (!container) return;

    let pointsHtml = '';
    if (service.details.points && service.details.points.length > 0) {
        pointsHtml = `
            <div class="key-points-section">
                <h2>¿Qué Incluye?</h2>
                <ul>
                    ${service.details.points.map(point => `<li><strong>${point.title}:</strong> ${point.description}</li>`).join('')}
                </ul>
            </div>`;
    }

    container.innerHTML = `
        <div class="service-detail-left">
            <img src="${service.image.replace('../', '')}" alt="${service.title}" class="service-main-image">
        </div>
        <div class="service-detail-right">
            <h1>${service.title}</h1>
            <span class="category-tag" style="background-color: ${service.color};">${service.category}</span>
            <p class="main-description">${service.details.mainDescription}</p>
            ${pointsHtml}
            <a href="contacto.html" class="btn btn-primary">Solicitar más información</a>
        </div>`;
}

