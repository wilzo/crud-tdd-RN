const express = require('express');
const sequelize = require('./config/database');
const pessoaRoutes = require('./routes/Pessoa');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Coloque o cors antes das rotas para habilitar CORS nelas
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

// Rotas
app.use('/api', pessoaRoutes);

// Sincroniza o banco e inicia o servidor
sequelize.sync().then(() => {
  console.log('Banco de dados conectado e tabelas sincronizadas.');
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch((err) => {
  console.error('Erro ao conectar ao banco:', err);
});
