// 📌 PostCard.tsx
import React, { useState } from 'react';
import { MoreHorizontal, Clock, Trash2 } from 'lucide-react';
import { Postagem, Comunidade } from '../types';

interface PostCardProps { // <-- Corrigido para PostCardProps
  postagem: Postagem;
  aoEntrarNaComunidade?: (idComunidade: string) => void;
  aoExcluirPostagem?: (idPostagem: string) => void;
  comunidades: Comunidade[];
}

const PostCard: React.FC<PostCardProps> = ({ // <-- Corrigido para PostCard
  postagem, 
  aoEntrarNaComunidade, 
  aoExcluirPostagem, 
  comunidades 
}) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  
  // 🔹 Busca os dados da comunidade
  const comunidade = comunidades.find(c => c.id === postagem.comunidadeId);
  // Permite excluir se for dono da comunidade e se a função foi passada
  const podeExcluir = comunidade?.souDono && !!aoExcluirPostagem; 
  const ehMembro = comunidade?.souMembro;

  const formatarTempoAtras = (data: Date) => {
    const agora = new Date();
    const diffEmMinutos = Math.floor((agora.getTime() - data.getTime()) / (1000 * 60));
    
    if (diffEmMinutos < 60) return `${diffEmMinutos}min`;
    if (diffEmMinutos < 1440) return `${Math.floor(diffEmMinutos / 60)}h`;
    return `${Math.floor(diffEmMinutos / 1440)}d`;
  };

  const handleExcluir = () => {
    if (podeExcluir && aoExcluirPostagem) {
      aoExcluirPostagem(postagem.id);
      setMostrarMenu(false);
    }
  }

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
              {formatarTempoAtras(new Date(postagem.dataCriacao))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!ehMembro && aoEntrarNaComunidade && (
            <button
              onClick={() => aoEntrarNaComunidade(postagem.comunidadeId)}
              className="bg-pink-600 text-white px-4 py-1 rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Entrar
            </button>
          )}
          
          {(podeExcluir || !ehMembro) && ( 
            <div className="relative">
              <button
                onClick={() => setMostrarMenu(!mostrarMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>

              {mostrarMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 border border-gray-100">
                  {podeExcluir && (
                    <button
                      onClick={handleExcluir}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-150"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Postagem
                    </button>
                  )}
                  {/* Outras opções futuras, como Denunciar */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-4 pb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{postagem.titulo}</h2>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{postagem.conteudo}</p>
        {postagem.imagem && (
          <img
            src={postagem.imagem}
            alt="Imagem da postagem"
            className="w-full max-h-80 object-cover rounded-lg border border-gray-100 mt-2"
          />
        )}
      </div>
    </div>
  );
};

export default PostCard;