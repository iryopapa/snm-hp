(function () {
  'use strict';

  if (document.documentMode) {
    var twBox = document.querySelector('.tw-box');
    twBox.style.display = 'none';
  }

  const anime_option = {
    root: null,
    rootMargin: "50px",
    threshold: 0.5
  };

  const animeArray = Array.prototype.slice.call(document.querySelectorAll('.js-anime'));
  const animeObserver = new IntersectionObserver(animationStart, anime_option);
  animeArray.forEach(function (element) {
    animeObserver.observe(element);
  });
  function animationStart(entries) {
    const entriesArray = Array.prototype.slice.call(entries, 0);
    entriesArray.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('action');
      }
    });
  }

  var scheduleSlide = new Swiper('.schedule-slider', {
    slidesPerView: 2,
    autoHeight: false,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  /* var calendar_Slide = new Swiper('.calendar-slides', {
    slidesPerView: 'auto',
    spaceBetween: 0,
    centeredSlides: true,
    breakpoints: {
      768: {
        // slidesPerView: 2,
        centeredSlides: false,
        // spaceBetween: 32,
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  }); */

  var programSwiper = new Swiper('.program-slide', {
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

  /* function initInsta() {
    var container = document.querySelector('.insta-box .widget-box');
    var img_list = [];
    for (var i = 0; i < data.length; i++) {
      var media = data[i]['media_url'].split('?')[0];
      if (media.slice((media.lastIndexOf('.')) + 1) === 'jpg') {
        img_list.push(data[i]);
      }
    }
    var ul = '<ul class="insta-list">';
    for (i = 0; i < 9; i++) {
      var item = '<li>';
      item += '<a href="' + img_list[i]['permalink'] + '" target="_blank" rel="noopener" class="no-icon">';
      item += '<img src="' + img_list[i]['media_url'] + '" alt="' + img_list[i]['caption'] + '" width="143" height="143">';
      item += '</a></li>';
      ul += item;
    }
    ul += "</ul>";
    container.innerHTML = ul;
  } */

  newsTicker();

  function newsTicker() {
    var news = document.querySelector('.news-list li:first-child a');
    var href = news.getAttribute('href');
    var date_str = news.querySelector('.date').textContent;
    var ttl_str = news.querySelector('.news-ttl').textContent;
    var news_body = document.querySelector('.news-body');
    var a = document.createElement('a');
    var news_date = document.createElement('div');
    news_date.setAttribute('class', 'news-date');
    var news_box = document.createElement('div');
    news_box.setAttribute('class', 'news-box');
    var p = document.createElement('p');
    news_date.textContent = date_str;
    p.textContent = ttl_str;
    news_box.appendChild(p);
    a.setAttribute('href', href);
    a.appendChild(news_date);
    a.appendChild(news_box);
    news_body.appendChild(a);

    news_box.classList.add('ticker');
  }


})();

