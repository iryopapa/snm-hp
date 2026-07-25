(function () {
  'use strict';

  $('.modal-button').modaal();
  $('.teacher-modal').click(function(){
    $('.modaal-content-container').addClass('teacher-container');
  });
  $('.seminar-modal').click(function(){
    $('.modaal-content-container').addClass('seminar-container');
  });
  $('.about-modal').click(function(){
    $('.modaal-content-container').addClass('about-container');
  });

  // const tapBtn = document.querySelector('.tap-button');
  // tapBtn.addEventListener('click', function() {
  //   this.classList.add('active');
  // });

  var trainingSlider = new Swiper('.training-slider', {
    slidesPerView: 1,
    loop: true,
    speed: 3000,
    spaceBetween: 20,
    centeredSlides: true,
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    // navigation: {
    //   nextEl: ".swiper-button-next",
    //   prevEl: ".swiper-button-prev",
    // },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  var trainingSlider02 = new Swiper('.training-slider02', {
    slidesPerView: 1,
    spaceBetween: 20,
    centeredSlides: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // var seminarSlider = new Swiper('.seminar-slider', {
  //   slidesPerView: 1,
  //   loop: true,
  //   speed: 2000,
  //   spaceBetween: 20,
  //   centeredSlides: true,
  //   autoplay: {
  //     delay: 1500,
  //     disableOnInteraction: false,
  //   },
  //   pagination: {
  //     el: ".swiper-pagination",
  //     clickable: true,
  //   },
  // });

  var voiceSlider = new Swiper('.voice-slider', {
    slidesPerView: 1.5,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    // loop: true,
    // speed: 4500,
    // loopedSlides: 3,
    // allowTouchMove: false,
    // autoplay: {
    //   delay: 0,
    //   disableOnInteraction: false,
    // }
  });
  
  // var eventSlider01 = new Swiper('.event-slider01', {
  //   slidesPerView: 1.5,
  //   loop: true,
  //   speed: 4000,
  //   spaceBetween: 15,
  //   loopedSlides: 4,
  //   allowTouchMove: false,
  //   autoplay: {
  //     delay: 0,
  //     disableOnInteraction: false,
  //   }
  // });
  
  // var eventSlider02 = new Swiper('.event-slider02', {
  //   slidesPerView: 1.5,
  //   loop: true,
  //   speed: 5000,
  //   spaceBetween: 15,
  //   // loopedSlides: 3,
  //   allowTouchMove: false,
  //   autoplay: {
  //     delay: 0,
  //     disableOnInteraction: false,
  //     reverseDirection: true,
  //     pauseOnMouseEnter: false,
  //   }
  // });

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

function voiceBg() {
  const scrollEffect = document.querySelectorAll('.voice-block');
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
document.addEventListener('scroll', voiceBg);

pannellum.viewer('panorama', {
  "type": "equirectangular",
  "panorama": "/asset/img/course/clinicalengineer/training-panorama.jpg",
  "autoLoad": true
});