const mongoose = require("mongoose");
const Survey = mongoose.model('Survey');

exports.index = async (req, res) => {
  const surveys = await Survey.find();
  res.render('surveys/index', { surveys: surveys, res: res });
};

exports.new = (req, res) => {
  res.render("surveys/new")
}

exports.create = async (req, res) => {
  const survey = new Survey(req.body);
  try {
    await survey.save()
  } catch(err) {
    console.log(err)
  }

  res.redirect('/surveys');
};
