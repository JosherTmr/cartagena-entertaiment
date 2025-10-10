// =================================================================================
// CARTAGENA ENTERTAINMENT - SCRIPT PRINCIPAL (APP.JS) V3
// Este script centralizado utiliza un único fuente de datos (database.json)
// para potenciar todo el sitio, incluyendo lógica de fechas estacionales.
// =================================================================================

const App = {
    // Propiedades de la aplicación
    data: null, 
    animationObserver: null,

    // --- 1. INICIALIZACIÓN PRINCIPAL ---
    async init() {
        try {
            await this.fetchData();
            this.initComponents();
            this.initAnimationObserver();
        } catch (error) {
            console.error("Error fatal al inicializar la aplicación:", error);
        }
    },

    // --- 2. GESTIÓN DE DATOS ---
    async fetchData() {
        const isPagesDir = window.location.pathname.includes('/pages/');
        const basePath = isPagesDir ? '../' : './';
        const response = await fetch(`${basePath}data/database.json`);
        if (!response.ok) {
            throw new Error(`No se pudo cargar database.json: ${response.statusText}`);
        }
        this.data = await response.json();
    },

    // --- 3. CARGA DE COMPONENTES Y ENRUTAMIENTO ---
    async initComponents() {
        const headerPlaceholder = document.createElement('div');
        document.body.prepend(headerPlaceholder);
        const footerPlaceholder = document.createElement('div');
        document.body.append(footerPlaceholder);

        const isPagesDir = window.location.pathname.includes('/pages/');
        const basePath = isPagesDir ? '../' : './';

        try {
            const [headerHtml, footerHtml] = await Promise.all([
                fetch(`${basePath}components/header.html`).then(res => res.text()),
                fetch(`${basePath}components/footer.html`).then(res => res.text())
            ]);

            headerPlaceholder.innerHTML = headerHtml;
            footerPlaceholder.innerHTML = footerHtml;
            
            this.initHeaderFeatures();
            this.routePageLogic();
        } catch (error) {
            console.error('Error al cargar componentes base (header/footer):', error);
        }
    },

    routePageLogic() {
        const pageId = document.body.id;
        switch (pageId) {
            case 'page-home':
                this.initHomePage();
                break;
            case 'page-services':
                this.initServicesPage();
                break;
            case 'page-service-detail':
                this.initServiceDetailPage();
                break;
            case 'page-nuestros-servicios':
                this.initNuestrosServiciosPage();
                break;
        }
    },
    
    // --- 4. FUNCIONALIDADES DEL HEADER Y NAVEGACIÓN ---
    initHeaderFeatures() {
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
        this.populateDropdowns();
    },

    populateDropdowns() {
        const servicesMenu = document.getElementById('services-dropdown-menu');

        if (servicesMenu) {
            const categories = [...new Set(this.data.services.map(s => s.category))];
            servicesMenu.innerHTML = `<li><a href="/pages/nuestros-servicios.html">Todos los Servicios</a></li>`;
            categories.forEach(category => {
                const li = document.createElement('li');
                const categoryId = `category-${category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
                li.innerHTML = `<a href="/pages/nuestros-servicios.html#${categoryId}">${category}</a>`;
                servicesMenu.appendChild(li);
            });
        }
    },

    // --- 5. LÓGICA ESPECÍFICA DE CADA PÁGINA ---
    initHomePage() {
        const featuredServices = this.data.services.filter(s => s.featured);
        this.renderServiceCards(featuredServices, '#featured-services-grid');
        this.initBookingForm();
        this.renderDestinationsSection();
        this.renderAboutSection();
        this.renderContactSection();
    },

    initNuestrosServiciosPage() {
        const container = document.getElementById('services-by-category');
        if (!container) return;

        const servicesByCategory = this.data.services.reduce((acc, service) => {
            const category = service.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(service);
            return acc;
        }, {});

        container.innerHTML = '';

        for (const category in servicesByCategory) {
            const categoryId = `category-${category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
            const sectionHtml = `
                <div id="${categoryId}" class="category-section">
                    <h2 class="section-title animate-on-scroll">${category}</h2>
                    <div class="services-grid">
                        <!-- Service cards for ${category} will be rendered here -->
                    </div>
                </div>
            `;
            container.innerHTML += sectionHtml;
        }

        for (const category in servicesByCategory) {
            const categoryId = `category-${category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
            const gridSelector = `#${categoryId} .services-grid`;
            this.renderServiceCards(servicesByCategory[category], gridSelector);
        }
        
        this.observeNewAnimatedElements(container);
    },
    
    initServiceDetailPage() {
        const serviceId = new URLSearchParams(window.location.search).get('id');
        const service = this.data.services.find(s => s.id === serviceId);
        
        if (!service) {
            console.error("Servicio no encontrado");
            return;
        }

        document.title = `${service.title} | Cartagena Entertainment`;
        const container = document.querySelector('.service-detail-container');
        if (!container) return;

        container.innerHTML = `
            <div class="service-detail-left">
                <img src="../${service.image}" alt="${service.title}" class="service-main-image">
            </div>
            <div class="service-detail-right">
                <h1>${service.title}</h1>
                <span class="category-tag">${service.category}</span>
                <p class="main-description">${service.fullDescription}</p>
                 <p class="lifestyle-focus"><em>"${service.lifestyleFocus}"</em></p>
                <a href="/index.html#contacto" class="btn btn-primary">Solicitar Cotización</a>
            </div>`;
    },

    // --- 6. FUNCIONES DE AYUDA (HELPERS) ---
    renderServiceCards(services, containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        container.innerHTML = '';

        if (!services || services.length === 0) {
            container.innerHTML = `<p class="col-span-full text-center">No se encontraron servicios que coincidan con tu búsqueda.</p>`;
            return;
        }

        const isPagesDir = window.location.pathname.includes('/pages/');

        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'card service-card animate-on-scroll';
            const imageUrl = isPagesDir ? `../${service.image}` : service.image;
            const detailUrl = isPagesDir ? `servicio-detalle.html?id=${service.id}` : `pages/servicio-detalle.html?id=${service.id}`;

            card.innerHTML = `
                <img src="${imageUrl}" alt="${service.title}" class="card-img">
                <div class="card-content">
                    <span class="category-tag">${service.category}</span>
                    <h3>${service.title}</h3>
                    <p>${service.shortDescription}</p>
                    <a href="${detailUrl}" class="btn-link">Ver más detalles <i class="fas fa-arrow-right"></i></a>
                </div>`;
            container.appendChild(card);
        });
        
        this.observeNewAnimatedElements(container);
    },

    // --- Lógica de Búsqueda Mejorada con Fechas ---
    initBookingForm() {
        const form = document.getElementById('booking-form');
        if (!form) return;

        const destinoSelect = form.querySelector('#destino-select');
        const servicioSelect = form.querySelector('#servicio-select');
        const fechaInput = form.querySelector('#fecha-input');
        
        // Populate dropdowns
        destinoSelect.innerHTML = '<option value="todos">Todos los Destinos</option>';
        this.data.destinations.forEach(d => {
            destinoSelect.innerHTML += `<option value="${d.id}">${d.name}</option>`;
        });

        const categories = [...new Set(this.data.services.map(s => s.category))];
        servicioSelect.innerHTML = '<option value="todos">Todas las Categorías</option>';
        categories.forEach(c => {
            servicioSelect.innerHTML += `<option value="${c}">${c}</option>`;
        });
        
        // Helper para obtener servicios disponibles en una fecha específica
        const getAvailableServicesForDate = (destinoId, date) => {
            const destino = this.data.destinations.find(d => d.id === destinoId);
            if (!destino) return [];

            const serviceIds = new Set(destino.seasonality.allYear);
            
            if (date && destino.seasonality.specialSeasons) {
                const selectedDate = new Date(date + 'T00:00:00'); // Asegurar que sea local
                
                destino.seasonality.specialSeasons.forEach(season => {
                    let isMatch = false;
                    if (season.type === 'specificDate') {
                        const [month, day] = season.value.split('-').map(Number);
                        if (selectedDate.getMonth() + 1 === month && selectedDate.getDate() === day) {
                            isMatch = true;
                        }
                    } else if (season.type === 'dateRange') {
                        const start = new Date(season.value.start + 'T00:00:00');
                        const end = new Date(season.value.end + 'T00:00:00');
                        if (selectedDate >= start && selectedDate <= end) {
                            isMatch = true;
                        }
                    }
                    if (isMatch) {
                        season.specificServices.forEach(id => serviceIds.add(id));
                    }
                });
            }
            return Array.from(serviceIds);
        };


        // Lógica de envío del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedDestinoId = destinoSelect.value;
            const selectedCategory = servicioSelect.value;
            const selectedDate = fechaInput.value;
            
            let results = this.data.services;

            // 1. Filtrar por Destino y Fecha
            if (selectedDestinoId !== 'todos') {
                const availableIds = getAvailableServicesForDate(selectedDestinoId, selectedDate);
                results = results.filter(service => availableIds.includes(service.id));
            }
            
            // 2. Filtrar por Categoría
            if (selectedCategory !== 'todos') {
                results = results.filter(s => s.category === selectedCategory);
            }
            
            this.renderServiceCards(results, '#featured-services-grid');
            document.getElementById('results-title').textContent = 'Resultados de tu Búsqueda';
            document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' });
        });
    },

    renderDestinationsSection() {
        const container = document.getElementById('destinos');
        if (!container) return;
        const destinationsToShow = this.data.destinations.slice(0, 3);
        let content = '<h2 class="section-title animate-on-scroll">Destinos de Ensueño</h2><div class="destinos-grid">';
        destinationsToShow.forEach(destino => {
            content += `
                <div class="card animate-on-scroll">
                    <img src="${destino.image}" alt="Imagen de ${destino.name}">
                    <div class="card-content">
                        <h3>${destino.name}</h3>
                        <p>${destino.description}</p>
                        <a href="#" class="btn-link">Explorar <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>`;
        });
        content += '</div>';
        container.innerHTML = content;
        this.observeNewAnimatedElements(container);
    },

    renderAboutSection() {
        const container = document.getElementById('nosotros');
        if (!container) return;
        container.innerHTML = `
            <h2 class="section-title animate-on-scroll">Un Estilo de Vida, No Solo un Viaje</h2>
            <div class="about-us-content">
                <div class="about-text animate-on-scroll glass-panel" style="padding: 40px;">
                    <p>En Cartagena Entertainment, curamos experiencias que definen el lujo. No solo alquilamos yates o mansiones; diseñamos momentos memorables que se convierten en el punto culminante de su vida. Nuestro compromiso es con la exclusividad, la privacidad y un servicio que anticipa cada uno de sus deseos.</p>
                    <br>
                    <a href="pages/quienes-somos.html" class="btn btn-primary">Conoce Nuestra Historia</a>
                </div>
                <div class="about-image animate-on-scroll">
                    <img src="assets/images/servicio-venta-yate.png" alt="Estilo de vida de lujo en yate" style="border-radius: 12px;">
                </div>
            </div>`;
        this.observeNewAnimatedElements(container);
    },

    renderContactSection() {
        const container = document.getElementById('contacto');
        if (!container) return;
        const company = this.data.companyInfo;
        container.innerHTML = `
            <div class="container">
                <h2 class="section-title animate-on-scroll">Inicia Tu Experiencia</h2>
                <p class="section-subtitle animate-on-scroll" style="text-align: center; max-width: 600px; margin: 0 auto 50px; opacity: 0.8;">Contáctanos para diseñar tu próxima aventura de lujo en el Caribe.</p>
                <div class="glass-panel" style="padding: 40px;">
                    <div class="contact-content">
                        <form class="contact-form animate-on-scroll">
                            <input type="text" placeholder="Nombre Completo" required>
                            <input type="email" placeholder="Correo Electrónico" required>
                            <textarea placeholder="Cuéntanos sobre la experiencia que buscas..."></textarea>
                            <button type="submit" class="btn btn-primary">Enviar Mensaje</button>
                        </form>
                        <div class="contact-info animate-on-scroll">
                            <p><i class="fas fa-phone"></i> ${company.phone}</p>
                            <p><i class="fas fa-envelope"></i> ${company.email}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${company.address}</p>
                            <div class="social-links" style="margin-top: 20px;">
                                <a href="#"><i class="fab fa-instagram"></i></a>
                                <a href="#"><i class="fab fa-facebook-f"></i></a>
                                <a href="#"><i class="fab fa-tiktok"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        this.observeNewAnimatedElements(container);
    },

    // --- 7. SISTEMA DE ANIMACIÓN ---
    initAnimationObserver() {
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    this.animationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        this.observeNewAnimatedElements(document.body);
    },

    observeNewAnimatedElements(container) {
        if (!this.animationObserver || !container) return;
        const elements = container.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => this.animationObserver.observe(el));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});