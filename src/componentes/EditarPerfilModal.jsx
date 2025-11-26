import { User, Mail, Calendar, Edit3, LogOut, Camera, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";

// URL de placeholder para imagem de perfil
const DEFAULT_PROFILE_IMAGE = "https://placehold.co/128x128/9D4EDD/ffffff?text=SG";

/**
 * Componente do Modal de Edição de Perfil
 * @param {object} props
 * @param {boolean} props.isOpen - Se o modal está aberto.
 * @param {object} props.initialData - Dados iniciais do usuário para edição.
 * @param {function} props.onClose - Função para fechar o modal.
 * @param {function} props.onSave - Função chamada ao salvar as alterações.
 */

export const EditarPerfilModal = ({ isOpen, initialData, onClose, onSave }) => {
    // Estado local para armazenar as edições temporariamente
    const [editedUsername, setEditedUsername] = useState(initialData.nomeUsuario || '');
    const [editedSobre, setEditedSobre] = useState(initialData.sobre || '');
    const [editedProfileImage, setEditedProfileImage] = useState(initialData.profileImage || DEFAULT_PROFILE_IMAGE);

    // Efeito para sincronizar dados iniciais quando o modal abre
    useEffect(() => {
        if (isOpen) {
            setEditedUsername(initialData.nomeUsuario || '');
            setEditedSobre(initialData.sobre || '');
            setEditedProfileImage(initialData.profileImage || DEFAULT_PROFILE_IMAGE);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleImageClick = () => {
        console.log("Simulando abertura do explorador de arquivos para nova imagem.");
    };

    const handleSave = () => {
        const newUserData = {
            ...initialData,
            nomeUsuario: editedUsername.trim(),
            sobre: editedSobre.trim(),
            profileImage: editedProfileImage,
        };
        onSave(newUserData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 transform transition-all duration-300 scale-100 opacity-100">
                
                {/* Cabeçalho do Modal */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Edit3 className="w-5 h-5 text-pink-500" />
                        Editar Perfil
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Seção de Imagem de Perfil */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer" onClick={handleImageClick}>
                        <img
                            src={editedProfileImage}
                            alt="Foto de Perfil"
                            className="w-24 h-24 rounded-full border-4 border-pink-300 object-cover shadow-md transition-shadow group-hover:shadow-xl"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Clique para alterar a foto</p>
                </div>

                {/* Campo Nome de Usuário */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome de Usuário Atual: <span className="font-semibold text-pink-600">@{initialData.nomeUsuario}</span>
                    </label>
                    <input
                        type="text"
                        value={editedUsername}
                        onChange={(e) => setEditedUsername(e.target.value)}
                        placeholder="Digite o novo nome de usuário"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                    />
                </div>

                {/* Campo Sobre */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sobre Você
                    </label>
                    <textarea
                        value={editedSobre}
                        onChange={(e) => setEditedSobre(e.target.value)}
                        placeholder="Adicione ou altere sobre você aqui"
                        rows={4}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                        style={{ color: editedSobre ? '#374151' : '#9ca3af' }}
                    />
                </div>

                {/* Botões de Ação */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};