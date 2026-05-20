import { useEffect, useState } from "react";

export default function DetalhesEvento({ evento, fechar }) {

    const [userInscrito, setUserInscrito] = useState(null);

    const BACKEND_URL = "http://localhost:8080";

    // const data = new Date(evento.data);
    // const dataConvertida = new Intl.DateTimeFormat('pt-BR', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric',
    //     timeZone: 'UTC'
    // }).format(data);

    const baixarInscricoes = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/evento/${evento.id}/download/inscricoes`,
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `participantes_do_evento_${evento.id}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.log("Erro baixar inscrições", error);
        }
    }

    const verificarInscricao = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/inscricao/${user.id}/${evento.id}`);
            setUserInscrito(response.data);
        } catch (error) {
            console.log("Erro ao verificar inscrição", error);
        }
    }

    useEffect(() => {
        verificarInscricao();
    }, [])

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

                            <p className="text-sm text italic-gray-600 mt-1">
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
                                    onClick={baixarInscricoes()}
                                >
                                    Baixar inscrições
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}