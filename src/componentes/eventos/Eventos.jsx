import React, { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import CadastroEvento from "./CadastroEvento";
import Evento from "./Evento";
import MeusEventos from "./MeusEventos";
import axios from "axios";
import Categoria from "../Categoria";
import Botao from "../Botao"

export default function Eventos() {

    const BACKEND_URL = "http://localhost:8080";

    const [eventos, setEventos] = useState([]);
    const [meusEventos, setMeusEventos] = useState([]);

    const [eventoEditando, setEventoEditando] = useState(null);
    const [eventoParaExcluir, setEventoParaExcluir] = useState(null);
    const [confirmEmpresa, setConfirmEmpresa] = useState(null);

    const [localidade, setLocalidade] = useState("");
    const [selecionado, setSelecionado] = useState("Todos");

    const [telaCadastro, setTelaCadastro] = useState(false);
    const [telaMeusEventos, setTelaMeusEventos] = useState(false);

    let storage = localStorage.getItem("user");
    const [usuario, setUsuario] = useState(JSON.parse(storage));

    const listarEventos = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/evento`);
            setEventos(response.data);
        } catch (error) {
            console.log("Erro ao buscar eventos:", error);
        }
    };

    const listarMeusEventos = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/evento/organizador/${usuario.id}`);
            setMeusEventos(response.data);
        } catch (error) {
            console.log("Erro ao buscar meus eventos:", error);
        }
    }

    const handleSelecionado = (tipo) => {
        setSelecionado(tipo);
    }

    const confirmarExcluirEvento = async () => {
        if (!eventoParaExcluir) return;
        try {
            const res = await fetch(`${BACKEND_BASE}/eventos/${eventoParaExcluir.id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error();
            setEventos((prev) => prev.filter((e) => e.id !== eventoParaExcluir.id));
            alert("Evento excluído!");
            setEventoParaExcluir(null);
        } catch (e) {
            setEventos((prev) => prev.filter((e) => e.id !== eventoParaExcluir.id));
            alert("Evento removido localmente (backend indisponível).");
            setEventoParaExcluir(null);
        }
    };

    const confirmarRedirecionamentoEmpresa = () => {
        if (!confirmEmpresa) return;
        const link = confirmEmpresa.link;
        if (!link) {
            alert("Link inválido.");
            setConfirmEmpresa(null);
            return;
        }
        const quero = window.confirm("Você será direcionado para uma página externa. Deseja continuar?");
        if (quero) {
            window.open(link, "_blank", "noopener,noreferrer");
        }
        setConfirmEmpresa(null);
    };

    useEffect(() => {
        listarEventos();
    }, []);

    return (
        <div className="flex min-h-screen bg-[#FFF6FF] text-gray-800">

            <aside className="w-[300px] bg-[#FFF6FF] p-6 flex flex-col gap-6 shadow-lg">
                <h1 className="font-bold text-black text-[22px] ml-4">Eventos</h1>

                <div className="relative ml-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar evento..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                        value={localidade}
                        onChange={(e) => setLocalidade(e.target.value)}
                    />
                </div>

                {(usuario?.role == "MODERADOR" || usuario?.role == "EMPRESA") && (
                    <>
                        <div className="mt-2 ml-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold">Meus eventos</h4>

                                <p
                                    className="px-2 py-1 text-sm rounded-md bg-pink-200 hover:bg-pink-300 text-pink-700 cursor-pointer transition"
                                    onClick={() => {
                                        setTelaMeusEventos(true);
                                        setTelaCadastro(false);
                                    }}
                                >
                                    Ver
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 max-h-64 overflow-auto pr-2 mt-4">
                                {Eventos.length === 0 ? (
                                    <div className="text-sm text-gray-400">Você ainda não criou eventos.</div>
                                ) : (
                                    Eventos.map((ev) => (
                                        <div key={ev.id ?? ev._id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                                            <div className="truncate text-sm">{ev.titulo}</div>
                                            <div className="flex gap-1">
                                                <button
                                                    className="px-2 py-1 text-xs bg-yellow-400 rounded"
                                                    onClick={() => {
                                                        setTelaCadastro(true);
                                                        setEventoEditando(ev);
                                                    }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                                                    onClick={() => setEventoParaExcluir(ev)}
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <button
                            className="w-full bg-[#F36EC0] text-white font-semibold h-[40px] mb-4 mt-4 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center"
                            onClick={() => {
                                setTelaCadastro(true);
                                setEventoEditando(null);
                            }}
                        >
                            + Publicar Evento
                        </button>

                        <Botao 

                        />
                    </>
                )}
            </aside>

            <main className="flex-1 p-8">
                {telaCadastro ? (
                    <CadastroEvento
                        usuario={usuario}
                        eventoEditando={eventoEditando}
                        fechar={() => { setTelaCadastro(false); setEventoEditando(null); }}
                    />
                ) : telaMeusEventos ? (
                    <>
                        <ArrowLeft className="m-2 cursor-pointer" onClick={() => setTelaMeusEventos(false)} />
                        <MeusEventos
                            eventos={meusEventos}
                            usuario={usuario}
                        />
                    </>
                ) : (
                    <>
                        <div className="flex gap-4 mb-6 justify-center">
                            {["Todos", "Ao-vivo", "Presencial", "Remoto"].map((tipo) => (
                                <Categoria
                                    key={tipo}
                                    nome={tipo}
                                    onClick={() => setSelecionado(tipo)}
                                    className={selecionado === tipo ? `bg-pink-500 text-white` : `bg-transparent text-black hover:text-white hover:bg-pink-500 transition-all duration-200`}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-center">
                            {eventos.map((evento, index) => (
                                <Evento
                                    key={index}
                                    evento={evento}
                                    usuario={usuario}
                                />
                            ))}

                            {eventos.length === 0 && (
                                <div className="text-center text-gray-500 col-span-full">Nenhum evento encontrado.</div>
                            )}
                        </div>
                    </>
                )}

                {confirmEmpresa && (
                    <div className="fixed inset-0 z-60 bg-black bg-opacity-50 flex justify-center items-center p-4">
                        <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
                            <h3 className="text-xl font-bold mb-2">{confirmEmpresa.evento.titulo}</h3>
                            <p className="mb-4">Você será direcionada para uma página externa de inscrição. Deseja continuar?</p>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={confirmarRedirecionamentoEmpresa}
                                    className="w-full text-white py-2 rounded"
                                    style={{ background: 'linear-gradient(90deg, #5b3eeb 0%, #c958d0 100%)' }}
                                >
                                    Confirmar e Acessar
                                </button>

                                <button
                                    onClick={() => setConfirmEmpresa(null)}
                                    className="w-full bg-gray-300 text-black py-2 rounded"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {eventoParaExcluir && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-xl w-96">
                            <h3 className="font-bold text-lg">Excluir evento</h3>
                            <p className="mb-4">
                                Tem certeza que deseja excluir <b>{eventoParaExcluir.titulo}</b>?
                            </p>

                            <div className="flex justify-between">
                                <button className="bg-gray-300 px-4 py-2 rounded-lg" onClick={() => setEventoParaExcluir(null)}>
                                    Cancelar
                                </button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={confirmarExcluirEvento}>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
