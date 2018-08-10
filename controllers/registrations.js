const mongoose = require("mongoose");
const User = mongoose.model('User');

exports.new = (req, res) => {
  res.render("registrations/new");
}

exports.create = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const data = {
    email: email,
    password: password
  };

  try {
    const user = await User.create(data);
  } catch (e) {
    console.log(e);
  }
  res.redirect("/login");
}
