const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nomeCompleto: String,
  nomeUsuario: String,
  email: String,
  senha: String,
  sobre: String,
  imagemPerfil: String,
  role: {
    type: String,
    enum: ["EMPRESA","USUARIO", "MODERADOR"],
    required: true,
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;