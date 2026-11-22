import { ArrowLeft, Search } from "lucide-react";
import { useState, useEffect } from "react";
import InscricaoEvento from "./InscricaoEvento";

export default function DetalhesEvento2({ usuario, evento, fechar }) {
    const [inscricao, setInscricao] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const BACKEND_URL = "http://localhost:8080";

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

    const abrirInscricao = () => {
        setInscricao(true);
    }

    const fecharInscricao = () => {
        setInscricao(false);
    }

    useEffect(() => {

    }, [])

    return (
        <>
            <div className="flex flex-col gap-4 p-8 bg-white w-[50%] m-auto">
                <img
                    src={evento.imagem}
                    alt={evento.titulo}
                    className="object-cover rounded-lg flex-shrink-0"
                />

                <div className="flex-1">
                    <h2 className="text-2xl font-bold break-words">{evento.titulo}</h2>
                    <p className="text-pink-600 mt-1">
                        {evento.data} • {evento.hora}
                    </p>

                    <p className="text-md text italic-gray-600 mt-1">
                        {(evento.modalidade).toUpperCase()} - {(evento.endereco.cidade)}
                    </p>

                    <p className="mt-2 text-md text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                        {evento.descricao}
                    </p>
                </div>

                <div className="border-t py-4">
                    <h4 className="text-md font-semibold mb-2">Endereço</h4>

                    <div className="text-md text-gray-700 mb-4 break-words">
                        <div className="break-words">
                            <div>{evento.endereco.rua}, {evento.endereco.bairro}, {evento.endereco.numero} - {evento.endereco.cidade}</div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-semibold mb-2">Link</h4>
                        <div className="text-md text-gray-700 flex flex-col gap-2">
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <button
                            type="button"
                            onClick={fechar}
                            className="bg-gray-200 px-3 py-1 rounded-lg text-md"
                        >
                            Fechar
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="border border-[#F36EC0] text-[#F36EC0] text-md px-3 py-1 rounded-lg font-semibold hover:bg-[#F36EC0] hover:text-white transition"
                        >
                            Baixar inscrições
                        </button>

                        <button
                            type="button"
                            className="border border-[#F36EC0] bg-[#F36EC0] text-white text-md px-3 py-1 rounded-lg font-semibold"
                            onClick={abrirInscricao}
                        >
                            Participar
                        </button>
                    </div>
                </div>
                {inscricao && (
                    <InscricaoEvento
                        user={usuario}
                        evento={evento}
                        fechar={fecharInscricao}
                    />  
                )}
            </div>
        </>
    );
}