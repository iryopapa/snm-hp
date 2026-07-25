(function () {
  'use strict';

  $('.modal-button').modaal();

  var learningSlider = new Swiper('.learning-slider', {
    slidesPerView: 1,
    loop: true,
    speed: 3000,
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  var voiceSlider = new Swiper('.voice-slide', {
    slidesPerView: 1.2,
    // loop: true,
    // speed: 2000,
    spaceBetween: 20,
    centeredSlides: true,
    // autoplay: {
    //   delay: 4000,
    //   disableOnInteraction: false,
    // },
    pagination: {
      el: ".voice-slide .swiper-pagination",
      clickable: true,
    },
  });

})();

function scrollAddClass() {
  const scrollEffect = document.querySelectorAll('.anim');
  let windowHeight = Math.floor(window.innerHeight * .75);
  for (let i = 0; i < scrollEffect.length; i++) {
    target = scrollEffect[i].getBoundingClientRect().top;
    if (target < windowHeight) {
      scrollEffect[i].classList.add('in');
    }
  }
}
document.addEventListener('scroll', scrollAddClass);


function blockBg() {
  const scrollEffect = document.querySelectorAll('.feature02 .feature-body');
  let windowHeight = Math.floor(window.innerHeight); 
  for (let i = 0; i < scrollEffect.length; i++) {
    target = scrollEffect[i].getBoundingClientRect().top;
    if (target < windowHeight) {
      scrollEffect[i].classList.add('in');
    } else {
      scrollEffect[i].classList.remove('in');
    }
  }
}
document.addEventListener('scroll', blockBg);

function resultBg() {
  const scrollEffect = document.querySelectorAll('.result-block');
  let windowHeight = Math.floor(window.innerHeight); 
  for (let i = 0; i < scrollEffect.length; i++) {
    target = scrollEffect[i].getBoundingClientRect().top;
    if (target < windowHeight) {
      scrollEffect[i].classList.add('in');
    } else {
      scrollEffect[i].classList.remove('in');
    }
  }
}
document.addEventListener('scroll', resultBg);

