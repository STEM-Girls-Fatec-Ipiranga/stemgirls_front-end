import React from 'react';
import QuizCard from './QuizCard';

interface Quiz {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  participants: number;
  rating: number;
  videoThumbnail: string;
}

interface QuizCategoryProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  quizzes: Quiz[];
}

const QuizCategory: React.FC<QuizCategoryProps> = ({ title, icon, color, quizzes }) => {
  return (
    <div className="mb-8">
      <div className={`flex items-center space-x-3 mb-4 p-4 rounded-xl bg-gradient-to-r ${color} text-white shadow-md`}>
        <div className="bg-white bg-opacity-20 p-2 rounded-lg">
          {icon}
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
};

export default QuizCategory;