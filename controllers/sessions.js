const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model('User');

exports.new = (req, res) => {
  res.render("sessions/new");
};

exports.create = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.authenticate(email, password);
    if (user) {
      var token = jwt.sign({ userId: user._id }, "secretcode");
      res.cookie("token", token, { expires: new Date(Date.now() + 24*60*60*1000), httpOnly: true });
      return res.redirect("/");
    } else {
      res.render("sessions/new", { error: "Wrong email or password. Try again!" });
    }
  } catch (e) {
    return next(e);
  }
};

exports.destroy = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};
