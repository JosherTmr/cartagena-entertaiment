document.addEventListener("DOMContentLoaded", function() {

    // --- PASO 1: INICIALIZAR LOS SISTEMAS GLOBALES ---
    // Llamamos a la función de main.js para crear nuestro observador de animación.
    // Ahora está listo para ser usado.
    initializeAnimationObserver();

    // Observamos los elementos estáticos que ya están en el HTML (como los títulos de sección).
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

    const fetchHeader = fetch("../components/header.html").then(res => res.text());
    const fetchFooter = fetch("../components/footer.html").then(res => res.text());

    // Esperamos a que AMBOS componentes se hayan descargado.
    Promise.all([fetchHeader, fetchFooter])
        .then(([headerData, footerData]) => {
            headerPlaceholder.innerHTML = headerData;
            footerPlaceholder.innerHTML = footerData;

            // Los componentes se han cargado. La lógica específica de la página
            // se llamará directamente desde el archivo HTML correspondiente.
        })
        .catch(error => console.error("Error al cargar componentes:", error));
});