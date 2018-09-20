const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, "is required"]
  },
  description: {
    type: String,
    required: [true, "is required"]
  },
  options: {
    type: [{
      text: {
        type: String,
        required: [true, "is required"]
      },
      votes: {
        type: Number,
        default: 0
      }
    }],
    validate: [v => v.length > 1, 'at least two options are required']
  }
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

module.exports = mongoose.model("Poll", schema);
