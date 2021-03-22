const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const glider = mongoose.model('glider');
const location = mongoose.model('location');
const history = mongoose.model('flight_history');
const testWrite = mongoose.model('test');
const realtime_tracking = mongoose.model('realtime_tracking_db');

// Fetch from location table in specific region with lat long conditions
router.get('/getCurrGlider', (req, res) => {
    console.log("getCurrGlider:"+req.query.lat_s+":"+req.query.lat_e+":"+req.query.lng_s+":"+req.query.lng_e);
    if(req.query.lat_s == undefined || req.query.lat_s > 180 || req.query.lat_s < -180
     ||req.query.lat_e == undefined || req.query.lat_e > 180 || req.query.lat_e < -180
     ||req.query.lng_s == undefined || req.query.lng_s > 180 || req.query.lng_s < -180
     ||req.query.lng_e == undefined || req.query.lng_e > 180 || req.query.lng_e < -180)  {
      console.log("Invalid lat and lng");
      res.status(500).send({ error: 'Invalid lat and lng' })
    } else {
      var execObj = location.find({ 'position.0': { $gte: req.query.lat_s, $lte: req.query.lat_e }
                                  , 'position.1': { $gte: req.query.lng_s, $lte: req.query.lng_e } })
                            .populate('fly_object')
                            .exec();

      execObj.then(function (location) {
        console.log(req.path+":"+"location:"+location);
        location.forEach(function (locationDoc){
          const newTestEntry = new testWrite();
          newTestEntry.Name = locationDoc.name;
          newTestEntry.timestamp = new Date();
          newTestEntry.lat = locationDoc.position[0];
          newTestEntry.lng = locationDoc.position[1];
          newTestEntry.alt = locationDoc.position[2];
          newTestEntry.vertical_speed = locationDoc.position[3];
          newTestEntry.save();
        })

        res.status(200).send(location); // send json location data to client
      });

    }
});



router.get('/Database_History_Read', (req, res) => {
    console.log("Database_History_Read:"+req.query.name);

    var execObj = history.find({ 'Name': req.query.name })
                         // .limit(10)
                         .sort({ timestamp: 1 })
                         .exec();

    execObj.then(function (history) {
      console.log("Database_History_Read history:"+history);
      res.status(200).send(history); // send json history data to client
    });
});



router.get('/Location_Current_Read', (req, res) => {
    console.log("Location_Current_Read:"+req.query.name);

    var execObj = location.find({ 'Name': req.query.name })
                         .limit(1)
                         .exec();

    execObj.then(function (location) {
      console.log("Location_Current_Read location:"+location);
      res.status(200).send(location); // send json location data to client
    });
});



router.post('/Flight_History_Write', (req, res) => {
    console.log("Flight_History_Write: "+req.body.Name + " " + req.body.lat+ " " + req.body.lng+ " " + req.body.alt+ " " + req.body.vertical_speed);

    const newHistoryEntry = new history();
    newHistoryEntry.Name = req.body.Name;
    newHistoryEntry.timestamp = new Date();
    newHistoryEntry.lat = req.body.lat;
    newHistoryEntry.lng = req.body.lng;
    newHistoryEntry.alt = req.body.alt;
    newHistoryEntry.vertical_speed = req.body.vertical_speed;
    newHistoryEntry.save();

});


router.post('/Location_Update', (req, res) => {
    console.log("Location_Update: "+req.body.Name + " " + req.body.lat+ " " + req.body.lng+ " " + req.body.alt+ " " + req.body.vertical_speed);

    var execObj = location.findOneAndUpdate({name: req.body.Name}, {$set:{name:req.body.Name, position: [req.body.lat, req.body.lng, req.body.alt, req.body.vertical_speed] }}, {new: true}, (err, doc) => {
    if (err) {
        console.log("Something wrong when updating data!");
    }

    console.log(doc);
});

});



router.post('/Realtime_Tracking_Write', (req, res) => {
    console.log("Realtime_Tracking_Write: "+req.body.Name + " " + req.body.lat+ " " + req.body.lng+ " " + req.body.alt+ " " + req.body.vertical_speed);

    const newRealtimeEntry = new realtime_tracking();
    newRealtimeEntry.Name = req.body.Name;
    newRealtimeEntry.timestamp = new Date();
    newRealtimeEntry.lat = req.body.lat;
    newRealtimeEntry.lng = req.body.lng;
    newRealtimeEntry.alt = req.body.alt;
    newRealtimeEntry.vertical_speed = req.body.vertical_speed;
    newRealtimeEntry.save();

});




router.get('/genData', (req, res) => {
    console.log("genData");
    location.deleteMany({ name: "Sunghoon" }).exec();
    history.deleteMany({ Name: "Sunghoon" }).exec();
    location.deleteMany({ name: "Aishr" }).exec();
    history.deleteMany({ Name: "Aishr" }).exec();

    const location_mock = new location();
    location_mock.name = "Aishr";
    location_mock.position = [32.45, -111.42, 830, 10];
    location_mock.save();

    const hist_mock = new history();
    hist_mock.Name = "Aishr"; hist_mock.lat = 32.45; hist_mock.lng = -111.42; hist_mock.alt = 830; hist_mock.vertical_speed = 10; hist_mock.timestamp = new Date((new Date()).getTime()-( 5*60*1000));
    hist_mock.save();
    const hist_mock1 = new history();
    hist_mock1.Name = "Aishr"; hist_mock1.lat = 32.452; hist_mock1.lng = -111.426; hist_mock1.alt = 830; hist_mock1.vertical_speed = 10; hist_mock1.timestamp = new Date((new Date()).getTime()-(10*60*1000));
    hist_mock1.save();
    const hist_mock2 = new history();
    hist_mock2.Name = "Aishr"; hist_mock2.lat = 32.451; hist_mock2.lng = -111.424; hist_mock2.alt = 830; hist_mock2.vertical_speed = 10; hist_mock1.timestamp = new Date((new Date()).getTime()-(15*60*1000));
    hist_mock2.save();

    res.status(200).send("Generate mockdata successfully"); // send json location data to client
});

module.exports = router;