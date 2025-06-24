const express = require('express');
const router = express.Router();
const PessoaController = require('../controllers/PessoaController');

router.post('/pessoas', PessoaController.criarPessoa);
router.get('/pessoas', PessoaController.listarPessoas);
router.get('/pessoas/:id', PessoaController.buscarPessoaPorId);
router.put('/pessoas/:id', PessoaController.atualizarPessoa);
router.delete('/pessoas/:id', PessoaController.deletarPessoa);

module.exports = router;
