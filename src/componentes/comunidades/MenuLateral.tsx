import React, { useState } from 'react';
import { Search, Plus, ChevronLeft } from 'lucide-react';
import { Comunidade } from '../types';
import CriarComunidadesModal from './CriarComunidadesModal'; // nome do arquivo/plural

interface MenuLateralProps {
  comunidades: Comunidade[];
  aoCriarComunidade: (dados: { nome: string; usuario: string; avatar: string }) => void;
  aoEntrarNaComunidade: (comunidadeId: string) => void;
  aoSelecionarComunidade: (comunidade: Comunidade | null) => void; // Aceita null para voltar ao feed
  comunidadeSelecionada: Comunidade | null;
  colapsada: boolean;
  // aoAlternarColapso: () => void; // Descomente se quiser usar o botão
}

const MenuLateral: React.FC<MenuLateralProps> = ({
  comunidades,
  aoCriarComunidade,
  aoEntrarNaComunidade,
  aoSelecionarComunidade,
  comunidadeSelecionada,
  colapsada,
  // aoAlternarColapso
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Adicionado um item "Feed Geral" para desselecionar a comunidade
  const aoSelecionar = (comunidade: Comunidade | null) => {
    aoSelecionarComunidade(comunidade);
  };

  const minhasComunidades = comunidades.filter(c => c.souDono);
  const comunidadesParticipadas = comunidades.filter(c => c.souMembro && !c.souDono);
  const comunidadesExplorar = comunidades.filter(c => !c.souMembro);

  const comunidadesExplorarFiltradas = comunidadesExplorar.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div
        className={`bg-[#FFF6FF] shadow-lg transition-all duration-300 ${
          colapsada ? 'w-0 overflow-hidden' : 'w-80'
        } relative border-r border-pink-100`}
      >

        {/* Botão de colapso */}
        {/* {aoAlternarColapso && (
            <button 
                onClick={aoAlternarColapso} 
                className={`absolute -right-4 top-6 z-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`} 
            > 
                <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${colapsada ? 'rotate-180' : ''}`} /> 
            </button>
        )} */}
            
        <div className="w-[80%] h-[50px] m-auto mt-[15px] flex items-center bg-[#FFF6FF]">
          <h1 className="font-bold text-black text-[22px]">Comunidades</h1>
        </div>

        <div className="p-6 h-screen overflow-y-auto bg-[#FFF6FF]">
          
          {/* Item Feed Geral */}
          <div
            onClick={() => aoSelecionar(null)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 mb-4 ${
              comunidadeSelecionada === null
                ? 'bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200'
                : 'hover:bg-gray-50'
            }`}
          >
            <span className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </span>
            <p className="font-bold text-gray-800 text-sm">Feed Geral</p>
          </div>

          {/* Busca */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar comunidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
            />
          </div>

          {/* Minhas comunidades */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-6 mr-4">Minhas comunidades</h3>
            {minhasComunidades.length === 0 ? (
              <p className="text-gray-400 text-sm mb-6 ml-4">Você ainda não possui comunidades.</p>
            ) : (
              <div className="space-y-2 mb-3">
                {minhasComunidades.map(comunidade => (
                  <div
                    key={comunidade.id}
                    onClick={() => aoSelecionar(comunidade)}
                    className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      comunidadeSelecionada?.id === comunidade.id
                        ? 'bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={comunidade.avatar}
                      alt={comunidade.nome}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{comunidade.nome}</p>
                      <p className="text-xs text-gray-500">{comunidade.usuario}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-[#F36EC0] text-white font-semibold w-[150px] h-[40px] m-auto rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center"
            >
              + Criar comunidade
            </button>
          </div>

          <hr className="border-t border-[#F36EC0] w-full" />

          {/* Comunidades que participo */}
          <div className="mb-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Comunidades que participo</h3>
            {comunidadesParticipadas.length === 0 ? (
              <p className="text-gray-400 text-sm text-center mb-6">Você ainda não faz parte de uma comunidade.</p>
            ) : (
              <div className="space-y-2">
                {comunidadesParticipadas.map(comunidade => (
                  <div
                    key={comunidade.id}
                    onClick={() => aoSelecionar(comunidade)}
                    className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      comunidadeSelecionada?.id === comunidade.id
                        ? 'bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={comunidade.avatar}
                      alt={comunidade.nome}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{comunidade.nome}</p>
                      <p className="text-xs text-gray-500">{comunidade.usuario}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-t border-[#F36EC0] w-full" />

          {/* Explorar */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              Explorar
            </h3>
            <div className="space-y-2">
              {comunidadesExplorarFiltradas.map(comunidade => (
                <div
                  key={comunidade.id}
                  className="flex items-center p-3 rounded-lg border border-pink-100 hover:border-pink-200 transition-all duration-200 bg-gradient-to-r from-white to-pink-25"
                >
                  <img
                    src={comunidade.avatar}
                    alt={comunidade.nome}
                    className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                    onClick={() => aoSelecionar(comunidade)}
                  />
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => aoSelecionar(comunidade)}
                  >
                    <p className="font-medium text-gray-800 text-sm">{comunidade.nome}</p>
                    <p className="text-xs text-gray-500">{comunidade.usuario}</p>
                  </div>
                  <button
                    onClick={() => aoEntrarNaComunidade(comunidade.id)}
                    className="text-pink-600 font-bold px-3 py-1 rounded-lg text-xs hover:shadow-md transition-all duration-200 transform hover:scale-105"
                  >
                    Entrar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CriarComunidadesModal
        estaAberto={showCreateModal}
        aoFechar={() => setShowCreateModal(false)}
        aoCriar={aoCriarComunidade}
      />
    </>
  );
};

export default MenuLateral;