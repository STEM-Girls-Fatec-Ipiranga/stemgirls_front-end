import { useState } from "react";

// Banco de imagens pré-selecionadas
const imagensDisponiveis = [
  "/imagens/evento1.jpg",
  "/imagens/evento2.jpg",
  "/imagens/evento3.jpg",
];

// Componentes básicos
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
  // Lista inicial de eventos
  const [eventos, setEventos] = useState([
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
  ]);

  // Estados para filtro, modal e formulário
  const [filtro, setFiltro] = useState("todos");
  const [localidade, setLocalidade] = useState("");
  const [modalEvento, setModalEvento] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [telaCadastro, setTelaCadastro] = useState(false);

  // Formulário de cadastro
  const [empresa, setEmpresa] = useState("");
  const [tituloEvento, setTituloEvento] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [horaEvento, setHoraEvento] = useState("");
  const [modelo, setModelo] = useState("presencial");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [link, setLink] = useState("");
  const [descricaoEvento, setDescricaoEvento] = useState("");
  const [imagem, setImagem] = useState(imagensDisponiveis[0]);

  // Função para preencher endereço pelo CEP usando ViaCEP
  const preencherEndereco = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return; // CEP inválido
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setCidade(data.localidade);
        setEstado(data.uf);
        setBairro(data.bairro);
        setRua(data.logradouro);
      } else {
        setCidade(""); setEstado(""); setBairro(""); setRua("");
      }
    } catch (err) {
      console.log("Erro ao buscar CEP", err);
      setCidade(""); setEstado(""); setBairro(""); setRua("");
    }
  };

  // Função para cadastrar evento
  const cadastrarEvento = () => {
    if (!empresa || !tituloEvento || !dataEvento || !horaEvento || !descricaoEvento || !imagem) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    if (modelo === "presencial" && (!cep || !cidade || !estado || !bairro || !rua || !numero || !link)) {
      alert("Preencha todos os campos do endereço e link!");
      return;
    }
    if (modelo === "remoto" && !link) {
      alert("Informe o link do evento!");
      return;
    }

    const novoEvento = {
      id: eventos.length + 1,
      empresa,
      titulo: tituloEvento,
      data: dataEvento,
      hora: horaEvento,
      tipo: modelo === "presencial" ? "presencial" : "remoto",
      local: modelo === "presencial" ? cidade : "Online",
      descricao: descricaoEvento,
      imagem,
      link,
    };

    setEventos([...eventos, novoEvento]);
    setTelaCadastro(false);

    // Limpa formulário
    setEmpresa(""); setTituloEvento(""); setDataEvento(""); setHoraEvento(""); setModelo("presencial");
    setCep(""); setCidade(""); setEstado(""); setBairro(""); setRua(""); setNumero(""); setComplemento(""); setLink(""); setDescricaoEvento(""); setImagem(imagensDisponiveis[0]);
  };

  // Filtragem de eventos
  const eventosFiltrados = eventos.filter((e) => {
    const matchTipo = filtro === "todos" || e.tipo === filtro;
    const matchLocal = e.local.toLowerCase().includes(localidade.toLowerCase());
    return matchTipo && matchLocal;
  });

  return (
    <div className="flex min-h-screen bg-purple-50 text-gray-800">
      {/* Barra lateral */}
      <div className="w-64 bg-purple-100 p-6 flex flex-col gap-4">
        <h2 className="font-bold text-xl mb-4">Menu</h2>
        <Button
          className="bg-pink-500 text-white hover:bg-pink-600"
          onClick={() => setTelaCadastro(true)}
        >
          Cadastrar Evento
        </Button>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 p-8">
        {telaCadastro ? (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Cadastrar Evento</h2>

            <input
              type="text"
              placeholder="Nome da empresa"
              className="w-full mb-3 p-2 border rounded-lg"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            />

            <input
              type="text"
              placeholder="Nome do evento"
              className="w-full mb-3 p-2 border rounded-lg"
              value={tituloEvento}
              onChange={(e) => setTituloEvento(e.target.value)}
            />

            <div className="flex gap-2 mb-3">
              <input
                type="date"
                className="flex-1 p-2 border rounded-lg"
                value={dataEvento}
                onChange={(e) => setDataEvento(e.target.value)}
              />
              <input
                type="time"
                className="flex-1 p-2 border rounded-lg"
                value={horaEvento}
                onChange={(e) => setHoraEvento(e.target.value)}
              />
            </div>

            <div className="flex gap-2 mb-3">
              <Button
                className={modelo === "presencial" ? "bg-pink-500 text-white" : "bg-gray-200"}
                onClick={() => setModelo("presencial")}
              >
                Presencial
              </Button>
              <Button
                className={modelo === "remoto" ? "bg-pink-500 text-white" : "bg-gray-200"}
                onClick={() => setModelo("remoto")}
              >
                Remoto
              </Button>
            </div>

            {modelo === "presencial" && (
              <div className="flex flex-col gap-2 mb-3">
                <input
                  type="text"
                  placeholder="CEP"
                  className="w-full p-2 border rounded-lg"
                  value={cep}
                  onChange={(e) => {
                    setCep(e.target.value);
                    preencherEndereco(e.target.value);
                  }}
                />
                <div className="flex gap-2">
                  <input type="text" placeholder="Cidade" className="flex-1 p-2 border rounded-lg" value={cidade} readOnly />
                  <input type="text" placeholder="Estado" className="flex-1 p-2 border rounded-lg" value={estado} readOnly />
                </div>
                <input type="text" placeholder="Bairro" className="w-full p-2 border rounded-lg" value={bairro} readOnly />
                <input type="text" placeholder="Rua" className="w-full p-2 border rounded-lg" value={rua} readOnly />
                <div className="flex gap-2">
                  <input type="text" placeholder="Número" className="flex-1 p-2 border rounded-lg" value={numero} onChange={(e) => setNumero(e.target.value)} />
                  <input
                    type="text"
                    placeholder="Complemento"
                    className="flex-1 p-2 border rounded-lg"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Link para formulário de inscrição"
                  className="w-full p-2 border rounded-lg mt-2"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            )}

            {modelo === "remoto" && (
              <div className="flex flex-col gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Link ou plataforma do evento"
                  className="w-full p-2 border rounded-lg"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            )}

            <textarea
              placeholder="Descrição do evento"
              className="w-full mb-3 p-2 border rounded-lg"
              value={descricaoEvento}
              onChange={(e) => setDescricaoEvento(e.target.value)}
            />

            <select
              className="w-full mb-3 p-2 border rounded-lg"
              value={imagem}
              onChange={(e) => setImagem(e.target.value)}
            >
              {imagensDisponiveis.map((img, i) => (
                <option key={i} value={img}>
                  Imagem {i + 1}
                </option>
              ))}
            </select>

            <Button className="bg-pink-500 text-white w-full mt-3" onClick={cadastrarEvento}>
              Cadastrar
            </Button>
            <Button className="bg-gray-300 text-gray-800 w-full mt-2" onClick={() => setTelaCadastro(false)}>
              Voltar
            </Button>
          </div>
        ) : (
          // Tela principal de eventos
          <div>
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
                  {tipo === "ao-vivo" ? "Ao vivo" : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <h2 className="text-xl font-bold mb-4">Confirme sua participação</h2>
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
                        alert(`Inscrição confirmada para ${nome} (${email}) no evento: ${modalEvento.titulo}`);
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
        )}
      </div>
    </div>
  );
}
