$.get("http://s250217848.online.de/api/public/index.php/article/all?token="+token, function (data) {
		$("#offer_tab").empty();
        articles = data.article
        for (var i = 0; i <articles.length; i++) {
            val = "<div class='row offer-row'><div class='col-xs-12 col-sm-12'><p>"+articles[i].manufacturer+"<span>"+articles[i]["name"]+"</span><span>"+articles[i].imei+"</span></p></div></div>"
            //console.log(articles[i])
            $("#offer_tab").append(val);
        }
});
