import axios from "axios";
import { useState, useEffect, use } from "react";
import Styles from '../../css/Login.module.css';
import { useParams } from "react-router-dom";

export default function FormCertificado() {
    const [dataHoje, setDataHoje] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [inscrito, setInscrito] = useState(null);
    const [mensagem, setMensagem] = useState("");

    const { eventoId } = useParams();
    const [email, setEmail] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmail((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function baixarCertificado() {
        try {
            const resUser = await axios.get(`http://localhost:8080/usuario/encontrar/${email}`);
            const usuarioData = resUser.data;

            if (resUser.status === 200) {
                try {
                    const resEvento = await axios.get(`http://localhost:8080/evento/${eventoId}`);
                    const eventoData = resEvento.data;

                    if (resEvento.status === 200) {
                        try {
                            const resInscricao = await axios.get(`http://localhost:8080/inscricao/${usuarioData.id}/${eventoData.id}`);
                            
                            if (resInscricao.status === 200) {
                                fetch(`http://localhost:8080/certificado/salvar/${usuarioData.nome}/${eventoData.titulo}/${dataHoje}`)
                                    .then(res => res.blob())
                                    .then(blob => {
                                        const url = window.URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.setAttribute('download', 'certificado.pdf');
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    })
                                    .catch(err => {
                                        setMensagem("Não foi possível baixar o certificado.");
                                        console.log(err);
                                    });
                            }

                        } catch (err) {
                            setMensagem("Usuário não está inscrito no evento.");
                            console.log(err);
                        }
                    }
                } catch (err) {
                    setMensagem("Evento não encontrado. Solicite novamente o link para obter o certificado.");
                    console.log(err);
                }
            }
        } catch (err) {
            setMensagem("Usuário não encontrado.");
            console.log(err);
        }
    }

    return (
        <>
            <div className={`bg-white flex justify-center ${Styles.container}`}>
                <div className="bg-white w-[40%] mt-10 mb-20 rounded-xl shadow-2xl border border-2">
                    <form className="flex flex-col p-6 gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <h1 className="text-black text-2xl mb-5 font-semibold">Obter certificado</h1>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    E-mail
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                                    placeholder="Digite seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {mensagem && (
                                <p className="text-red-500 text-sm mt-2 font-semibold">{mensagem}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="bg-[#F36EC0] text-white text-sm px-3 py-1 rounded-lg font-semibold hover:bg-[#e055a8] transition"
                                type="button"
                                onClick={baixarCertificado}
                            >
                                Baixar certificado
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}