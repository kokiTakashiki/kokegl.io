//lineUpImages
$(function () {
  /*================================================================
	情報
	================================================================*/
  var allList = [
    {
      imgid: "study202011/test049Canvas",
      life: "17. November 2020",
      title: "test049",
      modalid: "study202011/test049",
    },
    {
      imgid: "study202011/test048Canvas",
      life: "14. November 2020",
      title: "test048",
      modalid: "study202011/test048",
    },
    {
      imgid: "study202011/test047Canvas",
      life: "11. November 2020",
      title: "AR test 047",
      modalid: "study202011/test047",
    },
    {
      imgid: "study202011/test046Canvas",
      life: "10. November 2020",
      title: "AR test 046",
      modalid: "study202011/test046",
    },
    {
      imgid: "study202011/test045Canvas",
      life: "9. November 2020",
      title: "AR test 045",
      modalid: "study202011/test045",
    },
    {
      imgid: "study202011/test044Canvas",
      life: "7. November 2020",
      title: "test044",
      modalid: "study202011/test044",
    },
    {
      imgid: "study202011/test043Canvas",
      life: "5. November 2020",
      title: "test043",
      modalid: "study202011/test043",
    },
    {
      imgid: "study202011/test042Canvas",
      life: "4. November 2020",
      title: "test042",
      modalid: "study202011/test042",
    },
    {
      imgid: "study202011/test041Canvas",
      life: "3. November 2020",
      title: "test041",
      modalid: "study202011/test041",
    },
    {
      imgid: "study202011/test040Canvas",
      life: "2. November 2020",
      title: "test040",
      modalid: "study202011/test040",
    },
    {
      imgid: "study202010/test039Canvas",
      life: "31. October 2020",
      title: "test039",
      modalid: "study202010/test039",
    },
    {
      imgid: "study202010/test038Canvas",
      life: "30. October 2020",
      title: "test038",
      modalid: "study202010/test038",
    },
    {
      imgid: "study202010/test037Canvas",
      life: "29. October 2020",
      title: "test037",
      modalid: "study202010/test037",
    },
    {
      imgid: "study202010/test036Canvas",
      life: "28. October 2020",
      title: "test036",
      modalid: "study202010/test036",
    },
    {
      imgid: "study202010/test035Canvas",
      life: "27. October 2020",
      title: "test035",
      modalid: "study202010/test035",
    },
    {
      imgid: "study202010/test034Canvas",
      life: "26. October 2020",
      title: "test034",
      modalid: "study202010/test034",
    },
    {
      imgid: "study202010/test033Canvas",
      life: "25. October 2020",
      title: "test033",
      modalid: "study202010/test033",
    },
    {
      imgid: "study202010/test032Canvas",
      life: "24. October 2020",
      title: "test032",
      modalid: "study202010/test032",
    },
    {
      imgid: "study202010/test031Canvas",
      life: "23. October 2020",
      title: "test031",
      modalid: "study202010/test031",
    },
    {
      imgid: "study202010/test030Canvas",
      life: "22. October 2020",
      title: "test030",
      modalid: "study202010/test030",
    },
    {
      imgid: "study202010/test029Canvas",
      life: "21. October 2020",
      title: "test029",
      modalid: "study202010/test029",
    },
    {
      imgid: "study202010/test028Canvas",
      life: "20. October 2020",
      title: "test028",
      modalid: "study202010/test028",
    },
    {
      imgid: "study202010/test027Canvas",
      life: "19. October 2020",
      title: "test027",
      modalid: "study202010/test027",
    },
    {
      imgid: "study202010/test026Canvas",
      life: "18. October 2020",
      title: "test026",
      modalid: "study202010/test026",
    },
    {
      imgid: "study202010/test025Canvas",
      life: "17. October 2020",
      title: "test025",
      modalid: "study202010/test025",
    },
    {
      imgid: "study202010/test024Canvas",
      life: "16. October 2020",
      title: "test024",
      modalid: "study202010/test024",
    },
    {
      imgid: "study202010/test023Canvas",
      life: "15. October 2020",
      title: "test023",
      modalid: "study202010/test023",
    },
    {
      imgid: "study202010/test022Canvas",
      life: "14. October 2020",
      title: "test022",
      modalid: "study202010/test022",
    },
    {
      imgid: "study202010/test021Canvas",
      life: "13. October 2020",
      title: "test021",
      modalid: "study202010/test021",
    },
    {
      imgid: "study202010/test020Canvas",
      life: "12. October 2020",
      title: "test020",
      modalid: "study202010/test020",
    },
    {
      imgid: "study202010/test019Canvas",
      life: "11. October 2020",
      title: "test019",
      modalid: "study202010/test019",
    },
    {
      imgid: "study202010/test018Canvas",
      life: "10. October 2020",
      title: "test018",
      modalid: "study202010/test018",
    },
    {
      imgid: "study202010/test017Canvas",
      life: "9. October 2020",
      title: "test017",
      modalid: "study202010/test017",
    },
    {
      imgid: "study202010/test016Canvas",
      life: "8. October 2020",
      title: "test016",
      modalid: "study202010/test016",
    },
    {
      imgid: "study202010/test015Canvas",
      life: "7. October 2020",
      title: "test015",
      modalid: "study202010/test015",
    },
    {
      imgid: "study202010/test014Canvas",
      life: "6. October 2020",
      title: "test014",
      modalid: "study202010/test014",
    },
    {
      imgid: "study202010/test013Canvas",
      life: "5. October 2020",
      title: "test013",
      modalid: "study202010/test013",
    },
    {
      imgid: "study202010/test012Canvas",
      life: "4. October 2020",
      title: "test012",
      modalid: "study202010/test012",
    },
    {
      imgid: "study202010/test011Canvas",
      life: "3. October 2020",
      title: "test011",
      modalid: "study202010/test011",
    },
    {
      imgid: "study202010/test010Canvas",
      life: "2. October 2020",
      title: "test010",
      modalid: "study202010/test010",
    },
    {
      imgid: "study202010/test009Canvas",
      life: "1. October 2020",
      title: "test009",
      modalid: "study202010/test009",
    },
    {
      imgid: "study202009/test008Canvas",
      life: "30. September 2020",
      title: "test008",
      modalid: "study202009/test008",
    },
    {
      imgid: "study202009/test007Canvas",
      life: "29. September 2020",
      title: "test007",
      modalid: "study202009/test007",
    },
    {
      imgid: "study202009/test006Canvas",
      life: "28. September 2020",
      title: "test006",
      modalid: "study202009/test006",
    },
    {
      imgid: "study202009/test005Canvas",
      life: "27. September 2020",
      title: "test005",
      modalid: "study202009/test005",
    },
    {
      imgid: "study202009/test004Canvas",
      life: "26. September 2020",
      title: "test004",
      modalid: "study202009/test004",
    },
    {
      imgid: "study202009/test003Canvas",
      life: "25. September 2020",
      title: "test003",
      modalid: "study202009/test003",
    },
    {
      imgid: "study202009/test002Canvas",
      life: "24. September 2020",
      title: "test002",
      modalid: "study202009/test002",
    },
    {
      imgid: "study202009/test001Canvas",
      life: "24. September 2020",
      title: "test001",
      modalid: "study202009/test001",
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
        outputHtml +=
          '		<a href="study_page/' +
          line.modalid +
          '.html"><span class="title">' +
          line.title +
          "</span><br>";
        outputHtml +=
          '     </a><span class="studyday">' + line.life + "</span>";
        //画像
        outputHtml +=
          '	<a href="study_page/' +
          line.modalid +
          '.html"><div class="photo"><img src="static/img/' +
          line.imgid +
          '.png" alt="' +
          line.title +
          '" width="100%" height="100%" /></div></a>';
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
