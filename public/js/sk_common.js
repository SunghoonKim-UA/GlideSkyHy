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
  if( getCookie("user_type") == 'pilot' ) {
    $("#titlePLV").show();
    $("#titleFlight").show();
    $("#titleViewHist").show();
    $("#titleClearClicks").show();
    $("#titleVidCall").show();
    $("#titleSave").show();
  } else {
    $("#titlePLV").hide();
    $("#titleFlight").hide();
    $("#titleViewHist").hide();
    $("#titleClearClicks").hide();
    $("#titleVidCall").hide();
    $("#titleSave").hide();
  }
  $("#titleProf").show();
  $("#titleSignUp").hide();
  console.log("hi");
}
function afterLogout(data) {
  setCurrTitle4("Log in");
  $("#dlg_login").html(data);
  $("#dlg_logout").html("");
  $("#titleSignUp").show();
  $("#titlePLV").hide();
  $("#titleFlight").hide();
  $("#titleViewHist").hide();
  $("#titleClearClicks").hide();
  $("#titleVidCall").hide();
  $("#titleSave").hide();
  $("#titleProf").hide();
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
