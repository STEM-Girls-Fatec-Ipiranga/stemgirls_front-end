import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Code, Calculator, Coffee, Palette, Music, Gamepad2 } from 'lucide-react';

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

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isMinimized ? 'w-16' : 'w-64'} h-full fixed left-0 top-16 z-40`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute -right-3 top-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        {isMinimized ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className={`font-bold text-gray-800 ${isMinimized ? 'hidden' : 'block'}`}>
          Categorias
        </h2>
      </div>

      {/* Categories */}
      <div className="p-2 space-y-2">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`group cursor-pointer rounded-xl p-3 hover:scale-105 transition-all duration-200 bg-gradient-to-r ${category.color} text-white shadow-md hover:shadow-lg`}
            title={isMinimized ? category.name : ''}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {category.icon}
              </div>
              {!isMinimized && (
                <span className="text-sm font-medium truncate">{category.name}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {!isMinimized && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg border-2 border-dashed border-purple-300">
            <p className="text-xs text-purple-600 font-medium text-center">
              💡 Dica: Complete todos os quizzes para ganhar badges especiais!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarLeft;