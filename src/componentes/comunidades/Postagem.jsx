export default function Postagem({ postagem, comunidade }) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden transition-all duration-200 cursor-pointer">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <img 
                            src={comunidade.imagem}
                            alt={comunidade.nome}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-800">{comunidade.nome}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                                {postagem.dataCriacao.toLocaleDateString()} • {postagem.dataCriacao.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button className="bg-pink-500 text-white px-4 py-1 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"> 
                            Entrar
                        </button>
                    </div>
                </div>

                <div className="px-4 pb-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{postagem.titulo}</h2>
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{postagem.conteudo}</p>
                    <img 
                        src={postagem.imagem}
                        alt={postagem.titulo}
                        className="w-full max-h-80 object-cover rounded-lg border border-gray-100 mt-2"
                    />
                </div>
            </div>  
        </>
    );
}