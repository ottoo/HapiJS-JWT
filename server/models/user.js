var Mongoose = require('mongoose');

var userSchema = new Mongoose.Schema({
    name: { firstName: { type: String, required: true }, lastName: { type: String, required: true }},
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    twitter: { type: String },
    facebook: { type: String },
    homepage: { type: String },
    age: { type: Number, required: true },
    dateCreated: { type: Date, required: true, default: Date.now }
});

var User = Mongoose.model('User', userSchema);

exports.User = User;
