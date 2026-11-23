import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Postagem from "./Postagem";
import ComunidadeMiniatura from "./ComunidadeMiniatura";
import Comunidade from "./Comunidade";
import Categoria from "../Categoria";
import CriarComunidadeModal from "./CriarComunidadeModal";
import CriarPostagemModal from "./CriarPostagemModal";

const API = "http://localhost:8080/api";
const FILTROS = { "Tudo": "", "Mais recentes": "recentes", "Em alta": "alta" };
const VAZIA = { id: '', nome: '', nomeUsuario: '', imagem: '' };

// monta a query string ignorando valores vazios
const params = (obj) => new URLSearchParams(Object.entries(obj).filter(([, v]) => v)).toString();

async function api(caminho, opcoes = {}) {
    const resposta = await fetch(`${API}${caminho}`, {
        headers: { "Content-Type": "application/json" },
        ...opcoes,
    });
    if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        throw new Error(erro.message || "Algo deu errado. Tente novamente.");
    }
    return resposta.json();
}

export default function Comunidades() {
    const usuarioId = JSON.parse(localStorage.getItem("user") || "null")?.id;

    const [verComunidade, setVerComunidade] = useState(false);
    const [comunidadeSelecionada, setComunidadeSelecionada] = useState(VAZIA);
    const [criarComunidade, setCriarComunidade] = useState(false);
    const [criarPostagem, setCriarPostagem] = useState(false);
    const [selecionado, setSelecionado] = useState("Tudo");
    const [busca, setBusca] = useState("");
    const [explorar, setExplorar] = useState([]);

    const [minhasComunidades, setMinhasComunidades] = useState([]);
    const [comunidadesParticipo, setComunidadesParticipo] = useState([]);
    const [resultadosBusca, setResultadosBusca] = useState([]);
    const [feed, setFeed] = useState([]);
    const [postagensComunidade, setPostagensComunidade] = useState([]);

    // ---------- carregamento ----------
    const carregarComunidades = async () => {
    const todas = await api(`/comunidades?${params({ usuarioId })}`);
    setExplorar(todas.filter(c => !c.souMembro));
    if (!usuarioId) return;
    setMinhasComunidades(await api(`/comunidades?${params({ filtro: "minhas", usuarioId })}`));
    setComunidadesParticipo(await api(`/comunidades?${params({ filtro: "participo", usuarioId })}`));
    };

    const carregarFeed = async () =>
        setFeed(await api(`/postagens?${params({ filtro: FILTROS[selecionado], usuarioId })}`));

    const carregarPostagensComunidade = async (id) =>
        setPostagensComunidade(await api(`/comunidades/${id}/postagens?${params({ usuarioId })}`));

    useEffect(() => { carregarComunidades().catch(console.error); }, []);
    useEffect(() => { carregarFeed().catch(console.error); }, [selecionado]);
    useEffect(() => {
        if (!busca.trim()) {
            setResultadosBusca([]);
            return;
        }
        api(`/comunidades?${params({ busca, usuarioId })}`).then(setResultadosBusca).catch(console.error);
    }, [busca]);

    // ---------- ações ----------
    const selecionarComunidade = async (c) => {
        setComunidadeSelecionada(c);
        setVerComunidade(true);
        await carregarPostagensComunidade(c.id).catch(console.error);
    };

    const voltarFeed = () => {
        setVerComunidade(false);
        setComunidadeSelecionada(VAZIA);
        carregarFeed().catch(console.error);
    };

    const entrar = async (id) => {
    if (!usuarioId) return alert("Faça login para entrar em uma comunidade");
    try {
        const atualizada = await api(`/comunidades/${id}/entrar?${params({ usuarioId })}`, { method: "POST" });
        if (comunidadeSelecionada.id === id) setComunidadeSelecionada(atualizada);
        setResultadosBusca(lista => lista.map(c => (c.id === id ? atualizada : c)));
        await Promise.all([carregarComunidades(), carregarFeed()]);
    } catch (e) {
        alert(e.message);
    }
    };

    const criar = async (dados) => {
        if (!usuarioId) throw new Error("Faça login para criar uma comunidade");
        await api("/comunidades", { method: "POST", body: JSON.stringify({ ...dados, usuarioId }) });
        await carregarComunidades();
    };

    const publicar = async (dados) => {
        if (!usuarioId) throw new Error("Faça login para publicar");
        await api(`/comunidades/${comunidadeSelecionada.id}/postagens`, {
            method: "POST",
            body: JSON.stringify({ ...dados, usuarioId }),
        });
        await carregarPostagensComunidade(comunidadeSelecionada.id);
    };

    const curtir = async (id) => {
        if (!usuarioId) return alert("Faça login para curtir");
        try {
            const atualizada = await api(`/postagens/${id}/curtir?${params({ usuarioId })}`, { method: "POST" });
            const trocar = (lista) => lista.map(p => (p.id === id ? atualizada : p));
            setFeed(trocar);
            setPostagensComunidade(trocar);
        } catch (e) {
            alert(e.message);
        }
    };
    const linhaComunidade = (c) => (
        <div key={c.id} className="flex items-center p-2 rounded-lg border border-pink-100 bg-white">
            <img
                src={c.imagem}
                alt={c.nome}
                className="w-8 h-8 rounded-full mr-3 object-cover cursor-pointer"
                onClick={() => selecionarComunidade(c)}
            />
            <div className="flex-1 cursor-pointer" onClick={() => selecionarComunidade(c)}>
                <p className="font-medium text-gray-800 text-sm">{c.nome}</p>
                <p className="text-xs text-gray-500">{c.nomeUsuario}</p>
            </div>
            {!c.souMembro && (
                <button
                    onClick={() => entrar(c.id)}
                    className="text-pink-600 font-bold px-3 py-1 rounded-lg text-xs hover:bg-pink-100 transition-all duration-200"
                >
                    Entrar
                </button>
            )}
        </div>
    );
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex">

                    <aside className="flex flex-col p-4 bg-[#FFF6FF] shadow-lg transition-all duration-300">

                        <div className="bg-[#FFF6FF]">
                            <h1 className="font-bold text-black text-[22px]">Comunidades</h1>
                        </div>

                        <div className="p-6 flex items-center bg-[#FFF6FF] cursor-pointer" onClick={voltarFeed}>
                            <span className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </span>
                            <p className="font-bold text-gray-800 text-sm">Feed Geral</p>
                        </div>

                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar comunidade..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                            />
                        </div>

                       {busca.trim() && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Resultados</h3>
                                {resultadosBusca.length === 0 ? (
                                    <p className="text-gray-400 text-sm">Nenhuma comunidade encontrada</p>
                                ) : (
                                    <div className="space-y-2">
                                        {resultadosBusca.map(linhaComunidade)}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-6 mr-4">Minhas comunidades</h3>
                            {minhasComunidades.length === 0 ? (
                                <p className="text-gray-400 text-sm mb-6 ml-4">Você ainda não possui comunidades</p>
                            ) : (
                                <div className="space-y-2 mb-3">
                                    {minhasComunidades.map(c => (
                                        <ComunidadeMiniatura
                                            key={c.id}
                                            comunidade={c}
                                            comunidadeSelecionada={comunidadeSelecionada}
                                            selecionarComunidade={selecionarComunidade}
                                        />
                                    ))}
                                </div>
                            )}

                            <button
                                className="w-full bg-[#F36EC0] text-white font-semibold h-[40px] m-auto rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-medium"
                                onClick={() => setCriarComunidade(true)}
                            >
                                + Criar comunidade
                            </button>
                        </div>

                        <hr className="border-t border-[#F36EC0] w-full" />

                        <div className="mb-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Comunidades que participo</h3>
                            {comunidadesParticipo.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center mb-6">Você ainda não faz parte de uma comunidade</p>
                            ) : (
                                <div className="space-y-2">
                                    {comunidadesParticipo.map(c => (
                                        <ComunidadeMiniatura
                                            key={c.id}
                                            comunidade={c}
                                            comunidadeSelecionada={comunidadeSelecionada}
                                            selecionarComunidade={selecionarComunidade}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <hr className="border-t border-[#F36EC0] w-full" />

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Explorar</h3>
                            {explorar.length === 0 ? (
                                <p className="text-gray-400 text-sm">Nenhuma comunidade nova por enquanto</p>
                            ) : (
                                <div className="space-y-2">
                                    {explorar.map(linhaComunidade)}
                                </div>
                            )}
                        </div>
                    </aside>

                    <main className="flex-1 transition-all duration-300">
                        <div className="max-w-4xl mx-auto p-6 bg-[#FFF6FF]">
                            {!verComunidade && (
                                <>
                                    <div className="mb-6">
                                        <div className="flex flex-col gap-2">
                                            <h1 className="text-2xl font-bold text-black">Postagens</h1>
                                            <p className="text-gray-600">Descubra conteúdos incríveis das comunidades Stem Girls</p>
                                        </div>
                                        <div className="flex items-center space-x-4 my-6 flex flex-row">
                                            {Object.keys(FILTROS).map((tipo) => (
                                            <button
                                                key={tipo}
                                                onClick={() => setSelecionado(tipo)}
                                                className={`px-4 py-1 rounded-lg border-2 border-pink-500 font-bold transition-all duration-200 ${
                                                    selecionado === tipo
                                                        ? "bg-pink-500 text-white"
                                                        : "bg-white text-pink-600 hover:bg-pink-100"
                                                }`}
                                            >
                                                {tipo}
                                            </button>
                                        ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        {feed.length === 0 ? (
                                            <p className="text-gray-500 text-center py-12">Nenhuma postagem ainda</p>
                                        ) : (
                                            feed.map(p => (
                                                <Postagem key={p.id} postagem={p} entrar={entrar} curtir={curtir} />
                                            ))
                                        )}
                                    </div>
                                </>
                            )}

                            {verComunidade && (
                                <Comunidade
                                    comunidade={comunidadeSelecionada}
                                    postagens={postagensComunidade}
                                    voltarFeed={voltarFeed}
                                    entrar={() => entrar(comunidadeSelecionada.id)}
                                    publicar={() => setCriarPostagem(true)}
                                    curtir={curtir}
                                />
                            )}

                            {criarComunidade && (
                                <CriarComunidadeModal fechar={() => setCriarComunidade(false)} criar={criar} />
                            )}

                            {criarPostagem && (
                                <CriarPostagemModal fechar={() => setCriarPostagem(false)} criar={publicar} />
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}