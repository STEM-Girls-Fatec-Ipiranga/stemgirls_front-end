import React from "react";
import { User, Mail, Calendar, Edit3, LogOut, Camera, X, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { EditarPerfilModal } from "./EditarPerfilModal"; // ajuste o caminho se necessário

const DEFAULT_PROFILE_IMAGE = "https://i.ibb.co/gST4tJ1/default-profile.png";

export default function PerfilUsuario() {
    const navigate = useNavigate();

    const formatDate = (dateString?: string) =>
        dateString
            ? new Date(dateString).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
            : "Data Indisponível";

    // leitura segura do localStorage (evita JSON.parse("undefined"))
    const [userData, setUserData] = useState(() => {
        const storedData = localStorage.getItem("userData");
        const initialData = storedData && storedData !== "undefined"
            ? JSON.parse(storedData)
            : {};

        return {
            nomeCompleto: initialData.nomeCompleto || "Nome Completo (Sem Login)",
            nomeUsuario: initialData.nomeUsuario || "stemgirl",
            email: initialData.email || "exemplo@stemgirls.com.br",
            sobre: initialData.sobre || "Digite aqui um pequeno texto sobre você!",
            joinDate: initialData.joinDate || "2024-01-01T00:00:00Z",
            profileImage: initialData.profileImage || DEFAULT_PROFILE_IMAGE,
        };
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleSave = (newUserData: any) => {
        setUserData(newUserData);
        localStorage.setItem("userData", JSON.stringify(newUserData));
    };

    const handleLogout = () => {
        localStorage.removeItem("userData");
        localStorage.removeItem("userToken");
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
                                        src={userData.profileImage}
                                        alt={userData.nomeCompleto}
                                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                        onError={(e: any) => { e.target.onerror = null; e.target.src = DEFAULT_PROFILE_IMAGE; }}
                                    />
                                </div>
                                <div className="flex-1 text-center sm:text-left mb-4 mt-8 sm:mt-0">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{userData.nomeCompleto}</h2>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                        <User className="w-4 h-4 text-purple-600" />
                                        <span className="text-gray-600 text-[17px]">@{userData.nomeUsuario}</span>
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
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 border-b border-purple-200 pb-2">Sobre</h3>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {userData.sobre?.trim() || "Nenhum texto 'Sobre' adicionado ainda. Clique em 'Editar Perfil' para adicionar um!"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-pink-50 rounded-xl p-6 border border-pink-100">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-pink-200 pb-2">Informações da Conta</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 text-gray-700">
                                                <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Membro desde</p>
                                                    <p className="font-medium text-gray-800">{formatDate(userData.joinDate)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 text-gray-700">
                                                <Mail className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Email de login</p>
                                                    <p className="font-medium text-gray-800 break-all">{userData.email}</p>
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
                                        <ArrowLeft className="w-5 h-5"/>
                                        Voltar
                                    </button>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Edição - passo ambas convenções de props para compatibilidade */}
            <EditarPerfilModal
                //estaAberto={isModalOpen}
                //aoFechar={toggleModal}
                //aoSalvar={handleSave}
                isOpen={isModalOpen}
                onClose={toggleModal}
                onSave={handleSave}
                initialData={userData}
            />
        </>
    );
}