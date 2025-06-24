import { db } from '../database/db.js';

export const registerUser = (req, res) => {
  const { username, email, password } = req.body;

  const q = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  db.query(q, [username, email, password], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no cadastro', error: err });
    }
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  });
};

export const getUsers = (req, res) => {
  const q = "SELECT * FROM users";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
