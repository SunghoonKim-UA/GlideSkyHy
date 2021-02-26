const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const glider = mongoose.model('glider');

router.post('/login', (req, res) => {
    console.log(req.body);
    console.log(glider.findOne({ user_name: req.body.u_name }));
    var execObj = glider.findOne({ user_name: req.body.u_name })
                        .exec();
    execObj.then(function (glider) {console.log("glider:"+glider)});
          // .then((gliders) => {
          //   console.log("result:"+gliders);
          //   // res.render('success_login', { title: 'Welcome Msg', gliders });
          // })
          // console.log(cnt);
          // .catch(() => { res.send('Sorry! Something went wrong.'); });
    res.send('Sorry! testing...');
    // if (errors.isEmpty()) {
    //   const registration = new Registration(req.body);
    //   registration.save()
    //     .then(() => { res.send('Thank you for your registration!'); })
    //     .catch((err) => {
    //       console.log(err);
    //       res.send('Sorry! Something went wrong.');
    //     });
    // }
    //
    // res.render('form', { title: 'Registration form' });
});

module.exports = router;
