import { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaComments, FaLaptopCode, FaHandPointer } from "react-icons/fa";
import fundoSG from "../assets/img/FundoSGcolorido.jpg";

import FotoTalita from "../assets/img/Foto_Talita.jpg";
import FotoKauane from "../assets/img/Foto_Kauane.jpg";
import FotoAna from "../assets/img/Foto_Ana.jpeg";
import FotoLethicia from "../assets/img/Foto_lelet.jpg";

export default function SobreNos() {
  const [current, setCurrent] = useState(0);
  const fotos = ["/imagens/amelia.jpg", "/imagens/simone.jpg", "/imagens/ada-lovelace.jpg"];
  const [flipped, setFlipped] = useState(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % fotos.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + fotos.length) % fotos.length);
  };

  const membros = [
    {
      nome: "Talita Vitória",
      cargo: "Product Owner",
      descricao: "Designer UX e Dev Full Stack",
      foto: FotoTalita,
    },
    {
      nome: "Kauane Martins",
      cargo: "Scrum Master",
      descricao: "Designer UX e Dev BD",
      foto: FotoKauane,
    },
    {
      nome: "Ana Clara",
      cargo: "Tester",
      descricao: "Analista de Qualidade",
      foto: FotoAna,
    },
    {
      nome: "Lethicia Ribeiro",
      cargo: "Tester",
      descricao: "Analista de Documentação",
      foto: FotoLethicia,
    },
  ];

  const empresaCards = [
    {
      titulo: "Missão",
      texto: "Despertar o interesse de meninas para seguirem carreira em Tecnologia da Informação e Comunicação"
    },
    {
      titulo: "Visão",
      texto: "Ser referência na América Latina em equidade de gênero nas carreiras de Tecnologia da Informação e Comunicação"
    },
    {
      titulo: "Valores",
      texto: "Inclusão, respeito, inovação e colaboração."
    }
  ];

  const cards = [
    {
      icon: <FaUsers size={32} className="text-white" />,
      front: "Propor e realizar a integração das mulheres dos três cursos de TI da Fatec Ipiranga",
      back: "Nosso objetivo é unir alunas de todos os cursos de TI, promovendo interação e fortalecimento da comunidade feminina.",
      color: "bg-purple-600"
    },
    {
      icon: <FaComments size={32} className="text-white" />,
      front: "Criar um canal de comunicação sobre igualdade de gênero no mercado de trabalho",
      back: "Queremos abrir espaço para discussões sobre diversidade, inclusão e desafios enfrentados por mulheres em TI.",
      color: "bg-purple-600"
    },
    {
      icon: <FaLaptopCode size={32} className="text-white" />,
      front: "Propor ações para aumentar o número de mulheres nos cursos de TI da Fatec Ipiranga",
      back: "Planejamos campanhas e projetos para incentivar mais mulheres a ingressarem e permanecerem na área de tecnologia.",
      color: "bg-purple-600"
    },
  ];

  return (
    <div className="max-w-full bg-pink-50 text-gray-800 py-16 font-sans">
      {/* Seção Nossa Equipe */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">STEM Girls</h2>
        <p className="m-10 text-[18px]">Em março de 2024 foi criada uma Equipe no Microsoft Teams da Fatec Ipiranga e divulgado para as alunas dos cursos de TI da Fatec, nomeada STEM Girls Fatec Ipiranga. Nessa equipe foi apresentado o projeto</p>
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-12">

          {/* Carrossel */}
          <div className="relative w-full md:w-1/2 mb-8 md:mb-0">
            <div className="w-full h-90 bg-gray-300 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={fotos[current]}
                alt="Equipe"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full shadow-md hover:bg-opacity-70 transition-colors"
            >
              {"<"}
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full shadow-md hover:bg-opacity-70 transition-colors"
            >
              {">"}
            </button>
          </div>

          {/* Texto equipe */}
          <div className="w-full md:w-1/2 text-center md:text-left text-[18px] mt-10">
            <p className="leading-relaxed mb-4">
              A partir da criação do comitê gestor foram realizadas as seguintes atividades: cronograma de reuniões semanais ou quinzenais, proposta e escolha de outro nome, criação de um logo, elaboração do planos de trabalho para cada equipe.
            </p>
            <br />
            <p className="leading-relaxed">
              Reunião presencial para o fechamento do semestre e roda de conversa, na qual foram tratados temas importantes e definidas as próximas ações.
            </p>
          </div>
        </div>
      </div>

      {/* Seção de Objetivos */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Objetivos</h2>
        <p className="text-center text-gray-500 mb-12">O que a nossa equipe pretende fazer?</p>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              onClick={() => setFlipped(flipped === index ? null : index)}
              className="cursor-pointer relative transform transition-transform duration-300 hover:scale-105 perspective"
            >
              {/* Indicação de interação */}
              <div className="absolute top-4 right-4 z-20 text-white animate-pulse">
                <FaHandPointer size={20} />
              </div>

              <motion.div
                animate={{ rotateY: flipped === index ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className={`relative w-full h-80 rounded-2xl shadow-lg flex items-center justify-center p-6 ${card.color}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Frente */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                  style={{ backfaceVisibility: "hidden" }}>
                  {card.icon}
                  <p className="mt-4 text-white font-medium text-lg leading-snug">{card.front}</p>
                </div>

                {/* Verso */}
                <div
                  className="absolute inset-0 flex items-center justify-center p-6 text-center bg-white rounded-2xl"
                  style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                >
                  <p className="text-gray-700 leading-relaxed">{card.back}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Seção de vídeo */}
      <div className="mt-[80px] h-[600px] justify-center mx-auto flex flex-col items-center">
        <h2 className="text-3xl mb-12 font-bold text-center text-gray-800 mb-2">Apresentação</h2>
        <div className="w-[70%] h-[70%] text-center bg-gray-300 rounded-[20px]">video</div>
      </div>


      {/* Seção Missão Visão e Valores */}
      <section className="mt-[80px] mb-[80px]">
        <h2 className="text-3xl mb-12 font-bold text-center text-gray-800">
          Empresa
        </h2>
        <div
          className="bg-gray-400 bg-cover bg-center max-w-full h-[600px] flex items-center justify-center shadow-[inset_0_0_27px_4px_rgba(0,0,0,0.6)]"
          style={{ backgroundImage: `url(${fundoSG})` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-[85%] h-[60%] place-items-center">
            {empresaCards.map((card, i) => (
              <div key={i} className="group [perspective:1000px]">
                <div className="relative w-[350px] h-[350px] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                  {/* Frente */}
                  <div className="absolute inset-0 flex items-center justify-center bg-white border border-purple-600 shadow-md rounded-[25px] [backface-visibility:hidden]">
                    <h3 className="text-xl font-bold text-purple-700">
                      {card.titulo}
                    </h3>
                  </div>

                  {/* Verso */}
                  <div className="absolute inset-0 flex items-center justify-center bg-white text-gray-800 p-4 rounded-[25px] [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p className="text-center text-[20px]">{card.texto}</p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Nossa equipe */}

      <section className="bg-pink-50 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nossa equipe de desenvolvimento
          </h2>
          <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
            Para melhoras nossa conexão e nos aproximar, conheça um pouco mais
            sobre a equipe que desenvolveu a plataforma!
          </p>

          {/* Grid de membros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {membros.map((membro, index) => (
              <div
                key={index}
                className="bg-white border border-purple-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center"
              >
                <img
                  src={membro.foto}
                  alt={membro.nome}
                  className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-purple-400"
                />
                <h3 className="text-lg font-bold text-gray-900">
                  {membro.nome}
                </h3>
                <p className="text-sm text-gray-600">{membro.cargo}</p>
                <p className="text-sm text-gray-500">{membro.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section>
        <h2 className="text-3xl mb-12 font-bold text-center text-gray-800">
          Equipe de desenvolvimento
        </h2>



      </section> */}

    </div>
  );
}
