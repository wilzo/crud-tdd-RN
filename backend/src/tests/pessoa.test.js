const request = require('supertest');
const express = require('express');
const pessoaRoutes = require('../routes/Pessoa');
const sequelize = require('../config/database');
const Pessoa = require('../models/Pessoa');

const app = express();
app.use(express.json());
app.use('/api', pessoaRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true }); 
});

afterAll(async () => {
  await sequelize.close(); 
});

describe('CRUD Pessoa - Testes TDD', () => {
  let pessoaId; 


  test('Deve criar uma pessoa com data no formato brasileiro DD/MM/YYYY', async () => {
    const response = await request(app)
      .post('/api/pessoas')
      .send({
        nome: 'João Souza',
        cpf: '07698223981',
        dataNascimento: '14/02/2002', // formato brasileiro
        email: 'joao@gmail.com'
      });

    expect(response.status).toBe(201);
    expect(response.body.nome).toBe('João Souza');
    expect(response.body).toHaveProperty('id');
    expect(response.body.dataNascimento).toBeDefined();
  });

  test('Deve falhar ao criar pessoa sem nome', async () => {
    const response = await request(app)
      .post('/api/pessoas')
      .send({
        cpf: '07698225925',
        dataNascimento: '1990-01-01',
        email: 'semnome@gmail.com'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
test('Deve criar uma nova pessoa com data no formato ISO (YYYY-MM-DD)', async () => {
  const response = await request(app)
    .post('/api/pessoas')
    .send({
      nome: 'Maria Silva Lima',
      cpf: '11144477735', 
      dataNascimento: '1995-05-15',
      email: 'maria@gmail.com'
    });

  console.log('RESPONSE BODY:', response.body); 
  expect(response.status).toBe(201);
  expect(response.body.nome).toBe('Maria Silva Lima');
  pessoaId = response.body.id;
});


  test('Deve retornar 404 ao tentar atualizar pessoa inexistente', async () => {
    const response = await request(app)
      .put('/api/pessoas/999999')
      .send({
        nome: 'Pessoa Inexistente',
        cpf: '40556425120',
        dataNascimento: '2000-01-01',
        email: 'inexistente@gmail.com'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  test('Deve deletar pessoa cadastrada', async () => {
    const response = await request(app).delete(`/api/pessoas/${pessoaId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Pessoa deletada com sucesso');
  });

  test('Deve retornar 404 ao tentar deletar pessoa inexistente', async () => {
    const response = await request(app).delete('/api/pessoas/999999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  
  test('Deve listar pessoas cadastradas', async () => {
    const response = await request(app).get('/api/pessoas');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
