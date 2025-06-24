const request = require('supertest');
const express = require('express');
const pessoaRoutes = require('../routes/Pessoa');
const sequelize = require('../config/database');
const Pessoa = require('../models/Pessoa');

const app = express();
app.use(express.json());
app.use('/api', pessoaRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Limpa e cria as tabelas do banco
});

afterAll(async () => {
  await sequelize.close(); // Fecha conexão com banco
});

describe('CRUD Pessoa - Testes TDD', () => {
  let pessoaId; // Guardar ID para testes update/delete

  test('Deve criar uma nova pessoa com data no formato ISO (YYYY-MM-DD)', async () => {
    const response = await request(app)
      .post('/api/pessoas')
      .send({
        nome: 'Maria Silva',
        cpf: '12345678900',
        dataNascimento: '1995-05-15',
        email: 'maria@gmail.com'
      });
    expect(response.status).toBe(201);
    expect(response.body.nome).toBe('Maria Silva');
    pessoaId = response.body.id; // Salva o id para usar depois
  });

  test('Deve listar pessoas cadastradas', async () => {
    const response = await request(app).get('/api/pessoas');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('Deve criar uma pessoa com data no formato brasileiro DD/MM/YYYY', async () => {
    const response = await request(app)
      .post('/api/pessoas')
      .send({
        nome: 'João Souza',
        cpf: '98765432100',
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
        cpf: '11111111111',
        dataNascimento: '1990-01-01',
        email: 'semnome@gmail.com'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // Novo teste para UPDATE
  test('Deve atualizar dados da pessoa', async () => {
    const response = await request(app)
      .put(`/api/pessoas/${pessoaId}`)
      .send({
        nome: 'Maria Silva Atualizada',
        cpf: '12345678900',
        dataNascimento: '1995-05-15',
        email: 'maria_atualizada@gmail.com'
      });

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe('Maria Silva Atualizada');
    expect(response.body.email).toBe('maria_atualizada@gmail.com');
  });

  test('Deve retornar 404 ao tentar atualizar pessoa inexistente', async () => {
    const response = await request(app)
      .put('/api/pessoas/999999')
      .send({
        nome: 'Pessoa Inexistente',
        cpf: '00000000000',
        dataNascimento: '2000-01-01',
        email: 'inexistente@gmail.com'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  // Novo teste para DELETE
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
});
