import { useState } from "react";
// Componentes básicos sem shadcn
function Card({ children, className }) {
  return <div className={`bg-white rounded-xl shadow-md ${className}`}>{children}</div>;
}

function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

function Button({ children, className, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Eventos() {
  // Lista de eventos
  const [eventos] = useState([
    {
      id: 1,
      titulo: "Reunião meninas digitais",
      data: "26/06/2025",
      hora: "19:00",
      tipo: "ao-vivo",
      local: "São Paulo",
      descricao: "Reunião para trocar ideias e conhecimentos sobre o projeto buscando o aprimoramento.",
      imagem: "/imagens/mulheres-tecnologia.jpg",
    },
    {
      id: 2,
      titulo: "Palestra tecnologia inclusiva",
      data: "28/06/2025",
      hora: "15:00",
      tipo: "presencial",
      local: "Rio de Janeiro",
      descricao: "Discussão sobre inclusão de mulheres no mercado de tecnologia.",
      imagem: "/imagens/mulheres-tecnologia.jpg",
    },
    {
      id: 3,
      titulo: "Workshop remoto de inovação",
      data: "30/06/2025",
      hora: "20:00",
      tipo: "remoto",
      local: "Online",
      descricao: "Atividade remota para explorar novas tendências de inovação.",
      imagem: "/imagens/mulheres-tecnologia.jpg",
    },
    {
      id: 4,
      titulo: "Encontro de Programadores",
      data: "05/07/2025",
      hora: "18:00",
      tipo: "presencial",
      local: "Curitiba",
      descricao: "Networking entre profissionais e estudantes de TI.",
      imagem: "/imagens/mulheres-tecnologia.jpg",
    },
    {
      id: 5,
      titulo: "Hackathon Universitário",
      data: "10/07/2025",
      hora: "09:00",
      tipo: "ao-vivo",
      local: "Campinas",
      descricao: "Competição para criação de soluções inovadoras em tecnologia.",
      imagem: "/imagens/mulheres-tecnologia.jpg",
    },
    {
      id: 6,
      titulo: "Mesa Redonda sobre IA",
      data: "15/07/2025",
      hora: "14:00",
      tipo: "remoto",
      local: "Online",
      descricao: "Debate sobre inteligência artificial e ética.",
      imagem: "/imagens/mulheres-tecnologia.jpg",
    },
    {
      id: 7,
      titulo: "Oficina de Acessibilidade Digital",
      data: "20/07/2025",
      hora: "16:00",
      tipo: "presencial",
      local: "Porto Alegre",
      descricao: "Capacitação sobre acessibilidade em sites e aplicativos.",
      imagem: "/imagens/mulheres-tecnologia.jpg",
    },
    {
      id: 8,
      titulo: "Seminário Cloud Computing",
      data: "25/07/2025",
      hora: "11:00",
      tipo: "ao-vivo",
      local: "Belo Horizonte",
      descricao: "Apresentações sobre avanços em computação em nuvem.",
      imagem: "/imagens/mulheres-tecnologia.jpg",
    },
    {
      id: 9,
      titulo: "Curso Prático de Frontend",
      data: "01/08/2025",
      hora: "19:30",
      tipo: "remoto",
      local: "Online",
      descricao: "Curso introdutório sobre React e Tailwind.",
      imagem: "/imagens/mulheres-tecnologia.jpg",
    },
  ]);

  // Estados para filtro e modal
  const [filtro, setFiltro] = useState("todos");
  const [localidade, setLocalidade] = useState("");
  const [modalEvento, setModalEvento] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  // Filtragem de eventos
  const eventosFiltrados = eventos.filter((e) => {
    const matchTipo = filtro === "todos" || e.tipo === filtro;
    const matchLocal = e.local.toLowerCase().includes(localidade.toLowerCase());
    return matchTipo && matchLocal;
  });

  return (
    <div className="min-h-screen bg-purple-50 p-8 text-gray-800">
      {/* Filtros */}
      <div className="flex gap-4 mb-6 justify-center">
        {["ao-vivo", "presencial", "remoto", "todos"].map((tipo) => (
          <Button
            key={tipo}
            onClick={() => setFiltro(tipo)}
            className={`${
              filtro === tipo
                ? "bg-pink-500 text-white"
                : "bg-white/40 backdrop-blur border border-gray-300 text-gray-700 hover:bg-white/60"
            }`}
          >
            {tipo === "ao-vivo"
              ? "Ao vivo"
              : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </Button>
        ))}
      </div>

      {/* Pesquisa por localidade */}
      <div className="flex justify-center mb-6">
        <div className="relative w-1/2">
          <span className="absolute left-3 top-3 text-gray-500">🔍</span>
          <input
            type="text"
            placeholder="Pesquisar por localidade..."
            className="w-full pl-10 p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
            value={localidade}
            onChange={(e) => setLocalidade(e.target.value)}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eventosFiltrados.map((evento) => (
          <Card
            key={evento.id}
            className="border-2 border-pink-300 shadow-md rounded-xl overflow-hidden"
          >
            <img
              src={evento.imagem}
              alt={evento.titulo}
              className="w-full h-40 object-cover"
            />
            <CardContent>
              <h3 className="font-bold text-lg text-gray-800">{evento.titulo}</h3>
              <p className="text-pink-600 font-semibold">
                {evento.data} • {evento.hora}
              </p>
              <p className="text-sm italic text-gray-600">
                {evento.tipo.toUpperCase()} - {evento.local}
              </p>
              <p className="mt-2 text-gray-700 text-sm">{evento.descricao}</p>
              <Button
                className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white"
                onClick={() => setModalEvento(evento)}
              >
                Participar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {modalEvento && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-gray-800">
            <h2 className="text-xl font-bold mb-4">
              Confirme sua participação
            </h2>
            <p className="mb-2">{modalEvento.titulo}</p>
            <input
              type="text"
              placeholder="Nome completo"
              className="w-full mb-3 p-2 border rounded-lg text-gray-700"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded-lg text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex justify-between">
              <Button
                className="bg-gray-300 text-gray-800"
                onClick={() => setModalEvento(null)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-pink-500 text-white hover:bg-pink-600"
                onClick={() => {
                  alert(
                    `Inscrição confirmada para ${nome} (${email}) no evento: ${modalEvento.titulo}`
                  );
                  setModalEvento(null);
                }}
              >
                Confirmar participação
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}