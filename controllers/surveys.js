const mongoose = require("mongoose");
const Survey = mongoose.model('Survey');

const truncate = (text, length) => {
  if (text.length > length) {
    return `${text.substring(0, length - 5)} ...`;
  }
  return text;
}

exports.index = async (req, res) => {
  const surveys = await Survey.find();
  res.render('surveys/index', { surveys: surveys, truncate: truncate });
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

exports.show = async (req, res) => {
  const survey = await Survey.findOne({ _id: req.params.id });
  res.render("surveys/show", { survey: survey });
}
