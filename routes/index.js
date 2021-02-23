const express = require('express');
// const mongoose = require('mongoose');
const router = express.Router();
// const Glider = mongoose.model('Glider');

router.post('/login', (req, res) => {
    console.log(req.body);
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
