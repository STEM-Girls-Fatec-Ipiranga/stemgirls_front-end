import React, { useState } from "react";

export default function CriarCanais({ setCanais, canais, onClose, setShowNotificacao }) {
  const [nome, setNome] = useState("");
  const [desc, setDesc] = useState("");
  const [banner, setBanner] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  const criar = () => {
    if (!nome.trim() || !desc.trim()) {
      setShowNotificacao("Preencha nome e descrição");
      setTimeout(() => setShowNotificacao(null), 2000);
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", desc);
    if (banner) formData.append("banner", banner);
    if (fotoPerfil) formData.append("fotoPerfil", fotoPerfil);
    formData.append("owner", "me");

    fetch("http://localhost:8080/api/canais", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setCanais([...canais, data]);
        setShowNotificacao("✅ Canal criado!");
        setTimeout(() => setShowNotificacao(null), 2000);
        onClose();
      })
      .catch((err) => {
        console.error("Erro ao criar canal:", err);
        setShowNotificacao("Erro ao criar canal");
        setTimeout(() => setShowNotificacao(null), 2000);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg border border-pink-200 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">Criar Canal</h2>

        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do canal"
          className="w-full border p-2 rounded-lg mb-3"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Descrição"
          className="w-full border p-2 rounded-lg mb-3"
        />

        <label className="font-semibold text-sm mb-1 text-pink-600 block">Banner:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setBanner(file);
              setBannerPreview(URL.createObjectURL(file));
            }
          }}
          className="mb-3"
        />
        {bannerPreview && (
          <img src={bannerPreview} className="w-full h-32 object-cover mb-3 rounded-lg" />
        )}

        <label className="font-semibold text-sm mb-1 text-pink-600 block">Foto de perfil:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFotoPerfil(file);
              setFotoPreview(URL.createObjectURL(file));
            }
          }}
          className="mb-3"
        />
        {fotoPreview && (
          <img src={fotoPreview} className="w-20 h-20 rounded-full object-cover mb-3" />
        )}

        <div className="flex gap-2">
          <button
            onClick={criar}
            className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold"
          >
            Criar
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 py-2 rounded-lg font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
