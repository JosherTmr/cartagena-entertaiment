from playwright.sync_api import sync_playwright, Page, expect
import time

def run_verification(page: Page):
    """
    Verifies the implemented changes:
    1. Checks the dynamic "Actividades" dropdown.
    2. Tests the combined search filter with valid data.
    3. Captures the main page and the services page.
    """
    print("Navigating to the main page...")
    page.goto("http://localhost:8000")

    # --- 1. Verificar el menú desplegable "Actividades" ---
    print("Verifying the 'Actividades' dropdown...")

    # Esperar a que el header se cargue dinámicamente
    expect(page.locator(".main-header")).to_be_visible(timeout=10000)

    # Localizar el item del menú "Actividades"
    actividades_link = page.get_by_role("link", name="Actividades")

    # Hacer hover para mostrar el menú
    actividades_link.hover()

    # Esperar a que el menú desplegable aparezca y contenga un item esperado
    dropdown_menu = page.locator("#destinations-dropdown-menu")
    expect(dropdown_menu).to_be_visible()
    # Verificar que un destino conocido (ej. "Cartagena de Indias") se haya cargado
    expect(dropdown_menu.get_by_text("Cartagena de Indias")).to_be_visible()

    print("Dropdown verification successful. Taking screenshot...")
    page.screenshot(path="jules-scratch/verification/01_actividades_dropdown.png")

    # --- 2. Probar el filtro de búsqueda con datos válidos ---
    print("Testing the search filter with valid data...")

    # Esperar a que los selectores se pueblen
    expect(page.locator("#destino-select > option").nth(1)).to_be_enabled(timeout=10000)
    expect(page.locator("#servicio-select > option").nth(1)).to_be_enabled(timeout=10000)

    # Seleccionar "Cartagena de Indias" (ID: "cartagena")
    page.select_option("#destino-select", "cartagena")

    # Seleccionar "Navegación"
    page.select_option("#servicio-select", "Navegación")

    # Hacer clic en buscar
    page.get_by_role("button", name="Buscar").click()

    # Esperar a que el título de resultados cambie y la sección sea visible
    results_section = page.locator("#results-section")
    expect(results_section.locator("#results-title")).to_have_text("Resultados de tu búsqueda")

    # Hacer scroll a la sección de resultados para la captura
    results_section.scroll_into_view_if_needed()

    # Definir el contenedor de resultados para evitar ambigüedad
    results_grid = results_section.locator("#featured-services-grid")

    # Verificar que la tarjeta correcta ("Alquiler de Yates de Lujo") es visible dentro de los resultados
    expect(results_grid.get_by_text("Alquiler de Yates de Lujo")).to_be_visible()
    # Y que otra no relacionada no está
    expect(results_grid.get_by_text("Chef Exclusivo a Bordo")).not_to_be_visible()

    print("Search filter test successful. Taking screenshot of results...")
    results_section.screenshot(path="jules-scratch/verification/02_search_results.png")

    # --- 3. Verificar la página de Servicios ---
    print("Navigating to the services page...")
    page.goto("http://localhost:8000/pages/servicios.html")

    # Esperar a que el hero se cargue
    expect(page.locator(".hero-servicios")).to_be_visible()

    print("Services page loaded. Taking screenshot...")
    page.screenshot(path="jules-scratch/verification/03_servicios_page.png")

    print("Verification complete.")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            run_verification(page)
        finally:
            browser.close()

if __name__ == "__main__":
    main()