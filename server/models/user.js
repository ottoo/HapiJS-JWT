var Mongoose = require('mongoose');

var userSchema = new Mongoose.Schema({  
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    dateCreated: { type: Date, required: true, default: Date.now },
});

var User = Mongoose.model('User', userSchema);

exports.User = User; 