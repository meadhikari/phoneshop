var kpicture1;
var kpicture2;
function konSuccess1(imageData) {
   kpicture1 = imageData;
  $("#kpicture1").attr('src',"data:image/jpeg;base64," + imageData);                
}
function konSuccess2(imageData) {
  kpicture2 = imageData;
  $("#kpicture2").attr('src',"data:image/jpeg;base64," + imageData);                
}

function onFail(message) {
    //alert('Failed because: ' + message);
}

$(document).ready(function() {
    $(".signature").jSignature();


    $("#barcode").click(function(){
        cordova.plugins.barcodeScanner.scan(
          function (result) {
              if(!result.cancelled)
              {
                $("#imei").val(result.text)
                $('#successSound')[0].play()
              }

        }, 
        function (error) {
          alert("Scanning failed: " + error);
      }
      );
    })
    $( 'a[href="#"]' ).click( function(e) {
     e.preventDefault();
    } );
    $( "#kpicture1" ).click(function() {
        navigator.camera.getPicture(konSuccess1, onFail, { quality: 10,
            destinationType: Camera.DestinationType.DATA_URL
        });
    });
    $( "#kpicture2" ).click(function() {
        navigator.camera.getPicture(konSuccess2, onFail, { quality: 10,
            destinationType: Camera.DestinationType.DATA_URL
        });
    });
    $( "#clear" ).click(function() {
        $(".signature").jSignature("clear")
    });
    /*$( "#add_phone" ).click(function() {
        $( "#phone_detail" ).clone().find('input:text').val('').appendTo( "#phone_detail_container" );
    });*/

$( "#ksubmit" ).click(function() {
    cust_info = {}
    cust_info["image1"] = "data:image/jpeg;base64,"+kpicture1
    cust_info["image2"] = "data:image/jpeg;base64,"+kpicture2
    cust_info["token"] = localStorage.getItem("token")
    cust_info["transaction_type"] = "buy"
    cust_info["article_type"] = "phone"
    cust_info["signature"] = "data:image/jpeg;base64,"+$(".signature").jSignature("getData", "base30")[1]

    delete cust_info["ksubmit"];

    $.each($("#buy input"), function(key,value)
    {
        var attr = $(value).attr("id");
        var value = $(value).val();
        if(attr === "tax" && value === "on")
        {
            cust_info["tax"] = 1
        }
        else
        {
            cust_info["tax"] = 0
        }
        if(!value)
        {
            //cust_info[attr] = "none"  //comment this in production
            return;
        }
        cust_info[attr] = value;

    });


    //comment this line in production
    
    if(cust_info["signature"] === "")
    {
        alert("Signature is required")
        return
    }
    else if(cust_info["customer_name"] === "")
    {
        alert("Customer Name required");
        return
    }
    else if(cust_info["bill_number"] === "")
    {
        alert("Bill number is required");
        return
    }
    else if(!IsNumeric(cust_info["price"]))
    {
        alert("Invalid price");
        return   
    }
    else
    {
        console.log(cust_info);
            spinnerplugin.show(); 
            $.post('http://s250217848.online.de/api/public/index.php/transaction/buy', cust_info, 
                function(returnedData){
                    spinnerplugin.hide(); 
                    
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
                                  'from_email': 'humpta@holly.com',
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

            
        }
        
        
    });
});

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 
function IsNumeric(input)
{
    return (input - 0) == input && (''+input).trim().length > 0;
}
//document.addEventListener("backbutton", onBackKeyDown, false);

/*function onBackKeyDown() 
{
	navigator.app.exitApp();
}*/

