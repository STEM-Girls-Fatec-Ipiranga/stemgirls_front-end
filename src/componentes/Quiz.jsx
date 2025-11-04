import React, { useState } from "react";

export default function Quiz() {
  const [start, setStart] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: "Qual linguagem é usada para estruturar páginas web?",
      options: ["CSS", "Python", "HTML", "C++"],
      answer: "HTML",
    },
    {
      question: "Qual propriedade CSS muda a cor do texto?",
      options: ["font-size", "color", "background", "text-align"],
      answer: "color",
    },
    {
      question: "O que significa a sigla 'JS'?",
      options: ["JavaSoft", "JavaScript", "JustScript", "JollySystem"],
      answer: "JavaScript",
    },
  ];

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100 text-black">
      <div className="bg-white border-4 border-pink-400 rounded-2xl p-8 w-[400px] text-center shadow-lg">
        {!start ? (
          <>
            <div className="flex flex-col items-center">
              <img src="/img/LogoQuiz.jpeg" alt="Quiz" className="w-40 mb-4 rounded-xl"/>
              <p className="text-sm text-gray-700 mb-6">
                Termos e Condições Gerais de Uso do Site da FEEMCODE. Os serviços
                do FeemCode são fornecidos pela pessoa jurídica OU física com a
                seguinte Razão Social FeemCode Sistemas de Inovação LTDA, com nome
                fantasia FeemCode, titular da propriedade intelectual sobre website,
                conteúdos e demais ativos relacionados à plataforma FeemCode.
              </p>
              <button
                onClick={() => setStart(true)}
                className="bg-pink-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-pink-600 transition"
              >
                Iniciar
              </button>
            </div>
          </>
        ) : !showResult ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {questions[currentQuestion].question}
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(option)}
                  className={`py-2 px-3 rounded-xl border-2 ${
                    selectedAnswer === option
                      ? "bg-pink-300 border-pink-500"
                      : "bg-white border-pink-300 hover:bg-pink-100"
                  } transition`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleAnswer}
              className="bg-pink-500 text-white py-2 px-6 rounded-full hover:bg-pink-600 transition"
            >
              Verificar
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-pink-600">
              Quiz finalizado!
            </h2>
            <p className="mb-4">
              Você acertou <b>{score}</b> de <b>{questions.length}</b> perguntas.
            </p>
            <button
              onClick={() => {
                setStart(false);
                setCurrentQuestion(0);
                setScore(0);
                setShowResult(false);
                setSelectedAnswer(null);
              }}
              className="bg-pink-500 text-white py-2 px-6 rounded-full hover:bg-pink-600 transition"
            >
              Reiniciar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
