const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const glider = mongoose.model('glider');
const location = mongoose.model('location');
const history = mongoose.model('flight_history');

router.get('/getCurrSt', (req, res) => {
    console.log(req.path+":"+req.cookies._id);
    if(req.cookies._id == null || req.cookies._id == undefined)  {
      res.render("login");
    } else {
      var execObj = glider.findById(req.cookies._id).exec();
      execObj.then(function (glider) {
        console.log(req.path+":"+"glider:"+glider)
        if(glider == null)  {
          res.render("login");
        } else {
          res.render("success_login", {user_name : glider.user_name});
        }
      });
    }
});

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
                            .exec();
      execObj.then(function (location) {
        console.log(req.path+":"+"location:"+location);
        res.status(200).send(location); // send json location data to client 
      });
    }
});

router.get('/logout', (req, res) => {
    console.log(req.path+":"+req.cookies._id);
    res.clearCookie('_id');
    res.render("login");
});

router.post('/login', (req, res) => {
    console.log(req.path+":"+req.body);
    // console.log(glider.findOne({ user_name: req.body.u_name, password: req.body.pass_wd }));
    var execObj = glider.findOne({ user_name: req.body.u_name, password: req.body.pass_wd })
                        .exec();
    execObj.then(function (glider) {
      console.log(req.path+":"+"glider:"+glider)
      if(glider == null)  {
        res.render("login", {message : "Invalid Username and Password"});
      } else {
        res.cookie('_id',glider._id);
        res.render("success_login", {user_name : glider.user_name});
      }
    });
});

module.exports = router;



router.get('/Database_History_Read', (req, res) => {
    console.log("Database_History_Read:"+req.query.name);
    
    var execObj = history.find({ 'Name': req.query.name })
                          .exec();

    execObj.then(function (history) {
      console.log("Database_History_Read history:"+history);
      res.status(200).send(history); // send json location data to client 
    });
});



