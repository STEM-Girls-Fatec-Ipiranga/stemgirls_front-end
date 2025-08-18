// 📌 PostCard.tsx
import React, { useState } from 'react';
import { MoreHorizontal, Clock } from 'lucide-react';
import { Postagem, Comunidade } from '../types';

interface CartaoPostagemProps {
  postagem: Postagem;
  aoEntrarNaComunidade: (idComunidade: string) => void;
  aoExcluirPostagem: (idPostagem: string) => void;
  comunidades: Comunidade[];
}

const CartaoPostagem: React.FC<CartaoPostagemProps> = ({ 
  postagem, 
  aoEntrarNaComunidade, 
  aoExcluirPostagem, 
  comunidades 
}) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  
  const comunidade = comunidades.find(c => c.id === postagem.comunidadeId);
  const podeExcluir = comunidade?.souDono;
  const ehMembro = comunidade?.souMembro;

  const formatarTempoAtras = (data: Date) => {
    const agora = new Date();
    const diffEmMinutos = Math.floor((agora.getTime() - data.getTime()) / (1000 * 60));
    
    if (diffEmMinutos < 60) return `${diffEmMinutos}min`;
    if (diffEmMinutos < 1440) return `${Math.floor(diffEmMinutos / 60)}h`;
    return `${Math.floor(diffEmMinutos / 1440)}d`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Cabeçalho */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={postagem.comunidadeAvatar}
            alt={postagem.comunidadeNome}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{postagem.comunidadeNome}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {formatarTempoAtras(postagem.dataCriacao)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!ehMembro && (
            <button
              onClick={() => aoEntrarNaComunidade(postagem.comunidadeId)}
              className="bg-pink-600 text-white px-4 py-1 rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Entrar
            </button>
          )}
          
          <div className="relative">
            <button
              onClick={() => setMostrarMenu(!mostrarMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
            
            {mostrarMenu && (
              <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-32">
                {podeExcluir && (
                  <button
                    onClick={() => {
                      aoExcluirPostagem(postagem.id);
                      setMostrarMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm transition-colors duration-200"
                  >
                    Excluir
                  </button>
                )}
                <button
                  onClick={() => setMostrarMenu(false)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-600 text-sm transition-colors duration-200"
                >
                  Denunciar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Imagem */}
      {postagem.imagem && (
        <div className="px-4">
          <img
            src={postagem.imagem}
            alt="Postagem"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-4">
        <h2 className="font-bold text-lg text-gray-800 mb-2">{postagem.titulo}</h2>
        <p className="text-gray-600 leading-relaxed">{postagem.conteudo}</p>
      </div>
    </div>
  );
};

export default CartaoPostagem;
