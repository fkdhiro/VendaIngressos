const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  admin: { type: Boolean, default: false }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
