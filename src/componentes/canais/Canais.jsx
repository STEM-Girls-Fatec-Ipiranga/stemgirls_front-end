// src/pages/Canais.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Plus, CheckCircle } from "lucide-react";
import CriarCanais from "./CriarCanais";
import PostarVideos from "./PostarVideos";
import PopupLoginAviso from "../PopupLoginAviso";

export default function Canais() {
  const [canais, setCanais] = useState([]);
  const [search, setSearch] = useState("");
  const [inscritos, setInscritos] = useState([]);
  const [canalSelecionado, setCanalSelecionado] = useState(null);
  const [abrirCriarCanal, setAbrirCriarCanal] = useState(false);
  const [abrirPostarVideo, setAbrirPostarVideo] = useState(false);
  const [showNotificacao, setShowNotificacao] = useState(null);
  const [showPopupLogin, setShowPopupLogin] = useState(false);

  const playableUrlCache = useRef(new Map());
  const user = JSON.parse(localStorage.getItem("userData"));

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

  useEffect(() => {
    fetch("http://localhost:8080/api/canais")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar canais");
        return res.json();
      })
      .then((data) => setCanais(Array.isArray(data) ? data : canaisPadrao))
      .catch(() => setCanais(canaisPadrao));

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
      const mimeMatch = arr[0].match(/data:([^;]+)/);
      const mime = mimeMatch ? mimeMatch[1] : "video/mp4";
      const bstr = atob(arr[1] || "");
      const u8arr = new Uint8Array(bstr.length);
      for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
      const obj = URL.createObjectURL(new Blob([u8arr], { type: mime }));
      playableUrlCache.current.set(url, obj);
      return obj;
    }
    return url;
  }, []);

  const toggleInscricao = (id) => {
    const ja = inscritos.includes(id);
    const novos = ja ? inscritos.filter((x) => x !== id) : [...inscritos, id];
    setInscritos(novos);
    setCanais((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, inscritos: Number(c.inscritos || 0) + (ja ? -1 : 1) } : c
      )
    );
  };

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/videos")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar vídeos");
        return res.json();
      })
      .then((data) => setVideos(Array.isArray(data) ? data : []))
      .catch(() => setVideos([]));
  }, []);

  // don't mutate state with sort: copy array first
  const feedVideos = [...videos].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const [videosCanal, setVideosCanal] = useState([]);

  useEffect(() => {
    if (!canalSelecionado) {
      setVideosCanal([]);
      return;
    }
    fetch(`http://localhost:8080/api/videos/canal/${canalSelecionado.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar vídeos do canal");
        return res.json();
      })
      .then((data) => setVideosCanal(Array.isArray(data) ? data : []))
      .catch(() => setVideosCanal([]));
  }, [canalSelecionado]);

  const excluirCanal = (id) => {
    const canal = canais.find((c) => c.id === id);
    if (canal?.owner !== "me") {
      setShowNotificacao("Não é possível excluir canais do sistema");
      setTimeout(() => setShowNotificacao(null), 2000);
      return;
    }
    if (!window.confirm("Tem certeza que deseja excluir este canal?")) return;

    fetch(`http://localhost:8080/api/canais/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao excluir");
        setCanais((prev) => prev.filter((c) => c.id !== id));
        setCanalSelecionado(null);
        setShowNotificacao("Canal excluído!");
        setTimeout(() => setShowNotificacao(null), 2000);
      })
      .catch(() => {
        setShowNotificacao("Erro ao excluir canal");
        setTimeout(() => setShowNotificacao(null), 2000);
      });
  };

  const canaisFiltrados = search.trim()
    ? canais.filter((c) => c.nome.toLowerCase().includes(search.toLowerCase()))
    : [];

  const meusCanais = canais.filter((c) => c.owner === "me");
  const meusInscritos = canais.filter((c) => inscritos.includes(c.id));
  const sugeridos = canais.filter((c) => !inscritos.includes(c.id));

  const isLogged = !!user;
  //"min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" style="font-family: Quicksand, sans-serif;">

  return (
    <div className="flex min-h-screen bg-[#FFF6FF] text-black to-pink-50">
      {/* SIDEBAR */}
      <aside className="w-80 bg-[#FFF6FF] border-r border-pink-100 p-6 flex flex-col overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-bold text-black text-[22px] mb-4">Canais</h2>

        

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar canal..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => {
              if (!isLogged) {
                e.target.blur();
                setShowPopupLogin(true);
              }
            }}
          />
        </div>

        <PopupLoginAviso isOpen={showPopupLogin} onClose={() => setShowPopupLogin(false)} />

        {/* Search results */}
        {search.trim() ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Resultados</h3>
            {canaisFiltrados.length ? (
              <ul className="space-y-3 max-h-40 overflow-auto pr-2">
                {canaisFiltrados.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 p-3 hover:bg-pink-50 rounded-xl cursor-pointer"
                    onClick={() => {
                      setCanalSelecionado(c);
                      setSearch("");
                    }}
                  >
                    <img src={c.fotoPerfil} alt={c.nome} className="w-12 h-12 rounded-full shadow-sm" />
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{c.nome}</div>
                      <div className="text-xs text-gray-500">{c.inscritos ?? 0} inscritos</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Nenhum canal encontrado.</p>
            )}
          </div>
        ) : null}

        <div className="w-full border-b border-pink-400 my-4"></div>

        {/* Meus Canais */}
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Meus Canais</h3>
        {meusCanais.length ? (
          <ul className="space-y-3 mb-4">
            {meusCanais.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 p-3 hover:bg-pink-50 rounded-xl cursor-pointer"
                onClick={() => setCanalSelecionado(c)}
              >
                <img src={c.fotoPerfil} alt={c.nome} className="w-12 h-12 rounded-full shadow" />
                <div>
                  <div className="text-lg font-semibold">{c.nome}</div>
                  <div className="text-xs text-gray-500">{c.inscritos ?? 0} inscritos</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 mb-4">Você ainda não criou canais.</p>
        )}

        {user?.role === "MODERADOR" && (
          <button
            onClick={() => setAbrirCriarCanal(true)}
            className="w-full bg-[#F36EC0] text-white font-semibold h-[40px] mb-4 mt-4 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center"
          >
          + Criar Canal
          </button>
        )}

        <div className="w-full border-b border-pink-400 my-4"></div>

        {/* Canais inscritos */}
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Canais inscritos</h3>
        {meusInscritos.length ? (
          <ul className="space-y-3 mb-4">
            {meusInscritos.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 p-3 hover:bg-pink-50 rounded-xl cursor-pointer"
                onClick={() => setCanalSelecionado(c)}
              >
                <img src={c.fotoPerfil} alt={c.nome} className="w-12 h-12 rounded-full shadow" />
                <div>
                  <div className="text-lg font-semibold">{c.nome}</div>
                  <div className="text-xs text-gray-500">{c.inscritos ?? 0} inscritos</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 mb-4">Você ainda não se inscreveu.</p>
        )}

        <div className="w-full border-b border-pink-400 my-4"></div>

        {/* Sugeridos */}
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Sugeridos</h3>
        <ul className="space-y-3">
          {sugeridos.slice(0, 6).map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-3 p-3 hover:bg-pink-50 rounded-xl cursor-pointer"
              onClick={() => setCanalSelecionado(c)}
            >
              <img src={c.fotoPerfil} alt={c.nome} className="w-12 h-12 rounded-full shadow" />
              <div>
                <div className="text-lg font-semibold">{c.nome}</div>
                <div className="text-xs text-gray-500">{c.inscritos ?? 0} inscritos</div>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN */}
<main className="flex-1 p-6">
  {canalSelecionado ? (
    <div className="animate-fadeIn">

      <button
        onClick={() => setCanalSelecionado(null)}
        className="text-pink-600 mb-6 font-semibold hover:underline"
      >
        ← Voltar
      </button>

      <img
        src={canalSelecionado.banner}
        alt={canalSelecionado.nome}
        className="w-full h-52 rounded-2xl object-cover shadow-md mb-6"
      />

      <div className="flex items-center gap-5 mb-6 bg-white p-4 rounded-2xl shadow border border-pink-100">
        <img
          src={canalSelecionado.fotoPerfil}
          alt={canalSelecionado.nome}
          className="w-20 h-20 rounded-full object-cover shadow"
        />

        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800">{canalSelecionado.nome}</h2>
          <p className="text-gray-600">{canalSelecionado.inscritos ?? 0} inscritos</p>
        </div>

        <button
          onClick={() => toggleInscricao(canalSelecionado.id)}
          className={`ml-auto px-5 py-2.5 rounded-xl font-semibold transition-all shadow ${
            inscritos.includes(canalSelecionado.id)
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-pink-500 text-white hover:bg-pink-600"
          }`}
        >
          {inscritos.includes(canalSelecionado.id) ? "Inscrito" : "Inscrever-se"}
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setAbrirPostarVideo(true)}
          className="bg-pink-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow hover:bg-pink-600 transition-all"
        >
          Publicar Vídeo
        </button>

        {canalSelecionado.owner === "me" && (
          <button
            onClick={() => excluirCanal(canalSelecionado.id)}
            className="bg-red-500 text-white px-4 py-2.5 rounded-xl font-semibold shadow hover:bg-red-600 transition-all"
          >
            Excluir Canal
          </button>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 text-gray-800">Vídeos do Canal</h3>

        {videosCanal.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videosCanal.map((v) => (
              <article
                key={v.id || v.title}
                className="bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden hover:shadow-xl transition-all"
              >
                {v.thumb ? (
                  <img
                    src={v.thumb}
                    alt={v.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <video
                    src={getPlayableUrl(v.url)}
                    controls
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-5 flex flex-col">
                  <div className="font-semibold text-lg text-gray-800">{v.title}</div>
                  <p className="text-sm text-gray-600 my-2">{v.desc}</p>

                  {canalSelecionado.owner === "me" && (
                    <button
                      onClick={() => {
                        if (!window.confirm("Deseja excluir este vídeo?")) return;

                        fetch(`http://localhost:8080/api/videos/${v.id}`, {
                          method: "DELETE",
                        })
                          .then((res) => {
                            if (!res.ok) throw new Error("Erro ao excluir vídeo");
                            setVideosCanal((prev) =>
                              prev.filter((vid) => vid.id !== v.id)
                            );
                            setShowNotificacao("Vídeo excluído com sucesso!");
                            setTimeout(() => setShowNotificacao(null), 2000);
                          })
                          .catch(() => {
                            setShowNotificacao("Erro ao excluir vídeo");
                            setTimeout(() => setShowNotificacao(null), 2000);
                          });
                      }}
                      className="justify-center mx-auto bg-red-500 text-white text-xs px-4 py-1.5 rounded-lg shadow hover:bg-red-600 transition-all w-3xl text-center "
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Nenhum vídeo publicado neste canal.</p>
        )}
      </div>
    </div>
  ) : (
    <section className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-pink-600 mb-6">Feed de Vídeos</h2>

      {feedVideos.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedVideos.map((v) => (
            <article
              key={v.id || v.title}
              className="bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden hover:shadow-xl transition-all"
            >
              {v.thumb ? (
                <img
                  src={v.thumb}
                  alt={v.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <video
                  src={getPlayableUrl(v.url)}
                  controls
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-5">
                <div className="font-semibold text-lg text-gray-800">{v.title}</div>
                <p className="text-sm text-gray-600 mt-1">{v.desc}</p>
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


      {/* MODAIS */}
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

      {/* NOTIFICAÇÃO */}
      {showNotificacao && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 z-50">
          <CheckCircle className="w-5 h-5" />
          <span>{showNotificacao}</span>
        </div>
      )}
    </div>
  );
}
