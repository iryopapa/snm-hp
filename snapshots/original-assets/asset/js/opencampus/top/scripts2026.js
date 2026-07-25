(function () {
  'use strict';
  var programSwiper = new Swiper('.program-slide', {
    slidesPerView: 2,
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
  // var ictSlideLeft = new Swiper('.ict-slide.left', {
  //   allowTouchMove: false,
  //   direction: 'vertical',
  //   slidesPerView: "auto",
  //   centeredSlides: true,
  //   loop: true,
  //   loopedSlides: 10,
  //   loopAdditionalSlides: 10,
  //   freeMode: true,
  //   speed: 7000,
  //   autoplay: {
  //     delay: 0,
  //     disableOnInteraction: false,
  //   },

  // });
  // var ictSlideRight = new Swiper('.ict-slide.right', {
  //   allowTouchMove: false,
  //   direction: 'vertical',
  //   reverseDirection: true,
  //   slidesPerView: "auto",
  //   centeredSlides: true,
  //   loop: true,
  //   loopedSlides: 10,
  //   loopAdditionalSlides: 10,
  //   freeMode: true,
  //   speed: 7000,
  //   autoplay: {
  //     delay: 0,
  //     disableOnInteraction: false,
  //   },

  // });

  var schedule_Slide = new Swiper('.schedule-slider', {
    slidesPerView: 2,
    // slidesPerView: 'auto',
    autoHeight: false,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    // breakpoints: {
    //   768: {
    //     slidesPerView: 4,
    //   },
    // },
  });

  /* ↓↓↓カレンダーlocal確認用↓↓↓ */
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

})();

/* .calendar-wrapper02 ※カレンダー2つ目 */
(function () {
  'use strict';
  var loc = document.location;
  var container = document.querySelector('.calendar-wrapper02');
  var data;
  //var reqURL = '/assets/js/opencampus/calendar/data.json';
  var reqURL = '/json-calendar';
  var today = new Date();
  var thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  var nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  var total;
  var minCalendar = 2;
  var eom;
  var isheld = false;
  var next = false;
  var dayStart = 1;
  var weeks = ['月', '火', '水', '木', '金', '土', '日'];
  var holidays = holiday_jp.between(thisMonth, new Date(today.getFullYear(), today.getMonth() + 2));
  var closed_array = [
    /* '2020-12-24',
    '2020-12-25',
    '2020-12-26',
    '2020-12-27',
    '2020-12-28',
    '2020-12-29',
    '2020-12-30',
    '2020-12-31',
    '2021-01-01',
    '2021-01-02',
    '2021-01-03',
    '2021-01-04',
    '2021-01-05' */
  ];



  function loadData() {
    var request = new XMLHttpRequest();
    request.open('GET', reqURL);
    request.responseType = 'text';
    request.send();
    request.onload = function (e) {
      if (e) {
        parseData(JSON.parse(this.response));
      }
    }
  }

  function compare(a, b) {
    var r = 0;
    if (a.start < b.start) r = -1;
    else if (a.start > b.start) r = 1;
    return r;
  }

  /* function parseData(d) {
    data = Array.prototype.slice.call(d);
    data.sort(compare);
    var c = 0;
    eom = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    data.forEach(function (d) {
      var d = new Date(d.start);
      if (thisMonth > d) {
        c++;
      }
      if (d >= today && d <= eom) {
        isheld = true;
      }
      if (nextMonth < d) {
        next = true;
      }
    });
    for (var i = 0; i < c; i++) {
      data.shift();
    }
    checkDate();
  } */

  function parseData(d) {
    data = Array.prototype.slice.call(d);
    data.sort(compare);
    var c = 0;

    data.forEach(function (ds) {
      var d = new Date(ds.start);
      if (today - d > 86400000) {
        c++;
      }
    });
    for (var i = 0; i < c; i++) {
      data.shift();
    }
    checkDate();
  }

  function diffMonth(start, end) {
    return (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  }

  function checkDate() {
    if (data.length > 0) {
      var lastDay = new Date(data[data.length - 1].start);
      total = diffMonth(today, lastDay) + minCalendar;
    } else {
      total = 1;
    }

    holidays = holiday_jp.between(thisMonth, new Date(today.getFullYear(), today.getMonth() + total));

    var flag = false;

    data.forEach(function (ds) {
      var d = new Date(ds.start);
      if (nextMonth > d) {
        flag = true;
      }
    });

    for (var i = 0; i < total; i++) {
      var startYear = (flag) ? today.getFullYear() : nextMonth.getFullYear();
      var startMonth = (flag) ? today.getMonth() : nextMonth.getMonth();
      var m = new Date(startYear, startMonth + i, 1);
      createCalendar(m, container);
    }

    var calendar_Slide = new Swiper('.calendar-slides', {
      slidesPerView: 1,
      spaceBetween: 0,
      centeredSlides: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });

  }

  function createCalendar(d, target) {
    var box = document.createElement('div');
    box.className = 'calendar-box';
    box.classList.add('swiper-slide');
    var table = document.createElement('table');
    table.className = 'calendar-tbl';
    box.appendChild(table);
    var caption = document.createElement('caption');
    caption.innerHTML = '<b>' + (d.getMonth() + 1) + '</b>月';
    table.appendChild(caption);
    var thead = document.createElement('thead');
    var theadTr = thead.appendChild(document.createElement('tr'));
    for (var i = 0; i < 7; i++) {
      var th = document.createElement('th');
      th.innerText = weeks[i];
      if (i === 5) {
        th.className = 'sat';
      }
      if (i === 6) {
        th.className = 'sun';
      }
      theadTr.appendChild(th);
    }
    table.appendChild(thead);
    var startDay = d.getDay() - dayStart;
    if (startDay < 0) {
      startDay = 6;
    }
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    month = (month < 10) ? '0' + month : month;
    var monthTxt = year + '-' + month + '-';
    var endDay = new Date(year, month, 0).getDate();
    var tbody = document.createElement('tbody');
    var counter = 1;
    var tr;
    for (var i = 0; i < 6; i++) {
      if (i > 4 && counter > endDay) {
        break;
      }
      tr = document.createElement('tr');
      for (var j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          tr.appendChild(document.createElement('td'));
        } else if (counter > endDay) {
          tr.appendChild(document.createElement('td'));
        } else {
          var td = document.createElement('td');
          if (j === 5) {
            td.className = 'sat';
          }
          if (j === 6) {
            td.className = 'sun';
          }
          var dateText = monthTxt + ((counter < 10) ? '0' + counter : counter);
          var date = new Date(dateText);
          var cell = document.createElement('div');
          cell.className = 'cell';
          td.appendChild(cell);
          holidays.forEach(function (holiday) {
            if (String(date) === String(holiday.date)) {
              cell.classList.add('holiday');
            }
          });
          var dayBox = document.createElement('div');
          dayBox.className = 'num'
          dayBox.innerText = counter;
          cell.appendChild(dayBox);
          var iconBox = document.createElement('div');
          iconBox.className = 'icon-box';
          cell.appendChild(iconBox);
          var ul = document.createElement('ul');
          data.forEach(function (item) {
            if (item.start === dateText) {
              var icon;
              var inner = document.createElement('span');
              inner.className = 'inner';
              if (item.title !== undefined) {
                inner.innerText = item.title;
              }
              if (item.url !== undefined) {
                var href = '';
                icon = document.createElement('a');
                if ((item.url.indexOf('#') === 0) && (loc.pathname !== '/opencampus/calendar/')) {
                  href += '/opencampus/calendar/';
                }
                href += item.url
                icon.setAttribute('href', href);
                //icon.setAttribute('href', item.url);
                if (item.url.indexOf('form/') !== -1) {
                  icon.setAttribute('target', '_blank');
                  icon.setAttribute('rel', 'noopener');
                }
              } else {
                icon = document.createElement('span');
              }
              icon.appendChild(inner);
              //icon.classList = item.className;
              var classLists = item.className.split(' ');
              classLists.forEach(function (str) {
                icon.classList.add(str);
              });
              if (today - new Date(item.start) > 86400000) {
                icon.classList.add('off');
              }
              var li = document.createElement('li');
              li.appendChild(icon);
              ul.appendChild(li);
            }
          });
          closed_array.forEach(function (d) {
            if (d === dateText) {
              var li = document.createElement('li');
              li.classList.add('closed');
              li.innerText = '休';
              ul.appendChild(li);
            }
          });
          iconBox.appendChild(ul);
          if (ul.innerHTML === '') {
            ul.parentNode.removeChild(ul);
          }
          tr.appendChild(td);
          counter++;
        }
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    target.appendChild(box);
    var icons = Array.prototype.slice.call(document.querySelectorAll('.icon'));
    icons.forEach(function (icon) {
      icon.classList.add('no-icon');
    });
  }

  if (container !== null) {
    loadData();
  }

})();