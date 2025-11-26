import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, CheckCircle } from "lucide-react";
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

  const [videoAberto, setVideoAberto] = useState(null); 

  const [likeCounts, setLikeCounts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("video_like_counts_v1")) || {};
    } catch {
      return {};
    }
  });


  const user = JSON.parse(localStorage.getItem("user"));
  
  const [userLiked, setUserLiked] = useState(() => {
    try {
      const arr = JSON.parse(localStorage.getItem(`user_liked_videos_v1_${userKey}`)) || [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  });

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

  useEffect(() => {
    try {
      localStorage.setItem("video_like_counts_v1", JSON.stringify(likeCounts));
    } catch { }
  }, [likeCounts]);

  useEffect(() => {
    try {
      localStorage.setItem(
        `user_liked_videos_v1_${userKey}`,
        JSON.stringify(Array.from(userLiked))
      );
    } catch { }
  }, [userLiked]);

  const getPlayableUrl = useCallback((url) => {
    if (!url) return null;
    
    if (url.startsWith("data:")) {
      const cached = playableUrlCache.current.get(url);
      
      if (cached) return cached;
      
      const arr = url.split(",");
      const mimeMatch = arr[0].match(/data:([^;]+)/);
      const mime = mimeMatch ? mimeMatch[1] : "video/mp4";
    
      if (!arr[1]) return null;
      
      try {
        const bstr = atob(arr[1]);
        const u8arr = new Uint8Array(bstr.length);
        
        for (let i = 0; i < bstr.length; i++) 
          u8arr[i] = bstr.charCodeAt(i);
        
        const obj = URL.createObjectURL(new Blob([u8arr], { type: mime }));
        playableUrlCache.current.set(url, obj);
        
        return obj;
      } catch(error) {
        return null;
      }
    }
    return url;
  }, []);

  // toggle like: se não logado, abre popup login.
  // se já curtiu -> remove like (decrementa contagem, min 0)
  // se não curtiu -> adiciona like (incrementa contagem)

  const toggleLike = (videoId) => {
    if (!user) {
      setShowPopupLogin(true);
      return;
    }

    const idKey = String(videoId || "");
    setUserLiked((prev) => {
      const has = prev.has(idKey);
      const next = new Set(prev);
      if (has) {
        next.delete(idKey);
        setLikeCounts((prevCounts) => {
          const prevVal = Number(prevCounts[idKey] || 0);
          const nextCounts = { ...prevCounts, [idKey]: Math.max(0, prevVal - 1) };
          return nextCounts;
        });
      } else {
        next.add(idKey);
        setLikeCounts((prevCounts) => {
          const prevVal = Number(prevCounts[idKey] || 0);
          const nextCounts = { ...prevCounts, [idKey]: prevVal + 1 };
          return nextCounts;
        });
      }
      return next;
    });
  };

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

  useEffect(() => {
    fetch("http://localhost:8080/canais")
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

    fetch(`http://localhost:8080/canais/${id}`, { method: "DELETE" })
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

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setVideoAberto(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const abrirVideo = (v) => {
    setVideoAberto(v);
  };

  const Heart = ({ filled, size = 18, className = "" }) => {
    const [usuarioLogado, setUsuarioLogado] = useState({});

    const [user, setUser] = useState({
      data: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
          : {
                nomeCompleto: "Nome Completo (Sem Login)",
                nomeUsuario: "stemgirl",
                email: "exemplo@stemgirls.com.br",
                role: "USUARIO",
                sobre: "Digite aqui um pequeno texto sobre você!",
                joinDate: "2024-01-01T00:00:00Z",
                profileImage: DEFAULT_PROFILE_IMAGE,
            }
    });

    useEffect(() => {
      if (user.data.nomeUsuario != null) {
        setUsuarioLogado({
          nomeUsuario: user.data.nomeUsuario,
          role: user.data.role
        });
      } else if (empresa.data.nomeEmpresa != null) {
        setUsuarioLogado({
          nomeUsuario: empresa.data.nomeEmpresa,
          role: empresa.data.role
        });
      }
    }, []);

    return filled ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`transform transition-transform duration-200 ${className}`}
        aria-hidden
      >
        <path d="M12 21s-6.5-4.35-9-7.1C-1 10 3.6 4 7.5 6.3 9 7.5 12 10.2 12 10.2s3-2.7 4.5-3.9C20.4 4 25 10 21 13.9c-2.5 2.8-9 6.9-9 6.9z" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={className || "text-gray-600"}
        aria-hidden
      >
        <path
          d="M20.8 7.6c-1.7-3-5.2-4.1-8-2.7-1 .5-1.9 1.4-2.4 2.3-.5-.9-1.4-1.8-2.4-2.3-2.8-1.4-6.3-.3-8 2.7-2.1 3.7-.1 8.4 5.3 12.1L12 22l2.5-2.6c5.4-3.7 7.4-8.4 5.3-12.1z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const VideoPreview = ({ v }) => {
    const playable = getPlayableUrl(v.url || "");
    return (
      <div className="relative group w-full h-48 bg-gray-100 overflow-hidden">
        {v.thumb ? (
          <img
            src={v.thumb}
            alt={v.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : playable ? (
          
          <video
            src={playable}
            className="w-full h-full object-cover bg-black"
            muted
            playsInline
            preload="metadata"
            controls={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">Prévia do vídeo</div>
        )}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/40 rounded-full p-3 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3v18l15-9L5 3z" fill="white" />
            </svg>
          </div>
        </div>

        {v.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">{v.duration}</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FFF6FF] text-black">
     
      <aside className="w-80 bg-[#FFF6FF] border-r border-pink-100 p-6 flex flex-col overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-bold text-black text-[22px] mb-4">Canais</h2>

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
                    <img src={c.fotoPerfil} alt={c.nome} className="w-12 h-12 rounded-full shadow-sm" loading="lazy" />
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

        {/* Meus Canais */}
        {user.role == "MODERADOR" && (
          <>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Meus Canais</h3>
            
            {meusCanais.length ? (
              <ul className="space-y-3 mb-4">
                {meusCanais.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 p-3 hover:bg-pink-50 rounded-xl cursor-pointer"
                    onClick={() => setCanalSelecionado(c)}
                  >
                    <img src={c.fotoPerfil} alt={c.nome} className="w-12 h-12 rounded-full shadow" loading="lazy" />
                    <div>
                      <div className="text-lg font-semibold">{c.nome}</div>
                      <div className="text-xs text-gray-500">{c.inscritos ?? 0} inscritos</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (<p className="text-sm text-gray-500 mb-4">Você ainda não criou canais.</p>)}
      
            <button
                onClick={() => setAbrirCriarCanal(true)}
                className="w-full bg-[#F36EC0] text-white font-semibold h-[40px] mb-4 mt-4 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center"
            >
                + Criar Canal
            </button>
          </>
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
                <img src={c.fotoPerfil} alt={c.nome} className="w-12 h-12 rounded-full shadow" loading="lazy" />
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
              <img src={c.fotoPerfil} alt={c.nome} className="w-12 h-12 rounded-full shadow" loading="lazy" />
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
              loading="lazy"
            />

            <div className="flex items-center gap-5 mb-6 bg-white p-4 rounded-2xl shadow border border-pink-100">
              <img
                src={canalSelecionado.fotoPerfil}
                alt={canalSelecionado.nome}
                className="w-20 h-20 rounded-full object-cover shadow"
                loading="lazy"
              />

              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800">{canalSelecionado.nome}</h2>
                <p className="text-gray-600">{canalSelecionado.inscritos ?? 0} inscritos</p>
              </div>

              <button
                onClick={() => toggleInscricao(canalSelecionado.id)}
                className={`ml-auto px-5 py-2.5 rounded-xl font-semibold transition-all shadow ${inscritos.includes(canalSelecionado.id)
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
                  {videosCanal.map((v) => {
                    const vidKey = String(v.id || v.title || "");
                    const count = likeCounts[vidKey] || 0;
                    const liked = userLiked.has(vidKey);
                    return (
                      <article
                        key={vidKey}
                        className="bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                        onClick={() => abrirVideo(v)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === "Enter" ? abrirVideo(v) : null)}
                      >
                        {/* Thumb / Poster */}
                        <VideoPreview v={v} />

                        <div className="p-5 flex flex-col">
                          <div className="font-semibold text-lg text-gray-800">{v.title}</div>
                          <p className="text-sm text-gray-600 my-2 line-clamp-2">{v.desc}</p>

                          {/* botões administrativos — evitar propagação para não abrir modal ao clicar */}
                          <div className="mt-2 flex gap-2 items-center">
                            {canalSelecionado.owner === "me" && (
                              <button
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  if (!window.confirm("Deseja excluir este vídeo?")) return;
                                  fetch(`http://localhost:8080/api/videos/${v.id}`, {
                                    method: "DELETE",
                                  })
                                    .then((res) => {
                                      if (!res.ok) throw new Error("Erro ao excluir vídeo");
                                      setVideosCanal((prev) => prev.filter((vid) => vid.id !== v.id));
                                      setShowNotificacao("Vídeo excluído com sucesso!");
                                      setTimeout(() => setShowNotificacao(null), 2000);
                                    })
                                    .catch(() => {
                                      setShowNotificacao("Erro ao excluir vídeo");
                                      setTimeout(() => setShowNotificacao(null), 2000);
                                    });
                                }}
                                className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg shadow hover:bg-red-600 transition-all"
                              >
                                Excluir
                              </button>
                            )}

                            {/* LIKE BUTTON - canal view */}
                            <button
                              onClick={(ev) => {
                                ev.stopPropagation();
                                toggleLike(vidKey);
                              }}
                              className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 shadow-md ${liked ? "bg-purple-600 text-white" : "bg-white text-purple-600 border border-purple-300"
                                } hover:scale-[1.03] active:scale-[0.97]`}
                              aria-pressed={liked}
                              aria-label={liked ? "Remover curtida" : "Curtir vídeo"}
                              title={liked ? "Você curtiu" : "Curtir"}
                            >
                              <span className={`${liked ? "text-white" : "text-purple-600"}`}>
                                <Heart filled={liked} size={18} className="" />
                              </span>
                              <span className="font-semibold">{count > 0 ? count : "Curtir"}</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
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
                {feedVideos.map((v) => {
                  const vidKey = String(v.id || v.title || "");
                  const count = likeCounts[vidKey] || 0;
                  const liked = userLiked.has(vidKey);
                  return (
                    <article
                      key={vidKey}
                      className="bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                      onClick={() => abrirVideo(v)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === "Enter" ? abrirVideo(v) : null)}
                    >
                      <VideoPreview v={v} />

                      <div className="p-5">
                        <div className="font-semibold text-lg text-gray-800">{v.title}</div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{v.desc}</p>

                        <div className="mt-3 flex items-center">
                          {/* LIKE BUTTON - feed */}
                          <button
                            onClick={(ev) => {
                              ev.stopPropagation();
                              toggleLike(vidKey);
                            }}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 shadow-md ${liked ? "bg-purple-600 text-white" : "bg-white text-purple-600 border border-purple-300"
                              } hover:scale-[1.03] active:scale-[0.97]`}
                            aria-pressed={liked}
                            aria-label={liked ? "Remover curtida" : "Curtir vídeo"}
                          >
                            <span className={`${liked ? "text-white" : "text-purple-600"}`}>
                              <Heart filled={liked} size={18} className="" />
                            </span>
                            <span className="font-semibold">{count > 0 ? count : "Curtir"}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
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

      {/* Modal de vídeo centralizado - com borda rosa no card grande */}
      {videoAberto && (
        <div
          className="fixed inset-0 bg-black/60 flex itens-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setVideoAberto(null)}
        >
          <div
            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 relative border-2 border-pink-500"
            onClick={(e) => e.stopPropagation()} // evitar fechar ao clicar dentro
          >
            <button
              onClick={() => setVideoAberto(null)}
              aria-label="Fechar"
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            {/* Player */}
            <div className="w-full mb-4">
              {videoAberto.url ? (
                <video
                  src={getPlayableUrl(videoAberto.url)}
                  controls
                  className="w-full h-[420px] md:h-[480px] rounded-xl object-cover bg-black"
                />
              ) : videoAberto.thumb ? (
                <img
                  src={videoAberto.thumb}
                  alt={videoAberto.title}
                  className="w-full h-[420px] md:h-[480px] rounded-xl object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-[420px] md:h-[480px] rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                  Sem vídeo disponível
                </div>
              )}
            </div>

            {/* Conteúdo */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{videoAberto.title}</h2>
            <p className="text-gray-600 mb-4">{videoAberto.desc}</p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleLike(String(videoAberto.id || videoAberto.title || ""))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow transition-all ${userLiked.has(String(videoAberto.id || videoAberto.title || "")) ? "bg-purple-600 text-white" : "bg-pink-500 text-white"
                  }`}
              >
                <span className="inline-flex items-center">
                  <Heart filled={userLiked.has(String(videoAberto.id || videoAberto.title || ""))} className={`${userLiked.has(String(videoAberto.id || videoAberto.title || "")) ? 'text-white' : 'text-white'}`} />
                </span>
                <span className="ml-2">
                  {likeCounts[String(videoAberto.id || videoAberto.title || "")] ? `(${likeCounts[String(videoAberto.id || videoAberto.title || "")]})` : "Curtir"}
                </span>
              </button>

              <button
                onClick={() => {
                  if (videoAberto.canalId) {
                    const canal = canais.find((c) => c.id === videoAberto.canalId);
                    if (canal) {
                      setCanalSelecionado(canal);
                      setVideoAberto(null);
                    }
                  }
                }}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl font-medium shadow hover:bg-gray-200 transition-all"
              >
                Ver canal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICAÇÃO */}
      {showNotificacao && (
        <div className="fixed bottom-6 right-6 from-pink-500 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 z-50">
          <CheckCircle className="w-5 h-5" />
          <span>{showNotificacao}</span>
        </div>
      )}
    </div>
  );
}
