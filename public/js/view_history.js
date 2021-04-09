function initMapHistory() {
  var overlayObjList = [];
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: curr_lat, lng: curr_lng },
    zoom: 14.4,
    mapTypeId: "satellite",
  });

  class AnimateOverlay extends google.maps.OverlayView {
    constructor() {
      super();
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
      if (this.div) {
        this.div.style.left = "0px";
        this.div.style.top = "0px";
        this.div.style.width  = "700px";
        this.div.style.height = "100px";
        this.canvas.style.left = "0px";
        this.canvas.style.top = "0px";
        this.canvas.width  = "700";
        this.canvas.height = "100";
      }

  		var stage, circle;

			stage = new createjs.Stage(this.canvas);

			circle = new createjs.Shape();
			circle.graphics.beginFill("red").drawCircle(0, 0, 40);
			circle.y = 50;
			stage.addChild(circle);
      createjs.Ticker.on("tick", tick);
			createjs.Ticker.setFPS(30);
  
  		function tick(event) {
  			circle.x = circle.x + 5;
  			if (circle.x > stage.canvas.width) { circle.x = 0; }
  			stage.update(event); // important!!
  		}
  
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

  const overlay1 = new AnimateOverlay();
  overlay1.setMap(map);
}
