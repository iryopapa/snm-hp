jQuery(document).ready(function ($) {

  $('[data-remodal-id=modal]').remodal();

  var date = '';
  var busstop = '';

  $('.stop-link').on('click', function () {
    date = $(this).attr('data-date');
    busstop = $(this).attr('data-place');
    changeVal();
    // console.log(date);
    // console.log(busstop);
  });

  function changeVal() {
    $('.btn.arrow').each(function (index, element) {
      $(this).attr('data-date', date);
      $(this).attr('data-place', busstop);
    })

  }

  $('.btn.arrow').on('click', function (event) {
    event.preventDefault();

    var baseurl = $(this).attr('href');

    if (date != '') {
      baseurl = baseurl + '&date=' + $(this).attr('data-date');
    }
    if (busstop != '') {
      baseurl = baseurl + '&busstop=' + $(this).attr('data-place');
    }

    // var newurl = baseurl + '&date=' + $(this).attr('data-date') + '&busstop=' + $(this).attr('data-place');

    location.href = baseurl;

  })

  if ($('select[name=bus_date_list]')) {
    //セレクトボックス 初期表示
    selectBusDate();
    //セレクトボックス 選択時
    $('select[name=bus_date_list]').change(selectBusDate);

    //ポップアップ
    $('#bus_time_table .btn_reservation').on('click', function (e) {
      showOpencampusEventBox(e);
    });
    $('#bus_time_table div[id*=dialog_]').on('click', function (e) {
      removeOpencampusEventBox(e);
    });
    $('#bus_time_table div[id*=dialog_] a').on('click', function (e) {
      moveOpencampuspage(e);
    });
  }

  /*-------------------------------------------
   * 日付セレクトボックス 初期表示/選択時
   -------------------------------------------*/
  function selectBusDate() {
    //選択中の日付
    var select_date = $('select[name=bus_date_list]').val();
    //表示する時刻表
    $('#bus_time_table .time_tables > section#' + select_date).css('display', 'block');
    $('#bus_time_table .time_tables > section:not(#' + select_date + ')').css('display', 'none');
  }

  /*-------------------------------------------
   * ポップアップ 表示
   -------------------------------------------*/
  function showOpencampusEventBox(e) {
    $id = e.currentTarget.id;
    $date = $id.replace('btn_', '');
    $stop = e.currentTarget.name;
    $bus_stop_no = e.currentTarget.getAttribute("bus_stop_no");

    $dialog = $('#dialog_' + $date);
    $dialog.attr('name', $stop);
    $dialog.attr('bus_stop_no', $bus_stop_no);
    $dialog.fadeIn(500);
  }

  /*-------------------------------------------
   * ポップアップ 削除
   -------------------------------------------*/
  function removeOpencampusEventBox(e) {
    $id = e.currentTarget.id;
    $dialog = $('#' + $id);
    $dialog.removeAttr('name');
    $dialog.removeAttr('bus_stop_no');
    $dialog.fadeOut(500);
  }

  /*-------------------------------------------
   * ポップアップからのページ遷移
   -------------------------------------------*/
  function moveOpencampuspage(e) {
    $id = e.currentTarget.id;
    $date = $id.replace('a_', '');
    $href = e.currentTarget.href;
    $stop = $("#dialog_" + $date).attr("name");
    e.currentTarget.href = $href + '&stop=' + $stop;
    $bus_stop_no = $("#dialog_" + $date).attr("bus_stop_no");
    e.currentTarget.href = $href + '&bus_stop_no=' + $bus_stop_no;
    return false;
  }

});