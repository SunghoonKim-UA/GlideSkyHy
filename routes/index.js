const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const glider = mongoose.model('glider');

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
        res.render("login", {message : "Invalid ID/PWD"});
      } else {
        res.cookie('_id',glider._id);
        res.render("success_login", {user_name : glider.user_name});
      }
    });
});

module.exports = router;
