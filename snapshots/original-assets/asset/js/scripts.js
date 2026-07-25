(function (_win, _doc) {
  "use strict";
  if(_doc.documentMode) {
    var fixSvgIntrinsicSizing = function() {
      function getAspect(o) {
        return (o = o.split(" ")) && o[3] / o[2];
      }
      var x = _doc.querySelectorAll("svg[viewBox]");
      if(x) {
        for(var y, z, a, b, i = 0, l = x.length; i < l; i++) {
          y = x[i];
          if(!/noFixSvgIntrinsicSizing/.test(y.className.baseVal)) {
            y.hasAttribute("preserveAspectRatio") &&
              /slice/.test(y.getAttribute("preserveAspectRatio")) &&
              (y.style.overflow = "hidden");
            a = _win.getComputedStyle(y, "").width;
            b = _win.getComputedStyle(y, "").height;
            y.style.width = "";
            y.style.height = "";
            z = _win.getComputedStyle(y, "").height;
            if(z !== "150px") {
              y.style.width = a;
              y.style.height = b;
            }
            else {
              z = _win.getComputedStyle(y, "").width;
              a = /([0-9\.]+)px/.exec(z)[1] * 1;
              b = getAspect(y.getAttribute("viewBox"));
              a * b > _doc.documentElement.offsetHeight && (
                y.style.height = (a * b) + "px",
                z = _win.getComputedStyle(y, "").width,
                a = /([0-9\.]+)px/.exec(z)[1] * 1
              );
              y.style.width = z;
              y.style.height = (a * b) + "px";
            }
          }
        }
      }
    };
    _doc.addEventListener("DOMContentLoaded", fixSvgIntrinsicSizing, false);
    _win.addEventListener("resize", fixSvgIntrinsicSizing, false);
  }
})(window, document);

(function () {
  'use strict';

  //for ie
  if (document.documentMode) {
    objectFitImages();
  }

  // smooth scroll
  var scroll = new SmoothScroll('a[href*="#"]', {
    speed: 600,
    speedAsDuration: false,
    easing: 'easeInOutCubic',
    header: '.header'
  });

  const options = {
    root: null,
    rootMargin: "-100px",
    threshold: 0
  };

  const observer = new IntersectionObserver(doWhenIntersect, options);
  observer.observe(document.querySelector('.mv'));

  function doWhenIntersect(entries) {
    const entriesArray = Array.prototype.slice.call(entries, 0);
    entriesArray.forEach(function(entry) {
      if (entry.isIntersecting) {
        document.querySelector('.header').classList.remove('bg');
        document.querySelector('.fixed-cv-box').classList.remove('show');
      } else {
        document.querySelector('.header').classList.add('bg');
        document.querySelector('.fixed-cv-box').classList.add('show');
      }
    });
  }

  /* const _root = document.body;
  const menuBtn = document.querySelector('.menu-btn');
  var navOverlay = null;
  var headerElement = document.querySelector('.header');
  var currentPosY;
  menuBtn.addEventListener('click', function () {
    if (!navOverlay) {
      currentPosY = document.documentElement.scrollTop || document.body.scrollTop;
      navOverlay = document.createElement('div');
      navOverlay.classList.add('nav-overlay');
      _root.appendChild(navOverlay);
      _root.classList.add('isOpen');
      _root.scrollTo(0, currentPosY);
      navOverlay.addEventListener('click', menuClose);
      this.classList.add('on');
    } else {
      navOverlay.removeEventListener('click', menuClose);
      _root.removeChild(navOverlay);
      navOverlay = null;
      _root.classList.remove('isOpen');
      window.scrollTo(0, currentPosY);
      this.classList.remove('on');
    }
  });
  function menuClose() {
    menuBtn.click();
  } */

  /* function navInit() {
    var ckList = document.querySelectorAll('input[name=category-group]');
    var ckArray = Array.prototype.slice.call(ckList, 0);
    var t = document.querySelectorAll('.nav-category-ttl');
    var tArray = Array.prototype.slice.call(t, 0);
    tArray.forEach(function(elm){
      elm.addEventListener('mouseover', function(e){
        if(window.innerWidth < 1024) return;
        ckArray.forEach(function(t){
          t.checked = false;
        });
        this.click();
      });
    });

    window.addEventListener('resize', navSetting);

  } */

  /* var navIndex = 0;
  var isSp = false;

  function navSetting() {
    var ckList = document.querySelectorAll('input[name=category-group]');
    var ckArray = Array.prototype.slice.call(ckList, 0);
    ckArray.forEach(function (elm, i) {
      if (window.innerWidth < 1024) {
        elm.checked = false;
      } else {
        elm.checked = false;
        if (i === 0) {
          elm.checked = true;
        }
      }
    });
  } */

  //navInit();
  //navSetting();

  var bnrSlide = new Swiper('.ft-banner-slides', {
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loopAdditionalSlides: 2,
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: '.swiper-pagination',
    }
  });


  window.addEventListener('resize', function () {
    if (window.matchMedia('screen and (min-width: 1024px)').matches) {
      var chkBox = document.getElementById('menu-switch');
      if (chkBox.checked) {
        chkBox.checked = false;
      }
    }
  });

  // var lnav_title = document.querySelector('.menu-block .bg-ttl');
  // if(lnav_title) {
  //   lnav_title.addEventListener('click', function(e){
  //     this.parentNode.classList.toggle('active');
  //   });
  // }

  /*  ads-modal */
  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('ads-modal');
    const closeBtn = modal.querySelector('.close-button');
    const bannerLink = modal.querySelector('.ads-modal-banner');

    const STORAGE_KEY = 'ads-modal-closed-at';
    const HOURS_24 = 24 * 60 * 60 * 1000;

    const lastClosed = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (lastClosed && now - parseInt(lastClosed, 10) < HOURS_24) {
      return;
    }

    modal.style.display = 'block';

    const closeModal = () => {
      modal.style.display = 'none';
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    };

    closeBtn.addEventListener('click', closeModal);

    bannerLink.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  });

})();
