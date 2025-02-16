const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();


dotenv.config();

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

router.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) return res.send('Usuário já cadastrado');
  
  const senhaHash = await bcrypt.hash(senha, 10);
  await Usuario.create({ nome, email, senha: senhaHash });
  res.redirect('/auth/login');
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    return res.send('Login inválido');
  }

  const token = jwt.sign({ id: usuario._id, admin: usuario.admin }, process.env.JWT_SECRET, { expiresIn: '1h' });
  req.session.token = token;
  res.redirect('/ingressos');
});

module.exports = router;