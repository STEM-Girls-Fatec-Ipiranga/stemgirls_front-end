// --- IndexedDB para salvar vídeos e thumbnails ---

const newQuiz = await buildQuizFromForm();
const DB_NAME = "MiniMentesDB";
const STORE_NAME = "videos";
const VERSION = 1;

// Abre ou cria o banco
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Salva um vídeo/thumnail no store
export async function saveMedia(id, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put({ id, data });
    tx.oncomplete = resolve;
    tx.onerror = reject;
  });
}

// Carrega vídeo/thumbnail pelo ID
export async function getMedia(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(id);

    req.onsuccess = () => {
      resolve(req.result?.data || null);
    };
    req.onerror = reject;
  });
}

// Remove do IndexedDB
export async function deleteMedia(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = resolve;
    tx.onerror = reject;
  });
}
