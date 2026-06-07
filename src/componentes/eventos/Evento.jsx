import { use, useState, useEffect } from "react";
import DetalhesEvento from "./DetalhesEvento";
import InscricaoEvento from "./InscricaoEvento";
import FormCertificado from "./FormCertificado";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Evento({ usuario, evento }) {
    const [detalhes, setDetalhes] = useState(false);
    const [inscricao, setInscricao] = useState(false);
    const [formCertificado, setFormCertificado] = useState(false);

    const [userInscrito, setUserInscrito] = useState(null);

    const BACKEND_URL = "http://localhost:8080";

    const abrirDetalhes = (e) => {
        setDetalhes(true);
    }

    const fecharDetalhes = (e) => {
        setDetalhes(false);
    }

    const abrirInscricao = (e) => {
        setInscricao(true);
    }

    const fecharInscricao = (e) => {
        setInscricao(false);
    }

    const abrirFormCertificado = (e) => {
        setFormCertificado(true);
    }

    const fecharFormCertificado = (e) => {
        setFormCertificado(false);
    }

    const verificarInscricao = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/inscricao/${usuario.id}/${evento.id}`);
            setUserInscrito(response.data);
        } catch(err) {
            console.log(err);
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
                <img src={evento.imagem} className="w-full h-40 object-cover rounded-t-xl" alt={evento.titulo} onClick={abrirDetalhes} />

                <div className="flex flex-col p-4">
                    <div onClick={abrirDetalhes}>
                        <h3 className="font-bold text-lg break-words">{evento.titulo}</h3>
                        <p className="text-pink-600">{evento.data} • {evento.hora}</p>
                        <p className="text-sm italic text-gray-600 break-words">
                            {(evento.modalidade).toUpperCase()} - {(evento.endereco.cidade)}
                        </p>
                    </div>

                    <div className="flex mt-4 gap-3 h-full justify-end">
                        {
                            userInscrito ? (
                                <>
                                    <button
                                        className="bg-[#ABF7AB] text-[#38A838] text-sm font-semibold rounded-lg px-4 py-2 hover:bg-[#CCFFCC] transition"
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
                                        className="bg-[#F36EC0] text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-[#e055a8] transition"
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
                    </div>
                </div>
            </div>

            {detalhes && (
                <DetalhesEvento
                    evento={evento}
                    usuario={usuario}
                    fechar={fecharDetalhes}
                />
            )}

            {inscricao && (
                <InscricaoEvento
                    evento={evento}
                    user={usuario}
                    fechar={fecharInscricao}
                />
            )}
        </>
    );
}