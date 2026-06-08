import React, { use, useEffect, useRef, useState } from "react";
import { ArrowLeft, Asterisk } from "lucide-react";
import axios from "axios";
import fundoPrevia from "../../assets/img/fundo_previa.png"

export default function CadastroEventos({ usuario, eventoEditando = null, fechar }) {

    const [endereco, setEndereco] = useState({
        cep: '',
        rua: '',
        bairro: '',
        cidade: '',
        estado: '',

        numero: '',
        complemento: ''
    });

    const [evento, setEvento] = useState({
        id: '',

        titulo: '',
        descricao: '',
        data: '',
        hora: '',

        imagem: '',
        linkInscricao: '',
        linkEventoOnline: ''
    });

    const [status, setStatus] = useState({ message: "", color: "" });

    const [imagem, setImagem] = useState(null);
    const fileInputRef = useRef(null);
    const [imagemPreview, setImagemPreview] = useState(fundoPrevia);
    const [file, setFile] = useState(null);
    const [novoCEP, setNovoCEP] = useState("");

    const [liberarLink, setLiberarLink] = useState(false);
    const [link, setLink] = useState("");
    const [modalidade, setModalidade] = useState("presencial");

    const BACKEND_URL = "http://localhost:8080";

    const handleChangeEvento = (e) => {
        const { name, value } = e.target;
        setEvento((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeEndereco = (e) => {
        const { name, value } = e.target;
        setEndereco((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadImagem = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSizeMB = 3;
        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB.`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagem(reader.result);
            setImagemPreview(reader.result);
            setFile(file);
        };
        reader.readAsDataURL(file);
    };

    const aplicarMascaraCEP = (cep) => {
        const cepLimpo = cep.replace(/\D/g, "");
        let cepFormatado = "";

        if (cepLimpo.length <= 5) {
            cepFormatado = cepLimpo;
        } else {
            cepFormatado = `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5, 8)}`;
        }

        setNovoCEP(cepFormatado);
        return cepFormatado.substring(0, 9);
    };

    const preencherEndereco = async (cep) => {
        if (cep.length == 9) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const data = response.data;
                const endereco = {
                    rua: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    estado: data.uf
                };
                setEndereco(endereco);
            } catch (error) {
                console.log("Ocorreu um erro ao buscar o CEP ", error);
            }
        }
    }

    const salvarEvento = async (e) => {
        e.preventDefault();
        try {
            const corpoEvento = {
                organizador: {
                    id: usuario.id
                },
                titulo: evento.titulo,
                descricao: evento.descricao,
                modalidade: modalidade,
                endereco: {
                    rua: endereco.rua,
                    bairro: endereco.bairro,
                    cidade: endereco.cidade,
                    estado: endereco.estado,
                    numero: endereco.numero,
                    cep: novoCEP,
                },
                data: evento.data,
                hora: evento.hora,
                linkEventoOnline: evento.linkEventoOnline,
                linkInscricao: usuario.role === "EMPRESA" ? evento.linkInscricao : null
            }

            const formData = new FormData();
            formData.append(
                "evento",
                new Blob([JSON.stringify(corpoEvento)], { type: "application/json" })
            );

            formData.append("imagem", file);

            const response = await axios.post(`${BACKEND_URL}/evento/criar`, formData);

            setTimeout(() => {
                setStatus({ message: "Evento cadastrado com sucesso!", color: "green" });
                setLiberarLink(true);
                setLink(`http://localhost:5173/certificado/${response.data.id}`);
            }, 300);

        } catch (error) {
            setStatus({ message: "Erro ao cadastrar evento", color: "red" });
            console.error("Erro ao cadastrar evento ", error);
            return;
        }
    }

    const limpar = () => {
        setEvento({});
        setEndereco({});
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <ArrowLeft className="cursor-pointer" onClick={() => { limpar(); fechar(); }} />
                <h2 className="text-2xl font-bold">{eventoEditando ? "Editar Evento" : "Cadastrar Evento"}</h2>
            </div>

            <form className="flex flex-col gap-4" onSubmit={salvarEvento}>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 font-semibold">
                        <label className="font-semibold block" htmlFor="imagem">Imagem do evento</label>
                        <Asterisk className="w-[10px] h-[10px] text-red-500" />
                    </div>
                    <img src={imagemPreview} alt="Prévia da imagem do evento" className="w-full h-80 object-cover rounded-lg border" />
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { handleUploadImagem(e) }} className="w-full p-2 border rounded-lg" required />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 font-semibold">
                        <label htmlFor="titulo">Título do evento</label>
                        <Asterisk className="w-[10px] h-[10px] text-red-500" />
                    </div>
                    <input type="text" name="titulo" placeholder="Nome do evento" className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700" value={evento.titulo} onChange={handleChangeEvento} required />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-1 font-semibold">
                        <label htmlFor="descricao">Descrição do evento</label>
                    </div>
                    <textarea name="descricao" placeholder="Descrição do evento" className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700" value={evento.descricao} onChange={handleChangeEvento} />
                </div>

                <div className="flex gap-2">
                    <button className={modalidade === "presencial" ? "flex-1 px-4 py-2 rounded-lg font-semibold bg-pink-500 text-white" : "flex-1 px-4 py-2 rounded-lg font-semibold bg-gray-200"} onClick={() => setModalidade("presencial")}>Presencial</button>
                    <button className={modalidade === "remoto" ? "flex-1 px-4 py-2 rounded-lg font-semibold bg-pink-500 text-white" : "flex-1 px-4 py-2 rounded-lg font-semibold bg-gray-200"} onClick={() => setModalidade("remoto")}>Remoto</button>
                </div>

                <div className="flex gap-2">
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-1 font-semibold">
                            <label htmlFor="data">Data do evento</label>
                            <Asterisk className="w-[10px] h-[10px] text-red-500" />
                        </div>
                        <input type="date" name="data" className="p-2 bg-gray-100 text-gray-700 border rounded-lg" value={evento.data} onChange={handleChangeEvento} required />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-1 font-semibold">
                            <label htmlFor="hora">Horário do evento</label>
                            <Asterisk className="w-[10px] h-[10px] text-red-500" />
                        </div>
                        <input type="time" name="hora" className="p-2 border rounded-lg bg-gray-100 text-gray-700" value={evento.hora} onChange={handleChangeEvento} required />
                    </div>
                </div>

                {modalidade === "presencial" && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center gap-1 font-semibold">
                                <label htmlFor="cep">CEP</label>
                                <Asterisk className="w-[10px] h-[10px] text-red-500" />
                            </div>
                            <input
                                type="text"
                                name="cep"
                                placeholder="CEP"
                                className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                                value={novoCEP}
                                onChange={(e) => { preencherEndereco(e.target.value); aplicarMascaraCEP(e.target.value); setEndereco(e.target.value) }}
                                required
                            />
                        </div>

                        <div className="flex gap-2">
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="flex items-center gap-1 font-semibold">
                                    <label htmlFor="cidade">Cidade</label>
                                    <Asterisk className="w-[10px] h-[10px] text-red-500" />
                                </div>
                                <input type="text" name="cidade" placeholder="Cidade" className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700" value={endereco.cidade} onChange={handleChangeEndereco} required />
                            </div>

                            <div className="flex flex-col gap-2 flex-1">
                                <div className="flex items-center gap-1 font-semibold">
                                    <label htmlFor="estado">Estado</label>
                                    <Asterisk className="w-[10px] h-[10px] text-red-500" />
                                </div>
                                <input type="text" name="estado" placeholder="Estado" className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700" value={endereco.estado} onChange={handleChangeEndereco} required />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center gap-1 font-semibold">
                                <label htmlFor="rua">Rua</label>
                                <Asterisk className="w-[10px] h-[10px] text-red-500" />
                            </div>
                            <input type="text" name="rua" placeholder="Rua" className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700" value={endereco.rua} onChange={handleChangeEndereco} required />
                        </div>

                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center gap-1 font-semibold">
                                <label htmlFor="bairro">Bairro</label>
                                <Asterisk className="w-[10px] h-[10px] text-red-500" />
                            </div>
                            <input type="text" name="bairro" placeholder="Bairro" className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700" value={endereco.bairro} onChange={handleChangeEndereco} required />
                        </div>

                        <div className="flex gap-2">
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="flex items-center gap-1 font-semibold">
                                    <label htmlFor="numero">Número</label>
                                    <Asterisk className="w-[10px] h-[10px] text-red-500" />
                                </div>
                                <input type="text" name="numero" placeholder="Número" className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700" value={endereco.numero} onChange={handleChangeEndereco} required />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="flex items-center gap-1 font-semibold">
                                    <label htmlFor="complemento">Complemento</label>
                                </div>
                                <input type="text" name="complemento" placeholder="Complemento" className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700" value={endereco.complemento} onChange={handleChangeEndereco} />
                            </div>
                        </div>

                        {usuario.role === "EMPRESA" && (
                            <input type="text" placeholder="Link para formulário de inscrição (empresa)" className="w-full pl-4 pr-4 py-2 mb-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700" name="linkInscricao" value={evento.linkInscricao} onChange={handleChangeEvento} />
                        )}
                    </div>
                )}

                {modalidade === "remoto" && (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1 font-semibold">
                            <label htmlFor="numero">Link para acessar evento online</label>
                            <Asterisk className="w-[10px] h-[10px] text-red-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="URL do evento online"
                            className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                            onChange={handleChangeEvento}
                        />
                    </div>
                )}

                {status.message && (
                    <p className={`text-${status.color}-500 text-sm font-semibold`}>{status.message}</p>
                )}

                {liberarLink && (
                    <div className="flex justify-center items-center p-4 fixed inset-0 z-50 bg-black bg-opacity-50">
                        <div className="md:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-2xl mt-5 mb-5 overflow-y-auto">
                            <div className="flex flex-col gap-4 p-6">
                                <p className="font-semibold">Copie esse link para permitir que os participantes do evento obtenham o certificado</p>
                                <input 
                                    type="text" 
                                    name="link" 
                                    value={link}
                                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg shadow-inner" 
                                    readOnly
                                />
                                <button
                                    className="border border-[#F36EC0] bg-[#F36EC0] text-white text-sm px-3 py-1 rounded-lg font-semibold"
                                    onClick={fechar}
                                >
                                    Pronto
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <button type="button" className="flex-1 bg-gray-300 px-4 py-2 rounded-lg" onClick={() => { limpar(); fechar(); }}>Cancelar</button>
                    <button type="submit" className="flex-1 bg-pink-500 text-white px-4 py-2 rounded-lg">{eventoEditando ? "Salvar alterações" : "Cadastrar"}</button>
                </div>
            </form>
        </div>
    );
}
