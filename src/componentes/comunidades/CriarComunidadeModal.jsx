import { useState } from "react";
import { Upload } from "lucide-react";

const IMAGEM_PADRAO = "https://i.ibb.co/6P0wW0X/stemgirls.png";
const MAX_IMAGEM = 1_400_000; // ~1,4 MB (o back aceita até 2.000.000 caracteres em base64)

export default function CriarComunidadeModal({ fechar, criar }) {
    const [nome, setNome] = useState("");
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem, setImagem] = useState("");
    const [erro, setErro] = useState("");

    const escolherImagem = (e) => {
        const arquivo = e.target.files?.[0];
        if (!arquivo) return;
        if (arquivo.size > MAX_IMAGEM) return setErro("Imagem muito grande (máximo 1,4 MB)");
        setErro("");
        const leitor = new FileReader();
        leitor.onloadend = () => setImagem(leitor.result);
        leitor.readAsDataURL(arquivo);
    };

    const salvar = async (e) => {
        e.preventDefault();
        try {
            await criar({ nome, nomeUsuario, descricao, imagem: imagem || IMAGEM_PADRAO });
            fechar();
        } catch (err) {
            setErro(err.message);
        }
    };

    const estiloInput = "w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700";

    return (
        <div className="flex justify-center items-start p-4 fixed inset-0 z-50 bg-black/50 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl mt-10 mb-10 max-h-[90vh] overflow-y-auto">
                <form onSubmit={salvar} className="flex flex-col p-6 gap-6">
                    <h2 className="text-xl font-semibold text-gray-800">Criar nova comunidade</h2>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                            <input className={estiloInput} type="text" required value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Digite o nome da comunidade" />
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Usuário</label>
                            <input className={estiloInput} type="text" required value={nomeUsuario}
                                onChange={(e) => setNomeUsuario(e.target.value)}
                                placeholder="techwomenbr" />
                            <p className="text-xs text-gray-500 mt-1">
                                Será exibido como @{nomeUsuario.replace("@", "")}
                            </p>
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                            <input className={estiloInput} type="text" value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder="Digite a descrição da comunidade" />
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Foto da comunidade (opcional)</label>
                            <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer block">
                                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                                <span className="text-sm text-gray-500">Clique para enviar uma imagem do seu dispositivo</span>
                                <input type="file" accept="image/*" className="hidden" onChange={escolherImagem} />
                            </label>
                            {imagem && (
                                <img src={imagem} alt="Pré-visualização"
                                    className="w-16 h-16 rounded-full mx-auto mt-3 border-2 border-pink-200 object-cover" />
                            )}
                        </div>
                    </div>

                    {erro && <p className="text-sm text-red-500">{erro}</p>}

                    <div className="flex gap-2">
                        <button type="button" onClick={fechar} className="text-black bg-gray-200 px-3 py-1 rounded-lg">
                            Fechar
                        </button>
                        <button type="submit"
                            className="bg-[#F36EC0] text-white text-sm px-3 py-1 rounded-lg font-semibold hover:bg-[#e055a8] transition">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}