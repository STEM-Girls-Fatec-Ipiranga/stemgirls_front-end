import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Code, Calculator, Coffee, Palette, Music, Gamepad2 } from 'lucide-react';

/**
 * SidebarLeft (modificado)
 * - Removei o navigate para rotas internas
 * - Agora os botões fazem scroll suave para as seções da página (usamos slugify -> id)
 * - Mantive a mesma largura (w-64) quando expandido para ficar igual ao SidebarRight
 */

interface Category {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const SidebarLeft: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const categories: Category[] = [
    { name: 'Lógica de Programação', icon: <Code className="h-5 w-5" />, color: 'from-purple-400 to-purple-600' },
    { name: 'Matemática', icon: <Calculator className="h-5 w-5" />, color: 'from-pink-400 to-pink-600' },
    { name: 'Programação em Java', icon: <Coffee className="h-5 w-5" />, color: 'from-orange-400 to-orange-600' },
    { name: 'Design & UI/UX', icon: <Palette className="h-5 w-5" />, color: 'from-teal-400 to-teal-600' },
    { name: 'Algoritmos', icon: <Music className="h-5 w-5" />, color: 'from-indigo-400 to-indigo-600' },
    { name: 'Jogos & Diversão', icon: <Gamepad2 className="h-5 w-5" />, color: 'from-green-400 to-green-600' },
  ];

  // Cria ids compatíveis (mesma lógica usada para o alvo em QuizCategory)
  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const scrollToSection = (name: string) => {
    const id = slugify(name);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ${isMinimized ? 'w-16' : 'w-64'}`}
      style={{ position: 'absolute', left: 0, top: 239, bottom: 72, zIndex: 40 }}
      aria-label="Barra lateral esquerda"
    >
      {/* Toggle */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute -right-3 top-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
        aria-label={isMinimized ? 'Expandir barra' : 'Minimizar barra'}
      >
        {isMinimized ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className="p-4 border-b border-gray-100">
        <h2 className={`font-bold text-gray-800 ${isMinimized ? 'hidden' : 'block'}`}>
          Categorias
        </h2>
      </div>

      {/* Note: removi overflow-auto para garantir que a barra mostre todo o conteúdo quando expandida */}
      <div className="p-2 space-y-2 h-full">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(category.name)}
            title={isMinimized ? category.name : ''}
            className={`w-full text-left group cursor-pointer rounded-xl p-3 hover:scale-105 transition-all duration-200 bg-gradient-to-r ${category.color} text-white shadow-md hover:shadow-lg flex items-center space-x-3`}
            aria-label={`Ir para ${category.name}`}
          >
            <div className="flex-shrink-0">
              {category.icon}
            </div>

            {!isMinimized && (
              <span className="text-sm font-medium truncate">{category.name}</span>
            )}
          </button>
        ))}

        {!isMinimized && (
          <div className="mt-4 p-3">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg border-2 border-dashed border-purple-300">
              <p className="text-xs text-purple-600 font-medium text-center">
                💡 Dica: Complete todos os quizzes para ganhar badges especiais!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarLeft;
