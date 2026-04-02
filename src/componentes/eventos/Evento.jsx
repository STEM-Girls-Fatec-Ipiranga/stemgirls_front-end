import { use, useState, useEffect } from "react";
import DetalhesEvento from "./DetalhesEvento";
import InscricaoEvento from "./InscricaoEvento";
import axios from "axios";

export default function Evento({ evento, user }) {
    const [detalhes, setDetalhes] = useState(false);
    const [inscricao, setInscricao] = useState(false);

    const [userInscrito, setUserInscrito] = useState(null);

    const BACKEND_URL = "http://localhost:8080";

    const abrirDetalhes = (e) => {
        setDetalhes(true);
    };

    const fecharDetalhes = (e) => {
        setDetalhes(false);
    };

    const abrirInscricao = (e) => {
        setInscricao(true);
    };

    const fecharInscricao = (e) => {
        setInscricao(false);
    }

    const verificarInscricao = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/inscricao/${user.id}/${evento.id}`);
            setUserInscrito(response.data);
        } catch (error) {
            console.log("Erro ao verificar inscrição", error);
        }
    }

    const baixarInscricoes = async () => {
        try{
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
        }catch (error) {
            console.log("Erro baixar inscrições", error);
        }
    }

    useEffect(() => {
        verificarInscricao();
    }, []);

    return (
        <>
            <div
                className="bg-white rounded-xl shadow-md flex flex-col h-full border-2 border-pink-300 cursor-pointer"
            >
                <img src={evento.imagem} className="w-full h-40 object-cover rounded-t-xl" alt={evento.titulo} />
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-lg break-words">{evento.titulo}</h3>
                    <p className="text-pink-600">{evento.data} • {evento.hora}</p>
                    <p className="text-sm italic text-gray-600 break-words">
                        {(evento.modalidade).toUpperCase()} - {(evento.endereco.cidade)}
                    </p>
                    <div className="mt-auto pt-4 flex justify-center gap-3">
                        {
                            userInscrito ? (
                                <>
                                    <button
                                        className="bg-[#ABF7AB] text-[#38A838] font-semibold rounded-lg px-5 py-2 hover:bg-[#CCFFCC] transition"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            abrirInscricao();
                                        }}
                                    >

                                        Inscrito
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="bg-[#F36EC0] text-white font-semibold rounded-lg px-5 py-2 hover:bg-[#e055a8] transition"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            abrirInscricao();
                                        }}
                                    >

                                        Participar
                                    </button>
                                </>
                            )
                        }

                        <button
                            className="bg-white border border-pink-500 px-3 py-1 rounded-lg text-sm hover:bg-gray-100 transition text-pink-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                abrirDetalhes();
                            }}
                        >
                            Saiba mais
                        </button>

                        {(user.role === "MODERADOR") && (
                            <button
                                className="bg-[#F36EC0] text-white px-5 py-2 rounded-lg hover:bg-pink-500"
                                onClick={() => baixarInscricoes()}
                            >
                                Baixar inscrições
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {detalhes && (
                <DetalhesEvento
                    evento={evento}
                    fechar={fecharDetalhes}
                />
            )}

            {inscricao && (
                <InscricaoEvento
                    evento={evento}
                    user={user}
                    fechar={fecharInscricao}
                />
            )}
        </>
    );
}