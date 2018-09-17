const mongoose = require("mongoose");
const Poll = mongoose.model('Poll');

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
  const polls = await Poll.find().populate('user');
  res.render('polls/index', { polls, truncate });
};

exports.new = (req, res) => {
  res.render("polls/new")
}

exports.create = async (req, res, next) => {
  const poll = new Poll(req.body);
  poll.user = res.locals.user._id;
  try {
    await poll.save();

    req.flash("success", "The poll was created successfully");
    res.redirect(`/polls/${poll._id}/results`);
  } catch(e) {
    if (e.name == "ValidationError") {
      res.render("polls/new", { errors: e.errors });
    } else {
      return next(e);
    }
  }
};

exports.show = async (req, res) => {
  const poll = await Poll.findOne({ _id: req.params.id });
  res.render("polls/show", { poll, flash: req.flash });
}

exports.vote = async (req, res) => {
  const answer = req.body.answer;

  const poll = await Poll.findOne({ _id: req.params.id });
  poll.options[answer].votes += 1;
  await poll.save();

  res.redirect(`/polls/${poll._id}/results`);
}

exports.results = async (req, res) => {
  const poll = await Poll.findOne({ _id: req.params.id });
  res.render("polls/results", { poll: poll, encodeURI: encodeURI });
}

exports.remove = async (req, res) => {
  await Poll.deleteOne({ _id: req.params.id });
  res.status(204).send({});
};
