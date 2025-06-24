const Pessoa = require('../models/Pessoa');
const moment = require('moment');
const { cpf: cpfValidator } = require('cpf-cnpj-validator');

const validarEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const criarPessoa = async (req, res) => {
  try {
    const { nome, cpf, dataNascimento, email } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'O nome é obrigatório.' });
    }

    if (cpf && !cpfValidator.isValid(cpf)) {
      return res.status(400).json({ error: 'CPF inválido.' });
    }

    if (email && !validarEmail(email)) {
      return res.status(400).json({ error: 'Email inválido.' });
    }

    let dataConvertida = dataNascimento;

    if (dataNascimento) {
      const dataMoment = moment(dataNascimento, ['DD/MM/YYYY', 'YYYY-MM-DD'], true);
      if (!dataMoment.isValid()) {
        return res.status(400).json({ error: 'Data de nascimento inválida. Use o formato DD/MM/YYYY ou YYYY-MM-DD.' });
      }
      dataConvertida = dataMoment.format('YYYY-MM-DD');
    }

    const pessoa = await Pessoa.create({
      nome,
      cpf,
      dataNascimento: dataConvertida,
      email
    });

    res.status(201).json(pessoa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const listarPessoas = async (req, res) => {
  const pessoas = await Pessoa.findAll();
  res.json(pessoas);
};

const buscarPessoaPorId = async (req, res) => {
  const { id } = req.params;
  const pessoa = await Pessoa.findByPk(id);
  if (pessoa) {
    res.json(pessoa);
  } else {
    res.status(404).json({ error: 'Pessoa não encontrada' });
  }
};

const atualizarPessoa = async (req, res) => {
  const { id } = req.params;
  const { nome, cpf, dataNascimento, email } = req.body;

  const pessoa = await Pessoa.findByPk(id);

  if (!pessoa) {
    return res.status(404).json({ error: 'Pessoa não encontrada' });
  }

  if (!nome) {
    return res.status(400).json({ error: 'O nome é obrigatório.' });
  }

  if (cpf && !cpfValidator.isValid(cpf)) {
    return res.status(400).json({ error: 'CPF inválido.' });
  }

  if (email && !validarEmail(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  let dataConvertida = dataNascimento;

  if (dataNascimento) {
    const dataMoment = moment(dataNascimento, ['DD/MM/YYYY', 'YYYY-MM-DD'], true);
    if (!dataMoment.isValid()) {
      return res.status(400).json({ error: 'Data de nascimento inválida. Use o formato DD/MM/YYYY ou YYYY-MM-DD.' });
    }
    dataConvertida = dataMoment.format('YYYY-MM-DD');
  }

  await pessoa.update({
    nome,
    cpf,
    dataNascimento: dataConvertida,
    email
  });

  res.json(pessoa);
};

const deletarPessoa = async (req, res) => {
  const { id } = req.params;
  const pessoa = await Pessoa.findByPk(id);
  if (pessoa) {
    await pessoa.destroy();
    res.json({ message: 'Pessoa deletada com sucesso' });
  } else {
    res.status(404).json({ error: 'Pessoa não encontrada' });
  }
};

module.exports = {
  criarPessoa,
  listarPessoas,
  buscarPessoaPorId,
  atualizarPessoa,
  deletarPessoa
};
