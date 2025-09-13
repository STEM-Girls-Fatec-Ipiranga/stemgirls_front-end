const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nomeCompleto: String,
  nomeUsuario: String,
  email: String,
  senha: String,
  joinDate: {
    type: Date,
    default: Date.now
  },
  profileImage: String
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;