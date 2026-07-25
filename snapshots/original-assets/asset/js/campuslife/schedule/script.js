// (function (){
//   'use strict';

//   var learningSwiper = new Swiper('.learning-slide', {
//     loop: true,
//     speed: 2000,
//     effect: 'fade',
//     autoplay: {
//       delay: 2000,
//       disableOnInteraction: false,
//     },
//     pagination: {
//       el: ".swiper-pagination",
//       clickable: true
//     }
//   });

// })();


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