
function initMap() {
  var overlayObjList = [];
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: curr_lat, lng: curr_lng },
    zoom: 14.4,
    mapTypeId: "satellite",
  });

  // comment out for now
  //elevator = new google.maps.ElevationService();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
            //lat: position.coords.latitude,
          //lng: position.coords.longitude,
          lat: 32.428646,
          lng: -111.389273,
        };
        map.setCenter(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  /**
   * The custom GliderOverlay object contains the Glider image+name+altitude+path,
   * the bounds of the image, and a reference to the map.
   */
  class GliderOverlay extends google.maps.OverlayView {
    constructor(curr_location, image, name, alt, vert_speed, color, path) {
      super();
      this.lat = curr_location[0];
      this.lng = curr_location[1];
      this.image = image;
      this.name = name;
      this.alt = alt;
      this.vert_speed = vert_speed;
      this.color = color;
      this.path = path;
      this.min_lat = this.lat;
      this.max_lat = this.lat;
      this.min_lng = this.lng;
      this.max_lng = this.lng;

      for(var ii=0;ii<path.length;ii++) {
        if(this.min_lat > path[ii].lat) this.min_lat = path[ii].lat;
        if(this.max_lat < path[ii].lat) this.max_lat = path[ii].lat;
        if(this.min_lng > path[ii].lng) this.min_lng = path[ii].lng;
        if(this.max_lng < path[ii].lng) this.max_lng = path[ii].lng;
      }
    }
    /**
     * canvas objects includes current_glider and glider's path together
     *   current_glider : image + location label
     *   glider's path(max 10) : circle
     * next, locate objects and make segments at draw method
     */
    onAdd() {
      // 0. div
      this.div = document.createElement("div");
      this.div.style.borderStyle = "none";
      this.div.style.borderWidth = "0px";
      // this.div.style.borderColor = "black";
      this.div.style.position = "absolute";

      // 1. canvas
      this.canvas = document.createElement("canvas");
      this.div.appendChild(this.canvas);

      // Add the element to the "overlayLayer" pane.
      const panes = this.getPanes();
      panes.overlayLayer.appendChild(this.div);
    }
    draw() {
      const label_width = 70, label_height = 65, history_width = 6;
      const overlayProjection = this.getProjection();
      // 0. fix the size&location of div&canvas
      const nw_point = overlayProjection.fromLatLngToDivPixel(
        new google.maps.LatLng(this.max_lat, this.min_lng)
      );
      const se_point = overlayProjection.fromLatLngToDivPixel(
        new google.maps.LatLng(this.min_lat, this.max_lng)
      );
      // console.log("nw_point:"+this.max_lat+"//"+this.min_lng+"//"+nw_point.x+"//"+(nw_point.y));
      // console.log("se_point:"+this.min_lat+"//"+this.max_lng+"//"+se_point.x+"//"+(se_point.y));
      // Resize div to fit the indicated dimensions.
      if (this.div) {
        this.div.style.left = (nw_point.x-history_width) + "px";
        this.div.style.top = (nw_point.y-history_width) + "px";
        this.div.style.width  = calGap(se_point.x, nw_point.x)+label_width+history_width*2 + "px";
        this.div.style.height = calGap(nw_point.y, se_point.y)+history_width*2 + "px";
        this.canvas.style.left = (nw_point.x-history_width) + "px";
        this.canvas.style.top = (nw_point.y-history_width) + "px";
        this.canvas.width  = calGap(se_point.x, nw_point.x)+label_width+history_width*2; // to stretch label_width
        this.canvas.height = calGap(nw_point.y, se_point.y)+history_width*2;
        // console.log("div size:"+this.div.style.left+"//"+this.div.style.top+"//"+this.div.style.width+"//"+this.div.style.height);
      }
      // console.log("lat/lng:"+this.max_lat+"//"+this.min_lat+"//"+this.max_lng+"//"+this.min_lng+"//"+this.lat+"//"+this.lng);
      // 1. add current_glider
      const point = overlayProjection.fromLatLngToDivPixel(
        new google.maps.LatLng(this.lat, this.lng)
      );
      const point_x = calGap(point.x, nw_point.x+history_width);
      const point_y = calGap(point.y, nw_point.y+history_width);
      // console.log("point:"+this.lat+"//"+this.lng+"//"+point.x+"//"+(point.y));

      var stage = new createjs.Stage(this.canvas);
      // 1.1 location label : div element for name&alt and attach it to the div.
      var text_bg = new createjs.Shape();
      text_bg.graphics.beginFill(this.color).drawRect(point_x-1.2*label_width, point_y+1/4*label_width, label_width, label_height);
      stage.addChild(text_bg);
      var text = new createjs.Text(this.name+"\n"+this.alt+" ft"+"\n"+this.vert_speed+" knts", "20px Times", "#000000");
      text.x = point_x+history_width-1.2*label_width;
      text.y = point_y+1/2*history_width+1/4*label_width;
      stage.addChild(text);

      // 1.2 image : div element for name&alt and attach it to the div.
      var glider_icon = new createjs.Bitmap(this.image);
      glider_icon.scaleX = 1/3; glider_icon.scaleY = 1/3;
      glider_icon.regX = 44;
      glider_icon.regY = 58;
      glider_icon.x = point_x;
      glider_icon.y = point_y+label_height;
      // add shadow by glider's height
      glider_icon.shadow = new createjs.Shadow("#000000", this.alt/200, this.alt/200, 10);

      // 2. add glider's path and segments
      var seq = 0;
      // start path!
      var path_asis_x, path_asis_y;
      var path1 = new createjs.Shape();
      const color1 = this.color;

      jQuery.each(this.path, function( index, value ) { // for each: index in data update glider position
        seq++;
        const history_point = overlayProjection.fromLatLngToDivPixel(
          new google.maps.LatLng(value.lat, value.lng)
        );

        // add path
        if(seq>1) {
          path1.graphics.setStrokeStyle(10).beginStroke("red")
               .moveTo(path_asis_x, path_asis_y).lineTo(calGap(history_point.x, nw_point.x)+history_width, calGap(history_point.y, nw_point.y)+history_width);
          path1.alpha = 0.3;
          stage.addChild(path1);
        }
        path_asis_x = calGap(history_point.x, nw_point.x)+history_width;
        path_asis_y = calGap(history_point.y, nw_point.y)+history_width;

        // add circle
        var history_bg = new createjs.Shape();
        history_bg.graphics.beginFill("#FFFFFF").drawCircle(calGap(history_point.x, nw_point.x)+history_width, calGap(history_point.y, nw_point.y)+history_width, history_width);
        stage.addChild(history_bg);

        // add initial
        //var history_text = new createjs.Text(value.Name.substring(0,1)+seq, "10px Times", color1);
        //history_text.x = calGap(history_point.x, nw_point.x)+history_width/2;
       // history_text.y = calGap(history_point.y, nw_point.y)+history_width/2;
        //stage.addChild(history_text);
      });
      // path connecting recent history and current location
      //path1.graphics.setStrokeStyle(10).beginStroke("red")
      //     .moveTo(path_asis_x, path_asis_y).lineTo(glider_icon.x, glider_icon.y);
     // path1.alpha = 0.3;
      //stage.addChild(path1);

      // tilt current location's glider_icon
      var deltaX = glider_icon.x - path_asis_x;
      var deltaY = glider_icon.y - path_asis_y;
      var rad = Math.atan2(deltaY, deltaX);
      var deg = rad * (180 / Math.PI);
      glider_icon.rotation = deg;
      stage.addChild(glider_icon);

      stage.update();
    }

    /**
     * The onRemove() method will be called automatically from the API if
     * we ever set the overlay's map property to 'null'.
     */
    onRemove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        delete this.div;
      }
    }
    /**
     *  Set the visibility to 'hidden' or 'visible'.
     */
    hide() {
      if (this.div) {
        this.div.style.visibility = "hidden";
      }
    }
    show() {
      if (this.div) {
        this.div.style.visibility = "visible";
      }
    }
    toggle() {
      if (this.div) {
        if (this.div.style.visibility === "hidden") {
          this.show();
        } else {
          this.hide();
        }
      }
    }
    toggleDOM(map) {
      if (this.getMap()) {
        this.setMap(null);
      } else {
        this.setMap(map);
      }
    }
  }

  let image = "../img/glider.png";

  redraw();

  function redraw() {
    // setInterval(setTimeout(redraw, 5000)); // 5 sec
    // init overlay list
    // console.log("overlayObjList.length:"+overlayObjList.length);
    overlayObjList.forEach(remove_ovrly);
    function remove_ovrly(value, index, array) {
      value.toggleDOM(map);
      // console.log("remove_ovrly:"+value.name+"//"+value.lat+"//"+value.lng+"//"+index+"//"+array);
    }
    // to hold redrawing objects
    overlayObjList = [];

    //$.get("/getCurrGlider", { lat_s: curr_lat-1, lat_e: curr_lat+1, lng_s: curr_lng-1, lng_e: curr_lng+1 }).done(function(data){ // use loc data @ done func
    $.get("/glider/getCurrGlider", { lat_s: 32, lat_e: 33, lng_s: -112, lng_e: -109 })
    .done(function(data){
      jQuery.each(data, function( index, value ) { // for each: index in data update glider position

        var hist = [];
        $.get("/glider/Database_History_Read", { name: value.name })
        .done(function(data_history){
          // data_history : sort later
          //document.write(data_history);
          let i = 0;
          jQuery.each(data_history, function( index_n, value_n ) {
            // "i == 0" means current glider's position using GliderOverlay
            if(i==0)  {
               // setInterval(setTimeout(nextPosition, 5000, value_n)); // 5 sec
            } else {
              // param : lat, lng, image, name, alt, vert_speed, seq
              // model : Name: String, timestamp: Date, lat: Number, lng: Number, alt: Number, vertical_speed: Number,
              hist.push(value_n);
            }
            i++;
          });
          const overlay = new GliderOverlay(value.position, image, value.name, value.position[2], value.position[3], value.fly_object[0].color, hist);
          overlay.setMap(map);
          overlayObjList.push(overlay);
        });

        //setInterval(nextPosition, 15000); // 5 sec

      });
    });
  }






  // MouseEvent = click
  map.addListener("click", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
  });

  

}



function placeMarkerAndPanTo(latLng, map) {
  const marker = new google.maps.Marker({ // create new marker for clicked location
    position: latLng,
    map: map,
  });
  map.panTo(latLng);

  click_markers.push(marker);

}
  

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (let i = 0; i < click_markers.length; i++) {
    click_markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}



// Sets the map on all markers in the array.
function setMapOnAll_RealTime(map) {
  for (let i = 0; i < realtime_markers.length; i++) {
    realtime_markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearRealTimeMarkers() {
  setMapOnAll_RealTime(null);
}



// Sets the map on all markers in the array.
function setMapOnAll_FlightHistory(map) {
  for (let i = 0; i < flighthistory_markers.length; i++) {
    flighthistory_markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearFlightHistoryMarkers() {
  setMapOnAll_FlightHistory(null);
}


