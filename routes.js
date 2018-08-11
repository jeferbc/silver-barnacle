const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = mongoose.model('User');
const registrations = require('./controllers/registrations');
const sessions = require('./controllers/sessions');
const surveys = require('./controllers/surveys');

// authentication middleware
const setUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, "secretcode", (err, decoded) => {
      if (err) {
        res.clearCookie("token");
        next();
      } else {
        User.findOne({ _id: decoded.userId }, (err, user) => {
          res.locals.user = user;
          next();
        });
      }
    });
  } else {
    next();
  }
}

const requireUser = (req, res, next) => {
  if (!res.locals.user) {
    return res.redirect("/login");
  }
  next();
};

router.use(setUser);

router.get("/", surveys.index);

router.get("/register", registrations.new);
router.post("/register", registrations.create);
router.get("/login", sessions.new);
router.post("/login", sessions.create);
router.get("/logout", requireUser, sessions.destroy);

router.get("/surveys", surveys.index);
router.get("/surveys/new", requireUser, surveys.new);
router.post("/surveys", requireUser, surveys.create);
router.get("/surveys/:id", surveys.show)

module.exports = router;
