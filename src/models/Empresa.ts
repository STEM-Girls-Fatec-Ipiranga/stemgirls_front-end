const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
    nomeEmpresa: String, 
    cpnj: String,
    email: String,
    senha: String,
    telefone: String,
    role: {
        type: String,
        enum: ["EMPRESA", "USUARIO", "MODERADOR"],
        required: true
    },
    status: {
        type: String,
        enum: ["PENDENTE", "APROVADO", "REPROVADO"],
        required: true
    }
});

const Empresa = mongoose.model('Empresa', EmpresaSchema);

module.exports = Empresa;