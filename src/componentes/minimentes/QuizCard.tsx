import React from 'react';
import { Play, Clock, Star, Users } from 'lucide-react';

interface Quiz {
  id: number;
  title: string;
  description: string;
  //duration: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  //participants: number;
  rating: number;
  videoThumbnail: string;
}

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800 border-green-200';
      case 'Médio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Difícil': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group hover:scale-105">
      {/* Video Thumbnail */}
      <div className="relative h-32 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <button className="relative z-10 bg-white bg-opacity-90 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform hover:bg-opacity-100">
          <Play className="h-6 w-6 text-purple-600 ml-0.5" fill="currentColor" />
        </button>
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-purple-600">
          Vídeo
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-sm leading-tight">{quiz.title}</h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(quiz.difficulty)}`}>
            {quiz.difficulty}
          </div>
        </div>

        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{quiz.description}</p>

        {/* Action Button */}
        <button className="w-full bg-[#F36EC0] text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-200 hover:shadow-md">
          Começar Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizCard;