var SELLING_PHONES = []
var ARTICLES = []
var rpicture1;
var rpicture2;
function ronSuccess1(imageData) {
	rpicture1 = imageData
	$("#rpicture1").attr('src',"data:image/jpeg;base64," + imageData);                

}
function ronSuccess2(imageData) {
	rpicture2 = imageData
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
	console.log(SELLING_PHONES)

}
function addToCart(article)
{
	var price = prompt("Selling Price", "");
	SELLING_PHONES.push({"id":article.id,"price":price,"model":article.model})
	var tr = "<tr id=selectedRow"+article.id+">"+
	"<td>"+article["manufacturer"]+"</td>"+
	"<td>"+article["model"]+"</td>"+
	"<td>"+article["imei"]+"</td>"+
	"<td>"+price+"</td>"+
	"<td><button onclick='return removeFromCart("+JSON.stringify(article.id)+")'><span class='glyphicon glyphicon-remove'></span>Remove</button></td>"+
	"</tr>"
	console.log(SELLING_PHONES)
	$("#selected_phones").append(tr);

}

$( document ).ready(function() {
	
	

	/*$(".other_clear").click(function(){
		console.log("$(this).closest('div').attr('id')");

	})*/

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

$("#rprint").click(function(){
	$.get( "report.html", function( data ) {
		var sum = 0;
		for (var i = SELLING_PHONES.length - 1; i >= 0; i--) {
			sum = sum + parseFloat(SELLING_PHONES[i].price)
		};
		var other_names = ($(".other_name").map(function(){return $(this).val();}).get()).filter(Boolean);
		var other_prices = ($(".other_price").map(function(){return $(this).val();}).get()).filter(Boolean);
		var other_quantities = ($(".other_quantity").map(function(){return $(this).val();}).get()).filter(Boolean);
		others = []
		other_sum = 0;
		for (var i = other_names.length - 1; i >= 0; i--) {
			other = {}	
			other["name"] = other_names[i]
			other["price"] = parseFloat(other_prices[i]) * parseFloat(other_quantities[i])
			other["qty"] = other_quantities[i]
			other_sum = other_sum + parseFloat(other_prices[i])
			others.push(other)
		};
		sum = sum + other_sum
		content = TemplateEngine(data, {
			transaction_type: "Sell",
			today:today(),
			customer_name:$(".buyer_name").val(),
			phones:SELLING_PHONES,
			others: others,
			total: sum
		})
		var w = window.open();
        /*var type = "text/html";
		var title = "test.html";
		window.plugins.PrintPlugin.print(content,function(){console.log('success')},function(){console.log('fail')},"",type,title);*/

		/*cordova.plugins.printer.print(content, 'Document.html', function () {
    			alert('printing finished or canceled')
    		});*/
  		/*var html = $("#rreport").html();
  		$("body").printPage()
  		$(w.document.body).html(content);*/




  	});		


})

$( "#rsubmit" ).click(function() {
	cust_info = {}
	if(rpicture1)
	{
		cust_info["image1"] = "data:image/jpeg;base64,"+rpicture1
	}
	if(rpicture2)
	{
		cust_info["image2"] = "data:image/jpeg;base64,"+rpicture2
	}
	cust_info["token"] = token
	cust_info["transaction_type"] = "sell"

	var other_names = ($(".other_name").map(function(){return $(this).val();}).get()).filter(Boolean);
	var other_prices = ($(".other_price").map(function(){return $(this).val();}).get()).filter(Boolean);
	var other_quantities = ($(".other_quantity").map(function(){return $(this).val();}).get()).filter(Boolean);
	var other_taxes = ($(".other_tax").map(function(){return $(this).val();}).get()).filter(Boolean);
	var other_taxes_values = ($(".other_tax_value").map(function(){return $(this).val();}).get()).filter(Boolean);
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
	cust_info["phones"]	= SELLING_PHONES
	cust_info["others"]	= others
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
	spinnerplugin.show();
	console.log(cust_info)
	$.post('http://s250217848.online.de/api/public/index.php/transaction/sell', cust_info, 
		function(returnedData){
			spinnerplugin.hide(); 
					//alert(JSON.stringify(returnedData))
					if (returnedData.statusCode !== 200)
					{
						for (var key in returnedData.errors) {
							alert(returnedData.errors[key])
							return                             
						}
					}
					else
					{
						alert("Data Inserted Succesfully")
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
									'html': 'Hi, The receipt for the transaction ' + returnedData.message.replace("/index.php","")
								}
							}
						}).done(function(response) {
							alert("Email Sent"); 
						});
                        //window.location = "https://docs.google.com/viewer?url="+returnedData.message.replace("/index.php","");
                        $(':input').val('');
                    }
                    

                });


});

});

function populateSelectPhones(articles)
{
	for (var i = articles.length - 1; i >= 0; i--) {
			//console.log(articles[i]["manufacturer"])
			var tr = "<tr>"+
			"<td>"+articles[i]["model"]+"</td>"+
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


