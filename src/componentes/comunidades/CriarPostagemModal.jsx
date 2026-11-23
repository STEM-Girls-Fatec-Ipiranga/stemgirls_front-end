import { useState } from "react";
import { Upload } from "lucide-react";

const MAX_IMAGEM = 1_400_000;

export default function CriarPostagemModal({ fechar, criar }) {
    const [titulo, setTitulo] = useState("");
    const [conteudo, setConteudo] = useState("");
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
            await criar({ titulo, conteudo, imagem: imagem || undefined });
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
                    <h2 className="text-xl font-semibold text-gray-800">Criar nova publicação</h2>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                            <input className={estiloInput} type="text" required value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="Digite o título da sua publicação" />
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo</label>
                            <textarea className={estiloInput} rows={4} required value={conteudo}
                                onChange={(e) => setConteudo(e.target.value)}
                                placeholder="Compartilhe suas ideias com a comunidade..." />
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Imagem (opcional)</label>
                            <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer block">
                                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                                <span className="text-sm text-gray-500">Clique para enviar uma imagem do seu dispositivo</span>
                                <input type="file" accept="image/*" className="hidden" onChange={escolherImagem} />
                            </label>
                            {imagem && (
                                <img src={imagem} alt="Pré-visualização"
                                    className="max-w-full h-32 object-cover mx-auto mt-3 rounded-lg border border-gray-200" />
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
                            Publicar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}