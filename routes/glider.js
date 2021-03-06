const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const glider = mongoose.model('glider');
const flight = mongoose.model('flight');
const location = mongoose.model('location');
const images = mongoose.model('images');
const realtime_tracking = mongoose.model('realtime_tracking_db');

const {v4: uuidV4} = require('uuid');

function toNumber1(param)  {
  if(param == null) return 0;
  else if(isNaN(param)) return 0;
  else return Number(param);
}

// Fetch from location table in specific region with lat long conditions
router.get('/getCurrGlider', (req, res) => {
    console.log("getCurrGlider:"+req.query.lat_s+":"+req.query.lat_e+":"+req.query.lng_s+":"+req.query.lng_e);
    if(req.query.lat_s == undefined || req.query.lat_s > 180 || req.query.lat_s < -180
     ||req.query.lat_e == undefined || req.query.lat_e > 180 || req.query.lat_e < -180
     ||req.query.lng_s == undefined || req.query.lng_s > 180 || req.query.lng_s < -180
     ||req.query.lng_e == undefined || req.query.lng_e > 180 || req.query.lng_e < -180)  {
      console.log("Invalid lat and lng");
      res.status(500).send({ error: 'Invalid lat and lng' });
    } else {
      var execObj = location.find({ 'position.0': { $gte: req.query.lat_s, $lte: req.query.lat_e }
                                  , 'position.1': { $gte: req.query.lng_s, $lte: req.query.lng_e } })
                            .populate('fly_object')   // join to "glider"
                            // .populate('fly_object')
                            .exec();

      execObj.then(function (location) {
         console.log(req.path+":"+"location:"+location);

        res.status(200).send(location); // send json location data to client
      });

   }
});

router.get('/getallGliders', (req, res) => {
  //console.log("getallGliders:"+req.query.lat_s+":"+req.query.lat_e+":"+req.query.lng_s+":"+req.query.lng_e);
  // if(req.query.lat_s == undefined || req.query.lat_s > 180 || req.query.lat_s < -180
  //  ||req.query.lat_e == undefined || req.query.lat_e > 180 || req.query.lat_e < -180
  //  ||req.query.lng_s == undefined || req.query.lng_s > 180 || req.query.lng_s < -180
  //  ||req.query.lng_e == undefined || req.query.lng_e > 180 || req.query.lng_e < -180)  {
  //   console.log("Invalid lat and lng");
  //   res.status(500).send({ error: 'Invalid lat and lng' });
  // } else {
    var execObj = location.find()//{
                                 // 'position.0': { $gte: req.query.lat_s, $lte: req.query.lat_e }
                                //, 'position.1': { $gte: req.query.lng_s, $lte: req.query.lng_e } })
                                //.populate('fly_object')
                          .exec();
    execObj.then(function (location) {
      console.log(req.path+":"+"location:"+location);
      res.status(200).send(location); // send json location data to client
    });

  //}
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


router.get('/Flight_Read', (req, res) => {
    console.log(req.path+":"+req.cookies._id, req.query.page_no);
      var page_no = 0;
      if(req.query.page_no != null && req.query.page_no != 'undefined') {
        page_no = req.query.page_no-1;
      }
      // applied paging for less burden in client
      flight.countDocuments({user_id: req.cookies._id, end:{$ne:null}}, function (err, count) {
        var execObj = flight.find({user_id: req.cookies._id, end:{$ne:null}})
                            .limit(7)
                            .skip(page_no*7)
                            .sort({start: -1})
                            .exec();
        execObj.then(function (glider) {
          console.log(req.path+":"+"glider:"+glider);
          if(glider == null)  {
            console.log("glider not found in location db");
          }
          console.log("Flight_Read: "+glider);
          res.status(200).json({total_cnt:count, glider:glider});

        });
      });
});




router.get('/Realtime_Tracking_Read_FlightId', (req, res) => {
    console.log(req.path+": "+req.query.flight_id);
      var execObj = realtime_tracking.find({flight_id: req.query.flight_id}).exec();
      execObj.then(function (glider) {
        console.log(req.path+":"+"glider: "+glider);
        if(glider == null)  {
          console.log("glider not found in location db");
        }
        console.log(req.path+": "+glider);
        res.status(200).send(glider);

      });
});



router.post('/Location_Update', (req, res) => {
    console.log("Location_Update: "+req.body.name + " " + req.body.lat+ " " + req.body.lng+ " " + req.body.alt+ " " + req.body.vertical_speed);

    // var execObj = location.findOneAndUpdate({name: req.body.Name}, {$set:{name:req.body.Name, position: [req.body.lat, req.body.lng, req.body.alt, req.body.vertical_speed] }}, {new: true}, (err, doc) => {
    location.findOneAndUpdate({name: req.body.name}, {$set:{position: [toNumber1(req.body.lat), toNumber1(req.body.lng), toNumber1(req.body.alt), toNumber1(req.body.vertical_speed)] }}, {new: true}, (err, doc) => {
        if (err) {
            console.log("You might be a groundcrew, so no updating!");
            console.log("Something wrong when updating data!");
        } else {
          console.log("Location_Update: " + doc);
        }
    });
    res.status(200).send("Location update successfully"); // send response

});



router.post('/Realtime_Tracking_Write', (req, res) => {
    console.log("Realtime_Tracking_Write: "+req.body.lat+ " " + req.body.lng+ " " + req.body.alt+ " " + req.body.vertical_speed);

    const newRealtimeEntry = new realtime_tracking();
    newRealtimeEntry.Name = req.cookies.user_name;
    newRealtimeEntry.flight_id = req.body.flight_id;
    newRealtimeEntry.timestamp = new Date();
    newRealtimeEntry.lat = req.body.lat;
    newRealtimeEntry.lng = req.body.lng;
    newRealtimeEntry.alt = req.body.alt;
    newRealtimeEntry.vertical_speed = req.body.vertical_speed;
    newRealtimeEntry.save(function(){
      // piggyback and update our info in location as well
      location.findOneAndUpdate({name: req.cookies.user_name}, {$set:{position: [Number(req.body.lat), Number(req.body.lng), Number(req.body.alt), Number(req.body.vertical_speed)] }}, {new: true}, (err, doc) => {
      if (err) {
          console.log("You might be a groundcrew, so no updating!");
          console.log("Something wrong when updating data!");
      } else {
        console.log("Location_Update: " + doc);
      }
      });

      res.status(200)
         .send("Write successfully"); // send response
    });
});





router.post('/Flight_Write', (req, res) => {
    console.log("Flight_Write: "+req.cookies._id + " " +req.body.flight_id + " " + req.body.start+ " " + req.body.end+ " " + req.body.duration);

    const newflight = new flight();
    newflight.user_id = req.cookies._id;
    newflight.flight_id = req.body.flight_id;
    newflight.start = req.body.start;
    // newflight.end = req.body.end;
    // newflight.duration = req.body.duration;
    newflight.save(function() {
      // update recent_flight_id to glider
      glider.findOneAndUpdate({_id: newflight.user_id}, {$set:{recent_flight_id:newflight._id}}, {new: true}, (err, doc) => {
          if (err) {
              console.log("Something wrong when updating data! in Flight_Write");
          }

          console.log(doc);
      });

      res.status(200).json({ "flight_id" : newflight._id }); // send response
    });
});



router.post('/Flight_End', (req, res) => {
    console.log("Flight_End: "+req.body.flight_id + " " + req.body.end+ " " + req.body.duration);

    flight.findOneAndUpdate({_id: req.body.flight_id}, {$set:{end:req.body.end, duration:req.body.duration}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data! in Flight_End");
        }
        console.log(doc);

        res.status(200).send("Write successfully"); // send response
    });
});




router.post('/screenshot', (req, res) => {
    console.log("/screenshot: "+req.body.box + " " + req.body.screenshot);



    res.status(200).send("Write successfully"); // send response
});



router.get('/videocall', (req, res) => {
    console.log(req.path+"  :");

    res.redirect(`/videocall/${uuidV4()}`);

});





router.get('/Images_Read', (req, res) => {
    console.log(req.path+"  : "+req.cookies.user_name);

    var execObj = images.find({ 'name': req.cookies.user_name }).exec();

    execObj.then(function (images) {
      //console.log("Location_Current_Read location:"+location);
      res.status(200).send(images); // send json images data to client
    });
});





router.post('/Images_Write', (req, res) => {
    console.log(req.path+"  :   "+ req.body.image_url);
    //console.log(req.path+"  : ");

    const newImages = new images();
    newImages.name = req.cookies.user_name;
    newImages.image_url = req.body.image_url;
    newImages.save();

    res.status(200)
       .send("Write successfully"); // send response
});




// router.get('/genData', (req, res) => {
//     console.log("genData");
//     location.deleteMany({ name: "Sunghoon" }).exec();
//     history.deleteMany({ Name: "Sunghoon" }).exec();
//     location.deleteMany({ name: "Aishr" }).exec();
//     history.deleteMany({ Name: "Aishr" }).exec();
//
//     const location_mock = new location();
//     location_mock.name = "Aishr";
//     location_mock.position = [32.45, -111.42, 830, 10];
//     location_mock.save();
//
//     const hist_mock = new history();
//     hist_mock.Name = "Aishr"; hist_mock.lat = 32.45; hist_mock.lng = -111.42; hist_mock.alt = 830; hist_mock.vertical_speed = 10; hist_mock.timestamp = new Date((new Date()).getTime()-( 5*60*1000));
//     hist_mock.save();
//     const hist_mock1 = new history();
//     hist_mock1.Name = "Aishr"; hist_mock1.lat = 32.452; hist_mock1.lng = -111.426; hist_mock1.alt = 830; hist_mock1.vertical_speed = 10; hist_mock1.timestamp = new Date((new Date()).getTime()-(10*60*1000));
//     hist_mock1.save();
//     const hist_mock2 = new history();
//     hist_mock2.Name = "Aishr"; hist_mock2.lat = 32.451; hist_mock2.lng = -111.424; hist_mock2.alt = 830; hist_mock2.vertical_speed = 10; hist_mock1.timestamp = new Date((new Date()).getTime()-(15*60*1000));
//     hist_mock2.save();
//
//     res.status(200).send("Generate mockdata successfully"); // send response
// });

module.exports = router;
