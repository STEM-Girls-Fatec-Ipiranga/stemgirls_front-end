import { Edit3, LogOut, Camera, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const DEFAULT_PROFILE_IMAGE = "../assets/default-profile.png";

export const EditarPerfilModal = ({ abrir, fechar, user }) => {
    const [sobre, setSobre] = useState("");
    const [file, setFile] = useState("");
    const [erro, setErro] = useState("");
    const [preview, setPreview] = useState(DEFAULT_PROFILE_IMAGE);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const imageURL = URL.createObjectURL(file);
        setPreview(imageURL);
        setFile(file);
    }

    const salvarAlteracoes = async () => {
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
            
            atualizarUsuario(link);

        } catch (error) {
            const errorMessage = error.response?.data;
            console.log(errorMessage);
            setErro(errorMessage);
        }
    }

    const atualizarUsuario = async (imagemPerfil) => {        
        try {
            const response = await axios.put("http://localhost:8080/usuario/atualizar", {
                email: user.email,
                sobre: sobre,
                linkImagemPerfil: imagemPerfil
            });
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log(response);
            fechar();
            window.location.reload();
        } catch (error) {
            const errorMessage = error.response?.data;
            console.log(errorMessage);
            setErro(errorMessage);
        }
    }

    if (!abrir) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 transform transition-all duration-300 scale-100 opacity-100">

                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Edit3 className="w-5 h-5 text-pink-500" />
                        Editar Perfil
                    </h2>
                    <button
                        onClick={fechar}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form>
                    <div className="flex flex-col items-center mb-8">
                        <img src={preview} alt="Imagem de Perfil" className="w-24 h-24 rounded-full border-4 border-pink-300 object-cover shadow-md transition-shadow group-hover:shadow-xl" />

                        <div className="flex justify-center items-center w-full m-6">
                            <input className="w-[128px] file:mx-0" type="file" onChange={handleFileChange} />
                        </div>  
                    </div>
                </form>
        
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

                <div className="flex justify-end gap-3">
                    <button
                        onClick={fechar}
                        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={salvarAlteracoes}
                        className="px-5 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};