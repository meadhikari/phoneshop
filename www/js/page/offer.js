$.get("http://s250217848.online.de/api/public/index.php/article/all?token="+localStorage.getItem("token"), function (data) {
        articles = data.article
        for (var i = 0; i <articles.length; i++) {
            val = "<div class='row offer-row'><div class='col-xs-12 col-sm-12'><p>"+articles[i].manufacturer+"<span>"+articles[i].model+"</span></p></div></div>"
            //console.log(articles[i])
            $("#offer_tab").append(val);
          
          
        }
      });
