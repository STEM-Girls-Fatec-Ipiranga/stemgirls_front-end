export default function ComunidadeMiniatura({ comunidade, comunidadeSelecionada, selecionarComunidade }){
    return (
        <>
            <div 
                className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${comunidadeSelecionada.id == comunidade.id ? 'bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200' : 'hover:bg-[#E0E0E0]'}`}
                onClick={() => selecionarComunidade(comunidade)}
            >
                <img src={comunidade.imagem} alt={comunidade.nome} className="w-8 h-8 rounded-full mr-3"/>
                <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{comunidade.nome}</p>
                    <p className="text-xs text-gray-500">{comunidade.nomeUsuario}</p>
                </div>
            </div>
        </>
    );
}