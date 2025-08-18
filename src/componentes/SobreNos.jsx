import { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaComments, FaLaptopCode, FaHandPointer } from "react-icons/fa";

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
    <div className="bg-gray-100 text-gray-800 px-6 py-16 font-sans">
      {/* Seção Nossa Equipe */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Nossa equipe</h2>
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-12">
          {/* Carrossel */}
          <div className="relative w-full md:w-1/2 mb-8 md:mb-0">
            <div className="w-full h-80 bg-gray-300 rounded-2xl overflow-hidden shadow-xl">
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
          <div className="w-full md:w-1/2 text-center md:text-left">
            <p className="text-gray-600 leading-relaxed mb-4">
              Em março de 2024 foi criada uma Equipe no Microsoft Teams da Fatec Ipiranga e divulgada para as alunas dos cursos de TI da Fatec, nomeada STEM Girls Fatec Ipiranga. Nessa equipe foi apresentado o projeto.
            </p>
            <p className="text-gray-600 leading-relaxed">
              A partir da criação do comitê gestor foram realizadas as seguintes atividades: cronograma de reuniões semanais ou quinzenais, proposta e escolha de outro nome, criação de um logo, elaboração dos planos de trabalho para cada equipe.
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
    </div>
  );
}