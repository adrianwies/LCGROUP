/* =========================
   HERO SLIDER
========================= */

const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const dotsContainer = document.querySelector(".dots");

let current = 0;
let heroAutoplay = null;
const heroDuration = 5000;

if (slides.length && nextBtn && prevBtn && dotsContainer) {
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");

    if (index === 0) {
      dot.classList.add("active");
    }

    dot.addEventListener("click", () => {
      goToSlide(index);
      restartHeroAutoplay();
    });

    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".dot");

  function showSlide(index) {
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });

    dots.forEach((dot) => {
      dot.classList.remove("active");
    });

    slides[index].classList.add("active");
    dots[index].classList.add("active");
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  }

  function goToSlide(index) {
    current = index;
    showSlide(current);
  }

  function restartHeroAutoplay() {
    window.clearInterval(heroAutoplay);

    heroAutoplay = window.setInterval(() => {
      nextSlide();
    }, heroDuration);
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    restartHeroAutoplay();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    restartHeroAutoplay();
  });

  restartHeroAutoplay();
}

/* ==========================================
   CARRUSEL INFINITO DE PRODUCTOS CON DOTS
========================================== */


const productTrack = document.querySelector(
  ".catalog-product-track"
);


const productWindow = document.querySelector(
  ".catalog-product-window"
);


const productPrev = document.querySelector(
  ".catalog-product-prev"
);


const productNext = document.querySelector(
  ".catalog-product-next"
);


const productDotsContainer = document.querySelector(
  ".catalog-product-dots"
);


if (
  productTrack &&
  productWindow &&
  productPrev &&
  productNext &&
  productDotsContainer
) {
  const animationDuration = 450;


  const originalCards = Array.from(
    productTrack.querySelectorAll(".catalog-product-card")
  );


  const totalProducts = originalCards.length;


  let isAnimating = false;
  const movementQueue = [];


  /*
   * Guarda el índice original de cada producto.
   */
  originalCards.forEach((card, index) => {
    card.dataset.productIndex = String(index);
  });


  /*
   * Limpia el contenedor para evitar dots duplicados
   * si el script se ejecuta más de una vez.
   */
  productDotsContainer.innerHTML = "";


  /*
   * Crea un dot por cada article.
   * Con 6 productos se crearán 6 dots.
   */
  originalCards.forEach((_, index) => {
    const dot = document.createElement("button");


    dot.type = "button";
    dot.classList.add("catalog-product-dot");
    dot.dataset.productIndex = String(index);


    dot.setAttribute(
      "aria-label",
      `Mostrar producto ${index + 1}`
    );


    dot.addEventListener("click", () => {
      moveToProduct(index);
    });


    productDotsContainer.appendChild(dot);
  });


  const productDots = Array.from(
    productDotsContainer.querySelectorAll(
      ".catalog-product-dot"
    )
  );


  /*
   * Obtiene el gap entre productos.
   */
  function getTrackGap() {
    const styles = window.getComputedStyle(productTrack);


    return (
      Number.parseFloat(styles.columnGap) ||
      Number.parseFloat(styles.gap) ||
      0
    );
  }


  /*
   * Calcula cuántos productos están visibles.
   */
  function getVisibleProducts() {
    const firstCard = productTrack.querySelector(
      ".catalog-product-card"
    );


    if (!firstCard) {
      return 1;
    }


    const cardWidth =
      firstCard.getBoundingClientRect().width;


    const windowWidth =
      productWindow.getBoundingClientRect().width;


    const gap = getTrackGap();


    if (cardWidth <= 0) {
      return 1;
    }


    const amount = Math.round(
      (windowWidth + gap) / (cardWidth + gap)
    );


    return Math.max(
      1,
      Math.min(amount, totalProducts)
    );
  }


  /*
   * Obtiene el producto que está visualmente en el medio.
   *
   * Con 3 visibles:
   * izquierda | centro | derecha
   */
  function getMiddleCard() {
    const cards = Array.from(
      productTrack.querySelectorAll(
        ".catalog-product-card"
      )
    );


    if (cards.length === 0) {
      return null;
    }


    const visibleProducts = getVisibleProducts();


    const middlePosition = Math.floor(
      visibleProducts / 2
    );


    return cards[middlePosition] || cards[0];
  }


function getCurrentProductIndex() {
    const firstCard = productTrack.firstElementChild;


    if (!firstCard) {
        return 0;
    }


    return Number.parseInt(
        firstCard.dataset.productIndex,
        10
    );
}


function updateProductDots() {
    const activeIndex = getCurrentProductIndex();


    productDots.forEach((dot, index) => {
        dot.classList.toggle("active", index === activeIndex);
    });
}






  /*
   * Ancho de una tarjeta más el espacio entre tarjetas.
   */
  function getProductStep() {
    const firstCard = productTrack.querySelector(
      ".catalog-product-card"
    );


    if (!firstCard) {
      return 0;
    }


    return (
      firstCard.getBoundingClientRect().width +
      getTrackGap()
    );
  }


  /*
   * Ejecuta los movimientos uno por uno.
   */
  function processMovementQueue() {
    if (
      isAnimating ||
      movementQueue.length === 0
    ) {
      return;
    }


    const direction = movementQueue.shift();


    if (direction === "next") {
      moveProductNext();
    } else {
      moveProductPrevious();
    }
  }


  function finishMovement() {
    updateProductDots();


    isAnimating = false;


    processMovementQueue();
  }


  /*
   * Movimiento infinito hacia adelante.
   */
  function moveProductNext() {
    const step = getProductStep();
    const firstCard = productTrack.firstElementChild;


    if (!step || !firstCard) {
      finishMovement();
      return;
    }


    isAnimating = true;


    productTrack.style.transition =
      `transform ${animationDuration}ms ease`;


    productTrack.style.transform =
      `translateX(-${step}px)`;


    window.setTimeout(() => {
      productTrack.appendChild(firstCard);


      productTrack.style.transition = "none";
      productTrack.style.transform = "translateX(0)";


      void productTrack.offsetWidth;


      finishMovement();
    }, animationDuration);
  }


  /*
   * Movimiento infinito hacia atrás.
   */
  function moveProductPrevious() {
    const step = getProductStep();
    const lastCard = productTrack.lastElementChild;


    if (!step || !lastCard) {
      finishMovement();
      return;
    }


    isAnimating = true;


    productTrack.style.transition = "none";


    productTrack.insertBefore(
      lastCard,
      productTrack.firstElementChild
    );


    productTrack.style.transform =
      `translateX(-${step}px)`;


    void productTrack.offsetWidth;


    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        productTrack.style.transition =
          `transform ${animationDuration}ms ease`;


        productTrack.style.transform =
          "translateX(0)";
      });
    });


    window.setTimeout(() => {
      productTrack.style.transition = "none";
      productTrack.style.transform = "translateX(0)";


      finishMovement();
    }, animationDuration);
  }


  /*
   * Mueve el carrusel hacia el producto seleccionado
   * usando el camino más corto.
   */
  function moveToProduct(targetIndex) {
    movementQueue.length = 0;


    const currentIndex = getCurrentProductIndex();


    if (currentIndex === targetIndex) {
      updateProductDots();
      return;
    }


    const forwardDistance =
      (
        targetIndex -
        currentIndex +
        totalProducts
      ) % totalProducts;


    const backwardDistance =
      (
        currentIndex -
        targetIndex +
        totalProducts
      ) % totalProducts;


    if (forwardDistance <= backwardDistance) {
      for (
        let index = 0;
        index < forwardDistance;
        index += 1
      ) {
        movementQueue.push("next");
      }
    } else {
      for (
        let index = 0;
        index < backwardDistance;
        index += 1
      ) {
        movementQueue.push("prev");
      }
    }


    processMovementQueue();
  }


  /*
   * Flecha siguiente.
   */
  productNext.addEventListener("click", () => {
    movementQueue.push("next");
    processMovementQueue();
  });


  /*
   * Flecha anterior.
   */
  productPrev.addEventListener("click", () => {
    movementQueue.push("prev");
    processMovementQueue();
  });


  /*
   * Recalcula el producto central al cambiar
   * el tamaño de la ventana.
   */
  window.addEventListener("resize", () => {
    productTrack.style.transition = "none";
    productTrack.style.transform = "translateX(0)";


    updateProductDots();
  });


  /*
   * Activa inicialmente el dot del producto central.
   */
  updateProductDots();
}



