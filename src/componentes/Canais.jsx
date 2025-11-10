// src/pages/Canais.jsx
import React, { useEffect, useState, useRef } from "react";
import { Search, Plus, Video, ArrowLeft, CheckCircle } from "lucide-react";

/**
 * Canais.jsx - Versão final (React + Vite)
 *
 * - Mantém seu layout / design original
 * - Corrige bug da "tela preta" no upload de vídeo
 * - Persistência em localStorage (canais_all, inscritos_v2)
 * - Sidebar: botões no topo, pesquisa com resultados, ordem pedida
 * - Modais com scroll interno (max-height + overflow-y-auto)
 * - Postar vídeo com opção de thumbnail
 */

export default function Canais() {
  // --- estados principais ---
  const [canais, setCanais] = useState([]);
  const [search, setSearch] = useState("");
  const [inscritos, setInscritos] = useState([]); // array de ids inscritos
  const [canalSelecionado, setCanalSelecionado] = useState(null);

  // modais/cards
  const [abrirCriarCanal, setAbrirCriarCanal] = useState(false);
  const [abrirPostarVideo, setAbrirPostarVideo] = useState(false);

  // notificações
  const [showNotificacao, setShowNotificacao] = useState(null);

  // criar canal
  const [nomeCanal, setNomeCanal] = useState("");
  const [descCanal, setDescCanal] = useState("");
  const [bannerCanal, setBannerCanal] = useState(null);
  const [fotoPerfilCanal, setFotoPerfilCanal] = useState(null);

  // postar vídeo (duas variáveis: preview rápido e dataURL persistente)
  const [arquivoPreview, setArquivoPreview] = useState(null); // objectURL para preview imediato
  const [arquivoDataUrl, setArquivoDataUrl] = useState(null); // base64 para persistência
  const [tituloVideo, setTituloVideo] = useState("");
  const [descricaoVideo, setDescricaoVideo] = useState("");
  const [thumbPreview, setThumbPreview] = useState(null); // thumbnail preview objectURL
  const [thumbDataUrl, setThumbDataUrl] = useState(null); // thumbnail dataUrl para persistência
  const [canalDestinoId, setCanalDestinoId] = useState("");

  // modal vídeo grande
  const [videoModal, setVideoModal] = useState(null);

  // ref para saber se modal aberto — para revogar objectURL ao fechar
  const arquivoPreviewRef = useRef(null);
  const thumbPreviewRef = useRef(null);

  // canais padrão
  const canaisPadrao = [
    {
      id: 1,
      nome: "Tech World",
      descricao: "Dicas de tecnologia e programação.",
      banner: "/src/assets/img/FundoSGcolorido.jpg",
      fotoPerfil: "/src/assets/img/katherine-johnson.jpg",
      inscritos: 823,
      videos: [],
      owner: "system",
    },
    {
      id: 2,
      nome: "Tech para Todos",
      descricao: "Conteúdo acessível para iniciantes.",
      banner: "/src/assets/img/FundoSGcolorido.jpg",
      fotoPerfil: "/src/assets/img/Adalovelace.png",
      inscritos: 1540,
      videos: [],
      owner: "system",
    },
    {
      id: 3,
      nome: "Mundo Gamer",
      descricao: "Gameplay e notícias de jogos.",
      banner: "/src/assets/img/FundoSGcolorido.jpg",
      fotoPerfil: "/src/assets/img/grace-hopper.jpg",
      inscritos: 2310,
      videos: [],
      owner: "system",
    },
    {
      id: 4,
      nome: "Girls Power",
      descricao: "Saúde, bem-estar e treinos diários.",
      banner: "/src/assets/img/FundoSGcolorido.jpg",
      fotoPerfil: "/src/assets/img/lucianasantos.png",
      inscritos: 970,
      videos: [],
      owner: "system",
    },
  ];

  // ------------------- Inicialização / Persistência -------------------
  useEffect(() => {
    // carregar canais (canais_all se existir)
    const all = JSON.parse(localStorage.getItem("canais_all"));
    if (all && Array.isArray(all) && all.length > 0) {
      setCanais(all);
    } else {
      // fallback: mesclar padrao + personalizados (compatibilidade)
      const personalizados = JSON.parse(localStorage.getItem("canais_custom")) || [];
      const map = new Map();
      [...canaisPadrao, ...personalizados].forEach((c) => map.set(c.id, c));
      setCanais(Array.from(map.values()));
    }

    // inscritos
    const inscritosSalvos = JSON.parse(localStorage.getItem("inscritos_v2")) || [];
    setInscritos(inscritosSalvos);
  }, []);

  // Persistir canais_all + canais_custom ao mudar canais
  useEffect(() => {
    localStorage.setItem("canais_all", JSON.stringify(canais));
    const personalizados = canais.filter((c) => c.owner === "me");
    localStorage.setItem("canais_custom", JSON.stringify(personalizados));
  }, [canais]);

  // Persistir inscritos
  useEffect(() => {
    localStorage.setItem("inscritos_v2", JSON.stringify(inscritos));
  }, [inscritos]);

  // ------------------- Helpers upload -------------------
  // Usa FileReader para dataURL (persistência). Para preview imediato usamos createObjectURL.
  const handleImageUploadToDataUrl = (file, setterPreview, setterDataUrl, previewRef) => {
    if (!file) return;
    // revoga preview antigo
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    const objectUrl = URL.createObjectURL(file);
    previewRef.current = objectUrl;
    setterPreview(objectUrl);

    // ler para data url (persistência)
    const reader = new FileReader();
    reader.onload = () => {
      setterDataUrl(reader.result); // base64 => pode persistir
    };
    reader.readAsDataURL(file);
  };

  const handleBannerOrProfile = (e, setterPreview, setterData) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageUploadToDataUrl(file, setterPreview, setterData, { current: null });
  };

  // Video upload: cria preview rápido e também carrega dataURL para persistência
  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // revoga preview antigo se houver
    if (arquivoPreviewRef.current) {
      try { URL.revokeObjectURL(arquivoPreviewRef.current); } catch (err) {}
      arquivoPreviewRef.current = null;
    }

    const objUrl = URL.createObjectURL(file);
    arquivoPreviewRef.current = objUrl;
    setArquivoPreview(objUrl);

    // ler com FileReader para DataURL (persistência)
    const reader = new FileReader();
    reader.onload = () => {
      // somente definir o dataURL quando terminar a leitura (evita render precoce)
      setArquivoDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // thumbnail image selected (preview + data)
  const handleThumbUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (thumbPreviewRef.current) {
      try { URL.revokeObjectURL(thumbPreviewRef.current); } catch (err) {}
      thumbPreviewRef.current = null;
    }
    const objUrl = URL.createObjectURL(file);
    thumbPreviewRef.current = objUrl;
    setThumbPreview(objUrl);

    const reader = new FileReader();
    reader.onload = () => setThumbDataUrl(reader.result);
    reader.readAsDataURL(file);
  };

  // limpar previews quando modal fecha
  const limparPreviewsModalVideo = () => {
    if (arquivoPreviewRef.current) {
      try { URL.revokeObjectURL(arquivoPreviewRef.current); } catch (err) {}
      arquivoPreviewRef.current = null;
    }
    if (thumbPreviewRef.current) {
      try { URL.revokeObjectURL(thumbPreviewRef.current); } catch (err) {}
      thumbPreviewRef.current = null;
    }
    setArquivoPreview(null);
    setArquivoDataUrl(null);
    setThumbPreview(null);
    setThumbDataUrl(null);
    setTituloVideo("");
    setDescricaoVideo("");
    setCanalDestinoId("");
  };

  // ------------------- Criar canal -------------------
  const criarCanal = () => {
    if (!nomeCanal.trim() || !descCanal.trim()) {
      setShowNotificacao("Preencha nome e descrição do canal");
      setTimeout(() => setShowNotificacao(null), 2200);
      return;
    }
    const novo = {
      id: Date.now(),
      nome: nomeCanal.trim(),
      descricao: descCanal.trim(),
      banner: bannerCanal || "/src/assets/img/FundoSGcolorido.jpg",
      fotoPerfil: fotoPerfilCanal || "/src/assets/img/perfil_padrao.png",
      inscritos: 0,
      videos: [],
      owner: "me",
    };
    const novos = [...canais, novo];
    setCanais(novos);

    // limpar form
    setNomeCanal("");
    setDescCanal("");
    setBannerCanal(null);
    setFotoPerfilCanal(null);
    setAbrirCriarCanal(false);

    setShowNotificacao("✅ Canal criado com sucesso!");
    setTimeout(() => setShowNotificacao(null), 2200);
  };

  // ------------------- Postar vídeo -------------------
  const postarVideo = () => {
    // validacões
    if (!arquivoDataUrl || !tituloVideo.trim() || !canalDestinoId) {
      setShowNotificacao("Escolha vídeo, título e canal");
      setTimeout(() => setShowNotificacao(null), 2200);
      return;
    }

    const novos = canais.map((c) => {
      if (c.id === Number(canalDestinoId)) {
        const novoVideo = {
          title: tituloVideo.trim(),
          desc: descricaoVideo.trim(),
          url: arquivoDataUrl, // dataURL (persistente)
          thumb: thumbDataUrl || null, // persistente
          createdAt: Date.now(),
          owner: "me",
        };
        return { ...c, videos: [novoVideo, ...(c.videos || [])] };
      }
      return c;
    });

    setCanais(novos);

    // limpar e fechar
    limparPreviewsModalVideo();
    setAbrirPostarVideo(false);

    // atualiza canal selecionado se for o mesmo destino
    if (canalSelecionado && canalSelecionado.id === Number(canalDestinoId)) {
      setCanalSelecionado(novos.find((c) => c.id === Number(canalDestinoId)));
    }

    setShowNotificacao("✅ Vídeo postado com sucesso!");
    setTimeout(() => setShowNotificacao(null), 2200);
  };

  // ------------------- Toggle inscrição -------------------
  const toggleInscricao = (id) => {
    const ja = inscritos.includes(id);
    const novosInscritos = ja ? inscritos.filter((x) => x !== id) : [...inscritos, id];
    setInscritos(novosInscritos);
    localStorage.setItem("inscritos_v2", JSON.stringify(novosInscritos));

    const atualizados = canais.map((c) => {
      if (c.id === id) {
        const novosCount = ja ? Math.max(0, c.inscritos - 1) : c.inscritos + 1;
        return { ...c, inscritos: novosCount };
      }
      return c;
    });
    setCanais(atualizados);

    if (canalSelecionado && canalSelecionado.id === id) {
      setCanalSelecionado(atualizados.find((c) => c.id === id));
    }
  };

  // ------------------- Excluir canal / vídeo -------------------
  const excluirCanal = (id) => {
    const canal = canais.find((c) => c.id === id);
    if (!canal) return;
    if (canal.owner !== "me") {
      setShowNotificacao("Não é possível excluir canais do sistema");
      setTimeout(() => setShowNotificacao(null), 2000);
      return;
    }
    if (!window.confirm("Tem certeza que deseja excluir este canal?")) return;
    const novos = canais.filter((c) => c.id !== id);
    setCanais(novos);
    if (canalSelecionado?.id === id) setCanalSelecionado(null);
  };

  const excluirVideo = (canalId, idx) => {
    if (!window.confirm("Excluir este vídeo?")) return;
    const novos = canais.map((c) => {
      if (c.id === canalId) {
        const videosAtual = c.videos || [];
        const novosVideos = videosAtual.filter((_, i) => i !== idx);
        return { ...c, videos: novosVideos };
      }
      return c;
    });
    setCanais(novos);
    if (canalSelecionado && canalSelecionado.id === canalId) {
      setCanalSelecionado(novos.find((c) => c.id === canalId));
    }
  };

  // ------------------- Derived lists & feed -------------------
  const canaisFiltrados = search.trim() ? canais.filter((c) => c.nome.toLowerCase().includes(search.toLowerCase())) : [];
  const meusCanais = canais.filter((c) => c.owner === "me");
  const meusInscritos = canais.filter((c) => inscritos.includes(c.id));
  const sugeridos = canais.filter((c) => !inscritos.includes(c.id));
  const canaisCriadosPorMim = canais.filter((c) => c.owner === "me");

  const feedVideos = [];
  canais.forEach((canal) => {
    (canal.videos || []).forEach((v) => {
      feedVideos.push({
        ...v,
        canalId: canal.id,
        canalNome: canal.nome,
        canalFoto: canal.fotoPerfil,
        canalBanner: canal.banner,
      });
    });
  });
  feedVideos.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  // abrir vídeo em modal
  const abrirVideoModal = (video, canal) => {
    setVideoModal({ video, canal });
  };

  // Cleanup quando componente desmontar (revoke object URLs)
  useEffect(() => {
    return () => {
      if (arquivoPreviewRef.current) try { URL.revokeObjectURL(arquivoPreviewRef.current); } catch {}
      if (thumbPreviewRef.current) try { URL.revokeObjectURL(thumbPreviewRef.current); } catch {}
    };
  }, []);

  // ------------------- RENDER -------------------
  return (
    <div className="flex h-screen bg-[#FFF6FF] text-black">
      {/* SIDEBAR (mantive o design que você pediu) */}
      <aside className="w-72 bg-[#FFF6FF] border-r border-pink-50 p-4 flex flex-col">
        {/* TOP: Postar + Criar (do jeito que pediu) */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => { setAbrirPostarVideo(true); }}
            className="bg-[#F36EC0] text-white w-1/2 py-2 rounded-lg font-semibold flex items-center justify-center"
          >
            <Video className="w-4 h-4 mr-2" /> Postar Vídeo
          </button>

          <button
            onClick={() => { setAbrirCriarCanal(true); }}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white w-1/2 py-2 rounded-lg font-semibold flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Criar Canal
          </button>
        </div>

        {/* Busca */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar canal..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Resultados da pesquisa */}
        {search.trim() !== "" && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Resultados</h3>
            {canaisFiltrados.length > 0 ? (
              <ul className="space-y-2 max-h-40 overflow-auto pr-2">
                {canaisFiltrados.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-pink-50 p-2 rounded-lg"
                    onClick={() => { setCanalSelecionado(c); setSearch(""); }}
                  >
                    <img src={c.fotoPerfil} alt={c.nome} className="w-8 h-8 rounded-full object-cover" />
                    <div className="text-sm font-semibold">{c.nome}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Nenhum canal encontrado.</p>
            )}
          </div>
        )}

        {/* Meus Canais */}
        <h3 className="text-lg font-bold mt-2 mb-2">Meus Canais</h3>
        {meusCanais.length > 0 ? (
          <ul className="space-y-2">
            {meusCanais.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-pink-50 p-2 rounded-lg"
                onClick={() => setCanalSelecionado(c)}
              >
                <img src={c.fotoPerfil} className="w-8 h-8 rounded-full object-cover" alt="" />
                <span className="text-sm font-semibold">{c.nome}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Você ainda não criou canais.</p>
        )}

        {/* Canais inscritos */}
        <h3 className="text-lg font-bold mt-6 mb-2">Canais inscritos</h3>
        {meusInscritos.length > 0 ? (
          <ul className="space-y-2">
            {meusInscritos.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-pink-50 p-2 rounded-lg"
                onClick={() => setCanalSelecionado(c)}
              >
                <img src={c.fotoPerfil} className="w-8 h-8 rounded-full object-cover" alt="" />
                <span className="text-sm font-semibold">{c.nome}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Você ainda não se inscreveu em canais.</p>
        )}

        {/* Sugeridos */}
        <h3 className="text-lg font-bold mt-6 mb-2">Sugeridos</h3>
        <ul className="space-y-2">
          {sugeridos.slice(0, 6).map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-pink-50 p-2 rounded-lg"
              onClick={() => setCanalSelecionado(c)}
            >
              <img src={c.fotoPerfil} className="w-8 h-8 rounded-full object-cover" alt="" />
              <span className="text-sm font-semibold">{c.nome}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-pink-600">Postagens</h2>
          </div>
        </div>

        {/* Canal selecionado */}
        {canalSelecionado ? (
          <div className="bg-white rounded-xl shadow-md p-6 border border-pink-100 mb-6">
            <button onClick={() => setCanalSelecionado(null)} className="mb-4 text-pink-600 font-semibold hover:underline">
              ← Voltar
            </button>

            <img src={canalSelecionado.banner} className="w-full h-48 object-cover rounded-xl mb-4" alt="banner" />
            <div className="flex items-center gap-4 mb-4">
              <img src={canalSelecionado.fotoPerfil} className="w-16 h-16 rounded-full object-cover" alt="perfil" />
              <div>
                <h2 className="text-2xl font-bold">{canalSelecionado.nome}</h2>
                <p className="text-gray-600">{canalSelecionado.inscritos} inscritos</p>
              </div>
              <button
                onClick={() => toggleInscricao(canalSelecionado.id)}
                className={`ml-auto px-4 py-2 rounded-lg font-semibold ${inscritos.includes(canalSelecionado.id) ? "bg-gray-200 text-gray-700" : "bg-[#F36EC0] text-white"}`}
              >
                {inscritos.includes(canalSelecionado.id) ? "Inscrito" : "Inscrever-se"}
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button onClick={() => setAbrirPostarVideo(true)} className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold">Publicar Vídeo</button>
              {canalSelecionado.owner === "me" && (
                <button onClick={() => excluirCanal(canalSelecionado.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">Excluir Canal</button>
              )}
            </div>

            <h3 className="text-lg font-bold text-pink-600 mb-2">Vídeos</h3>
            {canalSelecionado.videos && canalSelecionado.videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {canalSelecionado.videos.map((v, i) => (
                  <div key={i} className="bg-pink-50 border border-pink-100 p-3 rounded-lg">
                    {v.thumb ? (
                      <img src={v.thumb} alt={v.title} className="w-full h-48 object-cover rounded-md mb-2 cursor-pointer" onClick={() => abrirVideoModal(v, canalSelecionado)} />
                    ) : v.url ? (
                      <video src={v.url} controls className="w-full h-48 object-cover rounded-md mb-2" />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-md mb-2 flex items-center justify-center">Sem vídeo</div>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold">🎬 {v.title}</div>
                        <div className="text-sm text-gray-600">{v.desc}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(v.createdAt || 0).toLocaleString()}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => abrirVideoModal(v, canalSelecionado)} className="text-sm text-pink-600 hover:underline">Abrir</button>
                        <button onClick={() => excluirVideo(canalSelecionado.id, i)} className="text-red-500 hover:underline text-sm">Excluir</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum vídeo disponível.</p>
            )}
          </div>
        ) : null}

        {/* FEED GERAL (todos os vídeos) */}
        <section>
          {feedVideos.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedVideos.map((v, idx) => (
                <article key={idx} className="bg-white rounded-xl shadow-md overflow-hidden border border-pink-100">
                  <div className="relative cursor-pointer" onClick={() => abrirVideoModal(v, canais.find((c) => c.id === v.canalId))}>
                    {v.thumb ? (
                      <img src={v.thumb} alt={v.title} className="w-full h-44 object-cover" />
                    ) : v.url ? (
                      <video src={v.url} controls className="w-full h-44 object-cover" />
                    ) : (
                      <div className="w-full h-44 bg-gray-200 flex items-center justify-center">Sem vídeo</div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <img src={v.canalFoto} alt={v.canalNome} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{v.title}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{v.desc}</div>
                        <div className="text-xs text-gray-400 mt-2">{new Date(v.createdAt || 0).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="text-xs text-gray-600">Canal: <span className="font-semibold">{v.canalNome}</span></div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCanalSelecionado(canais.find((c) => c.id === v.canalId))}
                          className="px-3 py-1 rounded-lg bg-gray-100 text-sm"
                        >
                          Entrar no canal
                        </button>
                        <button
                          onClick={() => toggleInscricao(v.canalId)}
                          className={`px-3 py-1 rounded-lg text-sm ${inscritos.includes(v.canalId) ? "bg-gray-200 text-gray-700" : "bg-[#F36EC0] text-white"}`}
                        >
                          {inscritos.includes(v.canalId) ? "Inscrito" : "Inscrever-se"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Nenhum vídeo publicado ainda. Seja a primeira a postar!</p>
          )}
        </section>
      </main>

      {/* -------------------- MODAL POSTAR VÍDEO (scroll interno) -------------------- */}
      {abrirPostarVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl border border-pink-200 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">Postar Vídeo</h2>

            <label className="block font-semibold mb-1">Escolher vídeo (do computador)</label>
            <input type="file" accept="video/*" onChange={handleVideoUpload} className="mb-3" />
            {/* mostra preview imediato (objectURL) ou player se já houver dataURL */}
            {arquivoPreview && !arquivoDataUrl && (
              <div className="mb-3 text-sm text-gray-500">Carregando vídeo para salvar... (aguarde)</div>
            )}
            {arquivoDataUrl && (
              <video src={arquivoDataUrl} controls className="w-full h-48 object-cover rounded-md mb-3" />
            )}

            <label className="block font-semibold mb-1">Escolher thumbnail (opcional)</label>
            <input type="file" accept="image/*" onChange={handleThumbUpload} className="mb-3" />
            {thumbPreview && <img src={thumbPreview} alt="thumb preview" className="w-full h-32 object-cover rounded-md mb-3" />}

            <input type="text" placeholder="Título do vídeo" className="w-full border p-2 rounded-lg mb-3" value={tituloVideo} onChange={(e) => setTituloVideo(e.target.value)} />
            <textarea placeholder="Descrição do vídeo" className="w-full border p-2 rounded-lg mb-3" rows="3" value={descricaoVideo} onChange={(e) => setDescricaoVideo(e.target.value)} />

            <label className="block font-semibold mb-1">Escolha o canal (apenas canais que você criou)</label>
            <select className="w-full border p-2 rounded-lg mb-4" value={canalDestinoId} onChange={(e) => setCanalDestinoId(e.target.value)}>
              <option value="">-- Selecione --</option>
              {canaisCriadosPorMim.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <button onClick={postarVideo} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-semibold">Publicar</button>
              <button onClick={() => { limparPreviewsModalVideo(); setAbrirPostarVideo(false); }} className="w-full bg-gray-200 py-2 rounded-lg font-semibold">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODAL CRIAR CANAL (scroll) -------------------- */}
      {abrirCriarCanal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg border border-pink-200 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">Criar Canal</h2>

            <input type="text" placeholder="Nome do canal" className="w-full border p-2 rounded-lg mb-3 text-black" value={nomeCanal} onChange={(e) => setNomeCanal(e.target.value)} />
            <textarea placeholder="Descrição do canal" className="w-full border p-2 rounded-lg mb-3 text-black" rows="3" value={descCanal} onChange={(e) => setDescCanal(e.target.value)} />

            <label className="block font-semibold text-sm mb-1 text-pink-600">Escolher banner:</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              // preview e dataUrl
              const tmpUrl = URL.createObjectURL(file);
              setBannerCanal(tmpUrl);
              const reader = new FileReader();
              reader.onload = () => {
                // optional: you may want to store dataUrl; for simplicity we store preview (strings) — if you want dataURL, adapt here
              };
              reader.readAsDataURL(file);
            }} className="mb-3" />
            {bannerCanal && <img src={bannerCanal} alt="Preview banner" className="w-full h-32 object-cover rounded-lg mb-3" />}

            <label className="block font-semibold text-sm mb-1 text-pink-600">Escolher foto de perfil:</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const tmpUrl = URL.createObjectURL(file);
              setFotoPerfilCanal(tmpUrl);
            }} className="mb-3" />
            {fotoPerfilCanal && <img src={fotoPerfilCanal} alt="Preview perfil" className="w-20 h-20 rounded-full object-cover mb-3" />}

            <div className="flex gap-2">
              <button onClick={criarCanal} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:opacity-90">Criar Canal</button>
              <button onClick={() => setAbrirCriarCanal(false)} className="w-full bg-gray-200 py-2 rounded-lg font-semibold">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODAL DE VISUALIZAÇÃO DO VÍDEO -------------------- */}
      {videoModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-4 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <img src={videoModal.canal.fotoPerfil} alt={videoModal.canal.nome} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-semibold">{videoModal.canal.nome}</div>
                  <div className="text-xs text-gray-500">{videoModal.video.title}</div>
                </div>
              </div>
              <button onClick={() => setVideoModal(null)} className="text-pink-600 font-semibold">Fechar</button>
            </div>

            <div>
              {videoModal.video.thumb ? (
                <img src={videoModal.video.thumb} alt="thumb" className="w-full h-96 object-cover rounded-md mb-3" />
              ) : videoModal.video.url ? (
                <video src={videoModal.video.url} controls className="w-full h-96 object-cover rounded-md mb-3" />
              ) : null}
              <p className="text-gray-700">{videoModal.video.desc}</p>
              <div className="text-xs text-gray-400 mt-2">{new Date(videoModal.video.createdAt || 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- NOTIFICAÇÃO -------------------- */}
      {showNotificacao && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>{showNotificacao}</span>
        </div>
      )}
    </div>
  );
}
