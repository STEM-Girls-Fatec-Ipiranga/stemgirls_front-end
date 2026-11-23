import { Heart } from "lucide-react";

export default function Postagem({ postagem, entrar, curtir }) {
    const data = new Date(postagem.dataCriacao);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden transition-all duration-200">
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src={postagem.comunidadeImagem}
                        alt={postagem.comunidadeNome}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-800">{postagem.comunidadeNome}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                            {data.toLocaleDateString()} • {data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>

                {entrar && !postagem.souMembro && (
                    <button
                        onClick={() => entrar(postagem.comunidadeId)}
                        className="bg-pink-500 text-white px-4 py-1 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                    >
                        Entrar
                    </button>
                )}
            </div>

            <div className="px-4 pb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{postagem.titulo}</h2>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{postagem.conteudo}</p>
                {postagem.imagem && (
                    <img
                        src={postagem.imagem}
                        alt={postagem.titulo}
                        className="w-full max-h-80 object-cover rounded-lg border border-gray-100 mt-2"
                    />
                )}
                <button
                    onClick={() => curtir(postagem.id)}
                    className="flex items-center gap-1 mt-3 text-sm text-gray-500 hover:text-pink-500 transition-colors"
                >
                    <Heart className={`h-5 w-5 ${postagem.curtiu ? "fill-pink-500 text-pink-500" : ""}`} />
                    {postagem.curtidas}
                </button>
            </div>
        </div>
    );
}