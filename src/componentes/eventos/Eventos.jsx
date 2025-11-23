// src/components/Eventos.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import CadastroEventos from "./CadastroEventos";

/* imagens pré-selecionadas */
const imagensDisponiveis = [
  "/src/assets/img/emeninas-digitais.jpeg",
  "/src/assets/img/mulheresfortes.png",
  "/src/assets/img/mulherwomakers.jpeg",
  "/src/assets/img/mulheres-tecnologia.jpg",
];

const empresaToken = localStorage.getItem("empresaToken");
const BACKEND_BASE = "http://localhost:8080";

export default function Eventos() {
  const eventosFixos = [
    {
      id: 1,
      titulo: "Reunião meninas digitais",
      data: "26/06/2025",
      hora: "19:00",
      tipo: "ao-vivo",
      local: "São Paulo",
      descricao:
        "Reunião para trocar ideias e conhecimentos sobre o projeto buscando o aprimoramento.",
      imagem: "/src/assets/img/mulheres-tecnologia.jpg",
    },
    {
      id: 2,
      titulo: "Palestra tecnologia inclusiva",
      data: "28/06/2025",
      hora: "15:00",
      tipo: "presencial",
      local: "Rio de Janeiro",
      descricao: "Discussão sobre inclusão de mulheres no mercado de tecnologia.",
      imagem: "/src/assets/img/mulheres-tecnologia.jpg",
    },
    {
      id: 3,
      titulo: "Workshop React para iniciantes",
      data: "05/07/2025",
      hora: "18:00",
      tipo: "remoto",
      local: "Online",
      descricao: "Oficina prática para quem deseja aprender os fundamentos do React.",
      imagem: "/src/assets/img/mulheres-tecnologia.jpg",
    },
    {
      id: 4,
      titulo: "Encontro Mulheres na TI",
      data: "10/07/2025",
      hora: "14:00",
      tipo: "presencial",
      local: "Belo Horizonte",
      descricao: "Evento presencial para networking e troca de experiências.",
      imagem: "/src/assets/img/mulheres-tecnologia.jpg",
    },
    {
      id: 5,
      titulo: "Mentoria carreira em tecnologia",
      data: "15/07/2025",
      hora: "20:00",
      tipo: "remoto",
      local: "Online",
      descricao: "Sessão de mentoria com profissionais experientes do mercado.",
      imagem: "/src/assets/img/mulheres-tecnologia.jpg",
    },
    {
      id: 6,
      titulo: "Hackathon inclusão digital",
      data: "20/07/2025",
      hora: "09:00",
      tipo: "presencial",
      local: "Curitiba",
      descricao: "Competição de programação com foco em soluções inclusivas.",
      imagem: "/src/assets/img/mulheres-tecnologia.jpg",
    },
  ];

  const [eventosCriados, setEventosCriados] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [localidade, setLocalidade] = useState("");
  const [modalEvento, setModalEvento] = useState(null);
  const [eventoParaExcluir, setEventoParaExcluir] = useState(null);
  const [telaCadastro, setTelaCadastro] = useState(false);
  const [telaMeusEventos, setTelaMeusEventos] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);

  // Modal inscrição
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [instituicao, setInstituicao] = useState("");

  // ---------- Utils ----------
  const aplicarMascaraCPF = (valor) => {
    const cpfLimpo = valor.replace(/\D/g, "");
    let cpfFormatado = cpfLimpo;
    if (cpfLimpo.length > 3) cpfFormatado = cpfLimpo.substring(0, 3) + "." + cpfLimpo.substring(3);
    if (cpfLimpo.length > 6) cpfFormatado = cpfFormatado.substring(0, 7) + "." + cpfFormatado.substring(7);
    if (cpfLimpo.length > 9) cpfFormatado = cpfFormatado.substring(0, 11) + "-" + cpfFormatado.substring(11);
    return cpfFormatado.substring(0, 14);
  };

  const aplicarMascaraTelefone = (valor) => {
    const tel = valor.replace(/\D/g, "");
    let t = tel;
    if (tel.length > 0) t = "(" + tel.substring(0, 2) + ") " + tel.substring(2);
    if (tel.length > 6) t = t.substring(0, 10) + "-" + t.substring(10);
    return t.substring(0, 15);
  };

  const validarCPF = (cpf) => {
    const c = cpf.replace(/\D/g, "");
    if (c.length !== 11) return false;
    if (/^(\d)\1+$/.test(c)) return false;

    let soma = 0;
    for (let i = 1; i <= 9; i++) soma += parseInt(c[i - 1]) * (11 - i);
    let resto = (soma * 10) % 11;
    resto = resto >= 10 ? 0 : resto;
    if (resto !== parseInt(c[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(c[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    resto = resto >= 10 ? 0 : resto;
    return resto === parseInt(c[10]);
  };

  // ---------- Backend ----------
  const listarEventosBackend = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE}/eventos`);
      if (!res.ok) throw new Error();

      const dados = await res.json();
      setEventosCriados(Array.isArray(dados) ? dados : []);
    } catch (e) {
      setEventosCriados([]);
    }
  };

  useEffect(() => {
    listarEventosBackend();
  }, []);

  // ---------- Salvar evento ----------
  const salvarEvento = async (eventoObj, isEdit) => {
    try {
      if (isEdit) {
        const res = await fetch(`${BACKEND_BASE}/eventos/${eventoObj.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventoObj),
        });
        if (!res.ok) throw new Error();
        alert("Evento atualizado!");
      } else {
        const res = await fetch(`${BACKEND_BASE}/eventos`, {
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
      alert("Erro ao salvar evento.");
    }
  };

  // ---------- Excluir ----------
  const confirmarExcluirEvento = async () => {
    if (!eventoParaExcluir) return;

    try {
      const res = await fetch(`${BACKEND_BASE}/eventos/${eventoParaExcluir.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setEventosCriados((prev) => prev.filter((e) => e.id !== eventoParaExcluir.id));
      alert("Evento excluído!");
      setEventoParaExcluir(null);
    } catch (e) {
      alert("Erro ao excluir.");
    }
  };

  // ---------- Feed + filtros ----------
  const todosOsEventos = [...eventosFixos, ...eventosCriados];

  const eventosFiltrados = todosOsEventos.filter((ev) => {
    const tipoMatch = filtro === "todos" || ev.tipo === filtro;
    const localMatch = (ev.local || "").toLowerCase().includes(localidade.toLowerCase());
    return tipoMatch && localMatch;
  });

  // ---------- Componentes básicos ----------
  const Card = ({ children, className = "" }) => (
    // adicionei flex flex-col h-full aqui para garantir que o card estique e permita mt-auto no conteúdo
    <div className={`bg-white rounded-xl shadow-md flex flex-col h-full ${className}`}>{children}</div>
  );

  const CardContent = ({ children, className = "" }) => (
    // flex-1 para ocupar o espaço interno e permitir que mt-auto funcione no botão
    <div className={`p-4 flex flex-col flex-1 ${className}`}>{children}</div>
  );

  const Button = ({ children, className = "", ...props }) => (
    <button className={`px-4 py-2 rounded-lg font-semibold ${className}`} {...props}>
      {children}
    </button>
  );

  // ========================================================================
  // ============================   RENDER   ================================
  // ========================================================================

  return (
    <div className="flex min-h-screen bg-[#FFF6FF] text-gray-800">
      {/* Sidebar */}
      <aside className="w-[300px] bg-[#FFF6FF] p-6 flex flex-col gap-6 shadow-lg">
        <h1 className="font-bold text-black text-[22px] ml-4">Eventos</h1>

        {/* Barra de pesquisa */}
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

        {/* Meus eventos */}
        <div className="mt-2 ml-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Meus eventos</h4>

            {/* Botão VER */}
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
            {eventosCriados.length === 0 ? (
              <div className="text-sm text-gray-400">Você ainda não criou eventos.</div>
            ) : (
              eventosCriados.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
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
       
          <Button
            className="bg-[#F36EC0] text-white font-bold mt-4"
            onClick={() => {
              setTelaCadastro(true);
              setEventoEditando(null);
            }}
          >
            + Publicar Evento
          </Button>
  
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-8">

        {/* Tela cadastro */}
        {telaCadastro ? (
          <CadastroEventos
            eventoEditando={eventoEditando}
            onSalvar={salvarEvento}
            onCancelar={() => setTelaCadastro(false)}
            imagensDisponiveis={imagensDisponiveis}
          />

        ) : telaMeusEventos ? (
          <>
            <ArrowLeft className="m-2 cursor-pointer" onClick={() => setTelaMeusEventos(false)} />
            <h2 className="text-2xl font-bold mb-6">Meus Eventos</h2>

            {eventosCriados.length === 0 ? (
              <div>Nenhum evento criado.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 items-stretch">
                {eventosCriados.map((ev) => (
                  <Card key={ev.id} className="border-2 border-pink-300">
                    <img
                      src={ev.imagem}
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <CardContent>
                      <h3 className="font-bold text-lg break-words">{ev.titulo}</h3>
                      <p className="text-pink-600">
                        {ev.data} • {ev.hora}
                      </p>
                      <p className="text-sm italic text-gray-600 break-words">
                        {(ev.tipo || "").toUpperCase()} - {(ev.local || "")}
                      </p>
                      <p className="mt-2 text-sm break-words">{ev.descricao}</p>

                      <div className="flex gap-2 mt-4">
                        <button className="bg-yellow-400 px-3 py-2 rounded" onClick={() => setEventoEditando(ev)}>
                          Editar
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-2 rounded"
                          onClick={() => setEventoParaExcluir(ev)}
                        >
                          Excluir
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* filtros */}
            
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
              {eventosFiltrados.map((ev) => (
                <Card key={ev.id} className="border-2 border-pink-300">
                  {/* IMG ajustada */}
                  <img
                    src={ev.imagem}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />

                  <CardContent>
                    <h3 className="font-bold text-lg break-words">{ev.titulo}</h3>

                    <p className="text-pink-600">{ev.data} • {ev.hora}</p>

                    <p className="text-sm italic text-gray-600 break-words">
                      {(ev.tipo || "").toUpperCase()} - {(ev.local || "")}
                    </p>

                    <p className="mt-2 text-sm break-words">{ev.descricao}</p>

                 {/* BOTÃO PARTICIPAR */}
{/* BOTÃO PARTICIPAR */}
<div className="mt-auto pt-4 flex justify-center">
  <Button
    className="bg-[#F36EC0] text-white font-semibold px-6 py-2 rounded-full hover:bg-[#e055a8] transition"
    onClick={() => {
      // Apenas abre o modal, sem chamar backend aqui
      setModalEvento(ev);

      // Se quiser pré-preencher nome-email do usuário logado:
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setNome(user.nome || "");
        setEmail(user.email || "");
      }
    }}
  >
    Participar
  </Button>
</div>


                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

      {/* Modal de inscrição */}
{modalEvento && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-xl w-96">

      <h2 className="text-xl font-bold">Inscrição</h2>
      <p className="font-semibold mb-2">{modalEvento.titulo}</p>

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="CPF"
        value={cpf}
        onChange={(e) => setCpf(aplicarMascaraCPF(e.target.value))}
      />

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Telefone"
        value={telefone}
        onChange={(e) => setTelefone(aplicarMascaraTelefone(e.target.value))}
      />

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Instituição"
        value={instituicao}
        onChange={(e) => setInstituicao(e.target.value)}
      />

      <div className="flex justify-between">
        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={() => setModalEvento(null)}
        >
          Cancelar
        </button>

        <button
          className="bg-pink-500 text-white px-4 py-2 rounded"
          onClick={async () => {
            if (!nome || !cpf || !email || !telefone || !instituicao) {
              return alert("Preencha todos os dados!");
            }
            if (!validarCPF(cpf)) {
              return alert("CPF inválido!");
            }

            try {
              const resposta = await fetch("http://localhost:8080/inscricoes", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  eventoId: String(modalEvento._id ?? modalEvento.id),
                  nome,
                  cpf,
                  email,
                  telefone,
                  instituicao,
                }),
              });

              if (!resposta.ok) {
                throw new Error("Erro ao enviar inscrição");
              }

              alert("Inscrição realizada com sucesso!");
              setModalEvento(null);

            } catch (erro) {
              console.error("ERRO NO BACK-END:", erro);
              alert("Erro ao realizar inscrição. Verifique o backend.");
            }
          }}
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
)}


        {/* Modal excluir */}
        {eventoParaExcluir && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-96">
              <h3 className="font-bold text-lg">Excluir evento</h3>
              <p className="mb-4">
                Tem certeza que deseja excluir <b>{eventoParaExcluir.titulo}</b>?
              </p>

              <div className="flex justify-between">
                <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEventoParaExcluir(null)}>
                  Cancelar
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmarExcluirEvento}>
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
