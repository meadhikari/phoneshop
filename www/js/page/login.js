$(document ).ready(function() {
            $( ".login-btn" ).click(function() {
                if ($( "#username").val() && $( "#password").val())
                {     
                    loginCheck($("#username").val(),$( "#password").val());
                }
                else {
                    console.log("Failed")
                }
            });

    });

	function loginCheck (username, password) {        
    //spinnerplugin.show();
    $.post('http://s250217848.online.de/api/public/index.php/login/gettoken', { email: username+"@something.com", password : password}, 
    function(returnedData){
         //spinnerplugin.hide(); 
         console.log("Yes")
         //alert(JSON.stringify(returnedData))
         if (returnedData.statusCode == 200)
         {
            token = returnedData.token.token_key
            console.log(token)            
            localStorage.token = token;
            window.location="main.html?token="+token;
         }
         else
         {
            alert("Try Again. There was a problem.")
         }
         
    });
   
}

	document.addEventListener("backbutton", onBackKeyDown, false);
	function onBackKeyDown() 
	{
		navigator.app.exitApp();
	}
