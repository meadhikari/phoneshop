$( "#view" ).click(function() {
  $("#tbody").html('');
  data = {}
  data["from_date"] = $('#from')[0].value
  data["to_date"] = $('#to')[0].value
  data["type"] = $("#status").find('option:selected').attr('id')
  /*data["from_date"] = "2015-01-03"
  data["to_date"] = "2015-03-18"
  data["type"] = "default"*/
  data["token"] = token
  //spinnerplugin.show();
  $.post('http://s250217848.online.de/api/public/index.php/report/all', data, 
    function(returnedData){
      //spinnerplugin.hide(); 
      if (returnedData.statusCode == 200)
      {
        transactions = returnedData.transactions;
        var cost_sum = 0.0;
        var tax_sum = 0.0;
        console.log(transactions)
        for (var i = transactions.length - 1; i >= 0; i--) {
          var articles = returnedData.transactions[i]["articles"]

          console.log(articles)
          for (var j = articles.length - 1; j >= 0; j--) {
            var article_name = articles[j]["article_name"]
            var cost = parseFloat(articles[j]["price"])
            cost_sum = cost_sum + cost
            var tax = parseFloat(articles[j]["tax"])
            tax_sum = tax_sum + tax;
            var net = cost + tax
            if(transactions[i].transaction_type === "sell")
            {
              var tr = "<tr>"+
              "<td>"+article_name+"</td>"+
              "<td>"+cost+"</td>"+
              "<td>"+tax+"</td>"+
              "<td>"+net+"</td>"+              
              "</tr>"
              $("#tbody").append(tr);  
            }
            else if(articles[j]["refund"] === "no")
            {
              console.log(articles[j]["refund"])
              var tr = "<tr>"+
              "<td>"+article_name+"</td>"+
              "<td>"+cost+"</td>"+
              "<td>"+tax+"</td>"+
              "<td>"+net+"</td>"+
              "<td><button id="+"article_name[i]['id']"+">Refund</button></td>"+              
              "</tr>"
              $("#tbody").append(tr);   
            }
            else
            {
              console.log(articles[j]["refund"])
              var tr = "<tr>"+
              "<td>"+article_name+"</td>"+
              "<td>"+cost+"</td>"+
              "<td>"+tax+"</td>"+
              "<td>"+net+"</td>"+
              "<td>Refunded</td>"+              
              "</tr>"
              $("#tbody").append(tr);   
            }
            
          };
          

        }
        var gross_sum = cost_sum + tax_sum;
        var sum_tr = "<tr>"+
        "<td></td>"+
        "<td>"+cost_sum+"</td>"+
        "<td>"+tax_sum+"</td>"+
        "<td>"+gross_sum+"</td>"+
        "</tr>"

        $("#tbody").append(sum_tr);

      }
      else
      {
        alert ("returnedData.errors")
      }


    }); 

});
$( "#print" ).click(function() {
  $("#tbody").html('');
  data = {}
  data["from_date"] = $('#from')[0].value
  data["to_date"] = $('#to')[0].value
  data["type"] = $("#status").find('option:selected').attr('id')
  data["token"] = token
  spinnerplugin.show();
  $.post('http://s250217848.online.de/api/public/index.php/report/list', data, 
    function(returnedData){
      spinnerplugin.hide(); 
      alert(returnedData.path)
      if (returnedData.statusCode == 200)
      {
          alert(JSON.stringify(cust_info))
          alert(JSON.stringify(returnedData))
          if (returnedData.statusCode !== 200)
          {
            for (var key in returnedData.errors) {
              alert(returnedData.errors[key])
              return                             
            }
          }
          else
          {
            alert("Report Generated")
            $.ajax({
              type: "POST",
              url: "https://mandrillapp.com/api/1.0/messages/send.json",
              data: {
                'key': '4hL8kWTGJB1Ztv2rDVNalA',
                'message': {
                  'from_email': 'transactions@wingshandy.com',
                  'to': [
                  {
                    'email': 'salik.adhikari@gmail.com',
                    'name': 'Bikram Adhikari',
                    'type': 'to'
                  },
                  {
                    'email': 'toyou.dev@gmail.com',
                    'name': 'Dev Bahadur Paudel',
                    'type': 'to'
                  },
                  {
                    'email': 'sahil@wingshandy.com',
                    'name': 'Sahil',
                    'type': 'to'
                  }
                  ],
                  'autotext': 'true',
                  'subject': 'Receipt',
                  'html': 'Hi, The receipt for the transaction ' + returnedData.path.replace("/index.php","")
                }
              }
            }).done(function(response) {
              alert("Email Sent"); 
            });
                        //window.location = "https://docs.google.com/viewer?url="+returnedData.message.replace("/index.php","");
                        $(':input').val('');
                    }
          //window.location = "https://docs.google.com/viewer?url="+returnedData.path;
      }
      else
      {
        alert ("returnedData.errors")
      }

      
    }); 

});