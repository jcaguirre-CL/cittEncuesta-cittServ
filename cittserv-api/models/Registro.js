var mongoose = require('mongoose');
var RegistroSchema = new mongoose.Schema({
  operador: String,
  ranking: String,
  comentario: String,
  correo: String,
  fechaevento: { type: Date, default: Date.now },
}, { collection: 'cittCollection' });
module.exports = mongoose.model('Registro', RegistroSchema);

// var dataSchema = new Schema({..}, { collection: 'data' })