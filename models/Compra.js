const mongoose = require('mongoose');

const CompraSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  ingressos: [{ tipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingresso' }, quantidade: Number }],
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Compra', CompraSchema);
