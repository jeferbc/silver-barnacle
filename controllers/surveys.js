const mongoose = require("mongoose");
const Survey = mongoose.model('Survey');

exports.index = (req, res) => {
  res.render('surveys', { surveys: Survey.find() })
};

exports.new = (req, res) => {
  res.render("surveys/new")
}

exports.create = async (req, res) => {
  const survey = new Survey(req.body);
  await survey.save()
  res.redirect('/surveys');
};
