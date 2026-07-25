
(function () {
  'use strict';

  var qaSlidertop = new Swiper('.qa-slider-top', {
    slidesPerView: 2.2,
    centeredSlides: true,
    loop: true,
    speed: 3000,
    autoplay: {
      delay: 500,
      disableOnInteraction: false,
    },
  });

  var qaSliderbottom = new Swiper('.qa-slider-bottom', {
    slidesPerView: 2.2,
    centeredSlides: true,
    loop: true,
    speed: 3000,
    autoplay: {
      delay: 500,
      reverseDirection: true,
      disableOnInteraction: false,
    },
  });

  var learningSwiper = new Swiper('.learning-slide', {
    slidesPerView: 2.5,
    loop: true,
    speed: 3000,
    spaceBetween: 10,
    loopedSlides: 4,
    allowTouchMove: false,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    }
  });

  var learningphSwiper = new Swiper('.learning-ph-slide', {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: true,
    speed: 3000,
    spaceBetween: 10,
    allowTouchMove: false,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".learning-ph-slide .swiper-pagination",
      clickable: true,
    },
  });

  var graduateSwiper = new Swiper('.graduate-slide', {
    slidesPerView: 1.2,
    centeredSlides: true,
    loop: true,
    spaceBetween: 10,
    loopedSlides: 3,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
 
  $('.modal-button').modaal({
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

// $(function() {
//   $('.modal-button').modaal({
//   });
// });