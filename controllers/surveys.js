const mongoose = require("mongoose");
const Survey = mongoose.model('Survey');

const truncate = (text, length) => {
  if (text.length > length) {
    return `${text.substring(0, length - 5)} ...`;
  }
  return text;
}

const encodeURI = (text) => {
  return encodeURIComponent(text);
}

exports.index = async (req, res) => {
  const surveys = await Survey.find().populate('user');
  res.render('surveys/index', { surveys: surveys, truncate: truncate });
};

exports.new = (req, res) => {
  res.render("surveys/new")
}

exports.create = async (req, res, next) => {
  const survey = new Survey(req.body);
  survey.user = res.locals.user._id;
  try {
    await survey.save()
  } catch(e) {
    if (e.name == "ValidationError") {
      res.render("surveys/new", { errors: e.errors });
      return;
    } else {
      return next(e);
    }
  }

  res.redirect(`/surveys/${survey._id}/results`);
};

exports.show = async (req, res) => {
  const survey = await Survey.findOne({ _id: req.params.id });
  res.render("surveys/show", { survey });
}

exports.vote = async (req, res) => {
  const answer = req.body.answer;

  const survey = await Survey.findOne({ _id: req.params.id });
  survey.options[answer].votes += 1;
  await survey.save();

  res.redirect(`/surveys/${survey._id}/results`);
}

exports.results = async (req, res) => {
  const survey = await Survey.findOne({ _id: req.params.id });
  res.render("surveys/results", { survey: survey, encodeURI: encodeURI });
}

exports.remove = async (req, res) => {
  await Survey.deleteOne({ _id: req.params.id });
  res.status(204).send({});
};
