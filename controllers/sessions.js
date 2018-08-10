const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model('User');

exports.new = (req, res) => {
  res.render("sessions/new");
};

exports.create = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.authenticate(email, password, (err, user) => {
    if (err || !user) {
      const err = new Error("Wrong email or password");
      err.status = 401;
      return next(err);
    } else {
      var token = jwt.sign({ userId: user._id }, "secretcode");
      res.cookie("token", token, { expires: new Date(Date.now() + 900000), httpOnly: true });
      return res.redirect("/");
    }
  });
};

exports.destroy = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};
