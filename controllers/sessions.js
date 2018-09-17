const mongoose = require("mongoose");
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
      req.session.userId = user._id;
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
