const express = require('express');
const jwt = require('jsonwebtoken');
const Compra = require('../models/Compra');
const Ingresso = require('../models/Ingresso');
const router = express.Router();

function autenticar(req, res, next) {
  const token = req.session.token;
  if (!token) return res.redirect('/auth/login');

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.redirect('/auth/login');
  }
}

router.get('/', autenticar, (req, res) => {
  res.redirect('/compras/historico');
});

router.post('/comprar', autenticar, async (req, res) => {
  const { ingressoId, quantidade } = req.body;
  
  try {
    const ingresso = await Ingresso.findById(ingressoId);
    if (!ingresso || ingresso.quantidade < quantidade) {
      return res.send('Estoque insuficiente');
    }

    ingresso.quantidade -= quantidade;
    await ingresso.save();

    await Compra.create({
      usuarioId: req.usuario.id,
      ingressos: [{ tipo: ingressoId, quantidade }]
    });

    res.redirect('/compras/historico');
  } catch (error) {
    res.status(500).send('Erro ao processar a compra');
  }
});

router.get('/historico', autenticar, async (req, res) => {
  try {
    const compras = await Compra.find({ usuarioId: req.usuario.id }).populate('ingressos.tipo');
    res.render('historico', { compras });
  } catch (error) {
    res.status(500).send('Erro ao carregar histórico de compras');
  }
});

module.exports = router;
