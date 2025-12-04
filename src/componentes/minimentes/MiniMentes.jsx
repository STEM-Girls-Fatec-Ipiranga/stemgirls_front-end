// MiniMentes.jsx
import React, { useRef, useState, useEffect } from "react";
import Quiz from "./Quiz";
import { Code, Calculator, Type, PenTool, Zap, Trash2, Edit2 } from "lucide-react";
import Robo from "../Robo.jsx";

/* -------------------------
   IndexedDB + localStorage helpers
   ------------------------- */
const DB_NAME = "minimentes-db";
const DB_STORE = "files-v1";
const DB_VERSION = 1;
const META_KEY = "minim-data-v1"; // metadata (categories + quizzes + blob ids)

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(key, blob) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).put(blob, key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet(key) {
  if (!key) return null;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readonly");
    const req = tx.objectStore(DB_STORE).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function idbDelete(key) {
  if (!key) return false;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).delete(key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

function makeId(prefix = "") {
  return prefix + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
}

function loadMetaRaw() {
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Erro ao ler meta do localStorage", e);
    return null;
  }
}
function persistMetaRaw(value) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(value));
  } catch (e) {
    console.error("Erro ao salvar meta no localStorage", e);
  }
}

/* -------------------------
   Seu componente (adaptado)
   ------------------------- */
export default function MiniMentes() {
  // --- seu initial (mantive id/titles etc) ---
  const initial = [
    {
      id: "logica",
      title: "Lógica de Programação",
      colorFrom: "from-purple-500",
      colorTo: "to-violet-500",
      icon: "Code",
      quizzes: [
        {
          id: "q1",
          title: "Primeiros Passos na Programação",
          difficulty: "Fácil",
          video: "", // será usado como URL/runtime
          thumbnail: "",
          description: "Aprenda o que é programação de forma divertida e fácil!",
          quiz: [
            {
              question: "O que é uma variável?",
              options: ["Um tipo de loop", "Um espaço para armazenar valor", "Um estilo CSS", "Uma função"],
              answer: 1,
            },
            {
              question: "Qual comando imprime no console em JS?",
              options: ["print()", "console.log()", "echo", "write()"],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "matematica",
      title: "Matemática",
      colorFrom: "from-pink-500",
      colorTo: "to-orange-400",
      icon: "Calculator",
      quizzes: [],
    },
    {
      id: "programacao",
      title: "Programação",
      colorFrom: "from-orange-400",
      colorTo: "to-red-400",
      icon: "Type",
      quizzes: [],
    },
    {
      id: "design",
      title: "Design UI / UX",
      colorFrom: "from-indigo-400",
      colorTo: "to-pink-400",
      icon: "PenTool",
      quizzes: [],
    },
    {
      id: "algoritmos",
      title: "Algoritmos",
      colorFrom: "from-green-400",
      colorTo: "to-emerald-500",
      icon: "Zap",
      quizzes: [],
    },
  ];

  // ---------- STATE: data loaded from localStorage + indexedDB ----------
  const [data, setData] = useState([]); // we'll load async in effect
  const [ready, setReady] = useState(false);

  // ---------- load metadata + blobs on mount ----------
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const raw = loadMetaRaw();
        const meta = raw || initial;

        // For each quiz that has videoBlobId / thumbBlobId, try to load blob and create objectURL
        const withUrls = await Promise.all(
          meta.map(async (cat) => {
            const catCopy = { ...cat };
            catCopy.quizzes = await Promise.all(
              (cat.quizzes || []).map(async (q) => {
                const qcopy = { ...q };
                // if q has videoBlobId -> fetch blob and create objectURL
                if (q.videoBlobId) {
                  try {
                    const blob = await idbGet(q.videoBlobId);
                    qcopy.video = blob ? URL.createObjectURL(blob) : q.video || "";
                  } catch (e) {
                    console.warn("Falha ao carregar blob de vídeo:", e);
                    qcopy.video = q.video || "";
                  }
                } else {
                  // keep whatever was in q.video (dataURL or external url)
                  qcopy.video = q.video || "";
                }

                if (q.thumbBlobId) {
                  try {
                    const tblob = await idbGet(q.thumbBlobId);
                    qcopy.thumbnail = tblob ? URL.createObjectURL(tblob) : q.thumbnail || "";
                  } catch (e) {
                    console.warn("Falha ao carregar blob de thumb:", e);
                    qcopy.thumbnail = q.thumbnail || "";
                  }
                } else {
                  qcopy.thumbnail = q.thumbnail || "";
                }

                return qcopy;
              })
            );
            return catCopy;
          })
        );

        if (!mounted) return;
        setData(withUrls);
        setReady(true);
      } catch (e) {
        console.error("Erro na inicialização dos dados:", e);
        setData(initial);
        setReady(true);
      }
    }
    init();
    return () => {
      mounted = false;
      // revogar objectURLs para evitar leak (opcional: pode revogar aqui, mas UI pode depender delas)
      // preferimos revogar cada vez que removemos um quiz
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Persistir apenas METADATA (category + quizzes + blob ids) ----------
  // Sempre que houver alteração de `data`, persistimos um JSON simplificado (sem objectURLs)
  useEffect(() => {
    if (!ready) return;
    const simplified = data.map((c) => ({
      ...c,
      quizzes: (c.quizzes || []).map((q) => {
        // guardamos videoBlobId / thumbBlobId se existirem, e outras propriedades necessárias
        const { id, title, difficulty, description, quiz, videoBlobId, thumbBlobId } = q;
        return { id, title, difficulty, description, quiz, videoBlobId: videoBlobId || null, thumbBlobId: thumbBlobId || null, video: q.video ? (q.video.startsWith("blob:") ? null : q.video) : "" , thumbnail: q.thumbnail ? (q.thumbnail.startsWith("blob:") ? null : q.thumbnail) : "" };
        // observação: se q.video era um objectURL (blob:), não salvamos a URL em si no metadata — salvamos o blob id
      }),
    }));
    persistMetaRaw(simplified);
  }, [data, ready]);

  // ---------- refs for category scrolling ----------
  const refs = useRef({});
  (data.length ? data : initial).forEach((c) => {
    if (!refs.current[c.id]) refs.current[c.id] = React.createRef();
  });

  // ---------- UI state (copiado de você) ----------
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [active, setActive] = useState(null);
  const [showQuizScreen, setShowQuizScreen] = useState(false);
  const [userStats, setUserStats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("minim-stats-v1")) || { points: 1247, accuracy: 87, streak: 12, badges: 3 };
    } catch {
      return { points: 1247, accuracy: 87, streak: 12, badges: 3 };
    }
  });
  useEffect(() => localStorage.setItem("minim-stats-v1", JSON.stringify(userStats)), [userStats]);

  // uploader modal state (reused for edit)
  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState(null); // { categoryId, quizId } or null

  const emptyQuestion = () => ({ question: "", options: ["", "", "", ""], answer: 0 });

  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "logica",
    difficulty: "Fácil",
    videoFile: null,
    thumbFile: null,
    quiz: [],
  });
  const [uploadPreview, setUploadPreview] = useState({ videoUrl: null, thumbUrl: null });
  const lastObjectUrlRef = useRef(null);

  function revokeLastObjectUrl() {
    if (lastObjectUrlRef.current) {
      try {
        URL.revokeObjectURL(lastObjectUrlRef.current);
      } catch { }
      lastObjectUrlRef.current = null;
    }
  }

  function handleUploadFile(e, field) {
    const file = e.target.files && e.target.files[0];
    setUploadForm((f) => ({ ...f, [field]: file || null }));

    if (!file) return;

    if (field === "videoFile") {
      revokeLastObjectUrl();
      const url = URL.createObjectURL(file);
      lastObjectUrlRef.current = url;
      setUploadPreview((p) => ({ ...p, videoUrl: url }));
    }

    if (field === "thumbFile") {
      const reader = new FileReader();
      reader.onload = () => setUploadPreview((p) => ({ ...p, thumbUrl: reader.result }));
      reader.readAsDataURL(file);
    }
  }

  function addQuizQuestion() {
    setUploadForm((f) => ({ ...f, quiz: [...f.quiz, emptyQuestion()] }));
  }
  function updateQuizQuestion(idx, field, value) {
    setUploadForm((f) => {
      const copy = JSON.parse(JSON.stringify(f));
      copy.quiz[idx][field] = field === "answer" ? Number(value) : value;
      return copy;
    });
  }
  function updateQuizOption(qidx, oidx, value) {
    setUploadForm((f) => {
      const copy = JSON.parse(JSON.stringify(f));
      copy.quiz[qidx].options[oidx] = value;
      return copy;
    });
  }
  function removeQuizQuestion(idx) {
    setUploadForm((f) => ({ ...f, quiz: f.quiz.filter((_, i) => i !== idx) }));
  }

  function difficultyBadgeClasses(d) {
    const n = (d || "").toLowerCase();
    if (n === "fácil" || n === "facil") return "inline-block px-3 py-1 rounded-full text-xs bg-green-100 text-green-800";
    if (n === "médio" || n === "medio") return "inline-block px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800";
    if (n === "difícil" || n === "dificil") return "inline-block px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800";
    return "inline-block px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700";
  }

  // ---------- submit upload: save blobs to IndexedDB and metadata to localStorage ----------
  async function submitUpload(e) {
    e.preventDefault();

    // build quiz structure
    const newQuizBase = {
      id: editing && editing.quizId ? editing.quizId : `u-${Date.now()}`,
      title: uploadForm.title || "Sem título",
      difficulty: uploadForm.difficulty,
      description: uploadForm.description || "",
      quiz: uploadForm.quiz.map((q) => ({
        question: q.question,
        options: q.options.slice(0, 4).concat(Array(Math.max(0, 4 - q.options.length)).fill("")),
        answer: Number(q.answer || 0),
      })),
    };

    // handle files: save blobs to IDB (if provided) and create objectURLs for runtime
    let videoBlobId = null;
    let thumbBlobId = null;
    let runtimeVideoUrl = null;
    let runtimeThumbUrl = null;

    try {
      if (uploadForm.videoFile) {
        videoBlobId = makeId("fvid_");
        await idbPut(videoBlobId, uploadForm.videoFile);
        runtimeVideoUrl = URL.createObjectURL(uploadForm.videoFile);
      } else if (uploadPreview.videoUrl && editing) {
        // keep previous url if editing and no new file; previous blob IDs are handled in the data state
        runtimeVideoUrl = uploadPreview.videoUrl;
      }

      if (uploadForm.thumbFile) {
        thumbBlobId = makeId("fimg_");
        await idbPut(thumbBlobId, uploadForm.thumbFile);
        // for image we used dataURL preview so prefer that for immediate display
        runtimeThumbUrl = uploadPreview.thumbUrl || null;
      } else if (uploadPreview.thumbUrl && editing) {
        runtimeThumbUrl = uploadPreview.thumbUrl;
      }
    } catch (err) {
      console.error("Erro ao salvar blobs no IndexedDB", err);
      alert("Falha ao salvar arquivos localmente. Tente novamente.");
      return;
    }

    const newQuiz = {
      ...newQuizBase,
      video: runtimeVideoUrl || "",
      thumbnail: runtimeThumbUrl || "",
      videoBlobId: videoBlobId || null,
      thumbBlobId: thumbBlobId || null,
    };

    // update state (insert or update)
    setData((d) => {
      const copy = JSON.parse(JSON.stringify(d));
      if (editing && editing.categoryId && editing.quizId) {
        // find category and quiz
        return copy.map((c) =>
          c.id === editing.categoryId
            ? {
                ...c,
                quizzes: c.quizzes.map((q) => {
                  if (q.id !== editing.quizId) return q;
                  // if replacing files, remove previous blobs (if we replaced)
                  (async () => {
                    try {
                      if (q.videoBlobId && newQuiz.videoBlobId && q.videoBlobId !== newQuiz.videoBlobId) {
                        await idbDelete(q.videoBlobId);
                      }
                      if (q.thumbBlobId && newQuiz.thumbBlobId && q.thumbBlobId !== newQuiz.thumbBlobId) {
                        await idbDelete(q.thumbBlobId);
                      }
                    } catch (err) {
                      console.warn("Erro ao limpar blobs antigos:", err);
                    }
                  })();
                  return { ...newQuiz };
                }),
              }
            : c
        );
      } else {
        // new quiz -> add to selected category at top
        return copy.map((c) => (c.id === uploadForm.category ? { ...c, quizzes: [newQuiz, ...(c.quizzes || [])] } : c));
      }
    });

    // reset modal
    setShowUpload(false);
    setEditing(null);
    setUploadForm({
      title: "",
      description: "",
      category: data[0]?.id || "logica",
      difficulty: "Fácil",
      videoFile: null,
      thumbFile: null,
      quiz: [],
    });
    setUploadPreview({ videoUrl: null, thumbUrl: null });
    revokeLastObjectUrl();
  }

  // ---------- delete helpers (remove metadata + blobs) ----------
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function askDelete(categoryId, quizId) {
    setDeleteTarget({ categoryId, quizId });
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { categoryId, quizId } = deleteTarget;

    // find the quiz to remove blob ids
    const found = (data.find((c) => c.id === categoryId)?.quizzes || []).find((q) => q.id === quizId);
    if (found) {
      // revoke objectURLs from runtime
      try {
        if (found.video) URL.revokeObjectURL(found.video);
      } catch {}
      try {
        if (found.thumbnail && found.thumbnail.startsWith("blob:")) URL.revokeObjectURL(found.thumbnail);
      } catch {}

      // delete blobs from IDB if ids exist
      (async () => {
        try {
          if (found.videoBlobId) await idbDelete(found.videoBlobId);
          if (found.thumbBlobId) await idbDelete(found.thumbBlobId);
        } catch (e) {
          console.warn("Erro ao deletar blobs:", e);
        }
      })();
    }

    setData((d) => d.map((c) => (c.id === categoryId ? { ...c, quizzes: c.quizzes.filter((q) => q.id !== quizId) } : c)));
    setShowDeleteModal(false);
    setDeleteTarget(null);
  }

  function cancelDelete() {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  }

  // ---------- edit ----------
  function openEditModal(categoryId, quiz) {
    const form = {
      title: quiz.title || "",
      description: quiz.description || "",
      category: categoryId,
      difficulty: quiz.difficulty || "Fácil",
      videoFile: null,
      thumbFile: null,
      quiz: (quiz.quiz || []).map((q) => ({
        question: q.question || "",
        options: (q.options || []).slice(0, 4).concat(Array(Math.max(0, 4 - (q.options || []).length)).fill("")),
        answer: Number(q.answer || 0),
      })),
    };

    setUploadForm(form);
    setUploadPreview({ videoUrl: quiz.video || null, thumbUrl: quiz.thumbnail || null });
    setEditing({ categoryId, quizId: quiz.id });
    setShowUpload(true);
  }

  // ---------- quiz screen navigation ----------
  function openQuizScreen(categoryId, quiz, categoryTitle) {
    setActive({ categoryId, quiz, categoryTitle });
    setShowQuizScreen(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 80);
  }
  function closeQuizScreen() {
    setShowQuizScreen(false);
    setActive(null);
  }

  function handleQuizFinished({ score, total }) {
    const percent = total ? Math.round((score / total) * 100) : 0;
    setUserStats((u) => {
      const newPoints = u.points + percent;
      const newAccuracy = Math.round((u.accuracy + percent) / 2);
      const newStreak = u.streak + 1;
      const updated = { ...u, points: newPoints, accuracy: newAccuracy, streak: newStreak };
      localStorage.setItem("minim-stats-v1", JSON.stringify(updated));
      return updated;
    });
  }

  // ---------- small helpers/UI pieces ----------
  function scrollToCategory(id) {
    const r = refs.current[id];
    if (r && r.current) r.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const IconMap = {
    logica: Code,
    matematica: Calculator,
    linguagens: Type,
    design: PenTool,
    algoritmos: Zap,
  };

  const Icon = ({ name, className = "w-5 h-5" }) => {
    const Comp = IconMap[name];
    if (!Comp) return null;
    return <Comp className={className} />;
  };

  const CollapseButton = ({ collapsed, onClick }) => (
    <button onClick={onClick} aria-label="Minimizar" className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-700">
      {collapsed ? "›" : "‹"}
    </button>
  );

  // ---------- user/empresa state (mantive) ----------
  const [usuarioLogado, setUsuarioLogado] = useState({});
  const [user, setUser] = useState({
    data: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : {}
  });
  const [empresa, setEmpresa] = useState({
    data: localStorage.getItem("empresa") ? JSON.parse(localStorage.getItem("empresa") || "{}") : {}
  });
  useEffect(() => {
    if (user.data.nomeUsuario != null) {
      setUsuarioLogado({ nomeUsuario: user.data.nomeUsuario, role: user.data.role });
    } else if (empresa.data.nomeEmpresa != null) {
      setUsuarioLogado({ nomeUsuario: empresa.data.nomeEmpresa, role: empresa.data.role });
    }
  }, [user, empresa]);

  // ---------- render ----------
  if (showQuizScreen && active) {
    return (
      <Quiz
        active={active}
        onClose={closeQuizScreen}
        onFinish={(result) => {
          handleQuizFinished(result);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 p-6 text-gray-800 text-sm">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* LEFT SIDEBAR */}
        <aside className={`flex flex-col transition-all duration-300 ${leftCollapsed ? "w-16" : "w-64"}`}>
          <div className="bg-white rounded-xl shadow p-2 sticky top-6">
            <div className="flex items-center justify-between mb-3">
              {!leftCollapsed && <h3 className="text-sm font-bold text-black">Categorias</h3>}
              <div className="ml-auto">
                <CollapseButton collapsed={leftCollapsed} onClick={() => setLeftCollapsed((s) => !s)} />
              </div>
            </div>

            <div className={`space-y-3 ${leftCollapsed ? "flex flex-col items-center" : ""}`}>
              {(data.length ? data : initial).map((c) => (
                <button
                  key={c.id}
                  onClick={() => scrollToCategory(c.id)}
                  className={`w-full flex items-center rounded-lg transition hover:scale-[1.01] ${leftCollapsed ? "justify-center" : "justify-start"}`}
                  style={{ height: "52px", padding: "0 12px", gap: "14px" }}
                >
                  <div className={`flex items-center justify-center rounded-xl text-white bg-gradient-to-r ${c.colorFrom} ${c.colorTo}`} style={{ width: "42px", height: "42px", flexShrink: 0 }}>
                    <Icon name={c.id} className="w-5 h-5 text-white" />
                  </div>

                  {!leftCollapsed && (
                    <span className="text-sm font-medium text-black" style={{ display: "flex", alignItems: "center", height: "42px", lineHeight: "1", whiteSpace: "nowrap" }}>
                      {c.title}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER */}
        <main className="flex-1">
          {/* header card */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-3xl font-extrabold text-black">Bem-vinda ao <span className="text-violet-600">MiniMentes</span>!</h1>
            <p className="mt-2 text-gray-600">Descubra o mundo da programação através de vídeos e quizzes interativos.</p>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-violet-300" />Quizzes Interativos</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pink-300" />Vídeos Explicativos</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-300" />Aprendizado Divertido</span>
            </div>

            <div className="mt-4 flex flex-col justify-center items-center mt-4 w-[30px] h-[300px] lg:w-[600px] lg:h-[250px]">
              <div className="w-[380px]"><Robo /></div>
            </div>

            {//user.data.role == "MODERADOR" && (
              <div className="mt-2">
                <button onClick={() => { setEditing(null); setUploadForm({ title: "", description: "", category: data[0]?.id || "logica", difficulty: "Fácil", videoFile: null, thumbFile: null, quiz: [] }); setUploadPreview({ videoUrl: null, thumbUrl: null }); setShowUpload(true); }} className="px-6 py-2 rounded-full bg-[#F36EC0] text-white font-semibold">Postar Conteúdo</button>
              </div>
}
          </div>

          {/* categories + cards */}
          <div className="mt-8 space-y-10">
            {(data.length ? data : initial).map((c) => (
              <section key={c.id} ref={refs.current[c.id]}>
                <div className={`rounded-xl p-4 ${c.colorFrom ? `bg-gradient-to-r ${c.colorFrom} ${c.colorTo} text-white` : "bg-gray-200"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <Icon name={c.id} className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-semibold text-lg text-white">{c.title}</h2>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {c.quizzes && c.quizzes.length ? (
                    c.quizzes.map((q) => (
                      <article key={q.id} className="bg-white rounded-xl shadow-md overflow-hidden relative">
                        <div className="relative h-44">
                          {q.thumbnail ? <img src={q.thumbnail} alt={q.title} className="absolute inset-0 w-full h-full object-cover opacity-40" /> : <div className="absolute inset-0 bg-gray-100" />}
                          <div className="absolute top-3 right-3 bg-white/80 text-xs text-gray-700 px-2 py-1 rounded-full">Vídeo</div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-bold text-black text-sm">{q.title}</h3>
                              <p className="text-xs text-gray-600 mt-1">{q.description}</p>
                            </div>
                            <div className="text-xs">
                              <span className={difficultyBadgeClasses(q.difficulty)}>{q.difficulty}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button onClick={() => openQuizScreen(c.id, { ...q, categoryTitle: c.title }, c.title)} className="flex-1 bg-[#F36EC0] hover:bg-pink-600 text-white py-2 rounded-full font-semibold shadow items-center justify-center flex gap-2">
                              <span>Assistir</span>
                            </button>

                            <button onClick={() => openEditModal(c.id, q)} className="w-12 h-10 rounded-lg border flex items-center justify-center" title="Editar">
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button onClick={() => askDelete(c.id, q.id)} className="w-12 h-10 rounded-lg border flex items-center justify-center text-red-600" title="Excluir">
                              <Trash2 className="w-4 h-4" />
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
        <aside className={`flex flex-col transition-all duration-300 ${rightCollapsed ? "w-14" : "w-64"}`}>
          <div className="bg-white rounded-xl shadow p-4 sticky top-6">
            <div className="flex items-center justify-between mb-3">
              {!rightCollapsed && <h3 className="text-sm font-bold text-black">Seus Pontos</h3>}
              <div className="ml-auto">
                <CollapseButton collapsed={rightCollapsed} onClick={() => setRightCollapsed((s) => !s)} />
              </div>
            </div>

            {!rightCollapsed ? (
              <div>
                <div className="text-3xl font-extrabold text-black">{userStats.points}</div>
                <div className="text-xs text-gray-500 mt-1">Nível: Programadora Junior</div>

                <div className="mt-3 bg-green-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600 flex items-center gap-2">Desempenho <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">{userStats.accuracy}%</span></div>
                  <div className="mt-1 text-sm font-semibold">Acertos: {userStats.accuracy}%</div>
                  <div className="text-xs text-gray-500">Sequência: {userStats.streak} dias</div>
                </div>

                <div className="mt-4 bg-yellow-50 p-3 rounded-lg flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-xl">🎉</div>
                  <div>
                    <h4 className="font-semibold text-sm">Motivação</h4>
                    <p className="text-xs text-gray-600 mt-1">Continue assim! Você ganha pontos e melhora sua sequência cada vez que completa um quiz.</p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-white/70">+ pontos</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-white/70">Novos desafios</span>
                    </div>
                  </div>
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

      {/* ---------- UPLOAD / EDIT MODAL ---------- */}
      {showUpload && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={submitUpload} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-black">{editing ? "Editar Conteúdo" : "Postar Conteúdo"}</h3>
              <button type="button" onClick={() => { setShowUpload(false); setEditing(null); }} className="text-gray-500">Fechar</button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <input value={uploadForm.title} onChange={(e) => setUploadForm((f) => ({ ...f, title: e.target.value }))} placeholder="Título" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700" />
              <textarea value={uploadForm.description} onChange={(e) => setUploadForm((f) => ({ ...f, description: e.target.value }))} placeholder="Descrição" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700" rows={3} />

              <div className="grid grid-cols-2 gap-2">
                <select value={uploadForm.category} onChange={(e) => setUploadForm((f) => ({ ...f, category: e.target.value }))} className="p-3 rounded border border-gray-200 bg-gray-100 text-gray-700">
                  {data.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}
                </select>
                <select value={uploadForm.difficulty} onChange={(e) => setUploadForm((f) => ({ ...f, difficulty: e.target.value }))} className="p-3 rounded border border-gray-200 bg-gray-100 text-gray-700">
                  <option>Fácil</option>
                  <option>Médio</option>
                  <option>Difícil</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col items-start">
                  <div className="text-xs text-gray-600 mb-1">Vídeo (do computador)</div>
                  <input type="file" accept="video/*" onChange={(e) => handleUploadFile(e, "videoFile")} />
                  {uploadPreview.videoUrl && <video src={uploadPreview.videoUrl} controls className="mt-2 max-h-40" />}
                </label>

                <label className="flex flex-col items-start">
                  <div className="text-xs text-gray-600 mb-1">Thumbnail / Logo</div>
                  <input type="file" accept="image/*" onChange={(e) => handleUploadFile(e, "thumbFile")} />
                  {uploadPreview.thumbUrl && <img src={uploadPreview.thumbUrl} className="mt-2 max-h-40" alt="thumb" />}
                </label>
              </div>

              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Quiz (adicione perguntas — 4 alternativas)</h4>
                  <button type="button" onClick={addQuizQuestion} className="px-3 py-1 rounded-full bg-pink-50">Adicionar</button>
                </div>

                <div className="mt-2 space-y-3">
                  {uploadForm.quiz.length === 0 && <div className="text-xs text-gray-400 italic mt-2">Nenhuma pergunta adicionada.</div>}
                  {uploadForm.quiz.map((qq, qi) => (
                    <div key={qi} className="p-3 rounded border">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">Pergunta {qi + 1}</div>
                        <button type="button" onClick={() => removeQuizQuestion(qi)} className="text-sm text-red-500">Remover</button>
                      </div>
                      <input value={qq.question} onChange={(e) => updateQuizQuestion(qi, "question", e.target.value)} placeholder="Pergunta" className="p-2 mt-2 rounded border w-full placeholder-white" />
                      <div className="grid grid-cols-1 gap-2 mt-2 placeholder-white">
                        {qq.options.map((opt, oi) => (<input key={oi} value={opt} onChange={(e) => updateQuizOption(qi, oi, e.target.value)} placeholder={`Opção ${oi + 1}`} className="p-2 rounded border w-full placeholder-white" />))}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="text-xs">Resposta correta:</div>
                          <select value={qq.answer} onChange={(e) => updateQuizQuestion(qi, "answer", e.target.value)} className="p-2 rounded border">
                            {qq.options.map((_, oi) => (<option key={oi} value={oi}>Opção {oi + 1}</option>))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowUpload(false); setEditing(null); }} className="px-4 py-2 rounded border">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded bg-pink-500 text-white">{editing ? "Salvar alterações" : "Publicar"}</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ---------- DELETE CONFIRM MODAL (simples) ---------- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold">Deseja realmente excluir?</h3>
            <p className="text-sm text-gray-600 mt-2">Essa ação não pode ser desfeita.</p>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={cancelDelete} className="px-4 py-2 rounded border">Cancelar</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-500 text-white">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
