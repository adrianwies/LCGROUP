"use strict";

async function loadComponent(selector, filePath) {
    const container = document.querySelector(selector);

    if (!container) {
        return;
    }

    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(
                `No se pudo cargar ${filePath}. Estado: ${response.status}`
            );
        }

        container.innerHTML = await response.text();
    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <p class="component-error">
                No se pudo cargar esta sección.
            </p>
        `;
    }
}

async function initializeComponents() {
    await Promise.all([
        loadComponent(
            "#header-container",
            "../componentes/header.html"
        ),
        loadComponent(
            "#footer-container",
            "../componentes/footer.html"
        )
    ]);
}

document.addEventListener(
    "DOMContentLoaded",
    initializeComponents
);



