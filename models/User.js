const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// hashes the password
schema.pre("save", function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

// used for authentication
schema.statics.authenticate = (email, password, cb) => {
  mongoose.model("User").findOne({ email: email }, (err, user) => {
    if (err) {
      return cb(err);
    } else if (!user) {
      const err = new Error("User not found");
      err.status = 401
      return cb(err);
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result === true) {
        return cb(null, user);
      } else {
        return cb();
      }
    });
  })
};

module.exports = mongoose.model("User", schema);
