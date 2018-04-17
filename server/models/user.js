const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema({
  name: { firstName: { type: String, required: true }, lastName: { type: String, required: true } },
  username: {
    type: String, required: true, index: true, unique: true
  },
  password: { type: String, required: true },
  dateCreated: { type: Date, required: true, default: Date.now }
});

const User = Mongoose.model('User', userSchema);

exports.User = User;
