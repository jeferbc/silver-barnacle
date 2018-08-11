const mongoose = require("mongoose");
const Survey = mongoose.model('Survey');

exports.index = async (req, res) => {
  const surveys = await Survey.find();
  res.render('surveys/index', { surveys: surveys });
};

exports.new = (req, res) => {
  res.render("surveys/new")
}

exports.create = async (req, res) => {
  console.log(req.body);
  const survey = new Survey(req.body);
  try {
    await survey.save()
  } catch(err) {
    console.log(err)
  }

  res.redirect('/surveys');
};

exports.show = async (req, res) => {
  const survey = await Survey.findOne({ _id: req.params.id });
  res.render("surveys/show", { survey: survey });
}
