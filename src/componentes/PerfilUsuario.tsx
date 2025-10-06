import { User, Mail, Calendar, Edit3, LogOut, Camera, X } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
//import FotoPerfil from "../assets/img/perfil-sem-foto.jpg";

import { useState } from "react";

export default function PerfilUsuario() {

  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      : "-";

  const [user, setUser] = useState({
    data: localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData") || "{}")
      : {
        nomeCompleto: "",
        nomeUsuario: "",
        email: "",
        sobre: "",
        joinDate: formatDate,
        //profileImage: FotoPerfil
      }
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userToken");
    navigate("/"); 
  }

  return (
    <>
      <div className="min-h-screen bg-pink-100 p-4 sm:p-6 lg:p-8">
        <div className="absolute top-4 left-4">
          <Link to="/" className="flex items-center text-gray-700 hover:text-gray-900">
            <ArrowLeft size={24} className="mr-1" />
            <span className="text-lg font-medium">Voltar</span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">Meu Perfil</h1>
            <p className="text-black">Gerencie suas informações pessoais e configurações</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-32 sm:h-40 bg-gradient-to-r from-purple-600 to-pink-500"></div>

            <div className="px-6 sm:px-8 pb-8">
              <div className="relative -mt-16 sm:-mt-20 mb-6 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                <div className="relative">
                  <img
                    // src={user.profileImage}
                    alt={user.data.nomeCompleto}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{user.data.nomeCompleto}</h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <User className="w-4 h-4 text-black" />
                    <span className="text-black text-[17px]">@{user.data.nomeUsuario}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 sm:mt-0">
                  <button
                    className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar Perfil
                  </button>

                  <button

                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" onClick={handleLogout} />
                    Sair
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre</h3>
                    <p className="text-gray-400 leading-relaxed">Digite aqui um pequeno texto sobre você!{/*{user.data.sobre || "-"}*/}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">Membro desde</p>
                          <p className="font-medium"> 17/09/2025{/* {formatDate(user.data.joinDate)}*/}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">Email de login</p>
                          <p className="font-medium">{user.data.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};