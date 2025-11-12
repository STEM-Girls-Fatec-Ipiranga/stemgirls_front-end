import React, { useRef, useState, useEffect } from "react";

// MiniMentes — Single-file React component (TailwindCSS required)
// Drop into your React app (App.jsx) where Tailwind is configured.
// This file **does not** include site top menu / footer — it only renders the MiniMentes area.

export default function MiniMentes() {
  // ---------- Sample data (replace videos / thumbs with your assets) ----------
  const data = [
    {
      id: "logica",
      title: "Lógica de Programação",
      colorFrom: "from-purple-500",
      colorTo: "to-violet-500",
      quizzes: [
        {
          id: "q1",
          title: "Primeiros Passos na Programação",
          difficulty: "Fácil",
          video: "/videos/sample1.mp4",
          thumbnail: "/images/thumb1.jpg",
          description:
            "Aprenda o que é programação de forma divertida e fácil! Descubra como os programas funcionam.",
          quiz: [
            {
              question: "O que é uma variável?",
              options: ["Um tipo de loop", "Um espaço para armazenar valor", "Um estilo CSS"],
              answer: 1,
            },
            {
              question: "Qual comando imprime no console em JS?",
              options: ["print()", "console.log()", "echo"],
              answer: 1,
            },
          ],
        },
        {
          id: "q2",
          title: "Algoritmos do Dia a Dia",
          difficulty: "Fácil",
          video: "/videos/sample2.mp4",
          thumbnail: "/images/thumb2.jpg",
          description: "Veja como usamos algoritmos todos os dias!",
          quiz: [
            {
              question: "Algoritmo é:",
              options: ["Um conjunto de passos", "Um tipo de dado", "Uma cor"],
              answer: 0,
            },
          ],
        },
      ],
    },
    {
      id: "mat",
      title: "Matemática",
      colorFrom: "from-pink-500",
      colorTo: "to-orange-400",
      quizzes: [],
    },
    {
      id: "java",
      title: "Programação em Java",
      colorFrom: "from-orange-400",
      colorTo: "to-red-400",
      quizzes: [],
    },
  ];

  // ---------- refs for scrolling ----------
  const refs = useRef({});
  data.forEach((c) => {
    if (!refs.current[c.id]) refs.current[c.id] = React.createRef();
  });

  // ---------- UI state ----------
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // When a user clicks 'Assistir' we switch the center area to fullscreen-mode (within the app)
  const [active, setActive] = useState(null); // {categoryId, quiz}
  const [isFullscreen, setIsFullscreen] = useState(false);

  // user stats
  const [userStats, setUserStats] = useState({ points: 1247, accuracy: 87, streak: 12, badges: 3 });

  // quiz state
  const [quizState, setQuizState] = useState({ answers: {}, index: 0, finished: false, score: 0 });

  // ---------- actions ----------
  function scrollToCategory(id) {
    const r = refs.current[id];
    if (r && r.current) r.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openFullscreen(categoryId, quiz) {
    setActive({ categoryId, quiz });
    setQuizState({ answers: {}, index: 0, finished: false, score: 0 });
    setIsFullscreen(true);
    // prevent body scroll while in fullscreen mode
    document.body.style.overflow = "hidden";
  }

  function closeFullscreen() {
    setIsFullscreen(false);
    setActive(null);
    document.body.style.overflow = "auto";
  }

  function pickAnswer(qIdx, optionIdx) {
    setQuizState((s) => ({ ...s, answers: { ...s.answers, [qIdx]: optionIdx } }));
  }

  function nextQuestion() {
    setQuizState((s) => ({ ...s, index: Math.min((active?.quiz.quiz.length || 1) - 1, s.index + 1) }));
  }
  function prevQuestion() {
    setQuizState((s) => ({ ...s, index: Math.max(0, s.index - 1) }));
  }

  function submitQuiz() {
    if (!active) return;
    const q = active.quiz.quiz;
    let score = 0;
    q.forEach((qq, i) => {
      if (quizState.answers[i] === qq.answer) score += 1;
    });
    const total = q.length;
    const percent = total ? Math.round((score / total) * 100) : 0;
    // update user points and accuracy (simple average update)
    setUserStats((u) => ({ ...u, points: u.points + percent, accuracy: Math.round((u.accuracy + percent) / 2) }));
    setQuizState((s) => ({ ...s, finished: true, score }));
  }

  // cleanup body style if unmounted
  useEffect(() => () => (document.body.style.overflow = "auto"), []);

  // ---------- small helpers for visuals ----------
  const GradientBadge = ({ from, to, children }) => (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${from} ${to}`}>{children}</span>
  );

  // ---------- component render ----------
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* LEFT SIDEBAR */}
        <aside className={`flex flex-col transition-all duration-300 ${leftCollapsed ? 'w-16' : 'w-64'}`}>
          <div className={`bg-white rounded-xl shadow p-4 sticky top-6`}> 
            <div className="flex items-center justify-between mb-3">
              {!leftCollapsed && <h3 className="text-sm font-bold text-pink-600">Categorias</h3>}
              <button
                onClick={() => setLeftCollapsed((s) => !s)}
                className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700"
                aria-label="Minimizar categorias"
              >
                {leftCollapsed ? '›' : '‹'}
              </button>
            </div>

            <div className={`space-y-3 ${leftCollapsed ? 'flex flex-col items-center' : ''}`}>
              {data.map((c) => (
                <button
                  key={c.id}
                  onClick={() => scrollToCategory(c.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition hover:scale-[1.01] ${leftCollapsed ? 'justify-center' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-r ${c.colorFrom} ${c.colorTo}`}></div>
                  {!leftCollapsed && <span className="text-sm font-medium text-gray-700">{c.title}</span>}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER */}
        <main className="flex-1">
          {/* header card */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-800">Bem-vinda ao <span className="text-violet-600">MiniMentes</span>!</h1>
            <p className="mt-2 text-gray-500">Descubra o mundo da programação através de vídeos e quizzes interativos.</p>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-violet-300"/>Quizzes Interativos</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pink-300"/>Vídeos Explicativos</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-300"/>Aprendizado Divertido</span>
            </div>
          </div>

          {/* categories + cards */}
          <div className="mt-8 space-y-10">
            {data.map((c) => (
              <section key={c.id} ref={refs.current[c.id]}>
                <div className={`rounded-xl p-4 ${c.colorFrom ? `bg-gradient-to-r ${c.colorFrom} ${c.colorTo} text-white` : 'bg-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">&lt;&gt;</div>
                    <h2 className="font-semibold text-lg">{c.title}</h2>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {c.quizzes.length ? (
                    c.quizzes.map((q) => (
                      <article key={q.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="relative h-44">
                          <img src={q.thumbnail} alt={q.title} className="absolute inset-0 w-full h-full object-cover opacity-40"/>
                          <div className="absolute top-3 right-3 bg-white/80 text-xs text-gray-700 px-2 py-1 rounded-full">Vídeo</div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-bold text-gray-800 text-sm">{q.title}</h3>
                              <p className="text-xs text-gray-500 mt-1">{q.description}</p>
                            </div>
                            <div className="text-xs">
                              <span className="inline-block px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">{q.difficulty}</span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <button
                              onClick={() => openFullscreen(c.id, { ...q, categoryTitle: c.title })}
                              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-full font-semibold shadow"
                            >
                              Assistir
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="col-span-full text-gray-400 italic">Sem vídeos nessa categoria por enquanto.</div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className={`flex flex-col transition-all duration-300 ${rightCollapsed ? 'w-14' : 'w-64'}`}>
          <div className="bg-white rounded-xl shadow p-4 sticky top-6">
            <div className="flex items-center justify-between mb-3">
              {!rightCollapsed && <h3 className="text-sm font-bold text-violet-600">Seus Pontos</h3>}
              <button
                onClick={() => setRightCollapsed((s) => !s)}
                className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600"
                aria-label="Minimizar painel"
              >
                {rightCollapsed ? '›' : '‹'}
              </button>
            </div>

            {!rightCollapsed ? (
              <div>
                <div className="text-3xl font-extrabold text-violet-600">{userStats.points}</div>
                <div className="text-xs text-gray-400 mt-1">Nível: Programadora Junior</div>

                <div className="mt-3 bg-green-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600">Desempenho</div>
                  <div className="mt-1 text-sm font-semibold">Acertos: {userStats.accuracy}%</div>
                  <div className="text-xs text-gray-500">Sequência: {userStats.streak} dias</div>
                </div>

                <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm">Motivação</h4>
                  <p className="text-xs text-gray-600 mt-1">Acredite no seu potencial!</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center">🏆</div>
                <div className="text-xs text-gray-500">{userStats.points}</div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ---------- FULLSCREEN VIDEO + QUIZ (replaces center area visually) ---------- */}
      {isFullscreen && active && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-black/90 to-black/80 flex flex-col"> 
          {/* top controls */}
          <div className="flex items-center justify-between p-4 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button onClick={closeFullscreen} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full">Voltar</button>
              <div className="text-white text-sm font-semibold">{active.quiz.categoryTitle}</div>
            </div>
            <div className="text-white/80 text-sm">{userStats.points} pts</div>
          </div>

          {/* video */}
          <div className="flex-1 flex items-center justify-center">
            <video
              src={active.quiz.video}
              controls
              autoPlay
              className="max-w-5xl w-full h-full object-cover"
            />
          </div>

          {/* quiz panel */}
          <div className="bg-white rounded-t-3xl shadow-2xl p-6 max-w-5xl mx-auto w-full -mt-6">
            {!quizState.finished ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{active.quiz.title}</h3>
                  <div className="text-sm text-gray-500">Pergunta {quizState.index + 1} de {active.quiz.quiz.length}</div>
                </div>

                <div>
                  {active.quiz.quiz.map((qq, qi) => (
                    <div key={qi} className={`${qi === quizState.index ? '' : 'hidden'}`}>
                      <p className="font-semibold text-gray-800">{qq.question}</p>
                      <div className="mt-3 grid gap-3">
                        {qq.options.map((opt, oi) => {
                          const chosen = quizState.answers[qi] === oi;
                          return (
                            <button
                              key={oi}
                              onClick={() => pickAnswer(qi, oi)}
                              className={`text-left p-3 rounded-lg border ${chosen ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}>
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between mt-5">
                        <div className="flex gap-2">
                          <button onClick={prevQuestion} disabled={quizState.index === 0} className="px-4 py-2 rounded-full border">Anterior</button>
                          <button onClick={nextQuestion} className="px-4 py-2 rounded-full border">Próxima</button>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => setQuizState({ answers: {}, index: 0, finished: false, score: 0 })} className="px-4 py-2 rounded-full border">Limpar</button>
                          <button onClick={submitQuiz} className="px-5 py-2 rounded-full bg-pink-500 text-white">Verificar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-pink-600">Resultado</h3>
                <p className="mt-3 text-gray-600">Você acertou {quizState.score} de {active.quiz.quiz.length}</p>
                <div className="mt-6">
                  <button onClick={() => { closeFullscreen(); }} className="px-6 py-2 rounded-full bg-pink-500 text-white">Fechar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
