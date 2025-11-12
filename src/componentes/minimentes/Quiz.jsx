import React, { useEffect, useRef, useState } from "react"; 
import quizLogo from "../../assets/img/quiz-logo.jpg"; // ✅ Caminho ajustado para sua pasta de imagens

/**
 * IndexedDB helpers
 */
function openVideosDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("MiniMentesVideosDB", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("videos")) db.createObjectStore("videos");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getVideoBlob(key) {
  const db = await openVideosDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("videos", "readonly");
    const store = tx.objectStore("videos");
    const r = store.get(key);
    r.onsuccess = () => {
      db.close();
      resolve(r.result || null);
    };
    r.onerror = () => {
      db.close();
      reject(r.error);
    };
  });
}

export default function Quiz({ active, onClose, onFinish }) {
  const videoRef = useRef(null);
  const objectUrlRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState("");
  const [showThumbnail, setShowThumbnail] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  const [quizState, setQuizState] = useState({
    started: false,
    finished: false,
    index: 0,
    answers: {},
    feedback: "",
    score: 0,
  });

  const q = active?.quiz || {};
  const quizId = q.id;

  useEffect(() => {
    objectUrlRef.current && (URL.revokeObjectURL(objectUrlRef.current), (objectUrlRef.current = null));
    setVideoSrc("");
    setShowThumbnail(!!q.thumbnail);

    async function resolveSrc() {
      if (!q || !q.video) return;
      if (typeof q.video === "string" && q.video.startsWith("idb:")) {
        const key = q.video.replace("idb:", "");
        try {
          const blob = await getVideoBlob(key);
          if (blob) {
            const url = URL.createObjectURL(blob);
            objectUrlRef.current = url;
            setVideoSrc(url);
            const savedTime = parseFloat(localStorage.getItem(`videoTime:${key}`) || "0");
            if (savedTime && videoRef.current) videoRef.current.currentTime = savedTime;
            return;
          } else {
            console.warn("Vídeo não encontrado no IndexedDB para chave:", key);
            setVideoSrc("");
          }
        } catch (err) {
          console.error("Erro ao ler IndexedDB:", err);
        }
      }
      setVideoSrc(q.video || "");
    }

    resolveSrc();

    return () => {
      if (objectUrlRef.current) {
        try {
          URL.revokeObjectURL(objectUrlRef.current);
        } catch {}
        objectUrlRef.current = null;
      }
    };
  }, [q.video]);

  useEffect(() => {
    const iv = setInterval(() => {
      try {
        if (!quizId) return;
        const v = videoRef.current;
        if (v && !isNaN(v.currentTime) && v.readyState > 0) {
          localStorage.setItem(`videoTime:${quizId}`, String(v.currentTime));
        }
      } catch {}
    }, 2000);

    return () => clearInterval(iv);
  }, [quizId]);

  useEffect(() => {
    return () => {
      try {
        if (videoRef.current && quizId) {
          const v = videoRef.current;
          if (!isNaN(v.currentTime)) localStorage.setItem(`videoTime:${quizId}`, String(v.currentTime));
        }
      } catch {}
    };
  }, [quizId]);

  const startQuiz = () => setQuizState((s) => ({ ...s, started: true, finished: false }));
  const pickAnswer = (qIdx, optionIdx) => {
    setQuizState((s) => ({ ...s, answers: { ...s.answers, [qIdx]: optionIdx }, feedback: "" }));
  };
  const prevQuestion = () =>
    setQuizState((s) => ({ ...s, index: Math.max(0, s.index - 1), feedback: "" }));
  const nextQuestion = () =>
    setQuizState((s) => ({ ...s, index: Math.min(s.index + 1, (q.quiz?.length || 1) - 1), feedback: "" }));

  const checkAnswer = () => {
    const idx = quizState.index;
    const current = q.quiz?.[idx];
    if (!current) return;
    const chosen = quizState.answers[idx];
    if (chosen === undefined) {
      setQuizState((s) => ({ ...s, feedback: "Selecione uma opção antes de verificar." }));
      return;
    }
    const isCorrect = chosen === current.answer;
    setQuizState((s) => ({
      ...s,
      feedback: isCorrect ? "Resposta certa 🎉" : `Errada ❌ — correta: ${current.options[current.answer]}`,
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
    setQuizState({ started: false, finished: false, index: 0, answers: {}, feedback: "", score: 0 });
  };

  const handleThumbnailClick = async () => {
    setShowThumbnail(false);
    const v = videoRef.current;
    if (!v) return;
    try {
      if (v.paused) {
        v.muted = true;
        await v.play();
        setTimeout(() => {
          v.muted = false;
        }, 250);
      } else {
        await v.play();
      }
    } catch (err) {
      console.warn("Falha ao iniciar vídeo:", err);
    }
  };

  if (!active) return null;

  const currentQ = q.quiz?.[quizState.index] || { question: "", options: ["", "", "", ""], answer: 0 };

  const ArrowLeft = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const ArrowRight = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 text-gray-800 flex flex-col">
      {/* header */}
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
            <div className="text-xs text-gray-600">{active.categoryTitle || ""}</div>
          </div>

          <div style={{ width: 84 }} />
        </div>
      </div>

      {/* content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6">
          {/* video area */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="relative w-full aspect-video bg-gray-200 flex items-center justify-center">
              {showThumbnail && q.thumbnail ? (
                <img
                  src={q.thumbnail}
                  alt="thumbnail"
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer z-20"
                  onClick={handleThumbnailClick}
                  onError={() => console.warn("Erro carregando thumbnail")}
                />
              ) : null}

              {videoSrc ? (
                <video
                  ref={videoRef}
                  src={videoSrc}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    showThumbnail ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                  playsInline
                  preload="auto"
                  controls
                />
              ) : (
                <div className="text-gray-400 p-6">Vídeo indisponível</div>
              )}

              {!canPlay && videoSrc && (
                <div className="absolute bottom-3 left-4 text-xs text-white/90 bg-black/30 px-3 py-1 rounded">
                  Carregando vídeo...
                </div>
              )}
            </div>
          </div>

          {/* quiz card */}
          <div className="mt-8 bg-white rounded-2xl border-2 border-pink-300 p-8 shadow text-center">
            {/* logo corrigida */}
            <div className="flex justify-center mb-4">
              <img
                src={quizLogo}
                alt="Quiz Logo"
                className="w-36 h-20 object-contain rounded-full"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>

            {/* descrição fixa */}
            {!quizState.started && !quizState.finished && (
              <>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  Este quiz foi criado para ajudar você a treinar e reforçar o que aprendeu! 💡
                  {"\n"}Você pode refazê-lo quantas vezes quiser e usá-lo como uma forma divertida de estudar.
                  {"\n"}Nossa dica: assista ao vídeo antes de começar o quiz 😉
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

            {/* perguntas */}
            {quizState.started && !quizState.finished && (
              <div className="mt-6">
                <hr className="border-pink-100 mb-4" />

                <p className="font-semibold text-black text-lg">{currentQ.question}</p>

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

                {/* feedback — aparece só após clicar em "verificar" */}
                {quizState.feedback && (
                  <div className="mt-4 text-sm text-gray-700">
                    <div className="inline-block px-4 py-2 rounded-full bg-white border border-pink-100 text-pink-600">
                      {quizState.feedback}
                    </div>
                  </div>
                )}

                {/* navegação */}
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
                      if (quizState.index >= (q.quiz?.length || 1) - 1) submitQuiz();
                      else nextQuestion();
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

            {/* resultado */}
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

          <div className="h-16" />
        </div>
      </div>
    </div>
  );
}
