import { ArrowLeft, Plus } from 'lucide-react';
import Postagem from "./Postagem";

export default function Comunidade({ comunidade, postagens, voltarFeed, entrar, publicar, curtir }) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center mb-6">
                <button
                    onClick={voltarFeed}
                    className="flex text-pink-600 hover:text-pink-700 transition-colors duration-200"
                >
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Voltar ao feed
                </button>
            </div>

            <div className="flex flex-col bg-white rounded-lg shadow-sm border border-pink-100 p-6 mb-6">
                <div className="flex items-center mb-6">
                    <div className="flex items-center flex-1">
                        <img
                            src={comunidade.imagem}
                            alt={comunidade.nome}
                            className="w-[150px] h-[150px] rounded-full mr-6 border-4 border-pink-100 object-cover"
                        />
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold text-gray-800">{comunidade.nome}</h1>
                            <p className="text-gray-600">{comunidade.nomeUsuario}</p>
                            {comunidade.descricao && <p className="text-gray-600 mt-1">{comunidade.descricao}</p>}
                            <p className="text-sm text-gray-500 mt-1">
                                {comunidade.totalMembros} membros • {postagens.length} postagens
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {comunidade.souMembro ? (
                            <button
                                onClick={publicar}
                                className="flex items-center justify-center bg-white text-pink-500 text-md border-2 border-pink-500 rounded-xl px-3 py-1 font-medium transition-all duration-200 transform hover:bg-pink-500 hover:text-white"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Publicar
                            </button>
                        ) : (
                            <button
                                onClick={entrar}
                                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 text-md rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                            >
                                Entrar
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Postagens da comunidade</h2>
                    {postagens.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-pink-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Esta comunidade ainda não tem postagens</h3>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {postagens.map(postagem => (
                                <Postagem key={postagem.id} postagem={postagem} curtir={curtir} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}