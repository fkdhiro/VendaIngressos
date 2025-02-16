const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const ingressoRoutes = require('./routes/ingressos');
const compraRoutes = require('./routes/compras');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado')).catch(err => console.error(err));

app.use('/auth', authRoutes);
app.use('/ingressos', ingressoRoutes);
app.use('/compras', compraRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));