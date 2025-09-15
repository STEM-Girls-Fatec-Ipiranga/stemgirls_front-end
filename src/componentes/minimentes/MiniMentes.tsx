
import React from 'react';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import QuizCategory from './QuizCategory';
import { quizCategories } from '../../models/QuizData';
import { Code, Calculator, Coffee, Palette } from 'lucide-react';

const iconMap = {
  Code: <Code className="h-6 w-6" />,
  Calculator: <Calculator className="h-6 w-6" />,
  Coffee: <Coffee className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />
};

function MiniMentes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50" style={{ backgroundColor: '#FFF6FF' }}>
      
      <div className="flex">
        <SidebarLeft />
        <SidebarRight />
        
        {/* Main Content */}
        <main className="flex-1 p-6 ml-64 mr-72 min-h-screen">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Bem-vinda ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">MiniMentes</span>! 
                </h1>
                <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                  Descubra o mundo incrível da programação através de quizzes divertidos e educativos! 
                  Cada passo é uma nova aventura no universo da tecnologia. 💜✨
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Quizzes Interativos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span>Vídeos Explicativos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Gamificação</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Categories */}
          <div className="space-y-8">
            {quizCategories.map((category, index) => (
              <QuizCategory
                key={index}
                title={category.title}
                icon={iconMap[category.icon as keyof typeof iconMap]}
                color={category.color}
                quizzes={category.quizzes}
              />
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 mb-8">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-8 text-white text-center shadow-lg">
              <h2 className="text-2xl font-bold mb-3">Pronta para começar sua jornada? 🚀</h2>
              <p className="mb-6 opacity-90">
                Escolha uma categoria acima e comece a explorar o mundo da programação!
              </p>
              <div className="flex justify-center space-x-4">
                <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Explorar Quizzes
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                  Saiba Mais
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Responsive Message */}
      <div className="lg:hidden fixed inset-0 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 text-center max-w-sm">
          <div className="text-4xl mb-4">📱</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Versão Mobile</h2>
          <p className="text-gray-600 text-sm">
            Para a melhor experiência, acesse o MiniMentes em um computador ou tablet! 
            Em breve teremos a versão mobile otimizada. 💜
          </p>
        </div>
      </div>
    </div>
  );
}

export default MiniMentes;