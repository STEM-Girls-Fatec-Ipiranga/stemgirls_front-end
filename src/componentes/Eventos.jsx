import { useState, useEffect } from "react";
import { ArrowLeft } from 'lucide-react';

// Banco de imagens pré-selecionadas
const imagensDisponiveis = [
  "/src/assets/img/emeninas-digitais.jpeg",
  "/src/assets/img/mulheresfortes.png",
  "/src/assets/img/mulherwomakers.jpeg",
  { imagem: "/src/assets/img/mulheres-tecnologia.jpg" },
];

export default function Eventos() {
  // Eventos iniciais (fixos)
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
      imagem: "/src/assets/img/mulheres-tecnologia.jpg"
    },
    {
      id: 2,
      titulo: "Palestra tecnologia inclusiva",
      data: "28/06/2025",
      hora: "15:00",
      tipo: "presencial",
      local: "Rio de Janeiro",
      descricao: "Discussão sobre inclusão de mulheres no mercado de tecnologia.",
      imagem: "/src/assets/img/mulheres-tecnologia.jpg"
    },
    {
      id: 3,
      titulo: "Workshop React para iniciantes",
      data: "05/07/2025",
      hora: "18:00",
      tipo: "remoto",
      local: "Online",
      descricao: "Oficina prática para quem deseja aprender os fundamentos do React.",
      imagem: "/src/assets/img/mulheres-tecnologia.jpg"
    },
    {
      id: 4,
      titulo: "Encontro Mulheres na TI",
      data: "10/07/2025",
      hora: "14:00",
      tipo: "presencial",
      local: "Belo Horizonte",
      descricao: "Evento presencial para networking e troca de experiências.",
      imagem: "/src/assets/img/mulheres-tecnologia.jpg"
    },
    {
      id: 5,
      titulo: "Mentoria carreira em tecnologia",
      data: "15/07/2025",
      hora: "20:00",
      tipo: "remoto",
      local: "Online",
      descricao: "Sessão de mentoria com profissionais experientes do mercado.",
      imagem: "/src/assets/img/mulheres-tecnologia.jpg"
    },
    {
      id: 6,
      titulo: "Hackathon inclusão digital",
      data: "20/07/2025",
      hora: "09:00",
      tipo: "presencial",
      local: "Curitiba",
      descricao: "Competição de programação com foco em soluções inclusivas.",
      imagem: "/src/assets/img/mulheres-tecnologia.jpg"
    },
  ];

  // Eventos criados via formulário (aparecem em "Meus Eventos" e na listagem principal)
  const [eventosCriados, setEventosCriados] = useState([]);

  // Estados para filtro, modal, telas e confirmação
  const [filtro, setFiltro] = useState("todos");
  const [localidade, setLocalidade] = useState("");
  const [modalEvento, setModalEvento] = useState(null); // evento para inscrição
  const [eventoParaExcluir, setEventoParaExcluir] = useState(null); // confirmação exclusão

  const [telaCadastro, setTelaCadastro] = useState(false);
  const [telaMeusEventos, setTelaMeusEventos] = useState(false);

  // Dados do modal de inscrição (participação)
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [instituicao, setInstituicao] = useState("");

  // Formulário de cadastro de eventos
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

  // Carregar eventos do localStorage ao inicializar
  useEffect(() => {
    const eventosSalvos = localStorage.getItem("eventosCriados");
    if (eventosSalvos) {
      setEventosCriados(JSON.parse(eventosSalvos));
    }
  }, []);

  // Salvar eventos no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem("eventosCriados", JSON.stringify(eventosCriados));
  }, [eventosCriados]);

  // Função para aplicar máscara de CPF
  const aplicarMascaraCPF = (valor) => {
    const cpfLimpo = valor.replace(/\D/g, "");
    let cpfFormatado = cpfLimpo;

    if (cpfLimpo.length > 3) {
      cpfFormatado = cpfLimpo.substring(0, 3) + '.' + cpfLimpo.substring(3);
    }
    if (cpfLimpo.length > 6) {
      cpfFormatado = cpfFormatado.substring(0, 7) + '.' + cpfFormatado.substring(7);
    }
    if (cpfLimpo.length > 9) {
      cpfFormatado = cpfFormatado.substring(0, 11) + '-' + cpfFormatado.substring(11);
    }

    return cpfFormatado.substring(0, 14);
  };

  // Função para aplicar máscara de telefone
  const aplicarMascaraTelefone = (valor) => {
    const telefoneLimpo = valor.replace(/\D/g, "");
    let telefoneFormatado = telefoneLimpo;

    if (telefoneLimpo.length > 0) {
      telefoneFormatado = '(' + telefoneLimpo.substring(0, 2) + ') ' + telefoneLimpo.substring(2);
    }
    if (telefoneLimpo.length > 6) {
      telefoneFormatado = telefoneFormatado.substring(0, 10) + '-' + telefoneFormatado.substring(10);
    }

    return telefoneFormatado.substring(0, 15);
  };

  // Função para validar CPF
  const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, "");

    // Verifica se tem 11 dígitos
    if (cpfLimpo.length !== 11) {
      return false;
    }

    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1+$/.test(cpfLimpo)) {
      return false;
    }

    // Algoritmo de validação de CPF
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
      resto = 0;
    }

    if (resto !== parseInt(cpfLimpo.substring(9, 10))) {
      return false;
    }

    soma = 0;

    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
      resto = 0;
    }

    if (resto !== parseInt(cpfLimpo.substring(10, 11))) {
      return false;
    }

    return true;
  };

  // Componentes simples (internos)
  function Card({ children, className = "" }) {
    return <div className={`bg-white rounded-xl shadow-md ${className}`}>{children}</div>;
  }

  function CardContent({ children, className = "" }) {
    return <div className={`p-4 ${className}`}>{children}</div>;
  }

  function Button({ children, className = "", ...props }) {
    return (
      <button className={`px-4 py-2 rounded-lg font-semibold transition ${className}`} {...props}>
        {children}
      </button>
    );
  }

  // Preenche endereço a partir do CEP (ViaCEP)
  const preencherEndereco = async (cepValor) => {
    const cepLimpo = cepValor.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      // Limpa apenas se for inválido e campo ficou vazio
      if (!cepLimpo) {
        setCidade("");
        setEstado("");
        setBairro("");
        setRua("");
      }
      return;
    }
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setCidade(data.localidade || "");
        setEstado(data.uf || "");
        setBairro(data.bairro || "");
        setRua(data.logradouro || "");
      } else {
        setCidade("");
        setEstado("");
        setBairro("");
        setRua("");
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
      setCidade("");
      setEstado("");
      setBairro("");
      setRua("");
    }
  };

  // Cadastra novo evento (vai para eventosCriados)
  const cadastrarEvento = () => {
    // validações essenciais
    if (!empresa.trim() || !tituloEvento.trim() || !dataEvento || !horaEvento || !descricaoEvento.trim() || !imagem) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    if (modelo === "presencial" && (!cep.trim() || !cidade.trim() || !estado.trim() || !bairro.trim() || !rua.trim() || !numero.trim() || !link.trim())) {
      alert("Preencha todos os campos do endereço e link para eventos presenciais!");
      return;
    }
    if (modelo === "remoto" && !link.trim()) {
      alert("Informe o link ou plataforma do evento remoto!");
      return;
    }

    const novoEvento = {
      id: Date.now(), // id único simples para os criados
      empresa: empresa.trim(),
      titulo: tituloEvento.trim(),
      data: dataEvento,
      hora: horaEvento,
      tipo: modelo === "presencial" ? "presencial" : "remoto",
      local: modelo === "presencial" ? cidade || "" : "Online",
      descricao: descricaoEvento.trim(),
      imagem,
      link: link.trim(),
      enderecoCompleto:
        modelo === "presencial"
          ? `${rua || ""}, ${numero || ""}${complemento ? " - " + complemento : ""} - ${bairro || ""} - ${cidade || ""}/${estado || ""}`
          : "",
    };

    setEventosCriados((prev) => [novoEvento, ...prev]);
    setTelaCadastro(false);

    // limpa formulário
    setEmpresa("");
    setTituloEvento("");
    setDataEvento("");
    setHoraEvento("");
    setModelo("presencial");
    setCep("");
    setCidade("");
    setEstado("");
    setBairro("");
    setRua("");
    setNumero("");
    setComplemento("");
    setLink("");
    setDescricaoEvento("");
    setImagem(imagensDisponiveis[0]);
  };

  // Deleta evento criado (após confirmação)
  const confirmarExcluirEvento = () => {
    if (!eventoParaExcluir) return;
    setEventosCriados((prev) => prev.filter((e) => e.id !== eventoParaExcluir.id));
    setEventoParaExcluir(null);
  };

  // Mostra a listagem que será exibida no feed (fixos + criados)
  const todosOsEventos = [...eventosFixos, ...eventosCriados];

  // Filtragem
  const eventosFiltrados = todosOsEventos.filter((e) => {
    const matchTipo = filtro === "todos" || e.tipo === filtro;
    const matchLocal = e.local.toLowerCase().includes(localidade.toLowerCase());
    return matchTipo && matchLocal;
  });

  // Inscrição - confirma dados do participante
  const confirmarInscricao = () => {
    if (!nome.trim() || !cpf.trim() || !email.trim() || !telefone.trim()) {
      alert("Preencha Nome, CPF, Email e Telefone para confirmar inscrição.");
      return;
    }

    // Validação do CPF
    if (!validarCPF(cpf)) {
      alert("CPF inválido. Por favor, verifique o número digitado.");
      return;
    }

    // aqui você pode enviar para API / backend se quiser
    alert(
      `Inscrição confirmada!\nEvento: ${modalEvento.titulo}\nNome: ${nome}\nCPF: ${cpf}\nEmail: ${email}\nTelefone: ${telefone}\nInstituição: ${instituicao ||
      "—"}`
    );

    // limpa formulário e fecha modal
    setNome("");
    setCpf("");
    setEmail("");
    setTelefone("");
    setInstituicao("");
    setModalEvento(null);
  };

  return (
    <div className="flex min-h-screen bg-pink-50 text-gray-800">
      {/* Barra lateral (sem título "Menu") */}
      <aside className="w-64 bg-pink-100 p-6 flex flex-col gap-4">
        <Button
          className="bg-pink-500 text-white hover:bg-pink-600"
          onClick={() => {
            setTelaCadastro(true);
            setTelaMeusEventos(false);
          }}
        >
          Cadastrar Evento
        </Button>

        <Button
          className="bg-purple-500 text-white hover:bg-purple-600"
          onClick={() => {
            setTelaMeusEventos(true);
            setTelaCadastro(false);
          }}
        >
          Meus Eventos
        </Button>

        <div className="mt-2">
          <h4 className="font-semibold mb-2">Seus eventos</h4>
          <div className="flex flex-col gap-2 max-h-64 overflow-auto pr-2">
            {eventosCriados.length === 0 ? (
              <div className="text-sm text-gray-600">Você ainda não criou eventos.</div>
            ) : (
              eventosCriados.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                  <div className="truncate text-sm mr-2">{ev.titulo}</div>
                  <div className="flex gap-1">
                    <button
                      title="Ver meus eventos"
                      className="px-2 py-1 text-xs bg-gray-200 rounded"
                      onClick={() => {
                        setTelaMeusEventos(true);
                        setTelaCadastro(false);
                      }}
                    >
                      Ver
                    </button>
                    <button
                      title="Excluir (confirmar)"
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
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-8">


        {/* Tela de cadastro */}
        {telaCadastro ? (

          <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <div className="flex">
              <ArrowLeft className="m-2" onClick={() => setTelaCadastro(false)} />
              <h2 className="text-2xl font-bold mb-4">Cadastrar Evento</h2>
            </div>

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
                  <input
                    type="text"
                    placeholder="Cidade"
                    className="flex-1 p-2 border rounded-lg"
                    value={cidade}
                    readOnly
                  />
                  <input
                    type="text"
                    placeholder="Estado"
                    className="flex-1 p-2 border rounded-lg"
                    value={estado}
                    readOnly
                  />
                </div>
                <input
                  type="text"
                  placeholder="Bairro"
                  className="w-full p-2 border rounded-lg"
                  value={bairro}
                  readOnly
                />
                <input
                  type="text"
                  placeholder="Rua"
                  className="w-full p-2 border rounded-lg"
                  value={rua}
                  readOnly
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Número"
                    className="flex-1 p-2 border rounded-lg"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                  />
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

          </div>
        ) : telaMeusEventos ? (
          /* Tela "Meus Eventos" - mostra apenas eventosCriados */
          <section>
            <ArrowLeft className="m-2" onClick={() => setTelaMeusEventos(false)} />
            <h2 className="text-2xl font-bold mb-6">Meus Eventos</h2>

            {eventosCriados.length === 0 ? (
              <div className="text-gray-600">Você ainda não criou nenhum evento.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
                {eventosCriados.map((evento) => (
                  <Card key={evento.id} className="border-2 border-pink-300 shadow-md rounded-xl overflow-hidden">
                    <img src={evento.imagem} alt={evento.titulo} className="w-full h-40 object-cover" />
                    <CardContent>
                      <h3 className="font-bold text-lg text-gray-800">{evento.titulo}</h3>
                      <p className="text-pink-600 font-semibold">{evento.data} • {evento.hora}</p>
                      <p className="text-sm italic text-gray-600">{evento.tipo.toUpperCase()} - {evento.local}</p>
                      <p className="mt-2 text-gray-700 text-sm">{evento.descricao}</p>
                      <div className="flex gap-2 mt-4">
                        <Button
                          className="m-auto w-[50%] bg-red-500 text-white"
                          onClick={() => setEventoParaExcluir(evento)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* Tela principal - feed de eventos (fixos + criados) */
          <section>
            {/* Filtros */}
            <div className="flex gap-4 mb-6 justify-center">
              {["ao-vivo", "presencial", "remoto", "todos"].map((tipo) => (
                <Button
                  key={tipo}
                  onClick={() => setFiltro(tipo)}
                  className={`${filtro === tipo
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

            {/* Cards (2 por linha) */}
            <div className="grid md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
              {eventosFiltrados.map((evento) => (
                <Card
                  key={evento.id}
                  className="border-2 border-pink-300 shadow-md rounded-xl overflow-hidden"
                >
                  <img src={evento.imagem} alt={evento.titulo} className="w-full h-40 object-cover" />
                  <CardContent>
                    <h3 className="font-bold text-lg text-gray-800">{evento.titulo}</h3>
                    <p className="text-pink-600 font-semibold">{evento.data} • {evento.hora}</p>
                    <p className="text-sm italic text-gray-600">{evento.tipo.toUpperCase()} - {evento.local}</p>
                    <p className="mt-2 text-gray-700 text-sm">{evento.descricao}</p>
                    <div className="mt-4">
                      <Button
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                        onClick={() => setModalEvento(evento)}
                      >
                        Participar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Modal de inscrição (participação) */}
        {modalEvento && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-gray-800">
              <h2 className="text-xl font-bold mb-4">Inscrição</h2>
              <p className="mb-3 font-semibold">{modalEvento.titulo}</p>

              <input
                type="text"
                placeholder="Nome completo"
                className="w-full mb-2 p-2 border rounded-lg"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <input
                type="text"
                placeholder="CPF"
                className="w-full mb-2 p-2 border rounded-lg"
                value={cpf}
                onChange={(e) => setCpf(aplicarMascaraCPF(e.target.value))}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full mb-2 p-2 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Telefone"
                className="w-full mb-2 p-2 border rounded-lg"
                value={telefone}
                onChange={(e) => setTelefone(aplicarMascaraTelefone(e.target.value))}
              />
              <input
                type="text"
                placeholder="Instituição de ensino (opcional)"
                className="w-full mb-3 p-2 border rounded-lg"
                value={instituicao}
                onChange={(e) => setInstituicao(e.target.value)}
              />

              <div className="flex justify-between">
                <Button className="bg-gray-300" onClick={() => setModalEvento(null)}>
                  Cancelar
                </Button>
                <Button className="bg-pink-500 text-white" onClick={confirmarInscricao}>
                  Confirmar inscrição
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmação de exclusão (usado tanto pela lateral quanto por Meus Eventos) */}
        {eventoParaExcluir && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h3 className="font-bold text-lg mb-4">Confirmar Exclusão</h3>
              <p>Deseja realmente excluir o evento <b>{eventoParaExcluir.titulo}</b>?</p>
              <div className="flex justify-between mt-4">
                <Button className="bg-gray-300" onClick={() => setEventoParaExcluir(null)}>
                  Cancelar
                </Button>
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => confirmarExcluirEvento()}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}