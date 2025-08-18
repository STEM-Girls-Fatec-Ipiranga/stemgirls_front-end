import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface CriarComunidadeModalProps {
  estaAberto: boolean;
  aoFechar: () => void;
  aoCriar: (dados: { nome: string; usuario: string; avatar: string }) => void;
}

const CriarComunidadeModal: React.FC<CriarComunidadeModalProps> = ({
  estaAberto,
  aoFechar,
  aoCriar
}) => {
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [avatar, setAvatar] = useState('');

  const avataresPadrao = [
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    'https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim() && usuario.trim() && avatar) {
      aoCriar({
        nome: nome.trim(),
        usuario: usuario.startsWith('@') ? usuario : `@${usuario}`,
        avatar
      });
      setNome('');
      setUsuario('');
      setAvatar('');
      aoFechar();
    }
  };

  if (!estaAberto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Criar nova comunidade</h2>
          <button
            onClick={aoFechar}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da comunidade
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: TechWomen Brasil"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="techwomenbr"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Será exibido como @{usuario.replace('@', '')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto da comunidade
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {avataresPadrao.map((urlAvatar, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAvatar(urlAvatar)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    avatar === urlAvatar ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <img
                    src={urlAvatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-16 object-cover"
                  />
                </button>
              ))}
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Ou cole uma URL de imagem</p>
              <input
                type="url"
                value={avatar.startsWith('https://images.pexels.com') ? '' : avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {avatar && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Pré-visualização:</p>
              <img
                src={avatar}
                alt="Pré-visualização"
                className="w-16 h-16 rounded-full mx-auto border-2 border-pink-200"
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
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Criar comunidade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CriarComunidadeModal;
