const mongoose = require('mongoose');

const IngressoSchema = new mongoose.Schema({
  nome: String,
  preco: Number,
  quantidade: Number
});

module.exports = mongoose.model('Ingresso', IngressoSchema);
