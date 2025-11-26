import { useState } from 'react';
import axios from "axios";

function PopupConfirmar({ fechar }) {
    const [email, setEmail] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = axios.put(`http://localhost:8080/empresa/${email}/aprovar`);
            setMensagem("Carregando...");
            await new Promise(resolve => setTimeout(resolve, 3000)); 
            fechar();
        }catch (error) {
            setErro("Erro ao reprovar empresa", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-[350px] shadow-lg">
                <h2 className="text-lg font-bold mb-4">Confirmar Aprovação</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <input
                        type="text"
                        placeholder="Digite o e-mail da empresa"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                    />

                    <input
                        type="text"
                        placeholder="Digite o CNPJ"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                    />

                    {erro && <p className="text-red-700">{erro}</p>}
                    {mensagem && <p className="text-gray-700 text-sm">{mensagem}</p>}

                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={fechar} className="bg-gray-500 text-white px-4 py-2 rounded-xl">
                            Cancelar
                        </button>

                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-xl">
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PopupConfirmar;
