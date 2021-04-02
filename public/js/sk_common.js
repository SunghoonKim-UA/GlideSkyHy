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

function afterLogin(data) {
  setCurrTitle4("Info");
  $("#dlg_logout").html(data);
  $("#dlg_login").html("");
  $("#titleGCV").hide();
  $("#titleSignUp").hide();
  $("#titleFlight").show();
  $("#titleViewHist").show();
  console.log("hi");
}
function afterLogout(data) {
  setCurrTitle4("Log in");
  $("#dlg_login").html(data);
  $("#dlg_logout").html("");
  $("#titleGCV").show();
  $("#titleSignUp").show();
  $("#titleFlight").hide();
  $("#titleViewHist").hide();
  console.log("bye");
}

function checkLogin(data)  {
  var id = getCookie("_id");
  if (id != "") {
    afterLogin(data);
  } else {
    afterLogout(data);
  }
}

function calGap(base, obj1) {
  return Math.abs(obj1-base);
}
