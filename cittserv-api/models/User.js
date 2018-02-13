var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  username: String,
  password: String,
});
module.exports = mongoose.model('User', UserSchema);
