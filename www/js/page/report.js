$( "#view" ).click(function() {
  $("#tbody").html('');
  data = {}
  data["from_date"] = $('#from')[0].value
  data["to_date"] = $('#to')[0].value
  data["type"] = $("#status").find('option:selected').attr('id')
  data["token"] = localStorage.getItem("token")
  spinnerplugin.show();
  $.post('http://s250217848.online.de/api/public/index.php/report/all', data, 
    function(returnedData){
      spinnerplugin.hide(); 
      if (returnedData.statusCode == 200)
      {
        transactions = returnedData.transactions;
        var cost_sum = 0.0;
        var tax_sum = 0.0;
        for (var i = transactions.length - 1; i >= 0; i--) {
          var article_name = returnedData.transactions[i]["article_name"]
          var cost = parseFloat(returnedData.transactions[i]["cost"])
          cost_sum = cost_sum + cost
          var tax = parseFloat(returnedData.transactions[i]["tax"])
          tax_sum = tax_sum + tax;
          var net = cost + tax
          var tr = "<tr>"+
          "<td>"+article_name+"</td>"+
          "<td>"+cost+"</td>"+
          "<td>"+tax+"</td>"+
          "<td>"+net+"</td>"+
          "</tr>"

          $("#tbody").append(tr);
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
  data["token"] = localStorage.getItem("token")
  spinnerplugin.show();
  $.post('http://s250217848.online.de/api/public/index.php/report/list', data, 
    function(returnedData){
      spinnerplugin.hide(); 
      alert(returnedData.path)
      if (returnedData.statusCode == 200)
      {
          window.location = "https://docs.google.com/viewer?url="+returnedData.path;
      }
      else
      {
        alert ("returnedData.errors")
      }

      
    }); 

});