import { useEffect, useState } from "react";
import axios from "axios";

export default function InscricaoEvento({ evento, user, fechar }) {

    const [instituicao, setInstituicao] = useState("");
    const [inscricao, setInscricao] = useState(null);

    const [novoCPF, setNovoCPF] = useState("");
    const [novoTelefone, setNovoTelefone] = useState("");

    const [status, setStatus] = useState({ message: "", color: "" });

    const BACKEND_URL = "http://localhost:8080";

    const aplicarMascaraCPF = (valor) => {
        const cpfLimpo = valor.replace(/\D/g, "");
        let cpfFormatado = "";

        if (cpfLimpo.length <= 3) {
            cpfFormatado = cpfLimpo;
        } else if (cpfLimpo.length <= 6) {
            cpfFormatado = `${cpfLimpo.substring(0, 3)}.${cpfLimpo.substring(3)}`;
        } else if (cpfLimpo.length <= 9) {
            cpfFormatado = `${cpfLimpo.substring(0, 3)}.${cpfLimpo.substring(3, 6)}.${cpfLimpo.substring(6)}`;
        } else {
            cpfFormatado = `${cpfLimpo.substring(0, 3)}.${cpfLimpo.substring(3, 6)}.${cpfLimpo.substring(6, 9)}-${cpfLimpo.substring(9, 11)}`;
        }

        setNovoCPF(cpfFormatado);
        return cpfFormatado.substring(0, 14);
    };

    const aplicarMascaraTelefone = (valor) => {
        const telefoneLimpo = valor.replace(/\D/g, "");
        let telefoneFormatado = "";

        if (telefoneLimpo.length > 0)
            telefoneFormatado = `(${telefoneLimpo.substring(0, 2)}`;

        if (telefoneLimpo.length > 2)
            telefoneFormatado += `) ${telefoneLimpo.substring(2, 7)}`;

        if (telefoneLimpo.length > 7)
            telefoneFormatado += `-${telefoneLimpo.substring(7, 11)}`;

        setNovoTelefone(telefoneFormatado);
        return telefoneFormatado.substring(0, 15);
    };

    const validarCPF = (cpf) => {
        const c = (cpf).replace(/\D/g, "");

        if (c.length !== 11) return false;

        if (/^(\d)\1+$/.test(c)) return false;

        let soma = 0;
        for (let i = 1; i <= 9; i++) soma += parseInt(c[i - 1]) * (11 - i);
        let resto = (soma * 10) % 11;
        resto = resto >= 10 ? 0 : resto;
        if (resto !== parseInt(c[9])) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(c[i - 1]) * (12 - i);
        resto = (soma * 10) % 11;
        resto = resto >= 10 ? 0 : resto;
        return resto === parseInt(c[10]);
    };

    const validarCampos = async () => {
        if (!user.cpf && !user.telefone) {
            let currentUser = user;
            if (novoCPF == "") {
                setStatus({ message: "Por favor, insira o CPF", color: "red" });
                return;
            } else if (!validarCPF(novoCPF)) {
                setStatus({ message: "CPF inválido, por favor digite novamente", color: "red" });
                return;
            } else if (novoTelefone == "") {
                setStatus({ message: "Por favor, insira o telefone", color: "red" });
                return;
            } else {
                try {
                    currentUser = await atualizarUsuario();
                } catch (error) {
                    setStatus({ message: "Erro ao atualizar dados do usuário", color: "red" });
                    return;
                }
            }
            setStatus({ message: "", color: "" });
            return currentUser;
        } else {
            return user;
        }
    }

    const atualizarUsuario = async () => {
        try {
            const response = await axios.put(`${BACKEND_URL}/usuario/atualizar`, {
                email: user.email,
                cpf: novoCPF,
                telefone: novoTelefone
            });
            localStorage.setItem("userEmail", response.data.email);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const enviarInscricao = async () => {
        let currentUser = await validarCampos();
        if (currentUser) {
            try {
                const response = await axios.post(`${BACKEND_URL}/evento/${evento.id}/inscrever`, {
                    participanteId: user.id,
                    instituicao: instituicao
                });

                setTimeout(() => {
                    setStatus({ message: "Enviando inscrição...", color: "blue" });
                    setInscricao(response.data);
                    window.location.reload();
                }, 300);
            } catch (error) {
                console.log(error);
                setStatus({ message: "Erro ao enviar inscrição", color: "red" });
            }
        } else {
            return;
        }
    }

    const excluirInscricao = async () => {
        try {
            await axios.delete(`${BACKEND_URL}/inscricao/excluir/${inscricao.id}`);

            setStatus({ message: "Inscrição cancelada com sucesso", color: "green" });
            setTimeout(() => {
                setInscricao(null);
                window.location.reload();
            }, 300);
        } catch (error) {
            setStatus({ message: "Erro ao cancelar inscrição", color: "red" });
        }
    }

    const verificarInscricao = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/inscricao/${user.id}/${evento.id}`);
            setInscricao(response.data);
        } catch (error) {
            setStatus({ message: "Erro ao verificar inscrição", color: "red" });
        }
    }

    useEffect(() => {
        verificarInscricao();
    }, []);

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
                <div className="flex flex-col p-6 bg-white rounded-xl w-full max-w-md shadow-xl max-h-[100vh] overflow-y-auto">

                    <div className="flex flex-col gap-4 mb-5">
                        <h2 className="text-[24px] font-bold">Evento</h2>
                        <img
                            src={evento.imagem}
                            alt={evento.titulo}
                            className="w-40 h-28 object-cover rounded-lg flex-shrink-0"
                        />

                        <div className="flex-1 min-w-[200px]">
                            <h2 className="text-[20px] text-[#454545] font-bold">{evento.titulo}</h2>

                            <p className="text-pink-600 mt-1">
                                {evento.data} • {evento.hora}
                            </p>

                            <p className="text-sm italic text-gray-600 mt-1">
                                {(evento.modalidade).toUpperCase()} - {(evento.endereco.rua)}, {(evento.endereco.bairro)}, {(evento.endereco.cidade)}
                            </p>
                        </div>
                    </div>

                    {!inscricao && (
                        <>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-2">

                                    <h2 className="text-[24px] font-bold">Inscrição</h2>

                                    <div className="flex flex-col gap-2">
                                        <input
                                            className="w-full text-sm px-2 py-2 mb-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                                            readOnly
                                            value={user.nomeUsuario}
                                        />
                                        <input
                                            className="w-full text-sm px-2 py-2 mb-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                                            readOnly
                                            value={user.email}
                                        />
                                    </div>
                                </div>

                                {user.cpf ? (
                                    <input
                                        className="w-full text-sm px-2 py-2 mb-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                                        readOnly
                                        value={user.cpf}
                                    />
                                ) : (
                                    <input
                                        className="w-full text-sm px-2 py-2 mb-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                                        placeholder="CPF"
                                        value={novoCPF}
                                        onChange={(e) => aplicarMascaraCPF(e.target.value)}
                                    />
                                )}

                                {user.telefone ? (
                                    <input
                                        className="w-full text-sm px-2 py-2 mb-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                                        readOnly
                                        value={user.telefone}
                                    />
                                ) : (
                                    <input
                                        className="w-full text-sm px-2 py-2 mb-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                                        placeholder="Telefone"
                                        value={novoTelefone}
                                        onChange={(e) => aplicarMascaraTelefone(e.target.value)}
                                    />
                                )}

                                <input
                                    className="w-full text-sm px-2 py-2 mb-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                                    placeholder="Instituição"
                                    value={instituicao}
                                    onChange={(e) => setInstituicao(e.target.value)}
                                />
                            </div>
                            <p className={`text-${status.color}-500 text-sm`}>{status.message}</p>
                        </>
                    )}

                    {inscricao && (
                        <>

                            <div className="flex flex-col gap-2">
                                <h2 className="text-[24px] font-bold">Dados da inscrição</h2>

                                <p className="text-[16px] text-gray-500">
                                    <span className="font-bold">Nome:</span> {user.nomeUsuario}
                                </p>
                                <p className="text-[16px] text-gray-500">
                                    <span className="font-bold">Email:</span> {user.email}
                                </p>
                                <p className="text-[16px] text-gray-500">
                                    <span className="font-bold">CPF:</span> {user.cpf}
                                </p>
                                <p className="text-[16px] text-gray-500">
                                    <span className="font-bold">Telefone:</span> {user.telefone}
                                </p>
                                <p className="text-[16px] text-gray-500">
                                    <span className="font-bold">Instituição:</span> {inscricao.instituicao}
                                </p>
                                <p className="text-[16px] text-gray-500">
                                    <span className="font-bold">Data de Inscrição:</span> {inscricao.dataInscricao}
                                </p>
                                <p className={`text-${status.color}-500 text-sm`}>{status.message}</p>
                            </div>
                        </>
                    )}

                    <div className="flex gap-2 mt-4 justify-end">
                        <button className="bg-gray-200 px-4 py-2 rounded-lg" onClick={fechar}>
                            Fechar
                        </button>

                        {inscricao && (
                            <button className="bg-red-400 text-white px-4 py-2 rounded-lg" onClick={excluirInscricao}>
                                Cancelar inscrição
                            </button>
                        )}

                        {!inscricao && (
                            <button className="bg-[#F36EC0] text-white font-semibold rounded-lg px-5 py-2 hover:bg-[#e055a8] transition" onClick={enviarInscricao}>
                                Confirmar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}