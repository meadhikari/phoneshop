var kpicture1_data;
var kpicture2_data;
function konSuccess1(imageData) {
 kpicture1_data = imageData
 //$("#kpicture1").attr('src',"data:image/jpeg;base64," + imageData);                
 $("#kpicture1").attr('src',imageData);                
 
 
 
}
function konSuccess2(imageData) {
  kpicture2_data = imageData
  //$("#kpicture2").attr('src',"data:image/jpeg;base64," + imageData);                
  $("#kpicture2").attr('src',imageData);
  
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
      navigator.camera.getPicture(konSuccess1, onFail, { quality: 4,
        destinationType: Camera.DestinationType.FILE_URI,
        encodingType: Camera.EncodingType.JPEG
      });
    });
    $( "#kpicture2" ).click(function() {
      navigator.camera.getPicture(konSuccess2, onFail, { quality: 4,
        destinationType: Camera.DestinationType.FILE_URI,
        encodingType: Camera.EncodingType.JPEG        
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
  /*if(kpicture1_data)
  {
    cust_info["image1"] = "data:image/jpeg;base64,"+kpicture1_data
  }
  else
  {
    delete cust_info["image1"]  
  }
  if(kpicture2_data)
  {
    cust_info["image2"] = "data:image/jpeg;base64,"+kpicture2_data
  }
  else
  {
    delete cust_info["image2"]  
  }*/
  /*cust_info["image1"] = kpicture1_data
  cust_info["image2"] = kpicture1_data*/
  
  cust_info["token"] = token
  cust_info["transaction_type"] = "buy"
  cust_info["article_type"] = "phone"

  cust_info["signature"] = $(".signature").jSignature("getData")

  delete cust_info["ksubmit"];

  cust_info["customer_name"] = document.getElementById("customer_name").value
  cust_info["article_name"] =  document.getElementById("article_name").value
  cust_info["manufacturer"] =  document.getElementById("manufacturer").value
  cust_info["imei"] = document.getElementById("imei").value
  cust_info["price"] = document.getElementById("price").value
  
  cust_info["customer_name"] = "test"
  cust_info["article_name"] =  "test"
  cust_info["manufacturer"] =  "test"
  cust_info["imei"] = "12345"
  cust_info["price"] = "345"
  
  if(document.getElementById("tax").checked)
  {
    cust_info["tax"] = 1
  }
  else
  {
    cust_info["tax"] = 0
  }   



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
  /*else if(!kpicture1_data)
  {
    alert("Please select the images");
    return
  }*/
  else
  {
    
    var options = new FileUploadOptions();
    options.fileKey="image1";
    options.fileName=kpicture1_data
    options.mimeType="image/jpeg";
    options.params = cust_info;
    options.chunkedMode = false;
    var ft = new FileTransfer();
    spinnerplugin.show();
    ft.upload(kpicture1_data, "http://s250217848.online.de/api/public/index.php/transaction/buy", win, fail, options);
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
kpicture1_data
document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown() 
{
  navigator.app.exitApp();
}


function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }


  function win(r) {
    spinnerplugin.hide();
    returnedData = JSON.parse(r.response)
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
    }
  }

   function fail(error) {
    spinnerplugin.hide();
    alert("Response = " +  error.code);
  }
  function dataURItoBlob(dataURI)
  {
    var byteString = atob(dataURI.split(',')[1]);

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++)
    {
      ia[i] = byteString.charCodeAt(i);
    }

    var bb = new Blob([ab], { "type": mimeString });
    return bb;
  }
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