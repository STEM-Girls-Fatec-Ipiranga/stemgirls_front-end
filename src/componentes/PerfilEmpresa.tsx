import React, { useState } from "react";
import { User, Mail, Calendar, Edit3, ArrowLeft, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EditarPerfilModal } from "./EditarPerfilModal"; // ajuste para import nomeado (ou exporte como default no arquivo)

const DEFAULT_PROFILE_IMAGE = "https://i.ibb.co/gST4tJ1/default-profile.png";

export default function PerfilEmpresa() {
    const navigate = useNavigate();

    const formatDate = (dateString: string | number | Date) =>
        dateString
            ? new Date(dateString).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
            : "Data Indisponível";

    // 🔹 Puxa os dados da empresa do localStorage
    const [empresaData, setEmpresaData] = useState(() => {
        const storedData = localStorage.getItem("empresaData");
        const initialData =
            storedData && storedData !== "undefined"
                ? JSON.parse(storedData)
                : {};

        return {
            nomeEmpresa: initialData.nomeEmpresa || "Nome da Empresa (Sem Login)",
            cnpj: "",
            emailEmpresa: initialData.emailEmpresa || "empresa@exemplo.com.br",
            senha: initialData.senha || "********",
            sobre: initialData.sobre || "Digite aqui um pequeno texto sobre sua empresa!",
            joinDate: initialData.joinDate || "2025-11-12T00:00:00Z",
            profileImage: initialData.profileImage || DEFAULT_PROFILE_IMAGE,
        };
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleSave = (newData: React.SetStateAction<{ nomeEmpresa: any; cnpj: any; emailEmpresa: any; senha: any; sobre: any; joinDate: any; profileImage: any; }>) => {
        setEmpresaData(newData);
        localStorage.setItem("empresaData", JSON.stringify(newData));
    };

    const handleLogout = () => {
        localStorage.removeItem("empresaData");
        localStorage.removeItem("empresaToken");
        navigate("/");
    };

    return (
        <>
            <div className="min-h-screen bg-pink-50 p-4 sm:p-6 lg:p-8 font-inter">
                <div className="flex justify-center max-w-4xl mx-auto">
                    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden mt-[40px] mb-8">
                        <div className="h-32 sm:h-40 bg-gradient-to-r from-purple-600 to-pink-500"></div>
                        <div className="px-6 sm:px-8 pb-8">
                            <div className="relative -mt-16 sm:-mt-20 mb-6 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                                <div className="relative">
                                    <img
                                        src={empresaData.profileImage}
                                        alt={empresaData.nomeEmpresa}
                                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                            const img = e.currentTarget;
                                            (img as any).onerror = null;
                                            img.src = DEFAULT_PROFILE_IMAGE;
                                        }}
                                    />
                                </div>
                                <div className="flex-1 text-center sm:text-left mb-4 mt-8 sm:mt-0">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                                        {empresaData.nomeEmpresa}
                                    </h2>
                                    <div className="flex text-pink-600 items-center justify-center sm:justify-start gap-2">
                                        <Star />
                                        <span className="text-pink-600 text-[17px] ">
                                            Perfil empresarial
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-4 sm:mt-0 flex-shrink-0">
                                    <button
                                        onClick={toggleModal}
                                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Editar Perfil
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 border-b border-purple-200 pb-2">
                                            Sobre a Empresa
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {empresaData.sobre?.trim() ||
                                                "Nenhum texto 'Sobre' adicionado ainda. Clique em 'Editar Perfil' para adicionar um!"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-pink-50 rounded-xl p-6 border border-pink-100">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-pink-200 pb-2">
                                            Informações da Conta
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 text-gray-700">
                                                <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Parceira desde</p>
                                                    <p className="font-medium text-gray-800">
                                                        {formatDate(empresaData.joinDate)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 text-gray-700">
                                                <Mail className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Email de login</p>
                                                    <p className="font-medium text-gray-800 break-all">
                                                        {empresaData.emailEmpresa}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <Link to="/">
                                    <button
                                        className="w-auto px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-bold transition-colors duration-200 shadow-lg flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Voltar
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Edição — passo ambas convenções de props para compatibilidade */}
            <EditarPerfilModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                onSave={handleSave}
                initialData={empresaData}
            />
        </>
    );
}
