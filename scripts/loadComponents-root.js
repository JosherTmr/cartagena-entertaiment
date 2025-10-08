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
        });

    // Cargar el pie de página
    fetch("./components/footer.html")
        .then(response => response.text())
        .then(data => {
            footerPlaceholder.innerHTML = data;
        });
});