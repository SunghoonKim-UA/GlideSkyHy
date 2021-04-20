var tmr_gc;
var overlayObjList = [];

function initMap() {
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

  // MouseEvent = click
  map.addListener("click", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
  });

  google.maps.event.addListener(map, 'bounds_changed', function() {
      drawMap();
  });
  tmr_gc = setInterval(drawMap, 5000); // 5sec
}

function initGroundCrew() {
  initGCObj();
  clearInterval(tmr_gc);
  tmr_gc = null;
  console.log("initGroundCrew");
}
function initGCObj()      {
  overlayObjList.forEach(remove_ovrly);
  function remove_ovrly(value, index, array) {
    if( value instanceof google.maps.Marker ) {
      value.setMap(null);
    } else {
      value.close();
    }
  }
  // to hold redrawing objects
  overlayObjList = [];
}

function drawMap() {
  initGCObj();
  if(tmr_gc!=null)  {
    $.get("/glider/getCurrGlider", { lat_s: map.getBounds().getSouthWest().lat(), lat_e: map.getBounds().getNorthEast().lat()
                                   , lng_s: map.getBounds().getSouthWest().lng(), lng_e: map.getBounds().getNorthEast().lng() })
     .done(function(data){
        jQuery.each(data, function( index, value ) { // for each: index in data update glider position
          let image_gc = "/img/glider.png";
          var location_gc = new google.maps.LatLng(value.position[0], value.position[1]);

          var icon_gc = {
                    url: image_gc, // url
                    scaledSize: new google.maps.Size(100, 100) // size
                    // rotation: [45]
                };

          const feature_gc =  {
                             position: location_gc,
                             type: "groundcrew",
                           };
          function addMarkerGc(feature) {
            var marker = new google.maps.Marker({
              position: feature_gc.position,
              icon: icon_gc,
              map: map,
            });
            return marker;
          }

          glider_icon_gc = addMarkerGc(feature_gc);

          var contentString =  '<font color='+value.fly_object[0].color+'>Name: ' + value.name + "<br>" + value.position[2]+' ft ' +  "<br>" + value.position[3]+' knts</font>';

          var infowindowGc = new google.maps.InfoWindow({
               content: contentString
          });

          infowindowGc.open(map,glider_icon_gc);

          overlayObjList.push(glider_icon_gc);
          overlayObjList.push(infowindowGc);
        });
      });
  }
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
