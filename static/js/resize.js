var common = {
  init: () => {
    var resizeTimer = null;
    var $body = $("body");

    common.resize();
    //common.start();

    /* window resize
		----------------------------- */
    var resizeCallback = function () {
      common.resize();
      resizeTimer = null;
    };

    $(window)
      .off("resize")
      .on("resize", function () {
        if (!$body.hasClass("resize")) {
          $body.addClass("resize");
        }
        if (resizeTimer) {
          clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(resizeCallback, 300);
      });
  },
  resize: () => {
    var ut = navigator.userAgent;
    // 角度を取得
    // let angle = screen && screen.orientation && screen.orientation.angle;
    // if ( angle === undefined ) {
    //   angle = window.orientation;    // iOS用
    // }
    //console.log(ut);
    //console.log(angle)

    var msg = {};

    if (
      ut.indexOf("iPhone") > 0 ||
      ut.indexOf("iPod") > 0 ||
      (ut.indexOf("Android") > 0 && ut.indexOf("Mobile") > 0)
    ) {
      if (window.innerHeight > window.innerWidth) {
        /* 縦画面時の処理 */
        console.log("tate");
        msg.type = "SmartPhone";
        msg.indeximgw = "calc(33.333% - 20px)";
        msg.indeximgm = "0 auto";
        msg.mainFont = "48";
        msg.capFont = "50";
        msg.canvasSise = $(window).width() * 0.8;
        msg.twitter = "10";
        msg.facebook = "7";
        msg.note = "11";
      } else {
        /* 横画面時の処理 */
        msg.type = "SmartPhone";
        msg.indeximgw = "calc(33.333% - 20px)";
        msg.indeximgm = "10px 10px 20px 10px";
        msg.mainFont = "26";
        msg.capFont = "26";
        msg.canvasSise = $(window).height() * 0.7;
        msg.twitter = "10";
        msg.facebook = "7";
        msg.note = "11";
      }
    } else if (ut.indexOf("iPad") > 0 || ut.indexOf("Android") > 0) {
      if (window.innerHeight > window.innerWidth) {
        /* 縦画面時の処理 */
        msg.type = "Tablet";
        msg.indeximgw = "calc(33.333% - 20px)";
        msg.indeximgm = "10px 10px 20px 10px";
        msg.mainFont = "30";
        msg.capFont = "30";
        msg.canvasSise = $(window).width() * 0.55;
        msg.twitter = "10";
        msg.facebook = "7";
        msg.note = "11";
      } else {
        /* 横画面時の処理 */
        msg.type = "Tablet";
        msg.indeximgw = "calc(33.333% - 20px)";
        msg.indeximgm = "10px 10px 20px 10px";
        msg.mainFont = "20";
        msg.capFont = "20";
        msg.canvasSise = $(window).height() * 0.6;
        msg.twitter = "10";
        msg.facebook = "7";
        msg.note = "11";
      }
    } else {
      msg.type = "Personal Computer";
      msg.indeximgw = "calc(33.333% - 20px)";
      msg.indeximgm = "10px 10px 20px 10px";
      msg.mainFont = "24";
      msg.capFont = "30";
      msg.canvasSise = 600;
      msg.twitter = "5";
      msg.facebook = "3.5";
      msg.note = "5.5";
    }

    //console.log(msg)

    var $body = $("body");

    $(".main").css({
      "font-size": msg.mainFont + "px",
    });
    $(".title").css({
      "font-size": msg.capFont + "px",
    });
    $(".studyDay").css({
      "font-size": msg.capFont + "px",
    });
    $(".twitter").css({
      width: msg.twitter + "%",
      height: msg.twitter + "%",
    });
    $(".facebook").css({
      width: msg.facebook + "%",
      height: msg.facebook + "%",
    });
    $(".note").css({
      width: msg.note + "%",
      height: msg.note + "%",
    });
    $(".mycanvas").css({
      width: msg.canvasSise + "px",
      height: msg.canvasSise + "px",
    });
    $(".imagebox").css({
      width: msg.canvasSise + "px",
      height: msg.canvasSise + "px",
    });
    $(".productArea .product").css({
      width: msg.indeximgw,
      margin: msg.indeximgm,
    });

    setTimeout(function () {
      if ($body.hasClass("resize")) {
        $body.removeClass("resize");
      }
    }, 300);
  },
};
document.addEventListener("DOMContentLoaded", function () {
  isPage = $("body").attr("id");
  common.init();
});
window.addEventListener("orientationchange", () => {
  common.resize();
});
