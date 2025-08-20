import React, { useRef, useState } from "react";
import { User, Mail, Calendar, Edit3, LogOut, Camera, X } from "lucide-react";

import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

type UserData = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  about: string;
  joinDate: string;      // ISO: "YYYY-MM-DD"
  profileImage: string;  // URL
};

interface UserProfileProps {
  user?: UserData;
  onLogout?: () => void;
}

const defaultUser: UserData = {
  id: "1",
  fullName: "Talita Vitória",
  username: "talitinha",
  email: "talitinha@gmail.com",
  about:
    "Desenvolvedora Full-Stack apaixonada por criar experiências digitais incríveis. Sempre em busca de novos desafios e oportunidades para crescer profissionalmente.",
  joinDate: "2025-08-20",
  profileImage:
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const normalizeUsername = (u: string) => u.trim().replace(/^@+/, "");

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  // estado "real" mostrado na tela
  const [profile, setProfile] = useState<UserData>(user ?? defaultUser);

  // estado do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUsername, setEditedUsername] = useState(profile.username);
  const [editedProfileImage, setEditedProfileImage] = useState(profile.profileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = () => {
    setEditedUsername(profile.username);
    setEditedProfileImage(profile.profileImage);
    setIsModalOpen(true);
  };

  const handleCancelEdit = () => setIsModalOpen(false);

  const handleSaveChanges = () => {
    setProfile((prev) => ({
      ...prev,
      username: normalizeUsername(editedUsername),
      profileImage: editedProfileImage || prev.profileImage,
    }));
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    else alert("Logout realizado com sucesso!");
  };

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) setEditedProfileImage(String(reader.result));
    };
    reader.readAsDataURL(file); // preview imediato
  };

  return (
    <div className="min-h-screen bg-pink-100 p-4 sm:p-6 lg:p-8">

      {/* 🔙 Botão de voltar */}
      <div className="absolute top-4 left-4">
        <Link to="/" className="flex items-center text-gray-700 hover:text-gray-900">
          <ArrowLeft size={24} className="mr-1" />
          <span className="text-lg font-medium">Voltar</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
            Meu Perfil
          </h1>
          <p className="text-black">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover colorida */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-purple-600 to-pink-500"></div>

          {/* Conteúdo */}
          <div className="px-6 sm:px-8 pb-8">
            <div className="relative -mt-16 sm:-mt-20 mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                {/* Foto */}
                <div className="relative">
                  <img
                    src={profile.profileImage}
                    alt={profile.fullName}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                </div>

                {/* Nome + @ */}
                <div className="flex-1 text-center sm:text-left mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {profile.fullName}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <User className="w-4 h-4 text-black" />
                    <span className="text-black text-[17px]">@{profile.username}</span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3 mt-4 sm:mt-0">
                  <button
                    onClick={openModal}
                    className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            </div>

            {/* Grid de detalhes */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Sobre */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre</h3>
                  <p className="text-gray-700 leading-relaxed">{profile.about}</p>
                </div>
              </div>

              {/* Informações da conta */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informações da Conta
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Membro desde</p>
                        <p className="font-medium">{formatDate(profile.joinDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Email de login</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>{/* /grid */}
          </div>
        </div>
      </div>

      {/* Modal de edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Editar Perfil</h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {/* Foto com overlay clicável */}
              <div className="text-center">
                <div
                  className="relative inline-block cursor-pointer"
                  onClick={handlePickFile}
                  title="Clique para escolher uma imagem do seu computador"
                >
                  <img
                    src={editedProfileImage}
                    alt="Preview"
                    className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-lg object-cover mx-auto"
                  />
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-gray-500 mt-2">Clique para alterar a foto</p>
              </div>

              {/* URL da foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Foto de Perfil
                </label>
                <input
                  type="url"
                  value={editedProfileImage}
                  onChange={(e) => setEditedProfileImage(e.target.value)}
                  className="w-full text-black bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                  placeholder="https://exemplo.com/minha-foto.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cole uma URL de imagem ou clique na foto acima para enviar um arquivo.
                </p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de Usuário
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="w-full text-black bg-white border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                    placeholder="nome.usuario"
                  />
                </div>
              </div>
            </div>

            {/* Rodapé */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex-1 bg-pink-500 hover:bg-pink-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
