import React from 'react';
import { Postagem, Comunidade } from '../types';
import PostCard from './PostCard'; // Seu CartaoPostagem.tsx
import PerfilComunidade from './PerfilComunidade';

interface ConteudoProps { // Alterado de FeedProps para ConteudoProps para refletir seu uso
  postagens: Postagem[];
  comunidades: Comunidade[];
  comunidadeSelecionada: Comunidade | null;
  aoEntrarNaComunidade: (comunidadeId: string) => void;
  aoCriarPostagem: (
    comunidadeId: string,
    dadosPostagem: { titulo: string; conteudo: string; imagem?: string }
  ) => void;
  aoExcluirPostagem: (postagemId: string) => void;
  aoExcluirComunidade: (comunidadeId: string) => void;
  aoVoltarParaFeed: () => void;
  barraLateralColapsada: boolean;
}

const Conteudo: React.FC<ConteudoProps> = ({
  postagens,
  comunidades,
  comunidadeSelecionada,
  aoEntrarNaComunidade,
  aoCriarPostagem,
  aoExcluirPostagem,
  aoExcluirComunidade,
  aoVoltarParaFeed,
  barraLateralColapsada
}) => {
  if (comunidadeSelecionada) {
    return (
      <div className={`flex-1 transition-all duration-300 ${barraLateralColapsada ? 'ml-0' : 'ml-0'}`}>
        <PerfilComunidade
          comunidade={comunidadeSelecionada}
          aoCriarPostagem={aoCriarPostagem}
          aoExcluirPostagem={aoExcluirPostagem}
          aoExcluirComunidade={aoExcluirComunidade}
          aoVoltar={aoVoltarParaFeed}
          aoEntrarNaComunidade={aoEntrarNaComunidade}
          // Passamos a lista completa de comunidades para que o PostCard funcione dentro do PerfilComunidade
          comunidades={comunidades} 
        />
      </div>
    );
  }

  // Lógica de filtro para o feed geral - apenas postagens de comunidades que você é membro ou dono
  const postagensFiltradas = postagens.filter(p => {
    const comunidade = comunidades.find(c => c.id === p.comunidadeId);
    return comunidade?.souMembro || !comunidade; // Se for membro, exibe. Se a comunidade não existir, também exibe por garantia (ou ajuste se quiser regras mais rígidas)
  });


  return (
    <div className={`flex-1 transition-all duration-300 ${barraLateralColapsada ? 'ml-0' : 'ml-0'}`}>
      <div className="max-w-4xl mx-auto p-6 bg-[#FFF6FF]"> {/* Adicionei max-w e mx-auto para centralizar o conteúdo */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black">
            Postagens
          </h1>
          <div className="flex items-center space-x-2 m-6 flex flex-row">
            <button
              className="w-[90px] h-[40px] bg-transparent text-[#F33EC0] rounded-lg border border-2 border-[#F33EC0] font-bold hover:text-white hover:bg-[#F33EC0] transition-all duration-200"
            >
              Em alta
            </button>
            <button
              className="w-[135px] h-[40px] bg-transparent text-[#F33EC0] rounded-lg border border-2 border-[#F33EC0] font-bold hover:text-white hover:bg-[#F33EC0] transition-all duration-200"
            >
              Mais recentes
            </button>
          </div>
          <p className="text-gray-600 m-6">Descubra conteúdos incríveis das comunidades Stem Girls</p>
        </div>

        {postagensFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhuma postagem ainda</h3>
            <p className="text-gray-500">
              As comunidades que você participa ainda não fizeram postagens. Volte mais tarde!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {postagensFiltradas.map(postagem => (
              <PostCard
                key={postagem.id}
                postagem={postagem}
                aoEntrarNaComunidade={aoEntrarNaComunidade}
                aoExcluirPostagem={aoExcluirPostagem}
                comunidades={comunidades}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Conteudo;