$( document ).ready(function() {
  //localStorage.clear(); // comment this in production
  if (localStorage.getItem("token"))
  {
    $.post('http://s250217848.online.de/api/public/index.php/login/tokenverify', { token: localStorage.getItem("token")}, 
      function(returnedData){
        if(returnedData.statusCode === 200)
        {
          window.location="main.html";       
        }
        else
        {
          window.location="login.html";       
        }
        
      });

  }
  else
  {
    window.location="login.html";


  }
});

