# Arquitectura del Sitio Web "AventuraCaribe"

Este documento describe la estructura del proyecto, el sistema de componentes dinámicos y cómo añadir nuevas páginas de forma eficiente.

## Estructura de Carpetas

El proyecto está organizado de la siguiente manera para separar las responsabilidades y facilitar la escalabilidad:

```
/
├── assets/               # Archivos estáticos como imágenes, iconos, etc.
│   ├── images/
│   └── icons/
├── components/           # Componentes HTML reutilizables (header, footer).
│   ├── header.html
│   └── footer.html
├── pages/                # Páginas adicionales del sitio (blog, detalles de destino).
│   ├── blog-post.html
│   └── destino-detalle.html
├── js/                   # Scripts de JavaScript.
│   ├── main.js
│   ├── loadComponents-root.js  # Carga componentes para la página principal.
│   └── loadComponents-pages.js # Carga componentes para las páginas anidadas.
├── styles/               # Hojas de estilo CSS.
│   └── main.css
└── index.html            # Página principal del sitio.
```

## Sistema de Componentes Dinámicos

Para evitar la duplicación de código, el encabezado (`header`) y el pie de página (`footer`) se han extraído a archivos independientes en el directorio `components/`. Estos componentes se cargan dinámicamente en cada página mediante JavaScript.

### ¿Cómo funciona?

-   **`js/loadComponents-root.js`**: Este script se utiliza exclusivamente en `index.html`. Carga el `header.html` y el `footer.html` utilizando rutas relativas (`./components/...`) adecuadas para la raíz del proyecto.
-   **`js/loadComponents-pages.js`**: Este script se utiliza en todas las páginas dentro del directorio `pages/`. Utiliza una ruta relativa diferente (`../components/...`) para acceder a los componentes desde una subcarpeta.

Este enfoque asegura que los componentes se carguen correctamente sin importar la profundidad de la página en la estructura de carpetas.

## Cómo Añadir una Nueva Página

Añadir una nueva página es un proceso sencillo:

1.  **Crea un nuevo archivo HTML** en el directorio `pages/`. Por ejemplo, `nueva-pagina.html`.

2.  **Usa la siguiente plantilla básica** para el nuevo archivo. Esta plantilla ya incluye la estructura necesaria para cargar los componentes y estilos:

    ```html
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Título de tu Nueva Página | AventuraCaribe</title>

        <!-- Estilos y fuentes (copiar desde otra página si es necesario) -->
        <link rel="stylesheet" href="../styles/main.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    </head>
    <body>
        <main style="padding-top: 100px;">
            <!--
            Aquí va el contenido principal de tu nueva página.
            Puedes añadir secciones, contenedores y todo lo que necesites.
            -->
            <div class="container section">
                <h1 class="section-title">¡Bienvenido a la Nueva Página!</h1>
                <p>Este es el contenido de tu nueva página.</p>
            </div>
        </main>

        <!-- Script para cargar header y footer en páginas anidadas -->
        <script src="../js/loadComponents-pages.js"></script>
        <!-- Script principal de la aplicación -->
        <script src="../js/main.js" defer></script>
    </body>
    </html>
    ```

3.  **¡Listo!** Al abrir la nueva página en un navegador, el encabezado y el pie de página se cargarán automáticamente. Ya puedes empezar a añadir tu contenido específico dentro de la etiqueta `<main>`.

## Paleta de Colores

El proyecto utiliza una paleta de colores definida para mantener una identidad visual coherente. Los colores están definidos como variables CSS en `styles/main.css` y deben usarse en todo el sitio.

| Color               | HEX        | Variable CSS        | Rol Principal                               |
| ------------------- | ---------- | ------------------- | ------------------------------------------- |
| Hooker's Green      | `#486b65`  | `--hookers-green`   | Fondos oscuros, texto principal.            |
| Keppel              | `#59b4a3`  | `--keppel`          | Color primario para botones, enlaces y acentos. |
| Mint                | `#57aa80`  | `--mint`            | Color secundario para acentos y hover.      |
| Celadon             | `#adedcb`  | `--celadon`         | Fondos claros y secciones destacadas.       |
| Licorice            | `#211916`  | `--licorice`        | Texto oscuro y pies de página.              |