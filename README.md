# Arquitectura del Sitio Web y Guía de Estilo "Liquid Glass"

Este documento describe la estructura del proyecto, el sistema de componentes dinámicos, la guía de estilo visual "Liquid Glass" y cómo añadir nuevas páginas de forma coherente.

## Estructura de Carpetas Simplificada

El proyecto se ha refactorizado para usar una estructura más limpia y un único script principal que centraliza toda la lógica.

```
/
├── assets/               # Archivos estáticos (imágenes, etc.).
├── components/           # Componentes HTML reutilizables (header, footer).
├── data/                 # Datos centralizados de la aplicación.
│   └── database.json     # Fuente única de verdad para contenido dinámico.
├── js/                   # Scripts de JavaScript.
│   └── app.js            # Script ÚNICO y principal de la aplicación.
├── pages/                # Páginas adicionales del sitio.
├── styles/               # Hojas de estilo CSS.
│   └── main.css          # Hoja de estilos principal.
└── index.html            # Página de inicio.
```

## Sistema de Componentes y Datos Dinámicos

El sitio funciona con un modelo de "Aplicación de Página Única" (SPA) simulado, donde los componentes y el contenido se cargan dinámicamente desde un único punto de entrada:

-   **`js/app.js`**: Este script es el corazón de la aplicación. Se encarga de:
    1.  Cargar los datos desde `data/database.json`.
    2.  Insertar componentes reutilizables como el `header` y el `footer`.
    3.  Enrutar la lógica específica de cada página basándose en el `id` del `<body>`.
    4.  Renderizar contenido dinámico (servicios, destinos, etc.) en las páginas correspondientes.

-   **`data/database.json`**: Contiene toda la información necesaria para el sitio (servicios, destinos, información de la empresa, etc.). Esto permite actualizar el contenido del sitio sin tocar el código HTML o JavaScript.

## Guía de Estilo: "Liquid Glass"

El diseño del sitio se basa en el concepto **"Liquid Glass"**, que busca crear una interfaz fluida, translúcida y moderna sobre un fondo dinámico.

### Principios Fundamentales

1.  **Profundidad y Capas**: Los elementos de la interfaz flotan sobre un fondo animado. La translucidez y el desenfoque (`backdrop-filter`) son clave para crear una sensación de profundidad.
2.  **Translucidez Inteligente**: Los paneles no son simplemente transparentes, sino que tienen un efecto de "vidrio esmerilado" que difumina lo que hay detrás.
3.  **Bordes Sutiles**: Cada panel de cristal tiene un borde muy fino y semitransparente que atrapa la luz, definiendo su forma sin ser intrusivo.
4.  **Interacción Orgánica**: Las interacciones (como `:hover`) deben sentirse naturales, con transiciones suaves en el color de fondo, los bordes o las sombras.

### Cómo Aplicar el Estilo

Para mantener la consistencia visual, utiliza las clases CSS predefinidas:

-   **`.glass-panel`**: Es la clase base para cualquier contenedor que deba tener el efecto de cristal. Aplica el `background`, `backdrop-filter`, `border` y `box-shadow` correctos.

    ```html
    <div class="glass-panel">
        <!-- Contenido del panel -->
    </div>
    ```

-   **`.content-panel`**: Es una variación de `.glass-panel` que además incluye un `padding` uniforme. Es ideal para agrupar secciones de texto o contenido mixto.

    ```html
    <div class="glass-panel content-panel">
        <h2 class="section-title">Título de la Sección</h2>
        <p>Este panel ya tiene el espaciado interno correcto.</p>
    </div>
    ```

## Paleta de Colores "Lujo Fluido"

La paleta de colores está diseñada para evocar lujo, naturaleza y tecnología. Está definida como variables CSS en `styles/main.css`.

| Color               | HEX        | Variable CSS                      | Rol Principal                               |
| ------------------- | ---------- | --------------------------------- | ------------------------------------------- |
| **Keppel**          | `#59B4A3`  | `--color-keppel`                  | Color primario para botones, enlaces y acentos. |
| **Mint**            | `#57AA80`  | `--color-mint`                    | Color secundario para acentos y `:hover`.   |
| **Hooker's Green**  | `#486B65`  | `--color-hookers-green`           | Usado en los "blobs" del fondo animado.     |
| **Texto Claro**     | `#E0F2F1`  | `--color-text`                    | Color principal para todo el texto.         |
| **Fondo de Cristal**| `rgba(20, 25, 30, 0.4)` | `--glass-background` | Fondo base para los paneles `.glass-panel`. |
| **Borde de Cristal**| `rgba(255, 255, 255, 0.15)` | `--glass-border` | Borde sutil para los paneles de cristal.    |

## Cómo Añadir una Nueva Página

1.  **Crea un nuevo archivo HTML** en el directorio `pages/` (ej. `mi-nueva-pagina.html`).

2.  **Usa la siguiente plantilla.** Incluye el `id` del `<body>` que `app.js` usará para cualquier lógica específica de la página.

    ```html
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Título | Cartagena Entertainment</title>
        <meta name="description" content="Descripción de la página.">

        <!-- Estilos y Fuentes -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <link rel="stylesheet" href="../styles/main.css">
    </head>
    <body id="page-mi-nueva-pagina">
        <!-- El fondo líquido es global -->
        <div class="liquid-background">
            <div class="blob blob1"></div>
            <div class="blob blob2"></div>
            <div class="blob blob3"></div>
        </div>

        <!-- El header se insertará aquí dinámicamente -->
        <main>
            <section class="page-title-section">
                <div class="container">
                    <h1 class="animate-on-scroll">Título de la Página</h1>
                    <p class="animate-on-scroll">Un subtítulo descriptivo.</p>
                </div>
            </section>

            <section class="container section">
                <!-- Usa paneles de cristal para organizar tu contenido -->
                <div class="glass-panel content-panel animate-on-scroll">
                    <p>Contenido principal aquí...</p>
                </div>
            </section>
        </main>
        <!-- El footer se insertará aquí dinámicamente -->

        <!-- ÚNICO SCRIPT REQUERIDO -->
        <script src="../js/app.js" defer></script>
    </body>
    </html>
    ```

3.  **(Opcional) Añade lógica personalizada en `app.js`**: Si la nueva página necesita cargar contenido dinámico, añade una nueva entrada en la función `routePageLogic` dentro de `js/app.js`.
