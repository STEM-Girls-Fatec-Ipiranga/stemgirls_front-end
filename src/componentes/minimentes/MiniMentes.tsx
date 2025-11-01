import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import QuizCategory from './QuizCategory';
import { quizCategories } from '../../models/QuizData';
import { Code, Calculator, Coffee, Palette } from 'lucide-react';

// Mapa de ícones usado nas categorias
const iconMap = {
  Code: <Code className="h-6 w-6" />,
  Calculator: <Calculator className="h-6 w-6" />,
  Coffee: <Coffee className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />
};

function MiniMentes() {
  const navigate = useNavigate();

  return (
    // Página inteira
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50" style={{ backgroundColor: '#FFF6FF' }}>
      {/* Layout: sidebars fixas + conteúdo central */}
      <div className="flex">
        {/* Sidebars são fixas; espaço do main é tratado via margin (veja main abaixo) */}
        <SidebarLeft />
        <SidebarRight />

        {/* Main Content
            - ml e mr equivalentes às larguras máximas das sidebars para não sobrepor
            - pt e pb garantem não ficar abaixo do header/rodapé (assumimos header 64px e footer 72px)
        */}
        <main
          className="flex-1 p-6 min-h-screen"
          style={{
            marginLeft: '16rem',   // 64 = 16rem (w-64)
            marginRight: '18rem',  // 72 = 18rem (w-72)
            paddingTop: '64px',    // espaço para menu superior (header)
            paddingBottom: '72px'  // espaço para footer
          }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Bem-vinda ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">MiniMentes</span>!
                </h1>
                <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                  Descubra o mundo incrível da programação através de quizzes divertidos e educativos!
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
                {/* Navega para página de quizzes */}
                <button
                  onClick={() => navigate('/quizzes')}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Explorar Quizzes
                </button>

                {/* Navega para página sobre / saiba mais */}
                <button
                  onClick={() => navigate('/sobre')}
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
                >
                  Saiba Mais
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Responsive Message (fica sobre toda a página quando em telas pequenas) */}
      <div className="lg:hidden fixed inset-0 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 text-center max-w-sm">
          <div className="text-4xl mb-4">📱</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Versão Mobile</h2>
          <p className="text-gray-600 text-sm">
            Para a melhor experiência, acesse o MiniMentes em um computador ou tablet!
          </p>
        </div>
      </div>
    </div>
  );
}

export default MiniMentes;
