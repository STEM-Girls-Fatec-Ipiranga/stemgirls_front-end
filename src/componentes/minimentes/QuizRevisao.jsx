import React, { useEffect, useState } from "react";

// Modo Revisão do quiz: quem controla a ordem das perguntas é a FILA do back-end
// (SessaoQuiz.java). Errou -> a pergunta volta para o fim da fila.
const API_URL = "http://localhost:8080/api/minimentes";

async function chamarApi(url, opcoes) {
  const resposta = await fetch(url, opcoes);
  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    const erro = new Error(corpo.mensagem || `Erro ${resposta.status}`);
    erro.status = resposta.status;
    throw erro;
  }
  return corpo;
}

export default function QuizRevisao({ atividadeId, onSair }) {
  const [estado, setEstado] = useState(null);
  const [escolha, setEscolha] = useState(null);
  const [feedback, setFeedback] = useState(null); // { ok: boolean, texto: string }
  const [voltou, setVoltou] = useState(null); // pergunta que acabou de voltar para o fim
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function iniciar() {
    setErro("");
    setFeedback(null);
    setEscolha(null);
    setVoltou(null);
    setEstado(null);
    try {
      const novo = await chamarApi(
        `${API_URL}/${encodeURIComponent(atividadeId)}/quiz/iniciar`,
        { method: "POST" }
      );
      setEstado(novo);
    } catch (e) {
      setErro(
        e.status === 404
          ? "Este conteúdo não está salvo no servidor, então o Modo Revisão não está disponível para ele. Tente um conteúdo postado pelo site."
          : e.message || "Não foi possível falar com o servidor."
      );
    }
  }

  useEffect(() => {
    iniciar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atividadeId]);

  async function verificar() {
    if (escolha === null) {
      setFeedback({ ok: false, texto: "Selecione uma opção antes de verificar." });
      return;
    }
    const perguntaDaVez = estado.perguntaAtual?.pergunta;
    setEnviando(true);
    try {
      const novo = await chamarApi(
        `${API_URL}/quiz/${encodeURIComponent(estado.sessaoId)}/responder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resposta: escolha }),
        }
      );
      setFeedback({ ok: novo.acertouUltima, texto: novo.mensagem });
      setVoltou(novo.acertouUltima ? null : perguntaDaVez);
      setEscolha(null);
      setEstado(novo);
    } catch (e) {
      setFeedback({ ok: false, texto: e.message || "Erro ao enviar a resposta." });
    } finally {
      setEnviando(false);
    }
  }

  if (erro) {
    return (
      <div className="mt-6">
        <p className="text-sm text-red-600">{erro}</p>
        <button
          onClick={onSair}
          className="mt-4 px-6 py-2 rounded-full border border-pink-300 text-pink-600 hover:bg-pink-50"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!estado) {
    return <p className="mt-6 text-sm text-gray-500">Montando a fila de perguntas…</p>;
  }

  const fila = estado.fila || [];

  return (
    <div className="mt-6 text-left">
      <hr className="border-pink-100 mb-4" />

      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-bold">
          🔁 Modo Revisão
        </span>
        <div className="flex gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
            ✔ {estado.acertos} acerto(s)
          </span>
          <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-semibold">
            ✘ {estado.erros} erro(s)
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold">
            {estado.perguntasRestantes} na fila
          </span>
        </div>
      </div>

      {estado.terminou ? (
        <div className="text-center py-4">
          <h3 className="text-2xl font-bold text-pink-600">Você revisou tudo! 🎉</h3>
          <p className="mt-3 text-gray-600">
            {estado.acertos} pergunta(s) concluída(s) com {estado.erros} erro(s) no caminho.
            <br />
            As perguntas que você errou voltaram para o fim da fila até você acertar.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={onSair}
              className="px-6 py-2 rounded-full bg-pink-500 text-white shadow hover:bg-pink-600"
            >
              Voltar
            </button>
            <button
              onClick={iniciar}
              className="px-6 py-2 rounded-full border border-pink-300 text-pink-600 hover:bg-pink-50"
            >
              Revisar de novo
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="font-semibold text-black text-lg text-center">
            {estado.perguntaAtual?.pergunta}
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {(estado.perguntaAtual?.opcoes || []).map((texto, oi) => (
              <button
                key={oi}
                onClick={() => setEscolha(oi)}
                className={`w-full px-4 py-3 rounded-full border-2 text-sm font-medium transition text-left ${
                  escolha === oi
                    ? "border-pink-500 bg-pink-50 text-pink-600"
                    : "border-pink-200 hover:border-pink-400"
                }`}
              >
                {texto}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={onSair}
              className="px-6 py-2 rounded-full border border-pink-300 text-pink-600 hover:bg-pink-50 text-sm"
            >
              Sair da revisão
            </button>
            <button
              onClick={verificar}
              disabled={enviando}
              className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white rounded-full px-6 py-2 text-sm font-semibold shadow"
            >
              Verificar
            </button>
          </div>
        </>
      )}

      {feedback && (
        <div
          className={`mt-4 px-4 py-2 rounded-2xl text-sm font-medium text-center ${
            feedback.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}
        >
          {feedback.texto}
        </div>
      )}

      <div className="mt-6">
        <h4 className="text-sm font-bold text-gray-800 mb-2">Fila de revisão</h4>
        {fila.length === 0 ? (
          <p className="text-sm text-gray-500 italic">A fila está vazia.</p>
        ) : (
          <ol className="space-y-2">
            {fila.map((texto, i) => {
              const ehFrente = i === 0;
              const acabouDeVoltar = !ehFrente && i === fila.length - 1 && texto === voltou;
              return (
                <li
                  key={`${i}-${texto}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl border-2 text-sm ${
                    ehFrente
                      ? "border-pink-400 bg-pink-50"
                      : acabouDeVoltar
                      ? "border-red-300 bg-red-50"
                      : "border-transparent bg-gray-50"
                  }`}
                >
                  <span className="w-6 h-6 flex-none rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="flex-1">{texto}</span>
                  {ehFrente && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-pink-500 text-white">
                      AGORA
                    </span>
                  )}
                  {acabouDeVoltar && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-500 text-white">
                      VOLTOU P/ O FIM
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        )}
        <p className="mt-2 text-xs text-gray-500">
          A primeira da lista é a pergunta da vez. Se errar, ela sai da frente e entra no final da fila.
        </p>
      </div>
    </div>
  );
}
