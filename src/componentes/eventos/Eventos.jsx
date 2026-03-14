import React, { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import CadastroEvento from "./CadastroEvento";
import Evento from "./Evento";
import MeusEventos from "./MeusEventos";
import axios from "axios";

export default function Eventos() {

  const imagensDisponiveis = [
    "/src/assets/img/emeninas-digitais.jpeg",
    "/src/assets/img/mulheresfortes.png",
    "/src/assets/img/mulherwomakers.jpeg",
    "/src/assets/img/mulheres-tecnologia.jpg",
  ];

  const eventosMock = [
    {
      id: 1,
      titulo: "Reunião meninas digitais",
      data: "2025-06-26",
      hora: "19:00",
      tipo: "ao-vivo",
      local: "São Paulo",
      descricao: "Reunião para trocar ideias e conhecimentos sobre o projeto buscando o aprimoramento.",
      imagem: "/src/assets/img/mulheres-tecnologia.jpg",
      organizador: "Stem Girls",
      organizadorTipo: "stemgirls",
      linkInscricao: "",
    },
    {
      id: 2,
      titulo: "Palestra tecnologia inclusiva",
      data: "2025-06-28",
      hora: "15:00",
      tipo: "presencial",
      local: "Rio de Janeiro",
      descricao: "Discussão sobre inclusão de mulheres no mercado de tecnologia.",
      imagem: "/src/assets/img/mulheres-tecnologia.jpg",
      organizador: "Empresa XPTO",
      organizadorTipo: "empresa",
      linkInscricao: "https://empresa-xpto.com/inscricao",
    },
  ];

  const BACKEND_URL = "http://localhost:8080";

  const user = JSON.parse(localStorage.getItem("user"));
  const [usuarioLogado, setUsuarioLogado] = useState({});

  const [eventos, setEventos] = useState([]);
  const [meusEventos, setMeusEventos] = useState([]);

  const [eventoEditando, setEventoEditando] = useState(null);
  const [eventoParaExcluir, setEventoParaExcluir] = useState(null);

  const [filtro, setFiltro] = useState("todos");
  const [localidade, setLocalidade] = useState("");
  
  const [telaCadastro, setTelaCadastro] = useState(false);
  const [telaMeusEventos, setTelaMeusEventos] = useState(false);

  const [confirmEmpresa, setConfirmEmpresa] = useState(null);

  const listarEventos = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/evento`);     
      setEventos(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Erro ao buscar eventos:", error);
    }
  };

  const listarMeusEventos = async () => {
    try{
      const response = await axios.get(`${BACKEND_URL}/evento/organizador/${user.id}`);
      setMeusEventos(response.data);
    }catch(error){
      console.log("Erro ao buscar meus eventos:", error);
    }
  }

  const todosEventos = [...eventosMock, ...eventos];

  const eventosFiltrados = todosEventos.filter((ev) => {
    const tipoMatch = filtro === "todos" || (ev.tipo || ev.tipoEvento || "").toLowerCase() === filtro;
    const localMatch = (ev.local || ev.cidade || "").toLowerCase().includes(localidade.toLowerCase());
    return tipoMatch && localMatch;
  });

  useEffect(() => {
    if (user)
      setUsuarioLogado(user);
  
    listarEventos();
    listarMeusEventos();
  }, []);

  const salvarEvento = async (eventoObj, isEdit) => {
    try {
      eventoObj.organizadorTipo = (eventoObj.organizadorTipo || eventoObj.organizerType || eventoObj.organizador || "").toString().trim().toLowerCase();
      if (!eventoObj.organizador && eventoObj.empresa) eventoObj.organizador = eventoObj.empresa;

      eventoObj.linkInscricao = eventoObj.linkInscricao || eventoObj.link || eventoObj.linkParaInscricao || "";

      if (isEdit) {
        const res = await fetch(`http://localhost:8080/eventos/${eventoObj.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventoObj),
        });
        if (!res.ok) throw new Error();
        alert("Evento atualizado!");
      } else {
        const res = await fetch(`http://localhost:8080/eventos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventoObj),
        });
        if (!res.ok) throw new Error();
        alert("Evento criado!");
      }

      await listarEventosBackend();
      setTelaCadastro(false);
      setEventoEditando(null);
    } catch (e) {
      // fallback: se backend não responder, atualiza localmente (útil durante desenvolvimento)
      if (!isEdit) {
        setEventos((prev) => [...prev, eventoObj]);
        alert("Evento armazenado localmente (backend indisponível).");
      } else {
        setEventos((prev) => prev.map((ev) => (ev.id === eventoObj.id ? eventoObj : ev)));
        alert("Alteração aplicada localmente (backend indisponível).");
      }
      setTelaCadastro(false);
      setEventoEditando(null);
    }
  };

  const confirmarExcluirEvento = async () => {
    if (!eventoParaExcluir) return;
    try {
      const res = await fetch(`${BACKEND_BASE}/eventos/${eventoParaExcluir.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setEventos((prev) => prev.filter((e) => e.id !== eventoParaExcluir.id));
      alert("Evento excluído!");
      setEventoParaExcluir(null);
    } catch (e) {
      // fallback local
      setEventos((prev) => prev.filter((e) => e.id !== eventoParaExcluir.id));
      alert("Evento removido localmente (backend indisponível).");
      setEventoParaExcluir(null);
    }
  };

  const Button = ({ children, className = "", ...props }) => (
    <button className={`px-4 py-2 rounded-lg font-semibold ${className}`} {...props}>
      {children}
    </button>
  );

  const confirmarRedirecionamentoEmpresa = () => {
    if (!confirmEmpresa) return;
    const link = confirmEmpresa.link;
    if (!link) {
      alert("Link inválido.");
      setConfirmEmpresa(null);
      return;
    }
    const quero = window.confirm("Você será direcionado para uma página externa. Deseja continuar?");
    if (quero) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
    setConfirmEmpresa(null);
  };

  return (
    <div className="flex min-h-screen bg-[#FFF6FF] text-gray-800">

      <aside className="w-[300px] bg-[#FFF6FF] p-6 flex flex-col gap-6 shadow-lg">
        <h1 className="font-bold text-black text-[22px] ml-4">Eventos</h1>

        <div className="relative ml-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar evento..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-inner bg-gray-100 text-gray-700"
            value={localidade}
            onChange={(e) => setLocalidade(e.target.value)}
          />
        </div>

        {(usuarioLogado.role == "MODERADOR" || usuarioLogado.role == "EMPRESA") && (
          <>
            <div className="mt-2 ml-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">Meus eventos</h4>

                <p
                  className="px-2 py-1 text-sm rounded-md bg-pink-200 hover:bg-pink-300 text-pink-700 cursor-pointer transition"
                  onClick={() => {
                    setTelaMeusEventos(true);
                    setTelaCadastro(false);
                  }}
                >
                  Ver
                </p>
              </div>
              <div className="flex flex-col gap-2 max-h-64 overflow-auto pr-2 mt-4">
                {Eventos.length === 0 ? (
                  <div className="text-sm text-gray-400">Você ainda não criou eventos.</div>
                ) : (
                  Eventos.map((ev) => (
                    <div key={ev.id ?? ev._id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                      <div className="truncate text-sm">{ev.titulo}</div>
                      <div className="flex gap-1">
                        <button
                          className="px-2 py-1 text-xs bg-yellow-400 rounded"
                          onClick={() => {
                            setTelaCadastro(true);
                            setEventoEditando(ev);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                          onClick={() => setEventoParaExcluir(ev)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              className="w-full bg-[#F36EC0] text-white font-semibold h-[40px] mb-4 mt-4 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center"
              onClick={() => {
                setTelaCadastro(true);
                setEventoEditando(null);
              }}
            >
              + Publicar Evento
            </button>
          </>
        )}
      </aside>

      <main className="flex-1 p-8">
        { telaCadastro ? (
          <CadastroEvento
            user={user}
            eventoEditando={eventoEditando}
            fechar={() => { setTelaCadastro(false); setEventoEditando(null); }}
          />
        ) : telaMeusEventos ? (
          <>
            <ArrowLeft className="m-2 cursor-pointer" onClick={() => setTelaMeusEventos(false)} />
            <MeusEventos 
              eventos={meusEventos}
              user={user}
            />
          </>
        ) : (
          <>
            <div className="flex gap-4 mb-6 justify-center">
              {["ao-vivo", "presencial", "remoto", "todos"].map((tipo) => (
                <Button
                  key={tipo}
                  onClick={() => setFiltro(tipo)}
                  className={filtro === tipo ? "bg-pink-500 text-white" : "bg-white border"}
                >
                  {tipo === "ao-vivo" ? "Ao vivo" : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </Button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              {eventos.map((evento, index) => (
                <Evento 
                  key={index}
                  evento={evento}
                  user={usuarioLogado}
                />
              ))}

              {eventos.length === 0 && (
                <div className="text-center text-gray-500 col-span-full">Nenhum evento encontrado.</div>
              )}
            </div>
          </>
        )}

        {/* Modal confirmar redirecionamento evento empresa (usado apenas para manter estado; a confirmação final usa window.confirm) */}
        {confirmEmpresa && (
          <div className="fixed inset-0 z-60 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
              <h3 className="text-xl font-bold mb-2">{confirmEmpresa.evento.titulo}</h3>
              <p className="mb-4">Você será direcionada para uma página externa de inscrição. Deseja continuar?</p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={confirmarRedirecionamentoEmpresa}
                  className="w-full text-white py-2 rounded"
                  style={{ background: 'linear-gradient(90deg, #5b3eeb 0%, #c958d0 100%)' }}
                >
                  Confirmar e Acessar
                </button>

                <button
                  onClick={() => setConfirmEmpresa(null)}
                  className="w-full bg-gray-300 text-black py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {eventoParaExcluir && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-96">
              <h3 className="font-bold text-lg">Excluir evento</h3>
              <p className="mb-4">
                Tem certeza que deseja excluir <b>{eventoParaExcluir.titulo}</b>?
              </p>

              <div className="flex justify-between">
                <button className="bg-gray-300 px-4 py-2 rounded-lg" onClick={() => setEventoParaExcluir(null)}>
                  Cancelar
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={confirmarExcluirEvento}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
