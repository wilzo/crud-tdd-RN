import React, { useState } from 'react';
import api from '../services/api';

export default function CriarPessoa() {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: ''
  });
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    try {
      await api.post('/pessoas', form);
      setMensagem('Pessoa cadastrada com sucesso!');
      setForm({
        nome: '',
        cpf: '',
        dataNascimento: '',
        email: ''
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErro(error.response.data.error);
      } else {
        setErro('Erro ao salvar pessoa');
      }
    }
  };

  return (
    <div>
      <h2>Cadastrar Pessoa</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
        />
        <input
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          onChange={handleChange}
        />
        <input
          name="dataNascimento"
          placeholder="Data de Nascimento"
          value={form.dataNascimento}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <button type="submit">Cadastrar</button>
      </form>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
    </div>
  );
}
