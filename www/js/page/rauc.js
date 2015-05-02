var SELLING_PHONES = []
var ARTICLES = []
var CUSTOMERS = []
var rpicture1_data;
var rpicture2_data;
function ronSuccess1(imageData) {
	rpicture1_data = imageData
	$("#rpicture1").attr('src',"data:image/jpeg;base64," + imageData);                

}
function ronSuccess2(imageData) {
	rpicture2_data = imageData
	$("#rpicture2").attr('src',"data:image/jpeg;base64," + imageData);                
}


function onFail(message) {
	//alert('Failed because: ' + message);
}
function removeFromCart(index)
{
	$("#selectedRow"+index).remove();
	SELLING_PHONES = SELLING_PHONES.filter(function (el) {
		return el.id !== index;
	});
	//console.log(SELLING_PHONES)

}
function addToCart(article)
{
	
	var price = prompt("Selling Price", "");
	if (price)
	{
		console.log({"id":article.id,"price":price,"name":article["name"]})
		SELLING_PHONES.push({"id":article.id,"price":price,"name":article["name"]})
	var tr = "<tr id=selectedRow"+article.id+">"+
	"<td>"+article["manufacturer"]+"</td>"+
	"<td>"+article["name"]+"</td>"+
	"<td>"+article["imei"]+"</td>"+
	"<td>"+price+"</td>"+
	"<td><button onclick='return removeFromCart("+JSON.stringify(article.id)+")'><span class='glyphicon glyphicon-remove'></span>Remove</button></td>"+
	"</tr>"
	//console.log(SELLING_PHONES)
	$("#selected_phones").append(tr);	
	}
	

}

$( document ).ready(function() {
	
	

	/*$(".other_clear").click(function(){
		console.log("$(this).closest('div').attr('id')");

	})*/

$.get("http://s250217848.online.de/api/public/index.php/customer/all?token="+token, function( data ) {
	CUSTOMERS = data.customer
	console.log(CUSTOMERS)
	}); 

$('.buyer_name').on('input',function(e){
	//console.log($(this).val())
	var current_text = $(this).val()
	$.each(CUSTOMERS, function(i, v) {
		if (v.name.toLowerCase().indexOf(current_text.toLowerCase()) >= 0) {
            //console.log(v)
            $("#email").val(v.email)
            $("#phone_number").val(v.phone)
            $("#postcode").val(v.postcode)
            $("#street").val(v.street)
            $("#city").val(v.city)
            $("#country").val(v.country)
            return false;
        }
    });
});
$.get("http://s250217848.online.de/api/public/index.php/article/all?token="+token, function( data ) {
	$("#select_phones").html('');
	$("#selected_phones").html('');
	ARTICLES = data["article"]		
	$.each(ARTICLES, function( i, article ) {
		if (!$("#manufacturer_select option[value='" + article["manufacturer"] + "']").length)
			$("#manufacturer_select").append($("<option />").val(article["manufacturer"]).text(article["manufacturer"]));
	});	
		//
		populateSelectPhones(ARTICLES)
		
}); 

	
	$('.other_price').on('input',function(e){
			var tax_value = $(this).closest('div').next('div').next('div').next('div').find('.tax_value')
			var other_tax = $(this).closest('div').next('div').next('div').find('.other_tax')
   			//console.log($(this).next('.tax_value').val())
   			//$(this).closest('.tax_value').val("0");
     		if(other_tax.is(":checked")){
     			if((parseFloat($(this).val()) * 0.19) > 0)
     				tax_value.val(parseFloat($('.other_price').val()) * 0.19)
     		}

    });       
    $('.other_tax').change(function() {
    	var tax_value = $(this).parent().parent().next().find(".tax_value")
		var other_price = $(this).parent().parent().prev().prev().find('.other_price')
        if($(this).is(":checked")){
     			if((parseFloat(other_price.val()) * 0.19) > 0)
     				tax_value.val(parseFloat($('.other_price').val()) * 0.19)
     	}
     	else
     	{
     		tax_value.val(0)	
     	}
    });
$('#phones').DataTable();
$("#add_other").click(function(){
	$.get("forms/other_detail.html", function (data) {
		data = $(data).attr("id","number"+Math.random())
		$("#other_detail_container").append(data);
		$('.other_tax').bootstrapToggle();
		$(".other_clear").click(function(event)
		{
			event.preventDefault();
			document.getElementById($(this).parent().attr('id')).innerHTML=""
				//$('#'+$(this).closest('div').attr('id')).remove();
				

		})
		$('.other_price').on('input',function(e){
			var tax_value = $(this).closest('div').next('div').next('div').next('div').find('.tax_value')
			var other_tax = $(this).closest('div').next('div').next('div').find('.other_tax')
   			//console.log($(this).next('.tax_value').val())
   			//$(this).closest('.tax_value').val("0");
     		if(other_tax.is(":checked")){
     			if((parseFloat($(this).val()) * 0.19) > 0)
     				tax_value.val(parseFloat($(this).val()) * 0.19)
     		}

    });       
    $('.other_tax').change(function() {
    	var tax_value = $(this).parent().parent().next().find(".tax_value")
		var other_price = $(this).parent().parent().prev().prev().find('.other_price')
        if($(this).is(":checked")){
     			if((parseFloat(other_price.val()) * 0.19) > 0)
     				tax_value.val(parseFloat(other_price.val()) * 0.19)
     	}
     	else
     	{
     		tax_value.val(0)	
     	}
    });
		

	});

})
$('#manufacturer_select').on('change', function (e) {
	var optionSelected = $("option:selected", this);
	var valueSelected = this.value;
    	//console.log(valueSelected)
    	$("#select_phones tr").remove();
    	current_manufacturer_articles = []
    	$.each(ARTICLES, function( i, article ) {
    		if (ARTICLES[i]["manufacturer"] === valueSelected)
    			current_manufacturer_articles.push(article)   		

    	});	
    	populateSelectPhones(current_manufacturer_articles)
    	
    });
$( "#rpicture1" ).click(function() {
	navigator.camera.getPicture(ronSuccess1, onFail, { quality: 10,
		destinationType: Camera.DestinationType.DATA_URL
	});
});
$( "#rpicture2" ).click(function() {
	navigator.camera.getPicture(ronSuccess2, onFail, { quality: 10,
		destinationType: Camera.DestinationType.DATA_URL
	});
});



$( "#rsubmit" ).click(function() {
	cust_info = {}
	cust_info["token"] = token
	cust_info["transaction_type"] = "sell"

	var other_names = ($(".other_name").map(function(){return $(this).val();}).get()).filter(Boolean);
	var other_prices = ($(".other_price").map(function(){return $(this).val();}).get()).filter(Boolean);
	var other_quantities = ($(".other_quantity").map(function(){return $(this).val();}).get()).filter(Boolean);
	var other_taxes = ($(".other_tax").map(function(){if(this.checked){return "on"}else{return "off"};}).get()).filter(Boolean);
	var other_taxes_values = ($(".tax_value").map(function(){return $(this).val();}).get()).filter(Boolean);
	others = []
	for (var i = other_names.length - 1; i >= 0; i--) {
		other = {}	
		other["name"] = other_names[i]
		other["price"] = other_prices[i]
		other["qty"] = other_quantities[i]
		other["tax"] = other_taxes[i]
		other["tax_value"] = other_taxes_values[i]
		others.push(other)
	};
	
	$.each($("#customer_detail input"), function(key,value)
	{
		var attr = $(value).attr("id");
		var value = $(value).val();
		if(!value)
		{
				cust_info[attr] = "none"  //comment this in production
				return;
		}
		cust_info[attr] = value;

	});
	
	cust_info["phones"]	= JSON.stringify(SELLING_PHONES)
	cust_info["others"]	= JSON.stringify(others)
	
	//spinnerplugin.show();
	
	$.post('http://s250217848.online.de/api/public/index.php/transaction/sell', cust_info, 
		function(returnedData){
			console.log(returnedData)
			//spinnerplugin.hide(); 
					//alert(JSON.stringify(cust_info))
					
					if (returnedData.statusCode !== 200)
					{
						
						for (var key in returnedData.errors) {
							alert(returnedData.errors[key])
							return                             
						}
						
					}
					else
					{
						alert("Transaction Completed")
						// $.ajax({
						// 	type: "POST",
						// 	url: "https://mandrillapp.com/api/1.0/messages/send.json",
						// 	data: {
						// 		'key': '4hL8kWTGJB1Ztv2rDVNalA',
						// 		'message': {
						// 			'from_email': 'transactions@wingshandy.com',
						// 			'to': [
						// 			{
						// 				'email': 'salik.adhikari@gmail.com',
						// 				'name': 'Bikram Adhikari',
						// 				'type': 'to'
						// 			},
						// 			{
						// 				'email': 'toyou.dev@gmail.com',
						// 				'name': 'Dev Bahadur Paudel',
						// 				'type': 'to'
						// 			},
						// 			{
						// 				'email': 'sahil@wingshandy.com',
						// 				'name': 'Sahil',
						// 				'type': 'to'
						// 			}
						// 			],
						// 			'autotext': 'true',
						// 			'subject': 'Receipt',
						// 			'html': 'Hi, The receipt for the transaction ' + returnedData.message.replace("/index.php","")
						// 		}
						// 	}
						// }).done(function(response) {
						// 	alert("Email Sent"); 
						// });
						cordova.plugins.printer.print(returnedData.message.replace("/index.php",""), 'Transacton', function () {
   							 alert('printing finished')
						});
                        //window.location = "https://docs.google.com/viewer?url="+returnedData.message.replace("/index.php","");
                        $(':input').val('');
                        $("#selected_phones").empty()
                        $.get("http://s250217848.online.de/api/public/index.php/article/all?token="+token, function( data ) {
							$("#select_phones").html('');
							$("#selected_phones").html('');
							ARTICLES = data["article"]		
							$.each(ARTICLES, function( i, article ) {
							if (!$("#manufacturer_select option[value='" + article["manufacturer"] + "']").length)
								$("#manufacturer_select").append($("<option />").val(article["manufacturer"]).text(article["manufacturer"]));
							});	
		
							populateSelectPhones(ARTICLES)
		
						}); 
                        $("#rsubmit").val("Submit")
                        $.get("http://s250217848.online.de/api/public/index.php/customer/all?token="+token, function( data ) {
							CUSTOMERS = data.customer
							console.log(CUSTOMERS)
						}); 

                    }
                    

                });


});

});

function populateSelectPhones(articles)
  {
    for (var i = articles.length - 1; i >= 0; i--) {
      //console.log(articles[i]["manufacturer"])
      var tr = "<tr>"+
      "<td>"+articles[i]["name"]+"</td>"+
      "<td>"+articles[i]["price"]+"</td>"+      
      "<td>"+articles[i]["imei"]+"</td>"+
      "<td><button onclick='return addToCart("+JSON.stringify(articles[i])+")'><span class='glyphicon glyphicon-plus'></span>Add</button></td>"+
      "</tr>"

      $("#select_phones").append(tr);
    }
  }
  function today(){
    var today = new Date();
    var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd
  } 
  if(mm<10){
    mm='0'+mm
  } 
  return dd+'/'+mm+'/'+yyyy;
}
