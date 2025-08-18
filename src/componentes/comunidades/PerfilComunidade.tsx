import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Users } from 'lucide-react';
import { Comunidade } from '../types';
import CartaoPostagem from './PostCard'; // Corrigido nome do componente importado
import CriarPostModal from './CriarPostModal';

interface PerfilComunidadeProps {
    comunidade: Comunidade;
    aoCriarPostagem: (comunidadeId: string, dadosPostagem: { titulo: string; conteudo: string; imagem?: string }) => void;
    aoExcluirPostagem: (postagemId: string) => void;
    aoExcluirComunidade: (comunidadeId: string) => void;
    aoVoltar: () => void;
    aoEntrarNaComunidade: (comunidadeId: string) => void;
}

const PerfilComunidade: React.FC<PerfilComunidadeProps> = ({
    comunidade,
    aoCriarPostagem,
    aoExcluirPostagem,
    aoExcluirComunidade,
    aoVoltar,
    aoEntrarNaComunidade
}) => {
    const [mostrarCriarPostagem, setMostrarCriarPostagem] = useState(false);
    const [mostrarConfirmacaoExclusao, setMostrarConfirmacaoExclusao] = useState(false);

    const excluirComunidade = () => {
        aoExcluirComunidade(comunidade.id);
        setMostrarConfirmacaoExclusao(false);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-6">
                {/* Botão Voltar */}
                <button
                    onClick={aoVoltar}
                    className="flex items-center mb-6 text-pink-600 hover:text-pink-700 transition-colors duration-200"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Voltar ao feed
                </button>

                {/* Cabeçalho da Comunidade */}
                <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <img
                                src={comunidade.avatar}
                                alt={comunidade.nome}
                                className="w-20 h-20 rounded-full mr-6 border-4 border-pink-100"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{comunidade.nome}</h1>
                                <p className="text-gray-600 mb-2">{comunidade.usuario}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Users className="h-4 w-4 mr-1" />
                                    {comunidade.postagens.length} postagens
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {!comunidade.souMembro && !comunidade.souDono && (
                                <button
                                    onClick={() => aoEntrarNaComunidade(comunidade.id)}
                                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200 transform hover:scale-105"
                                >
                                    Entrar na comunidade
                                </button>
                            )}

                            {comunidade.souDono && (
                                <>
                                    <button
                                        onClick={() => setMostrarCriarPostagem(true)}
                                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200 transform hover:scale-105 flex items-center"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Fazer publicação
                                    </button>

                                    <button
                                        onClick={() => setMostrarConfirmacaoExclusao(true)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200 transform hover:scale-105 flex items-center"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Excluir comunidade
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Postagens */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Postagens da comunidade</h2>

                    {comunidade.postagens.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-pink-100">
                            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {comunidade.souDono ? 'Você ainda não possui postagens' : 'Nenhuma postagem ainda'}
                            </h3>
                            <p className="text-gray-500">
                                {comunidade.souDono
                                    ? 'Crie sua primeira postagem para compartilhar com a comunidade!'
                                    : 'Esta comunidade ainda não fez nenhuma publicação.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {comunidade.postagens.map(postagem => (
                                <CartaoPostagem
                                    key={postagem.id}
                                    postagem={postagem}
                                    aoEntrarNaComunidade={aoEntrarNaComunidade}
                                    aoExcluirPostagem={aoExcluirPostagem}
                                    comunidades={[comunidade]}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Confirmação de Exclusão */}
            {mostrarConfirmacaoExclusao && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirmar exclusão</h3>
                        <p className="text-gray-600 mb-6">
                            Tem certeza que deseja excluir a comunidade "{comunidade.nome}"? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setMostrarConfirmacaoExclusao(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={excluirComunidade}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CriarPostModal
                estaAberto={mostrarCriarPostagem}
                aoFechar={() => setMostrarCriarPostagem(false)}
                aoCriar={(dadosPostagem) => aoCriarPostagem(comunidade.id, dadosPostagem)}
            />
        </>
    );
};

export default PerfilComunidade;
