import React, { useState } from "react";
import MenuLateralComunidades from "./MenuLateralComunidades";
import Postagem from "./Postagem";
import ComunidadeMiniatura from "./ComunidadeMiniatura";
import Comunidade from "./Comunidade";
import { Search } from 'lucide-react';
import PerfilComunidade from "./PerfilComunidade";
import Categoria from "./Categoria";

export default function Comunidades() {

    const [comunidade, setComunidade] = useState(false);
    const [postagens, setPostagens] = useState(true);
    const [comunidadeSelecionada, setComunidadeSelecionada] = useState({ id: '', nome: '', usuario: '', imagem: '' });

    const minhasComunidades = [
        {
            id: 'c1',
            nome: 'Comunidade Teste',
            nomeUsuario: 'Nome Usuário Comunidade',
            imagem: 'https://i.ibb.co/6P0wW0X/stemgirls.png'
        }
    ];

    const comunidadesParticipo = [
        {
            id: 'c2',
            nome: 'Comunidade que Participo Teste',
            nomeUsuario: 'Nome Usuário Comunidade',
            imagem: 'https://i.ibb.co/6P0wW0X/stemgirls.png'
        }
    ];

    const itemComunidade = {
        id: 'c1',
        nome: 'Comunidade Teste',
        nomeUsuario: 'Nome Usuário Comunidade',
        imagem: 'https://i.ibb.co/6P0wW0X/stemgirls.png'
    };

    const listaPostagens = [
        {
            id: 'p1',
            titulo: 'Título da Postagem',
            conteudo: 'Conteúdo da Postagem',
            imagem: 'https://i.ibb.co/QrfjN08/lideranca.png',
            dataCriacao: new Date()
        },
        {
            id: 'p2',
            titulo: 'Título da Postagem',
            conteudo: 'Conteúdo da Postagem',
            imagem: 'https://i.ibb.co/QrfjN08/lideranca.png',
            dataCriacao: new Date()
        }
    ];

    const selecionarComunidade = (comunidade) => {
        setComunidadeSelecionada(comunidade);
        setComunidade(true);
        setPostagens(false);
    };

    const voltarFeed = () => {
        setComunidade(false);
        setPostagens(true);
        setComunidadeSelecionada({ id: '', nome: '', usuario: '', imagem: '' });
    }

    return (
        <>
            <div
                className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50"
            >
                <div className="flex">
                    {/* <MenuLateralComunidades minhasComunidades={minhasComunidades} /> */}

                    <aside className="flex flex-col p-4 bg-[#FFF6FF] shadow-lg transition-all duration-300">

                        <div className="bg-[#FFF6FF]">
                            <h1 className="font-bold text-black text-[22px]">Comunidades</h1>
                        </div>

                        <div className="p-6 flex items-center bg-[#FFF6FF]">
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
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                            />
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-6 mr-4">Minhas comunidades</h3>
                            {minhasComunidades.length == 0 ? (
                                <p className="text-gray-400 text-sm mb-6 ml-4">Você ainda não possui comunidades</p>
                            ) : (
                                <div className="space-y-2 mb-3">
                                    {minhasComunidades.map(comunidade => (
                                        <ComunidadeMiniatura
                                            key={comunidade.id}
                                            comunidade={comunidade}
                                            comunidadeSelecionada={comunidadeSelecionada}
                                            selecionarComunidade={selecionarComunidade}
                                        />
                                    ))}
                                </div>
                            )}

                            <button className="w-full bg-[#F36EC0] text-white font-semibold h-[40px] m-auto rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-medium">
                                + Criar comunidade
                            </button>
                        </div>

                        <hr className="border-t border-[#F36EC0] w-full" />

                        <div className="mb-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Comunidades que participo</h3>
                            {comunidadesParticipo.length == 0 ? (
                                <p className="text-gray-400 text-sm text-center mb-6">Você ainda não faz parte de uma comunidade</p>
                            ) : (
                                <div className="space-y-2">
                                    {comunidadesParticipo.map(comunidade => (
                                        <ComunidadeMiniatura
                                            key={comunidade.id}
                                            comunidade={comunidade}
                                            comunidadeSelecionada={comunidadeSelecionada}
                                            selecionarComunidade={selecionarComunidade}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>

                    <main className="flex-1 transition-all duration-300">
                        <div className="max-w-4xl mx-auto p-6 bg-[#FFF6FF]">
                            {postagens && (
                                <div className="mb-6">
                                    <div className="flex flex-col gap-2">
                                        <h1 className="text-2xl font-bold text-black">
                                            Postagens
                                        </h1>
                                        <p className="text-gray-600">Descubra conteúdos incríveis das comunidades Stem Girls</p>
                                    </div>
                                    <div className="flex items-center space-x-4 my-6 flex flex-row">
                                        <Categoria
                                            nome="Tudo"
                                        />
                                        <Categoria
                                            nome="Mais recentes"
                                        />
                                        <Categoria
                                            nome="Em alta"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-6">
                                {postagens && (
                                    listaPostagens.map(postagem => (
                                        <Postagem key={postagem.id} comunidade={itemComunidade} postagem={postagem} />
                                    ))
                                )}
                            </div>

                            {comunidade && (
                                <Comunidade
                                    comunidade={comunidadeSelecionada}
                                    postagens={listaPostagens}
                                    voltarFeed={voltarFeed}
                                />
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}