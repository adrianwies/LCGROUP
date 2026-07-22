/**
 * ==========================================
 * DETECTAR RUTA BASE AUTOMÁTICAMENTE
 * ==========================================
 */


function getBasePath() {
  const currentPath = window.location.pathname;


  /*
   * Página principal:
   * /LCGROUP/
   * /LCGROUP/index.html
   */
  const isHomePage =
    currentPath.endsWith("/") &&
    !currentPath.match(
      /\/(licores|conservas|cristaleria|limpieza|nosotros|contacto)\/$/,
    );


  const isRootIndex = currentPath.endsWith("/index.html");


  const internalSections = [
    "/licores/",
    "/conservas/",
    "/cristaleria/",
    "/limpieza/",
    "/nosotros/",
    "/contacto/",
  ];


  const isInternalPage = internalSections.some((section) =>
    currentPath.includes(section),
  );


  if (isInternalPage) {
    return "../";
  }


  if (isHomePage || isRootIndex) {
    return "./";
  }


  return "./";
}


/**
 * ==========================================
 * CARGA DE COMPONENTES
 * ==========================================
 */


async function loadComponent(containerSelector, componentPath) {
  const container = document.querySelector(containerSelector);


  if (!container) {
    return;
  }


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
 * ACTUALIZAR ENLACES DEL HEADER
 * ==========================================
 */


function updateNavigationLinks(basePath) {
  const links = document.querySelectorAll(".nav a[data-page]");


  links.forEach((link) => {
    const page = link.dataset.page;


    if (!page) {
      return;
    }


    if (page === "inicio") {
      link.href = basePath;
      return;
    }


    link.href = `${basePath}${page}/`;
  });
}


/**
 * ==========================================
 * ACTUALIZAR IMÁGENES DE LOS COMPONENTES
 * ==========================================
 */


function updateComponentImages(basePath) {
  const images = document.querySelectorAll(
    "#header-container img, #footer-container img",
  );


  images.forEach((image) => {
    const source = image.getAttribute("src");


    if (
      !source ||
      source.startsWith("http://") ||
      source.startsWith("https://") ||
      source.startsWith("data:") ||
      source.startsWith("blob:")
    ) {
      return;
    }


    const cleanSource = source.replace(/^(\.\/|\.\.\/)+/, "");


    image.src = `${basePath}${cleanSource}`;
  });
}


/**
 * ==========================================
 * MARCAR ENLACE ACTIVO
 * ==========================================
 */


function setActiveNavLink() {
  const currentPath = window.location.pathname
    .replace(/index\.html$/, "")
    .replace(/\/+$/, "/");


  const links = document.querySelectorAll(".nav a");


  links.forEach((link) => {
    link.classList.remove("active");


    const href = new URL(link.href).pathname
      .replace(/index\.html$/, "")
      .replace(/\/+$/, "/");


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
  const basePath = getBasePath();


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


  updateNavigationLinks(basePath);
  updateComponentImages(basePath);
  setActiveNavLink();
}


/**
 * ==========================================
 * DOM READY
 * ==========================================
 */


document.addEventListener("DOMContentLoaded", initializeComponents);



