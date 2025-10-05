import React, { useState } from "react";

export default function CriarCanal() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [banner, setBanner] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (!nome || !descricao) {
      alert("Preencha todos os campos!");
      return;
    }

    const novoCanal = {
      id: Date.now(),
      nome,
      descricao,
      banner: banner || "/imagens/banner1.jpg",
      fotoPerfil: fotoPerfil || "/imagens/perfil1.jpg",
      inscritos: 0,
      videos: [],
    };

    const canais = JSON.parse(localStorage.getItem("canais")) || [];
    canais.push(novoCanal);
    localStorage.setItem("canais", JSON.stringify(canais));

    alert("✅ Canal criado com sucesso!");
    window.close();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg border border-pink-200">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">Criar Canal</h2>

        <input
          type="text"
          placeholder="Nome do canal"
          className="w-full border p-2 rounded-lg mb-3 text-black"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <textarea
          placeholder="Descrição do canal"
          className="w-full border p-2 rounded-lg mb-3 text-black"
          rows="3"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <label className="block font-semibold text-sm mb-1 text-pink-600">
          Escolher banner:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, setBanner)}
          className="mb-3"
        />
        {banner && (
          <img
            src={banner}
            alt="Preview banner"
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
        )}

        <label className="block font-semibold text-sm mb-1 text-pink-600">
          Escolher foto de perfil:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, setFotoPerfil)}
          className="mb-3"
        />
        {fotoPerfil && (
          <img
            src={fotoPerfil}
            alt="Preview perfil"
            className="w-20 h-20 rounded-full object-cover mb-3"
          />
        )}

        <button
          onClick={handleCreate}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:opacity-90"
        >
          Criar Canal
        </button>
      </div>
    </div>
  );
}
