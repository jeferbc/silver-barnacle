const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    votes: {
      type: Number,
      default: 0
    }
  }]
});

schema.methods.votes = function() {
  let sum = 0;
  this.options.forEach((option) => sum += option.votes);
  return sum;
};

schema.methods.optionPercentage = function(index) {
  const totalVotes = this.votes();
  if (totalVotes > 0) {
    return (this.options[index].votes / totalVotes) * 100;
  }
  return 0;
}

module.exports = mongoose.model("Survey", schema);
