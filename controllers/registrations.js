const mongoose = require("mongoose");
const User = mongoose.model('User');

exports.new = (req, res) => {
  res.render("registrations/new");
}

exports.create = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const data = {
    email: email,
    password: password
  };

  try {
    const user = await User.create(data);
    res.redirect("/login");
  } catch (e) {
    if (e.name == "ValidationError") {
      res.render("registrations/new", { errors: e.errors });
    } else {
      return next(e);
    }
  }
}
