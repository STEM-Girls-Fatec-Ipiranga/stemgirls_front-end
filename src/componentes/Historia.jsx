import React, { useState } from "react";

const mulheres = [
  {
    nome: "Marie Curie",
    foto: "/imagens/marie-curie.jpg",
    resumo: "Marie Curie foi uma cientista pioneira na pesquisa sobre radioatividade, ganhando dois prêmios Nobel em áreas diferentes e abrindo caminho para mulheres na ciência.",
    historia: "Marie Curie foi a primeira mulher a ganhar um Nobel, e a única a receber dois em diferentes áreas: Física e Química. Ela descobriu os elementos rádio e polônio, realizou pesquisas inovadoras sobre radioatividade, fundou laboratórios e inspirou gerações de cientistas, quebrando barreiras para mulheres na ciência.",
  },
  {
    nome: "Ada Lovelace",
    foto: "/imagens/ada-lovelace.jpg",
    resumo: "Ada Lovelace é considerada a primeira programadora da história, criando conceitos fundamentais da computação moderna.",
    historia: "Ada Lovelace escreveu o primeiro algoritmo destinado a ser processado por uma máquina, antecipando conceitos que hoje são fundamentais na computação. Seu trabalho mostrou a importância da programação e inspirou milhares de pessoas a entrar no mundo da tecnologia, tornando-se um ícone do pensamento lógico e inovação.",
  },
  {
    nome: "Frida Kahlo",
    foto: "/imagens/frida-kahlo.jpg",
    resumo: "Frida Kahlo, artista mexicana, é conhecida por suas pinturas intensamente pessoais e simbólicas, explorando identidade e dor.",
    historia: "Frida Kahlo é uma das artistas mais icônicas do século XX. Suas pinturas refletem dor física e emocional, questões de identidade e cultura mexicana. Ela se tornou um símbolo de resistência, feminismo e expressão artística única, influenciando artistas e movimentos culturais ao redor do mundo.",
  },
  {
    nome: "Malala Yousafzai",
    foto: "/imagens/malala.jpg",
    resumo: "Defensora da educação feminina, sobreviveu a um ataque e continua a lutar pelo direito de meninas estudarem em todo o mundo.",
    historia: "Malala Yousafzai se tornou símbolo global da luta pelo direito à educação. Sobreviveu a um atentado do Talibã, mas continuou sua missão, fundando organizações, escrevendo livros e recebendo o Nobel da Paz. Seu trabalho inspira jovens mulheres a buscarem educação e igualdade em países onde seus direitos são negados.",
  },
  {
    nome: "Rosa Parks",
    foto: "/imagens/rosa-parks.jpg",
    resumo: "Símbolo do movimento pelos direitos civis, inspirou mudanças significativas nos Estados Unidos.",
    historia: "Rosa Parks se recusou a ceder seu assento em um ônibus a um passageiro branco em Montgomery, Alabama. Esse ato de coragem desencadeou o boicote de Montgomery e fortaleceu o movimento pelos direitos civis, tornando Rosa um ícone da luta contra a segregação racial e pela igualdade.",
  },
  {
    nome: "Serena Williams",
    foto: "/imagens/serena.jpg",
    resumo: "Serena Williams é considerada uma das maiores tenistas de todos os tempos, com inúmeros títulos e impacto cultural.",
    historia: "Serena Williams revolucionou o tênis feminino, conquistando títulos de Grand Slam, inspirando gerações de atletas e influenciando a cultura esportiva mundial. Sua determinação, habilidade e presença fora das quadras fazem dela uma referência de sucesso e resistência.",
  },
  {
    nome: "Simone de Beauvoir",
    foto: "/imagens/simone.jpg",
    resumo: "Filósofa e escritora francesa, uma das principais figuras do feminismo moderno.",
    historia: "Simone de Beauvoir foi uma das principais pensadoras do feminismo moderno. Autora de 'O Segundo Sexo', defendeu a liberdade individual e a igualdade de gênero, influenciando debates filosóficos e sociais até os dias atuais. Seu legado inspira discussões sobre direitos das mulheres e autonomia.",
  },
  {
    nome: "Amelia Earhart",
    foto: "/imagens/amelia.jpg",
    resumo: "Aviadora pioneira, primeira mulher a atravessar o Atlântico sozinha e símbolo de coragem e exploração.",
    historia: "Amelia Earhart foi uma das primeiras mulheres a se destacar na aviação. Conquistou feitos históricos, como atravessar o Atlântico sozinha, e inspirou mulheres a desafiar limites. Seu desaparecimento durante um voo de circunavegação só aumentou o mistério e a lenda em torno de sua vida, tornando-a símbolo de coragem e exploração.",
  },
];

export default function App() {
  const [selecionada, setSelecionada] = useState(null);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* TOPO PERSONALIZADO (igual à referência) */}
      <section className="relative mx-auto max-w-6xl h-[520px] mt-6">
        {/* Fundo roxo – não ocupa toda a largura */}
        <img
          src="/imagens/topo-fundo.png"
          alt="Fundo tecnológico"
          className="absolute left-0 top-0 h-full w-[68%] object-cover rounded-3xl"
        />
        {/* Ilustração da mulher sobreposta */}
        <img
          src="/imagens/topo-mulher.png"
          alt="Mulher usando notebook"
          className="absolute right-0 bottom-0 h-full object-contain"
        />
        {/* Texto e chips à esquerda */}
        <div className="absolute left-10 top-14 z-10 text-white max-w-[520px]">
          <h1 className="text-5xl font-extrabold leading-[1.1]">
            Mulheres Pioneiras <br /> da Tecnologia
          </h1>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="bg-white/10 backdrop-blur px-5 py-2 rounded-full text-sm font-semibold">Programação</span>
            <span className="bg-white/10 backdrop-blur px-5 py-2 rounded-full text-sm font-semibold">Inovação</span>
            <span className="bg-white/10 backdrop-blur px-5 py-2 rounded-full text-sm font-semibold">Ciência</span>
          </div>
          <p className="mt-6 text-lg leading-relaxed">
            Pioneiras, visionárias e corajosas mulheres que desafiaram barreiras e
            mudaram para sempre o rumo da tecnologia.
          </p>
        </div>
      </section>

      {/* Seção de mulheres */}
      <main className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-36 mx-16">
        {mulheres.map((mulher, index) => (
          <div key={index} className="relative cursor-pointer flex justify-center">
            <img
              src={mulher.foto}
              alt={mulher.nome}
              className="w-72 h-72 object-cover rounded-lg shadow-lg"
            />
            {/* Card centralizado sobre a foto */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-56 bg-white bg-opacity-90 rounded-xl p-4 shadow-md text-center">
              <h2 className="text-lg font-bold text-gray-900">{mulher.nome}</h2>
              <p className="text-gray-700 mt-2 text-sm">{mulher.resumo}</p>
              <button
                onClick={() => setSelecionada(mulher)}
                className="mt-3 bg-pink-500 text-white px-4 py-2 rounded-full text-sm"
              >
                Saiba mais
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Pop-up */}
      {selecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-2xl overflow-y-auto max-h-[80vh]">
            <button
              onClick={() => setSelecionada(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{selecionada.nome}</h2>
            <p className="text-gray-700">{selecionada.historia}</p>
          </div>
        </div>
      )}
    </div>
  );
}
