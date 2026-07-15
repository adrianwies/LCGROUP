

const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const dotsContainer = document.querySelector(".dots");

let current = 0;

/* CREATE DOTS */

slides.forEach((_, index) => {

  const dot = document.createElement("div");
  dot.classList.add("dot");

  if(index === 0){
    dot.classList.add("active");
  }

  dot.addEventListener("click", () => {
    goToSlide(index);
  });

  dotsContainer.appendChild(dot);

});

const dots = document.querySelectorAll(".dot");

/* SHOW SLIDE */

function showSlide(index){

  slides.forEach(slide => {
    slide.classList.remove("active");
  });

  dots.forEach(dot => {
    dot.classList.remove("active");
  });

  slides[index].classList.add("active");
  dots[index].classList.add("active");

}

/* NEXT */

function nextSlide(){

  current++;

  if(current >= slides.length){
    current = 0;
  }

  showSlide(current);

}

/* PREV */

function prevSlide(){

  current--;

  if(current < 0){
    current = slides.length - 1;
  }

  showSlide(current);

}

/* GO TO */

function goToSlide(index){

  current = index;
  showSlide(current);

}

/* BUTTONS */

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

/* AUTOPLAY */

setInterval(() => {
  nextSlide();
}, 5000);


const typeGrid = document.querySelector(".type-grid");
const typeNext = document.querySelector(".type-next");
const typePrev = document.querySelector(".type-prev");


const speed = 450;
const gap = 15;


function getMove() {
  return typeGrid.children[0].offsetWidth + gap;
}


/* NEXT */


typeNext.addEventListener("click", () => {


  const move = getMove();


  typeGrid.style.transition = `transform ${speed}ms ease`;
  typeGrid.style.transform = `translateX(-${move}px)`;


  setTimeout(() => {


    typeGrid.appendChild(typeGrid.children[0]);


    typeGrid.style.transition = "none";
    typeGrid.style.transform = "translateX(0)";


  }, speed);


});




/* PREV */


typePrev.addEventListener("click", () => {


  const move = getMove();


  typeGrid.style.transition = "none";


  typeGrid.insertBefore(
    typeGrid.children[typeGrid.children.length - 1],
    typeGrid.children[0]
  );


  typeGrid.style.transform = `translateX(-${move}px)`;


  requestAnimationFrame(() => {


    requestAnimationFrame(() => {


      typeGrid.style.transition = `transform ${speed}ms ease`;
      typeGrid.style.transform = "translateX(0)";


    });


  });


});



