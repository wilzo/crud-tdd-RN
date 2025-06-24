import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function FormPessoa({ pessoa, onSucesso }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (pessoa) {
      setNome(pessoa.nome || '');
      setCpf(pessoa.cpf || '');
      setDataNascimento(pessoa.dataNascimento || '');
      setEmail(pessoa.email || '');
      setErro(null);
    } else {
      setNome('');
      setCpf('');
      setDataNascimento('');
      setEmail('');
      setErro(null);
    }
  }, [pessoa]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    try {
      if (pessoa && pessoa.id) {
        // Atualizar pessoa
        await api.put(`/pessoas/${pessoa.id}`, {
          nome,
          cpf,
          dataNascimento,
          email,
        });
      } else {
        // Criar nova pessoa
        await api.post('/pessoas', {
          nome,
          cpf,
          dataNascimento,
          email,
        });
      }
      onSucesso();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErro(error.response.data.error);
      } else {
        setErro('Erro ao salvar pessoa');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <div>
        <label>Nome:</label>
        <input value={nome} onChange={e => setNome(e.target.value)} />
      </div>
      <div>
        <label>CPF:</label>
        <input value={cpf} onChange={e => setCpf(e.target.value)} />
      </div>
      <div>
        <label>Data de Nascimento:</label>
        <input value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} placeholder="DD/MM/YYYY ou YYYY-MM-DD" />
      </div>
      <div>
        <label>Email:</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <button type="submit">{pessoa ? 'Atualizar' : 'Criar'}</button>
    </form>
  );
}
