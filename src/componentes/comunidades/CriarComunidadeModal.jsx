import { useState, useEffect } from "react";

export default function CriarComunidadeModal({ fechar }){
    const [user, setUser] = useState(null);

    useEffect(() => {
        let data = localStorage.getItem("user");
        setUser(JSON.parse(data));
    })

    return (
        <>
            <div className="flex justify-center items-start p-4 fixed inset-0 z-50 bg-black/50 overflow-y-auto">
                <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl mt-10 mb-10 max-h-[90vh] overflow-y-auto">
                    <form className="flex flex-col p-6 gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome
                                </label>
                                <input
                                    className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                                    type="text"
                                    placeholder="Digite o nome da comunidade"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição
                                </label>
                                <input
                                    className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                                    type="text"
                                    placeholder="Digite a descrição da comunidade"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-black bg-gray-200 px-3 py-1 rounded-lg" onClick={fechar}>
                                Fechar
                            </button>
                            <button
                                className="bg-[#F36EC0] text-white text-sm px-3 py-1 rounded-lg font-semibold hover:bg-[#e055a8] transition"
                                type="button"
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    ); 
}