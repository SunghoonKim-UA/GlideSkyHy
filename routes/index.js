const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const glider = mongoose.model('glider');

router.post('/login', (req, res) => {
    console.log(req.body);
    let cnt = glider.findOne({ user_name: "\""+req.body.u_name+"\"" }).exec();
    console.log(cnt);
    res.send('Sorry! testing.');
      // .then((gliders) => {
      //   res.render('success_login', { title: 'Welcome Msg', gliders });
      // })
      // .catch(() => { res.send('Sorry! Something went wrong.'); });
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
