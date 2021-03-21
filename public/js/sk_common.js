function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCurrTitle4(data) {
  $("#currTitle4").html(data);
}

function checkLogin(data)  {
  var id = getCookie("_id");
  if (id != "") {
    setCurrTitle4("Info");
    $("#dlg_logout").html(data);
    $("#dlg_login").html("");
    $("#signUpTitle").hide();
    // console.log("hi");
  } else {
    setCurrTitle4("Log in");
    $("#dlg_login").html(data);
    $("#dlg_logout").html("");
    $("#signUpTitle").show();
    // console.log("bye");
  }
}

function calGap(base, obj1) {
  return Math.abs(obj1-base);
}
