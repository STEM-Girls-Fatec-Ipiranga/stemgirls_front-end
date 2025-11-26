import { useState } from "react";
import axios from "axios";

function PopupReprovar({ fechar }) {
    const [email, setEmail] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = axios.put(`http://localhost:8080/empresa/${email}/reprovar`);
            setMensagem("Carregando...");
            await new Promise(resolve => setTimeout(resolve, 3000)); 
            fechar();
        }catch (error) {
            setErro("Erro ao reprovar empresa", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
                <h2 className="text-xl font-semibold mb-4">Confirmar Reprovação</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <input
                        type="email"
                        placeholder="Digite o e-mail da empresa"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Digite o CNPJ"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-7001"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                    />

                    {erro && <p className="text-red-700 text-sm">{erro}</p>}
                    {mensagem && <p className="text-gray-700 text-sm">{mensagem}</p>}

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={fechar} className="bg-gray-300 px-3 py-1 rounded-lg">
                            Cancelar
                        </button>

                        <button type="submit" className="bg-red-500 text-white px-3 py-1 rounded-lg">
                            Reprovar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PopupReprovar;
