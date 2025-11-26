import React, { useState } from "react";
import { X, Upload } from "lucide-react";

interface CriarPostModalProps {
  estaAberto: boolean;
  aoFechar: () => void;
  aoCriar: (dados: { titulo: string; conteudo: string; imagem?: string }) => void;
}

const CriarPostModal: React.FC<CriarPostModalProps> = ({
  estaAberto,
  aoFechar,
  aoCriar,
}) => {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagem, setImagem] = useState("");

  const aoEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (titulo.trim() && conteudo.trim()) {
      aoCriar({
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        imagem: imagem.trim() || undefined,
      });
      setTitulo("");
      setConteudo("");
      setImagem("");
      aoFechar();
    }
  };

  if (!estaAberto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Criar nova publicação
          </h2>
          <button
            onClick={aoFechar}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={aoEnviar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título da sua publicação..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo
            </label>
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Compartilhe suas ideias com a comunidade..."
              rows={4}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem (opcional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-2">Cole uma URL de imagem</p>
              <input
                type="url"
                value={imagem}
                onChange={(e) => setImagem(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
              />
            </div>
          </div>

          {imagem && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Pré-visualização:</p>
              <img
                src={imagem}
                alt="Pré-visualização"
                className="max-w-full h-32 object-cover mx-auto rounded-lg border border-gray-200"
                onError={() => setImagem("")}
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={aoFechar}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CriarPostModal;