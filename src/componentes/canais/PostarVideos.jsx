import React, { useState, useRef } from "react";

export default function PostarVideos({
  canais,
  setCanais,
  onClose,
  canalSelecionado,
  setCanalSelecionado,
  setShowNotificacao,
}) {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [desc, setDesc] = useState("");
  const [canalDestino, setCanalDestino] = useState(canalSelecionado?.id || "");
  const [mostrarPopup, setMostrarPopup] = useState(false);

  const arquivoInput = useRef();
  const thumbInput = useRef();

  // Vídeo preview (blob url)
  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setVideoPreview(blobUrl);
    setVideoFile(file);
  };

  // Thumb preview + salvar arquivo pra enviar
  const handleThumbChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbFile(file);
    const reader = new FileReader();
    reader.onload = () => setThumbPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const publicar = () => {
    if (!videoFile || !titulo.trim() || !canalDestino) {
      setShowNotificacao("Escolha vídeo, título e canal");
      setTimeout(() => setShowNotificacao(null), 2000);
      return;
    }

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("title", titulo);
    formData.append("desc", desc);
    formData.append("canalId", canalDestino);
    formData.append("owner", "me");

    // envia thumb se houver
    if (thumbFile) formData.append("thumb", thumbFile);

    // NÃO setar content-type: fetch cuidará do multipart/form-data com boundary
    fetch("http://localhost:8080/api/videos", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        // se backend devolve 201 sem json, trate isso; tentar parsear json com fallback
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          try {
            return JSON.parse(text || "{}");
          } catch {
            throw new Error("Resposta inesperada do servidor");
          }
        }
      })
      .then((data) => {
        // data deve ser o objeto do vídeo criado, contendo id, title, thumb (url ou caminho), url, canalId, createdAt...
        setShowNotificacao("✅ Vídeo enviado com sucesso!");
        setTimeout(() => setShowNotificacao(null), 2000);

        // Disparar evento para o componente Canais atualizar o feed imediatamente
        try {
          window.dispatchEvent(new CustomEvent("videos:created", { detail: data }));
        } catch (e) { /* fallback silencioso */ }

        onClose();
      })
      .catch((err) => {
        console.error("Erro ao enviar vídeo:", err);
        setShowNotificacao("Erro ao publicar vídeo");
        setTimeout(() => setShowNotificacao(null), 2000);
      });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-6 rounded-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh] border border-pink-200">
          <h2 className="text-2xl font-bold mb-4 text-center">Publicar Novo Vídeo</h2>

          <label className="block mb-2 font-semibold text-sm text-pink-600">Vídeo:</label>
          <input type="file" accept="video/*" ref={arquivoInput} onChange={handleVideoChange} className="mb-3" />

          {videoPreview && (
            <div className="relative cursor-pointer group" onClick={() => setMostrarPopup(true)}>
              <video src={videoPreview} className="w-full h-48 object-cover rounded-lg mb-4" muted />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-xl opacity-0 group-hover:opacity-100 rounded-lg transition">
                ▶ Clique para visualizar
              </div>
            </div>
          )}

         {/* 
        <label className="block mb-2 font-semibold text-sm text-pink-600">Thumbnail:</label>
        <input type="file" accept="image/*" ref={thumbInput} onChange={handleThumbChange} className="mb-3" />
        {thumbPreview && <img src={thumbPreview} alt="thumbnail" className="w-full h-32 object-cover rounded-lg mb-4" />}
        */}

          <input type="text" placeholder="Título do vídeo" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full mb-4 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700" />

          <textarea placeholder="Descrição do vídeo" value={desc} onChange={(e) => setDesc(e.target.value)} className="mb-3 w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700" />

          <select value={canalDestino} onChange={(e) => setCanalDestino(e.target.value)} className="mb-4 w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700">
            <option value="">Selecione o canal</option>
            {canais.filter((c) => c.owner === "me").map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>

          <div className="flex gap-3">
            <button onClick={publicar} className="w-full bg-[#F36EC0] text-white py-2 rounded-lg font-semibold">Publicar</button>
            <button onClick={onClose} className="w-full bg-gray-200 py-2 rounded-lg font-semibold">Cancelar</button>
          </div>
        </div>
      </div>

      {mostrarPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[999] flex items-center justify-center p-4">
          <div className="bg-black p-4 rounded-lg relative max-w-4xl w-full">
            <video src={videoPreview} controls autoPlay className="w-full rounded-lg max-h-[80vh]" />
            <button onClick={() => setMostrarPopup(false)} className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-black px-3 py-1 rounded-lg font-bold">✕</button>
          </div>
        </div>
      )}
    </>
  );
}
