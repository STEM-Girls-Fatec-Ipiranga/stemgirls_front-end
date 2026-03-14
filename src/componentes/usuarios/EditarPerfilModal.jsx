import { User, Mail, Calendar, Edit3, LogOut, Camera, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const DEFAULT_PROFILE_IMAGE = "https://res.cloudinary.com/dfykqixct/image/upload/v1764633385/wkjfmbhioe1tkd14ivhb.jpg";

/**
 * Componente do Modal de Edição de Perfil
 * @param {object} props
 * @param {boolean} props.isOpen - Se o modal está aberto.
 * @param {object} props.initialData - Dados iniciais do usuário para edição.
 * @param {function} props.onClose - Função para fechar o modal.
 * @param {function} props.onSave - Função chamada ao salvar as alterações.
 */

export const EditarPerfilModal = ({ isOpen, initialData, onClose, onSave }) => {
    const [user, setUser] = useState({
        data: localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user"))
            : {}
    });

    const [sobre, setSobre] = useState("");
    const [file, setFile] = useState("");
    const [erro, setErro] = useState("");
    const [preview, setPreview] = useState(DEFAULT_PROFILE_IMAGE);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const imageURL = URL.createObjectURL(file);
        setPreview(imageURL);
        setFile(file);
    };

    const enviarImagem = async () => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "http://localhost:8080/usuario/upload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
        
            const link = response.data;
            console.log("link imagem "+response.data);
            
            salvarUsuario(link);

        } catch (error) {
            const errorMessage = error.response?.data;
            console.log(errorMessage);
            setErro(errorMessage);
        }
    }

    const salvarUsuario = async (imagemPerfil) => {        
        try {
            const response = await axios.put("http://localhost:8080/usuario/atualizar", {
                email: user.data.email,
                sobre: sobre,
                linkImagemPerfil: imagemPerfil
            });
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log(response);
            onClose();
            window.location.reload();
        } catch (error) {
            const errorMessage = error.response?.data;
            console.log(errorMessage);
            setErro(errorMessage);
        }
    }

    if (!isOpen) return null;

    // const handleSave = () => {
    //     const newUserData = {
    //         ...initialData,
    //         nomeUsuario: editedUsername.trim(),
    //         sobre: editedSobre.trim(),
    //         profileImage: editedProfileImage,
    //     };
    //     onSave(newUserData);
    //     onClose();
    // };

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
                <form>
                    <div className="flex flex-col items-center mb-8">
                        <img src={preview} alt="Imagem de Perfil" className="w-24 h-24 rounded-full border-4 border-pink-300 object-cover shadow-md transition-shadow group-hover:shadow-xl" />

                        <div className="flex justify-center items-center w-full m-6">
                            <input className="w-[128px] file:mx-0" type="file" onChange={handleFileChange} />
                        </div>  
                    </div>
                </form>
                {/* Campo Sobre */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sobre Você
                    </label>
                    <textarea
                        value={sobre}
                        onChange={(e) => setSobre(e.target.value)}
                        placeholder="Adicione ou altere sobre você aqui"
                        rows={4}
                        className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
                    />
                </div>

                <div>
                    <p style={{
                        color: '#e74c3c',
                        fontSize: '0.8rem',
                        marginTop: '4px',
                        paddingLeft: '4px',
                        fontWeight: '600',
                    }}>

                        {erro}
                    </p>
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
                        onClick={enviarImagem}
                        className="px-5 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};