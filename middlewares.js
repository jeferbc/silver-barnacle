const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model('User');

// authentication middleware
exports.setUser = (req, res, next) => {
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

exports.requireUser = (req, res, next) => {
  if (!res.locals.user) {
    return res.redirect("/login");
  }
  next();
};
