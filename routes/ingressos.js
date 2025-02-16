const express = require('express');
const jwt = require('jsonwebtoken');
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

router.get('/', autenticar, async (req, res) => {
  const ingressos = await Ingresso.find();
  res.render('ingressos', { ingressos });
});

router.post('/adicionar', autenticar, async (req, res) => {
  if (!req.usuario.admin) return res.status(403).send('Acesso negado');

  const { nome, preco, quantidade } = req.body;
  await Ingresso.create({ nome, preco, quantidade });
  res.redirect('/ingressos');
});

router.post('/editar/:id', autenticar, async (req, res) => {
  if (!req.usuario.admin) return res.status(403).send('Acesso negado');

  const { nome, preco, quantidade } = req.body;
  await Ingresso.findByIdAndUpdate(req.params.id, { nome, preco, quantidade });
  res.redirect('/ingressos');
});

router.post('/deletar/:id', autenticar, async (req, res) => {
  if (!req.usuario.admin) return res.status(403).send('Acesso negado');

  await Ingresso.findByIdAndDelete(req.params.id);
  res.redirect('/ingressos');
});

module.exports = router;
