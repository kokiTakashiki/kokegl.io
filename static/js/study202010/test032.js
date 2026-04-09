//lineUpImages
$(function () {
  /*================================================================
	情報
	================================================================*/
  var allList = [
    {
      id: "texture/maybe_umasugigoke/maybe_umasugigoke01",
      life: "24. October 2020",
      title: "maybe_umasugigoke01",
      modalid: "maybe_umasugigoke01",
    },
    {
      id: "texture/maybe_umasugigoke/maybe_umasugigoke02",
      life: "24. October 2020",
      title: "maybe_umasugigoke02",
      modalid: "maybe_umasugigoke02",
    },
    {
      id: "texture/maybe_umasugigoke/maybe_umasugigoke03",
      life: "24. October 2020",
      title: "maybe_umasugigoke03",
      modalid: "maybe_umasugigoke03",
    },
    {
      id: "texture/maybe_umasugigoke/maybe_umasugigoke05",
      life: "24. October 2020",
      title: "maybe_umasugigoke07",
      modalid: "maybe_umasugigoke07",
    },
    {
      id: "texture/maybe_umasugigoke/maybe_umasugigoke04",
      life: "24. October 2020",
      title: "maybe_umasugigoke04",
      modalid: "maybe_umasugigoke04",
    },
    {
      id: "texture/maybe_umasugigoke/maybe_umasugigoke10",
      life: "24. October 2020",
      title: "maybe_umasugigoke10",
      modalid: "maybe_umasugigoke10",
    },
    {
      id: "texture/maybe_umasugigoke/maybe_umasugigoke09",
      life: "24. October 2020",
      title: "maybe_umasugigoke09",
      modalid: "maybe_umasugigoke09",
    },
    {
      id: "texture/maybe_umasugigoke/maybe_umasugigoke08",
      life: "24. October 2020",
      title: "maybe_umasugigoke08",
      modalid: "maybe_umasugigoke08",
    },
    {
      id: "texture/maybe_umasugigoke/maybe_umasugigoke07",
      life: "24. October 2020",
      title: "maybe_umasugigoke07",
      modalid: "maybe_umasugigoke07",
    },
    {
      id: "texture/maybe_umasugigoke/maybe_umasugigoke06",
      life: "24. October 2020",
      title: "maybe_umasugigoke06",
      modalid: "maybe_umasugigoke06",
    },
    {
      id: "texture/maybe_umasugigoke/maybe_umasugigoke07",
      life: "24. October 2020",
      title: "maybe_umasugigoke07",
      modalid: "maybe_umasugigoke07",
    },
    {
      id: "texture/maybe_umasugigoke/maybe_umasugigoke06",
      life: "24. October 2020",
      title: "maybe_umasugigoke06",
      modalid: "maybe_umasugigoke06",
    },
  ];

  /*================================================================
	スクリプトはじまり
	================================================================*/
  function init() {
    //最初は全て出力
    refleshHtml(allList);
  }

  /*================================================================
	HTML出力
	================================================================*/
  function refleshHtml(list) {
    var outputHtml = "";

    //出力する内容をoutputHtmlに格納
    if (list.length > 0) {
      _.each(list, function (line, i) {
        outputHtml += '<div class="product">';
        //画像
        outputHtml +=
          '	<div class="photo"><img src="../../static/img/' +
          line.id +
          '.jpeg" alt="' +
          line.title +
          '" width="100%" height="100%" /></div>';
        outputHtml += "<!--/.product--></div>";
      });
    } else {
      outputHtml +=
        '<div class="noproduct"><p>条件に当てはまるwordを検索できませんでした。</p></div>';
    }

    //HTML出力（フェードインアニメーションつき）
    $(".productArea").html(outputHtml);
    $(".productArea .product")
      .css({ opacity: 0 })
      .each(function (i) {
        $(this)
          .delay(100 * i)
          .animate({ opacity: 1 }, 0);
      });
  }

  /*================================================================
	デバック
	================================================================*/
  function DebugPrint(str) {
    var out = document.getElementById("debug");
    if (!out) return;
    out.value += str;
  }

  /*================================================================
	スクリプトはじめ
	================================================================*/
  init();
});
