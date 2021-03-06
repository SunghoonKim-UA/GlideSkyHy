const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const glider = mongoose.model('glider');
const flight = mongoose.model('flight');
// const testWrite = mongoose.model('test');
const location = mongoose.model('location');
// const realtime_tracking = mongoose.model('realtime_tracking_db');

function toNumber1(param)  {
  if(param == null) return 0;
  else if(isNaN(param)) return 0;
  else return Number(param);
}

router.get('/getCurrSt', (req, res) => {
    console.log(req.path+":"+req.cookies._id);
    if(req.cookies._id == null || req.cookies._id == undefined)  {
      res.render("login");
    } else {
      var execObj = glider.findById(req.cookies._id).exec();
      execObj.then(function (glider) {
        console.log(req.path+":"+"glider:"+glider);
        if(glider == null)  {
          res.render("login");
        } else {
          res.render("success_login", {user_name : glider.user_name});
        }
      });
    }
});

router.get('/getMyInfo', (req, res) => {
    console.log(req.path+":"+req.cookies._id);
      var execObj = location.findOne({fly_object: req.cookies._id}).exec();
      execObj.then(function (glider) {
        console.log(req.path+":"+"glider:"+glider);
        if(glider == null)  {
          console.log("glider not found in location db");
        }
        res.status(200).send(glider);

      });
});

router.get('/flightHistory', (req, res) => {
    console.log(req.path+": "+req.query.user_id);
    var execObj = flight.find({user_id: req.query.user_id}).exec();
    execObj.then(function (glider) {
      console.log(req.path+":"+"glider:  "+glider);
      if(glider == null)  {
        console.log("glider not found in location db");
      }
      res.status(200).send(glider);
    });
});


router.get('/logout', (req, res) => {
    console.log(req.path+":"+req.cookies._id);
    location.findOneAndDelete({fly_object: req.cookies._id}).exec();
    res.clearCookie('_id');
    res.clearCookie('user_name');
    res.clearCookie('user_type');
    res.render("login");

});

router.post('/login', (req, res) => {
    console.log(req.path+":"+req.body);
    // console.log(glider.findOne({ user_name: req.body.u_name, password: req.body.pass_wd }));
    var execObj = glider.findOne({ user_name: req.body.u_name, password: req.body.pass_wd })
                        .exec();
    execObj.then(function (glider) {
      console.log(req.path+":"+"glider:"+glider);
      if(glider == null)  {
        res.render("login", {message : "Invalid Username and Password"});
      } else {
        res.cookie('_id',glider._id);
        res.cookie('user_name',glider.user_name);
        res.cookie('user_type',glider.type);

        if(glider.type == "pilot"){
          const newTestEntry = new location();
          newTestEntry.name = req.body.u_name;
          newTestEntry.position[0] = toNumber1(req.body.lat);
          newTestEntry.position[1] = toNumber1(req.body.lng);
          newTestEntry.position[2] = toNumber1(req.body.alt);
          newTestEntry.position[3] = 0;
          newTestEntry.fly_object = glider._id;
          newTestEntry.type = glider.type;
          newTestEntry.save();
        }
        res.render("success_login", {user_name : glider.user_name});
        // res.status(200).send(location); // send json location data to client
      }
  });

});

router.post('/signup', (req, res) => {
    console.log("signup :"+req.body.new_name);
    // check duplicate user_name
    const new_glider = new glider();
    var validat_msg = "";
    var execObj = glider.findOne({ user_name: req.body.new_name })
                        .exec();
    execObj.then(function (glider) {
      if(glider != null)  {
        validat_msg = "Choose another username";
      } else {
        new_glider.type      = req.body.new_type;
        new_glider.user_name = req.body.new_name;
        new_glider.password  = req.body.new_passwd;
        new_glider.color     = req.body.new_color;
        new_glider.save();
      }

      res.status(200).json({ "msg" : validat_msg }); // send json msg
    });
});

router.post('/profile_write', (req, res) => {
    console.log("profile_write :"+req.body.prof_passwd);
    // check duplicate user_name
    // update recent_flight_id to glider
    var validat_msg = "";
    glider.findOneAndUpdate({_id: req.cookies._id}, {$set:{password:req.body.prof_passwd, color:req.body.prof_color}}, {new: true}, (err) => {
        if (err) {
            validat_msg = "Something wrong when updating data! in profile_write";
        }

        // console.log(doc);
    });

    res.status(200).json({ "msg" : validat_msg }); // send json msg
});

router.get('/profile_read', (req, res) => {
    console.log(req.path+":"+req.cookies._id);
      var execObj = glider.findOne({_id: req.cookies._id}).exec();
      execObj.then(function (glider) {
        console.log(req.path+":"+"glider:"+glider);
        if(glider == null)  {
          console.log("glider not found in location db");
        }
        res.status(200).send(glider);

      });
});



module.exports = router;
