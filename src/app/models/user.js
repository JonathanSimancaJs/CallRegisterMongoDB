// Modelo para la colección de usuarios

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema =  new mongoose.Schema({
    login: String,
    nameuser: String,
    password: String
});

userSchema.methods.generateHash = function (password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', userSchema);
