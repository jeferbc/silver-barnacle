const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("./models/Survey");
require("./models/User");
const routes = require('./routes');

const app = express();
mongoose.connect('mongodb://localhost:27017/surveys', { useNewUrlParser: true });

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', routes);

app.listen(3000, () => console.log("Listening on port 3000 ..."));
