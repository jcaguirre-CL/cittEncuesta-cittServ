var mongoose = require('mongoose');
var CampoSchema = new mongoose.Schema({
  key: String,
  value: String,
});
module.exports = mongoose.model('Campo', CampoSchema);
