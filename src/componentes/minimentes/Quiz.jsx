import React, { useState } from "react";
import quizLogo from "../../assets/img/quiz-logo.jpg";

export default function Quiz({ active, onClose, onFinish }) {
  const [quizState, setQuizState] = useState({
    started: false,
    finished: false,
    index: 0,
    answers: {},
    feedback: "",
    score: 0,
  });

  const q = active?.quiz || {};
  const currentQ = q.quiz?.[quizState.index] || {
    question: "",
    options: ["", "", "", ""],
    answer: 0,
  };

  const handleExternalLink = () => {
    try {
      const url = new URL(q.video || "");

      if (!["http:", "https:"].includes(url.protocol)) {
        alert("Este link não é válido.");
        return;
      }

      const accepted = window.confirm(
        `Você está saindo do MiniMentes e será direcionada para:\n${url.hostname}\n\nDeseja continuar?`
      );

      if (accepted) {
        window.open(url.href, "_blank", "noopener,noreferrer");
      }
    } catch {
      alert("Não foi possível abrir este link. Verifique se o endereço está correto.");
    }
  };

  const startQuiz = () =>
    setQuizState((s) => ({ ...s, started: true, finished: false }));

  const pickAnswer = (qIdx, optionIdx) => {
    setQuizState((s) => ({
      ...s,
      answers: { ...s.answers, [qIdx]: optionIdx },
      feedback: "",
    }));
  };

  const prevQuestion = () =>
    setQuizState((s) => ({
      ...s,
      index: Math.max(0, s.index - 1),
      feedback: "",
    }));

  const nextQuestion = () =>
    setQuizState((s) => ({
      ...s,
      index: Math.min(s.index + 1, (q.quiz?.length || 1) - 1),
      feedback: "",
    }));

  const checkAnswer = () => {
    const idx = quizState.index;
    const current = q.quiz?.[idx];

    if (!current) return;

    const chosen = quizState.answers[idx];

    if (chosen === undefined) {
      setQuizState((s) => ({
        ...s,
        feedback: "Selecione uma opção antes de verificar.",
      }));
      return;
    }

    const isCorrect = chosen === current.answer;

    setQuizState((s) => ({
      ...s,
      feedback: isCorrect
        ? "Resposta certa 🎉"
        : `Errada ❌ — correta: ${current.options[current.answer]}`,
    }));
  };

  const submitQuiz = () => {
    let score = 0;

    (q.quiz || []).forEach((qq, i) => {
      if (quizState.answers[i] === qq.answer) score++;
    });

    setQuizState((s) => ({ ...s, finished: true, score }));
    onFinish?.({ score, total: q.quiz?.length || 0 });
  };

  const retry = () => {
    setQuizState({
      started: false,
      finished: false,
      index: 0,
      answers: {},
      feedback: "",
      score: 0,
    });
  };

  if (!active) return null;

  const ArrowLeft = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M15 18l-6-6 6-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ArrowRight = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M9 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 text-gray-800 flex flex-col">
      <div className="sticky top-0 bg-white z-10 border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <button
            onClick={() => onClose()}
            className="flex items-center gap-2 text-pink-600 border border-pink-200 px-3 py-1 rounded-full hover:bg-pink-50 transition shadow-sm"
          >
            <ArrowLeft />
            <span className="text-sm font-medium">Voltar</span>
          </button>

          <div className="text-center font-semibold">
            <div className="text-black font-bold truncate">{q.title}</div>
            <div className="text-xs text-gray-600">
              {active.categoryTitle || ""}
            </div>
          </div>

          <div style={{ width: 84 }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="relative w-full aspect-video bg-gray-200 flex items-center justify-center">
              {q.thumbnail ? (
                <img
                  src={q.thumbnail}
                  alt={q.title || "Thumbnail do conteúdo"}
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                  onClick={handleExternalLink}
                />
              ) : (
                <div className="text-gray-500 p-6 text-center">
                  Imagem não disponível
                </div>
              )}

              {q.thumbnail && (
                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-2 rounded-lg pointer-events-none">
                  Clique na imagem para acessar o conteúdo externo
                </div>
              )}
            </div>

            <div className="mt-8 bg-white rounded-2xl border-2 border-pink-300 p-8 shadow text-center">
              <div className="flex justify-center mb-4">
                <img
                  src={quizLogo}
                  alt="Quiz Logo"
                  className="w-36 h-20 object-contain rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {!quizState.started && !quizState.finished && (
                <>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    Este quiz foi criado para ajudar você a treinar e reforçar o que aprendeu! 💡
                    {"\n"}Você pode refazê-lo quantas vezes quiser e usá-lo como uma forma divertida de estudar.
                    {"\n"}Nossa dica: acesse o conteúdo pela imagem antes de começar o quiz 😉
                    {"\n"}Ah, e cada acerto vale pontos — então, boa sorte e mande bem! 🎯
                  </p>
                  <button
                    onClick={startQuiz}
                    className="mt-6 px-12 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-lg font-semibold shadow-md"
                  >
                    Iniciar
                  </button>
                </>
              )}

              {quizState.started && !quizState.finished && (
                <div className="mt-6">
                  <hr className="border-pink-100 mb-4" />

                  <p className="font-semibold text-black text-lg">
                    {currentQ.question}
                  </p>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, oi) => {
                      const text = currentQ.options?.[oi] ?? `Opção ${oi + 1}`;
                      const isChosen = quizState.answers[quizState.index] === oi;

                      return (
                        <button
                          key={oi}
                          onClick={() => pickAnswer(quizState.index, oi)}
                          className={`w-full px-4 py-3 rounded-full border-2 text-sm font-medium transition text-left ${
                            isChosen
                              ? "border-pink-500 bg-pink-50 text-pink-600"
                              : "border-pink-200 hover:border-pink-400"
                          }`}
                        >
                          {text}
                        </button>
                      );
                    })}
                  </div>

                  {quizState.feedback && (
                    <div className="mt-4 text-sm text-gray-700">
                      <div className="inline-block px-4 py-2 rounded-full bg-white border border-pink-100 text-pink-600">
                        {quizState.feedback}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-6">
                    <button
                      onClick={prevQuestion}
                      disabled={quizState.index === 0}
                      className="text-pink-600 disabled:opacity-30"
                    >
                      <ArrowLeft />
                    </button>

                    <button
                      onClick={checkAnswer}
                      className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6 py-2 text-sm font-semibold shadow"
                    >
                      Verificar
                    </button>

                    <button
                      onClick={() => {
                        if (quizState.index >= (q.quiz?.length || 1) - 1) {
                          submitQuiz();
                        } else {
                          nextQuestion();
                        }
                      }}
                      className="text-pink-600"
                    >
                      <ArrowRight />
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Pergunta {quizState.index + 1} de {q.quiz?.length || 0}
                  </div>
                </div>
              )}

              {quizState.finished && (
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-pink-600">Resultado</h3>
                  <p className="mt-3 text-gray-600">
                    Você acertou {quizState.score} de {q.quiz?.length || 0}
                  </p>

                  <div className="mt-6 flex justify-center gap-3">
                    <button
                      onClick={() => onClose()}
                      className="px-6 py-2 rounded-full bg-pink-500 text-white shadow hover:bg-pink-600"
                    >
                      Fechar
                    </button>
                    <button
                      onClick={retry}
                      className="px-6 py-2 rounded-full border border-pink-300 text-pink-600 hover:bg-pink-50"
                    >
                      Tentar novamente
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-16" />
        </div>
      </div>
    </div>
  );
}
