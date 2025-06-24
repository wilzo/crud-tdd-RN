import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ListarPessoas({ onEditar }) {
  const [pessoas, setPessoas] = useState([]);

  useEffect(() => {
    fetchPessoas();
  }, []);

  async function fetchPessoas() {
    const response = await api.get('/pessoas');
    setPessoas(response.data);
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/pessoas/${id}`);
      fetchPessoas();
    } catch (error) {
      alert('Erro ao deletar pessoa');
      console.error(error);
    }
  }

  return (
    <div>
      <h2>Lista de Pessoas</h2>
      <ul>
        {pessoas.map(pessoa => (
          <li key={pessoa.id}>
            {pessoa.nome} - {pessoa.email}{' '}
            <button onClick={() => onEditar(pessoa)}>Editar</button>{' '}
            <button onClick={() => handleDelete(pessoa.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
