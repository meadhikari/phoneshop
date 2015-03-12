var kpicture1_data;
var kpicture2_data;
function konSuccess1(imageData) {
 kpicture1_data = "data:image/jpeg;base64," + imageData
 $("#kpicture1").attr('src',"data:image/jpeg;base64," + imageData);                
 //$("#kpicture1").attr('src',imageData);                
 //kpicture1_data = $("#kpicture1").imageBlob('image/jpeg').blob();
 
 
}
function konSuccess2(imageData) {
  kpicture2_data = "data:image/jpeg;base64," + imageData
  $("#kpicture2").attr('src',"data:image/jpeg;base64," + imageData);                
  //$("#kpicture2").attr('src',imageData);
  
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
        destinationType: Camera.DestinationType.DATA_URL,
        encodingType: Camera.EncodingType.JPEG
        


      });
    });
    $( "#kpicture2" ).click(function() {
      navigator.camera.getPicture(konSuccess2, onFail, { quality: 10,
        destinationType: Camera.DestinationType.DATA_URL,
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
  cust_info["image1"] = dataURItoBlob(kpicture1_data)

  cust_info["image2"] = dataURItoBlob(kpicture2_data)
  
  cust_info["token"] = token
  cust_info["transaction_type"] = "buy"
  cust_info["article_type"] = "phone"
  cust_info["signature"] = "data:image/jpeg;base64,"+$(".signature").jSignature("getData", "base30")[1]

  delete cust_info["ksubmit"];

  cust_info["customer_name"] = document.getElementById("customer_name").value
  cust_info["article_name"] =  document.getElementById("article_name").value
  cust_info["manufacturer"] =  document.getElementById("manufacturer").value
  cust_info["model"] = document.getElementById("model").value
  cust_info["imei"] = document.getElementById("imei").value
  cust_info["price"] = document.getElementById("price").value
  cust_info["bill_number"] = document.getElementById("bill_number").value

  cust_info["customer_name"] = "test"
  cust_info["article_name"] =  "test"
  cust_info["manufacturer"] =  "test"
  cust_info["model"] = "test"
  cust_info["imei"] = "12345"
  cust_info["price"] = "345"
  cust_info["bill_number"] = "3456"
  if(document.getElementById("tax").value === "on")
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
  else
  {
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    for(var k in cust_info) formData.append(k,cust_info[k]);
    /*formData.append("image1", dataURItoBlob(kpicture1_data), {"type": "image/jpeg"});
    formData.append("image2", dataURItoBlob(kpicture2_data), {"type": "image/jpeg"});*/
    formData.append("image1",kpicture1_data)
    formData.append("image2",kpicture2_data)
    console.log(formData["article_name"])
    xhr.onload = function (data) {
      alert(JSON.stringify(data))
    }
    xhr.open("POST", "http://s250217848.online.de/api/public/index.php/transaction/buy", true);    
    xhr.send(formData);
    
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
     alert("Code = " + r.responseCode);
     alert("Response = " + r.response);
     //alert($.parseJSON(r.response))    
 }

 function fail(error) {
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