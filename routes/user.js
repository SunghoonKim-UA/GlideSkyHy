const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const glider = mongoose.model('glider');
const testWrite = mongoose.model('test');
const location = mongoose.model('location');

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

router.get('/getMyInfo', (req, res) => {
    console.log(req.path+":"+req.cookies._id);
      var execObj = location.findOne({fly_object: req.cookies._id}).exec();
      execObj.then(function (glider) {
        console.log(req.path+":"+"glider:"+glider)
        if(glider == null)  {
          console.log("glider not found in location db");
        }
        res.status(200).send(glider);
        
      });
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

router.post('/signup', (req, res) => {
    console.log("signup :"+req.param("new_name"));
    // check duplicate user_name
    const new_glider = new glider();
    var validat_msg = "";
    var execObj = glider.findOne({ user_name: req.body.new_name })
                        .exec();
    execObj.then(function (glider) {
      if(glider != null)  {
        validat_msg = "Choose another username";
      } else {
        new_glider.user_name = req.body.new_name;
        new_glider.password  = req.body.new_passwd;
        new_glider.color     = req.body.new_color;
        new_glider.save();
      }

      res.status(200).send("{ \"msg\" : \""+validat_msg+"\" }"); // send json msg
    });
});

module.exports = router;
