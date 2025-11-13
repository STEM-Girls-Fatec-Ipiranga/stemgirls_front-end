// src/pages/Canais.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Plus, CheckCircle } from "lucide-react";
import CriarCanais from "./CriarCanais";
import PostarVideos from "./PostarVideos";

export default function Canais() {
  // --- estados principais ---
  const [canais, setCanais] = useState([]);
  const [search, setSearch] = useState("");
  const [inscritos, setInscritos] = useState([]);
  const [canalSelecionado, setCanalSelecionado] = useState(null);
  const [abrirCriarCanal, setAbrirCriarCanal] = useState(false);
  const [abrirPostarVideo, setAbrirPostarVideo] = useState(false);
  const [showNotificacao, setShowNotificacao] = useState(null);

  const playableUrlCache = useRef(new Map());

  const canaisPadrao = [
    {
      id: 1,
      nome: "Tech World",
      descricao: "Dicas de tecnologia",
      banner: "/src/assets/img/FundoSGcolorido.jpg",
      fotoPerfil: "/src/assets/img/katherine-johnson.jpg",
      inscritos: 823,
      videos: [],
      owner: "system",
    },
    {
      id: 2,
      nome: "Mundo Gamer",
      descricao: "Gameplay e notícias",
      banner: "/src/assets/img/FundoSGcolorido.jpg",
      fotoPerfil: "/src/assets/img/grace-hopper.jpg",
      inscritos: 2310,
      videos: [],
      owner: "system",
    },
  ];

  // --- carregar canais e inscritos ---
  useEffect(() => {
    fetch("http://localhost:8080/api/canais")
      .then((res) => res.json())
      .then((data) => setCanais(data))
      .catch((err) => {
        console.error("Erro ao buscar canais:", err);
        setCanais(canaisPadrao);
      });

    setInscritos(JSON.parse(localStorage.getItem("inscritos_v2")) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("canais_all", JSON.stringify(canais));
  }, [canais]);

  useEffect(() => {
    localStorage.setItem("inscritos_v2", JSON.stringify(inscritos));
  }, [inscritos]);

  const getPlayableUrl = useCallback((url) => {
    if (!url) return null;
    if (url.startsWith("data:")) {
      const cached = playableUrlCache.current.get(url);
      if (cached) return cached;
      const arr = url.split(",");
      const mime = arr[0].match(/data:([^;]+)/)[1];
      const bstr = atob(arr[1]);
      const u8arr = new Uint8Array(bstr.length);
      for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
      const obj = URL.createObjectURL(new Blob([u8arr], { type: mime }));
      playableUrlCache.current.set(url, obj);
      return obj;
    }
    return url;
  }, []);

  // --- inscrições ---
  const toggleInscricao = (id) => {
    const ja = inscritos.includes(id);
    const novos = ja ? inscritos.filter((x) => x !== id) : [...inscritos, id];
    setInscritos(novos);
    setCanais((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, inscritos: ja ? c.inscritos - 1 : c.inscritos + 1 }
          : c
      )
    );
  };

  // --- feed geral ---
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error("Erro ao buscar vídeos:", err));
  }, []);

  const feedVideos = videos.sort(
    (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
  );

  // --- vídeos do canal selecionado ---
  const [videosCanal, setVideosCanal] = useState([]);

  useEffect(() => {
    if (!canalSelecionado) return;
    fetch(`http://localhost:8080/api/videos/canal/${canalSelecionado.id}`)
      .then((res) => res.json())
      .then((data) => setVideosCanal(data))
      .catch((err) => console.error("Erro ao buscar vídeos do canal:", err));
  }, [canalSelecionado]);

  // --- excluir canal ---
  const excluirCanal = (id) => {
    const canal = canais.find((c) => c.id === id);
    if (canal?.owner !== "me") {
      setShowNotificacao("Não é possível excluir canais do sistema");
      setTimeout(() => setShowNotificacao(null), 2000);
      return;
    }
    if (!window.confirm("Tem certeza que deseja excluir este canal?")) return;
    fetch(`http://localhost:8080/api/canais/${id}`, { method: "DELETE" })
      .then(() => {
        setCanais((prev) => prev.filter((c) => c.id !== id));
        if (canalSelecionado?.id === id) setCanalSelecionado(null);
        setShowNotificacao("Canal excluído!");
        setTimeout(() => setShowNotificacao(null), 2000);
      })
      .catch((err) => {
        console.error("Erro ao excluir canal:", err);
        setShowNotificacao("Erro ao excluir canal");
        setTimeout(() => setShowNotificacao(null), 2000);
      });

    if (canalSelecionado?.id === id) setCanalSelecionado(null);
  };

  const canaisFiltrados = search.trim()
    ? canais.filter((c) => c.nome.toLowerCase().includes(search.toLowerCase()))
    : [];
  const meusCanais = canais.filter((c) => c.owner === "me");
  const meusInscritos = canais.filter((c) => inscritos.includes(c.id));
  const sugeridos = canais.filter((c) => !inscritos.includes(c.id));

  return (
    <div className="flex h-screen bg-[#FFF6FF] text-black">
      {/* Sidebar */}
      <aside className="w-72 bg-[#FFF6FF] border-r border-pink-50 p-4 flex flex-col">
        <button
          onClick={() => setAbrirCriarCanal(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-semibold mb-4 flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Criar Canal
        </button>

        {/* Busca */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar canal..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 shadow-inner bg-gray-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Resultados */}
        {search.trim() && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Resultados</h3>
            {canaisFiltrados.length ? (
              <ul className="space-y-2 max-h-40 overflow-auto">
                {canaisFiltrados.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-2 p-2 hover:bg-pink-50 rounded-lg cursor-pointer"
                    onClick={() => {
                      setCanalSelecionado(c);
                      setSearch("");
                    }}
                  >
                    <img
                      src={c.fotoPerfil}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-semibold text-sm">{c.nome}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Nenhum canal encontrado.</p>
            )}
          </div>
        )}

        {/* Meus canais */}
        <h3 className="text-lg font-bold mb-2">Meus Canais</h3>
        {meusCanais.length ? (
          <ul className="space-y-2">
            {meusCanais.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-2 p-2 hover:bg-pink-50 rounded-lg cursor-pointer"
                onClick={() => setCanalSelecionado(c)}
              >
                <img
                  src={c.fotoPerfil}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-semibold">{c.nome}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Você ainda não criou canais.</p>
        )}

        {/* Inscritos */}
        <h3 className="text-lg font-bold mt-6 mb-2">Canais inscritos</h3>
        {meusInscritos.length ? (
          <ul className="space-y-2">
            {meusInscritos.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-2 p-2 hover:bg-pink-50 rounded-lg cursor-pointer"
                onClick={() => setCanalSelecionado(c)}
              >
                <img
                  src={c.fotoPerfil}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-semibold">{c.nome}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Você ainda não se inscreveu.</p>
        )}

        {/* Sugeridos */}
        <h3 className="text-lg font-bold mt-6 mb-2">Sugeridos</h3>
        <ul className="space-y-2">
          {sugeridos.slice(0, 6).map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-2 p-2 hover:bg-pink-50 rounded-lg cursor-pointer"
              onClick={() => setCanalSelecionado(c)}
            >
              <img
                src={c.fotoPerfil}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-semibold">{c.nome}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto p-6">
        {canalSelecionado ? (
          <div>
            <button
              onClick={() => setCanalSelecionado(null)}
              className="text-pink-600 mb-4"
            >
              ← Voltar
            </button>
            <img
              src={canalSelecionado.banner}
              className="w-full h-48 rounded-xl object-cover mb-4"
            />
            <div className="flex items-center gap-4 mb-3">
              <img
                src={canalSelecionado.fotoPerfil}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold">{canalSelecionado.nome}</h2>
                <p className="text-gray-600">
                  {canalSelecionado.inscritos} inscritos
                </p>
              </div>
              <button
                onClick={() => toggleInscricao(canalSelecionado.id)}
                className={`ml-auto px-4 py-2 rounded-lg font-semibold ${
                  inscritos.includes(canalSelecionado.id)
                    ? "bg-gray-200 text-gray-700"
                    : "bg-pink-500 text-white"
                }`}
              >
                {inscritos.includes(canalSelecionado.id)
                  ? "Inscrito"
                  : "Inscrever-se"}
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setAbrirPostarVideo(true)}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Publicar Vídeo
              </button>
              {canalSelecionado.owner === "me" && (
                <button
                  onClick={() => excluirCanal(canalSelecionado.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Excluir Canal
                </button>
              )}
            </div>

            {/* vídeos do canal */}
            <div>
              <h3 className="text-xl font-bold mb-3">Vídeos do Canal</h3>
              {videosCanal.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videosCanal.map((v, i) => (
  <article
    key={i}
    className="bg-white rounded-xl shadow-md border border-pink-100 relative"
  >
    <video
      src={getPlayableUrl(v.url)}
      controls
      className="w-full h-44 object-cover"
    />
    <div className="p-4">
      <div className="font-semibold">{v.title}</div>
      <p className="text-sm text-gray-600 mb-2">{v.desc}</p>

      {/* Botão excluir - só aparece se o canal for meu */}
      {canalSelecionado.owner === "me" && (
        <button
          onClick={() => {
            if (!window.confirm("Deseja excluir este vídeo?")) return;
            fetch(`http://localhost:8080/api/videos/${v.id}`, {
              method: "DELETE",
            })
              .then((res) => {
                if (!res.ok)
                  throw new Error("Erro ao excluir vídeo no servidor");
                // Atualiza lista local
                setVideosCanal((prev) => prev.filter((vid) => vid.id !== v.id));
                setShowNotificacao("Vídeo excluído com sucesso!");
                setTimeout(() => setShowNotificacao(null), 2000);
              })
              .catch((err) => {
                console.error("Erro ao excluir vídeo:", err);
                setShowNotificacao("Erro ao excluir vídeo!");
                setTimeout(() => setShowNotificacao(null), 2000);
              });
          }}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow"
        >
          Excluir
        </button>
      )}
    </div>
  </article>
))}

                  {videosCanal.map((v, i) => (
                    <article
                      key={i}
                      className="bg-white rounded-xl shadow-md border border-pink-100"
                    >
                      <video
                        src={getPlayableUrl(v.url)}
                        controls
                        className="w-full h-44 object-cover"
                      />
                      <div className="p-4">
                        <div className="font-semibold">{v.title}</div>
                        <p className="text-sm text-gray-600">{v.desc}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  Nenhum vídeo publicado neste canal.
                </p>
              )}
            </div>
          </div>
        ) : (
          <section>
            <h2 className="text-2xl font-bold text-pink-600 mb-4">
              Feed de Vídeos
            </h2>
            {feedVideos.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedVideos.map((v, i) => (
                  <article
                    key={i}
                    className="bg-white rounded-xl shadow-md border border-pink-100"
                  >
                    {v.thumb ? (
                      <img
                        src={v.thumb}
                        alt=""
                        className="w-full h-44 object-cover"
                      />
                    ) : (
                      <video
                        src={getPlayableUrl(v.url)}
                        controls
                        className="w-full h-44 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="font-semibold">{v.title}</div>
                      <p className="text-sm text-gray-600">{v.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum vídeo publicado ainda.</p>
            )}
          </section>
        )}
      </main>

      {/* modais */}
      {abrirCriarCanal && (
        <CriarCanais
          setCanais={setCanais}
          canais={canais}
          onClose={() => setAbrirCriarCanal(false)}
          setShowNotificacao={setShowNotificacao}
        />
      )}

      {abrirPostarVideo && (
        <PostarVideos
          canais={canais}
          setCanais={setCanais}
          onClose={() => setAbrirPostarVideo(false)}
          canalSelecionado={canalSelecionado}
          setCanalSelecionado={setCanalSelecionado}
          setShowNotificacao={setShowNotificacao}
        />
      )}

      {/* notificação */}
      {showNotificacao && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>{showNotificacao}</span>
        </div>
      )}
    </div>
  );
}
