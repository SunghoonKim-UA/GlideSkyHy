const express = require('express');
const path = require('path');
const routes_user = require('./routes/user');
const routes_glider = require('./routes/glider');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/user/',   routes_user);
app.use('/glider/', routes_glider);
app.use(express.static(path.join(__dirname, './public')));

module.exports = app;
