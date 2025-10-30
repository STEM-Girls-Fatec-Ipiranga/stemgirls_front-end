import React, { useEffect, useState } from "react";
import { Search } from 'lucide-react';

export default function Canais() {
  const [canais, setCanais] = useState([]);
  const [search, setSearch] = useState("");
  const [inscritos, setInscritos] = useState([]);
  const [canalSelecionado, setCanalSelecionado] = useState(null);


  const canaisPadrao = [
    {
      id: 1,
      nome: "Tech World",
      descricao: "Dicas de tecnologia e programação.",
      banner: "/src/assets/img/FundoSGcolorido.jpg",
      fotoPerfil: "/src/assets/img/katherine-johnson.jpg",
      inscritos: 823,
      videos: ["Como usar React", "CSS moderno", "O poder do Tailwind"],
    },
    {
      id: 2,
      nome: "Tech para Todos",
      descricao: "Receitas simples e deliciosas!",
      banner: "/src/assets/img/FundoSGcolorido.jpg",
      fotoPerfil: "/src/assets/img/Adalovelace.png",
      inscritos: 1540,
      videos: ["Torta de maçã", "Massa fresca caseira", "Dicas de temperos"],
    },
    {
      id: 3,
      nome: "Mundo Gamer",
      descricao: "Gameplay e notícias de jogos.",
      banner: "/src/assets/img/FundoSGcolorido.jpg",
      fotoPerfil: "/src/assets/img/grace-hopper.jpg",
      inscritos: 2310,
      videos: ["Top 5 jogos 2025", "Segredos do Minecraft", "Zerando Elden Ring"],
    },
    {
      id: 4,
      nome: "Girls Power",
      descricao: "Saúde, bem-estar e treinos diários.",
      banner: "/src/assets/img/FundoSGcolorido.jpg",
      fotoPerfil: "/src/assets/img/lucianasantos.png",
      inscritos: 970,
      videos: ["Treino em casa", "Alimentação saudável", "Rotina matinal"],
    },
  ];


  useEffect(() => {
    const armazenados = JSON.parse(localStorage.getItem("canais")) || [];
    const todosCanais = mergeCanaisPadraoComPersonalizados(canaisPadrao, armazenados);
    setCanais(todosCanais);

    const inscritosSalvos = JSON.parse(localStorage.getItem("inscritos")) || [];
    setInscritos(inscritosSalvos);
  }, []);

  useEffect(() => {
    const atualizar = () => {
      const armazenados = JSON.parse(localStorage.getItem("canais")) || [];
      const todosCanais = mergeCanaisPadraoComPersonalizados(canaisPadrao, armazenados);
      setCanais(todosCanais);
    };

    window.addEventListener("focus", atualizar);
    return () => window.removeEventListener("focus", atualizar);
  }, []);


  const mergeCanaisPadraoComPersonalizados = (padrao, personalizados) => {
    const map = new Map();
    [...padrao, ...personalizados].forEach((c) => map.set(c.id, c));
    return Array.from(map.values());
  };

  const toggleInscricao = (id) => {
    let atualizados = [...inscritos];
    const jaInscrito = atualizados.includes(id);

    const novosCanais = canais.map((canal) => {
      if (canal.id === id) {
        const novosInscritos = jaInscrito
          ? Math.max(0, canal.inscritos - 1)
          : canal.inscritos + 1;
        return { ...canal, inscritos: novosInscritos };
      }
      return canal;
    });

    if (jaInscrito) {
      atualizados = atualizados.filter((c) => c !== id);
    } else {
      atualizados.push(id);
    }

    setCanais(novosCanais);
    setInscritos(atualizados);
    localStorage.setItem("inscritos", JSON.stringify(atualizados));
    localStorage.setItem(
      "canais",
      JSON.stringify(novosCanais.filter((c) => c.id > 4))
    );

    if (canalSelecionado && canalSelecionado.id === id) {
      const atualizado = novosCanais.find((c) => c.id === id);
      setCanalSelecionado(atualizado);
    }
  };


  const excluirCanal = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este canal?")) {
      const novos = canais.filter((c) => c.id !== id);
      setCanais(novos);

      const personalizados = novos.filter((c) => c.id > 4);
      localStorage.setItem("canais", JSON.stringify(personalizados));
      setCanalSelecionado(null);
    }
  };

  const excluirVideo = (canalId, indexVideo) => {
    if (window.confirm("Tem certeza que deseja excluir este vídeo?")) {
      const novos = canais.map((c) => {
        if (c.id === canalId) {
          const novosVideos = c.videos.filter((_, i) => i !== indexVideo);
          return { ...c, videos: novosVideos };
        }
        return c;
      });

      setCanais(novos);
      localStorage.setItem(
        "canais",
        JSON.stringify(novos.filter((c) => c.id > 4))
      );

      if (canalSelecionado && canalSelecionado.id === canalId) {
        setCanalSelecionado({
          ...canalSelecionado,
          videos: canalSelecionado.videos.filter((_, i) => i !== indexVideo),
        });
      }
    }
  };


  const canaisFiltrados = canais.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase())
  );

  const meusCanais = canais.filter((c) => inscritos.includes(c.id));
  const sugeridos = canais.filter((c) => !inscritos.includes(c.id));

  return (
    <div className="flex h-screen bg-[#FFF6FF] text-black">
      {/* LATERAL */}
      <aside className="w-72 bg-[#FFF6FF] shadow-lg transition-all duration-30 flex flex-col p-4">

        <div className="w-[80%] mb-[15px] mt-[15px] flex items-center bg-[#FFF6FF]">
          <h1 className="font-bold text-black text-[22px]">Canais</h1>
        </div>

        <div>
          <div className="relative">
            <Search className="absolute left-3 top-7 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar canal..."
              className="w-full pl-10 pr-4 py-2 mt-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>


          <h3 className="text-lg font-bold mt-6 mb-2">
            Meus Canais
          </h3>
          {meusCanais.length > 0 ? (
            <ul className="space-y-2">
              {meusCanais.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-pink-50 p-2 rounded-lg"
                  onClick={() => setCanalSelecionado(c)}
                >
                  <img
                    src={c.fotoPerfil}
                    className="w-8 h-8 rounded-full object-cover"
                    alt=""
                  />
                  <span className="text-sm font-semibold">{c.nome}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              Você ainda não se inscreveu em canais.
            </p>
          )}

          <button
            onClick={() => window.open("/criar-canal", "_blank")}
            className="bg-[#F36EC0] mt-8 text-white w-full py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center"
          >
            + Criar Canal
          </button>

          <h3 className="text-lg font-bold mt-6 mb-2">
            Sugeridos
          </h3>
          <ul className="space-y-2">
            {sugeridos.slice(0, 4).map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-pink-50 p-2 rounded-lg"
                onClick={() => setCanalSelecionado(c)}
              >
                <img
                  src={c.fotoPerfil}
                  className="w-8 h-8 rounded-full object-cover"
                  alt=""
                />
                <span className="text-sm font-semibold">{c.nome}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-6">
        {canalSelecionado ? (
          <div className="bg-white rounded-xl shadow-md p-6 border border-pink-100">
            <button
              onClick={() => setCanalSelecionado(null)}
              className="mb-4 text-pink-600 font-semibold hover:underline"
            >
              ← Voltar
            </button>

            <img
              src={canalSelecionado.banner}
              className="w-full h-48 object-cover rounded-xl mb-4"
              alt="banner"
            />
            <div className="flex items-center gap-4 mb-4">
              <img
                src={canalSelecionado.fotoPerfil}
                className="w-16 h-16 rounded-full object-cover"
                alt=""
              />
              <div>
                <h2 className="text-2xl font-bold">{canalSelecionado.nome}</h2>
                <p className="text-gray-600">
                  {canalSelecionado.inscritos} inscritos
                </p>
              </div>
              <button
                onClick={() => toggleInscricao(canalSelecionado.id)}
                className={`ml-auto px-4 py-2 rounded-lg font-semibold ${inscritos.includes(canalSelecionado.id)
                  ? "bg-gray-200 text-gray-700"
                  : "bg-[#F36EC0] text-white"
                  }`}
              >
                {inscritos.includes(canalSelecionado.id)
                  ? "Inscrito"
                  : "Inscrever-se"}
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold">
                Publicar Vídeo
              </button>

              <button
                onClick={() => excluirCanal(canalSelecionado.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Excluir Canal
              </button>
            </div>

            <h3 className="text-lg font-bold text-pink-600 mb-2">Vídeos</h3>
            {canalSelecionado.videos?.length > 0 ? (
              <ul className="space-y-2">
                {canalSelecionado.videos.map((v, i) => (
                  <li
                    key={i}
                    className="bg-pink-50 border border-pink-100 p-2 rounded-lg flex justify-between items-center"
                  >
                    <span>🎬 {v}</span>
                    <button
                      onClick={() => excluirVideo(canalSelecionado.id, i)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Excluir
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhum vídeo disponível.</p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {canaisFiltrados.map((canal) => (
                <div
                  key={canal.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg border border-pink-100"
                  onClick={() => setCanalSelecionado(canal)}
                >
                  <img
                    src={canal.banner}
                    className="w-full h-32 object-cover"
                    alt="banner"
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={canal.fotoPerfil}
                        className="w-12 h-12 rounded-full object-cover"
                        alt=""
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{canal.nome}</h3>
                        <p className="text-sm text-gray-600">
                          {canal.inscritos} inscritos
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleInscricao(canal.id);
                        }}
                        className={`w-full py-2 rounded-lg font-semibold ${inscritos.includes(canal.id)
                          ? "bg-gray-200 text-gray-700"
                          : "bg-[#F36EC0] text-white"
                          }`}
                      >
                        {inscritos.includes(canal.id)
                          ? "Cancelar inscrição"
                          : "Inscrever-se"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
