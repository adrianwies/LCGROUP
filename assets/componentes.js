/**
 * ==========================================
 * CARGA DE COMPONENTES
 * ==========================================
 */

async function loadComponent(containerSelector, componentPath) {
  const container = document.querySelector(containerSelector);

  if (!container) return;

  try {
    const response = await fetch(componentPath);

    if (!response.ok) {
      throw new Error(
        `No se pudo cargar ${componentPath}. Estado: ${response.status}`,
      );
    }

    container.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

/**
 * ==========================================
 * MARCAR ENLACE ACTIVO
 * ==========================================
 */

function setActiveNavLink() {
  const currentPath = window.location.pathname;

  const links = document.querySelectorAll(".nav a");

  links.forEach((link) => {
    link.classList.remove("active");

    const href = new URL(link.href).pathname;

    if (
      currentPath === href ||
      (href !== "/" && currentPath.startsWith(href))
    ) {
      link.classList.add("active");
    }
  });
}

/**
 * ==========================================
 * INICIALIZAR COMPONENTES
 * ==========================================
 */

async function initializeComponents() {
  const basePath = "../";

  await Promise.all([
    loadComponent(
      "#header-container",
      `${basePath}componentes/header.html`,
    ),
    loadComponent(
      "#footer-container",
      `${basePath}componentes/footer.html`,
    ),
  ]);

  setActiveNavLink();
}

/**
 * ==========================================
 * DOM READY
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", initializeComponents);
