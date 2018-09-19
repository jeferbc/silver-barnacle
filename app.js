const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require('cookie-session');
const flash = require("flash");
const path = require('path');
require("./models/Poll");
require("./models/User");
const routes = require('./routes');

const assets = require("connect-assets");
require('mincer-babel')(assets.Mincer);

const app = express();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/polls', { useNewUrlParser: true });

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({ secret: process.env.SECRET || "secretcode" }));
app.use(flash());
app.use(assets());

app.use('/', routes);

module.exports = app;
