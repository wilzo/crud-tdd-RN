import React from 'react';
import CriarPessoa from './pages/CriarPessoa';
import ListarPessoas from './pages/ListarPessoas';

function App() {
  return (
    <div>
      <h1>CRUD de Pessoas (TDD)</h1>
      <CriarPessoa />
      <ListarPessoas />
    </div>
  );
}

export default App;
