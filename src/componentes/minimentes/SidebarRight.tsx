import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Trophy, Target, TrendingUp, Heart, Star, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * SidebarRight (modificado)
 * - Mantive o conteúdo que você já tinha, mas ajustei as larguras para ficar igual à LeftSidebar
 * - Removi overflow que fazia rolagem e deixei o painel maior (w-64) para mostrar todo conteúdo
 * - Caso o conteúdo exceda, o usuário pode minimizar o painel (isMinimized true)
 */

const SidebarRight: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();

  const motivationalQuotes = [
    "Você é incrível! 💖",
    "Cada erro é um aprendizado! 🌟",
    "Acredite no seu potencial! ✨",
    "Programar é arte! 🎨",
    "Você nasceu para brilhar! 🌟"
  ];

  const [currentQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ${isMinimized ? 'w-16' : 'w-64'}`}
      style={{ position: 'absolute', right: 0, top: 239, bottom: 72, zIndex: 40 }}
      aria-label="Barra lateral direita"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute -left-3 top-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
        aria-label={isMinimized ? 'Expandir painel' : 'Minimizar painel'}
      >
        {isMinimized ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {!isMinimized && (
        // Removi overflow-auto para evitar barra de scroll; aumentei largura para caber o conteúdo
        <div className="p-4 space-y-6 h-full">
          {/* Seção de Pontos */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-xl border-2 border-purple-200">
            <div className="flex items-center space-x-2 mb-3">
              <Trophy className="h-5 w-5 text-purple-600" />
              <h3 className="font-bold text-purple-800">Seus Pontos</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">1,247</div>
              <div className="flex justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-sm text-purple-600">Nível: Programadora Junior</p>
            </div>
            <div className="mt-3 text-center">
              <button onClick={() => navigate('/perfil')} className="text-sm underline">Ver perfil</button>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-gradient-to-br from-green-100 to-teal-100 p-4 rounded-xl border-2 border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-bold text-green-800">Desempenho</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Acertos:</span>
                <span className="font-semibold text-green-800">87%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Sequência:</span>
                <span className="font-semibold text-green-800">12 dias 🔥</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Badges:</span>
                <div className="flex space-x-1">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <Award className="h-4 w-4 text-silver-500" />
                  <Award className="h-4 w-4 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-xl border-2 border-yellow-200">
            <div className="flex items-center space-x-2 mb-3">
              <Heart className="h-5 w-5 text-orange-600 fill-current" />
              <h3 className="font-bold text-orange-800">Motivação</h3>
            </div>
            <p className="text-center text-orange-700 font-medium text-sm leading-relaxed">
              {currentQuote}
            </p>
          </div>
        </div>
      )}

      {/* Minimized */}
      {isMinimized && (
        <div className="p-4 space-y-4">
          <div className="text-center">
            <Trophy className="h-6 w-6 text-purple-600 mx-auto" />
            <div className="text-xs font-bold text-purple-600 mt-1">1247</div>
          </div>
          <div className="text-center">
            <Target className="h-6 w-6 text-pink-600 mx-auto" />
          </div>
          <div className="text-center">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarRight;
