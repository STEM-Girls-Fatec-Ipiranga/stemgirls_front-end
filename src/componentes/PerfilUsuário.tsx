import React, { useState } from 'react';
import { Camera, Mail, Calendar, Shield, Edit3, LogOut, X, Save } from 'lucide-react';

interface UserData {
  name: string;
  username: string;
  avatar: string;
  about: string;
  memberSince: string;
  email: string;
  isActive: boolean;
}

const UserProfile: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: 'Maria Silva Santos',
    username: 'maria.santos',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    about: 'Desenvolvedora full-stack apaixonada por criar experiências digitais incríveis. Especialista em React, Node.js e design UI/UX.',
    memberSince: 'Janeiro 2023',
    email: 'maria.santos@email.com',
    isActive: true
  });

  const [editData, setEditData] = useState({
    username: userData.username,
    avatar: userData.avatar
  });

  const handleEditProfile = () => {
    setEditData({
      username: userData.username,
      avatar: userData.avatar
    });
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setUserData(prev => ({
      ...prev,
      username: editData.username,
      avatar: editData.avatar
    }));
    setIsEditModalOpen(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      username: userData.username,
      avatar: userData.avatar
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fff6ff] p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-[#f36ec0] to-[#af5fe4] rounded-3xl overflow-hidden shadow-2xl mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative p-8 lg:p-12 text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-6">
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-6 border-white shadow-2xl object-cover mx-auto"
              />
              <div className="absolute inset-0 rounded-full shadow-inner"></div>
            </div>
            
            {/* User Info */}
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {userData.name}
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 font-medium">
              @{userData.username}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleEditProfile}
                className="flex items-center justify-center gap-2 bg-[#f36ec0] hover:bg-[#e055a8] text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Edit3 size={20} />
                <span>Editar Perfil</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#af5fe4] hover:bg-[#9b4dcc] text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <LogOut size={20} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* About Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-[#f36ec0] to-[#af5fe4] rounded-full"></div>
              Sobre
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">{userData.about}</p>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-[#f36ec0] to-[#af5fe4] rounded-full"></div>
              Informações da Conta
            </h2>
            <div className="flex items-center gap-4 text-lg">
              <Calendar className="text-[#af5fe4]" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Membro desde</p>
                <p className="font-semibold text-gray-800">{userData.memberSince}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-[#f36ec0] to-[#af5fe4] rounded-full"></div>
              Informações de Contato
            </h2>
            <div className="flex items-center gap-4 text-lg">
              <Mail className="text-[#f36ec0]" size={24} />
              <div>
                <p className="text-gray-500 text-sm">E-mail</p>
                <p className="font-semibold text-gray-800">{userData.email}</p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-[#f36ec0] to-[#af5fe4] rounded-full"></div>
              Status da Conta
            </h2>
            <div className="flex items-center gap-4 text-lg">
              <Shield className="text-[#af5fe4]" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${userData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="font-semibold text-gray-800">
                    {userData.isActive ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Editar Perfil</h3>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Foto do Perfil
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={editData.avatar}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border-4 border-gray-200"
                  />
                  <div className="flex-1">
                    <input
                      type="url"
                      value={editData.avatar}
                      onChange={(e) => setEditData(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="URL da imagem"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f36ec0] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nome de Usuário
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">@</span>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f36ec0] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#f36ec0] to-[#af5fe4] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;