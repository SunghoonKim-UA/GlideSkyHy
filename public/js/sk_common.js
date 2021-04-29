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

function rotated_glider(param_point) {
  var degree_div_45 = Math.atan2(param_point.y, param_point.x) * 180 / Math.PI / 45;
  console.log("degree_div_45:"+param_point.y+"//"+param_point.x+"//"+Math.atan2(param_point.y, param_point.x) * 180 / Math.PI);
  var rot_icon = "glider_0.png"
  if(degree_div_45 >= 1 && degree_div_45 < 2) rot_icon = "glider_45.png";
  if(degree_div_45 >= 2 && degree_div_45 < 3) rot_icon = "glider_90.png";
  if(degree_div_45 >= 3 && degree_div_45 < 4) rot_icon = "glider_135.png";
  if(degree_div_45 >= 4 && degree_div_45 < 5) rot_icon = "glider_180.png";
  if(degree_div_45 >= 5 && degree_div_45 < 6) rot_icon = "glider_225.png";
  if(degree_div_45 >= 6 && degree_div_45 < 7) rot_icon = "glider_270.png";
  if(degree_div_45 >= 7 && degree_div_45 < 8) rot_icon = "glider_315.png";
  return {
            url: '/img/'+rot_icon, // url
            scaledSize: new google.maps.Size(100, 100) // size
        };
}
