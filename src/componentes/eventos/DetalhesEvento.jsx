
export default function DetalhesEvento({ evento, fechar }) {
    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start p-4 overflow-y-auto" onClick={fechar}>
                <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl mt-10 mb-10 max-h-[90vh] overflow-y-auto">
                    <div className="flex flex-col gap-4 p-6">
                        <img
                            src={evento.imagem}
                            alt={evento.titulo}
                            className="w-[100%] h-[200px] object-cover rounded-lg flex-shrink-0"
                        />

                        <div className="flex-1 min-w-[200px]">
                            <h2 className="text-2xl font-bold break-words">{evento.titulo}</h2>
                            <p className="text-pink-600 mt-1">
                                {evento.data} • {evento.hora}
                            </p>

                            <p className="text-sm italic text-gray-600 mt-1">
                                {(evento.modalidade).toUpperCase()} - {(evento.endereco.cidade)}
                            </p>

                            <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                                {evento.descricao}
                            </p>
                        </div>
                    </div>

                    <div className="border-t px-6 py-4">
                        <h4 className="font-semibold mb-2">Endereço</h4>

                        <div className="text-sm text-gray-700 mb-4 break-words">
                            <div className="break-words">
                                <div>{evento.endereco.rua}, {evento.endereco.bairro}, {evento.endereco.numero} - {evento.endereco.cidade}</div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Links</h4>
                            <div className="text-sm text-gray-700 flex flex-col gap-2">
                                {/* {pegarLinkInscricao(detalhesEvento) ? (
                                    <button
                                        className="underline text-sm text-left break-words"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(pegarLinkInscricao(detalhesEvento), "_blank", "noopener,noreferrer");
                                        }}
                                    >
                                        Link para inscrição
                                    </button>
                                ) : (
                                    <div className="text-gray-400">Sem link de inscrição</div>
                                )} */}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <button
                                    className="bg-gray-200 px-3 py-1 rounded-lg"
                                    onClick={fechar}
                                >
                                    Fechar
                                </button>
                            </div>
                            <div className="flex gap-2">

                                <button
                                    className="border border-[#F36EC0] text-[#F36EC0] text-sm px-3 py-1 rounded-lg font-semibold hover:bg-[#F36EC0] hover:text-white transition"
                                    // onClick={() => abrirInscricaoComRegras(detalhesEvento)}
                                >
                                    Baixar inscrições
                                </button>

                                <button
                                    className="bg-[#F36EC0] text-white text-sm px-3 py-1 rounded-lg font-semibold hover:bg-[#e055a8] transition"
                                    // onClick={() => abrirInscricaoComRegras(detalhesEvento)}
                                >
                                    Participar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}