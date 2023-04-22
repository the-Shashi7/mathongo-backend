const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
        match:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/
      },
      urls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shorturls'
      }],
      isLogined: Boolean,
      isLoginedAt: String,
},{timestamps:true},);

module.exports = mongoose.model('User', userSchema);