import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Card({ children, className = "" }) {
  return <div className={`bg-white text-black rounded-xl shadow-md p-6 ${className}`}>{children}</div>;
}

function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition ${className}`}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const videos = [
    { id: 1, title: "Elas Inventam", src: "imagens/minha-historia.mp4", thumbnail: "imagens/carrosel-1.png" },
    { id: 2, title: "Mulheres na Tecnologia", src: "imagens/super-dicas.mp4", thumbnail: "imagens/carrosel-2.png" },
    { id: 3, title: "História das Inovações", src: "imagens/mulheres-tecnologia.mp4", thumbnail: "imagens/carrosel-3.png" },
    { id: 4, title: "STEM Girls", src: "imagens/mulheres-tecnologia.mp4", thumbnail: "imagens/carrosel-4.png" },
  ];

  const communities = [
    { id: 1, group: "Meninas Digitais", image: "imagens/palestrawomakers.jpeg", title: "Palestras Mulheres na Tecnologia", description: "Encontro dinâmico que conecta mulheres apaixonadas por tecnologia." },
    { id: 2, group: "Meninas Digitais", image: "imagens/palestrawomakers.jpeg", title: "Workshop de Programação", description: "Aprenda técnicas de programação com especialistas do setor." },
    { id: 3, group: "Meninas Digitais", image: "imagens/palestrawomakers.jpeg", title: "Mentoria STEM", description: "Receba orientação de profissionais para sua carreira em tecnologia." },
    { id: 4, group: "WoMakers Code", image: "imagens/palestrawomakers.jpeg", title: "Hackathons Criativos", description: "Desafios para desenvolver soluções tecnológicas inovadoras." },
    { id: 5, group: "WoMakers Code", image: "imagens/palestrawomakers.jpeg", title: "Café com Devs", description: "Encontros informais para troca de experiências e networking." },
    { id: 6, group: "WoMakers Code", image: "imagens/palestrawomakers.jpeg", title: "Bootcamp Full Stack", description: "Intensivo de desenvolvimento de software completo para iniciantes." },
  ];

  const team = [
    { name: "Talita Vitória", role: "Product Owner", title: "Designer UX e Dev Full Stack", image: "/imagens/Foto_Talita.jpg" },
    { name: "Kauane Martins", role: "Scrum Master", title: "Designer UX e Dev BD", image: "/imagens/Foto_kauane.jpg" },
    { name: "Ana Clara", role: "Tester", title: "Analista de Qualidade", image: "/imagens/Foto_Ana.jpeg" },
    { name: "Lethicia Ribeiro", role: "Tester", title: "Analista de Documentação", image: "/imagens/Foto_lelet.jpg" },
  ];

  const nextSlide = () => {
    setActive((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setActive((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const getPrevIndex = (current) => (current === 0 ? videos.length - 1 : current - 1);
  const getNextIndex = (current) => (current === videos.length - 1 ? 0 : current + 1);

  return (
    <div className="bg-pink-50 text-gray-800 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto py-10">

        {/* Carrossel */}
        <section className="relative w-full max-w-6xl mx-auto overflow-hidden">
          <div className="flex items-center justify-center relative">
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30 bg-pink-500 p-3 rounded-full shadow-lg hover:bg-pink-600 transition"
            >
              <ChevronLeft className="text-white" />
            </button>
            <div className="flex items-center justify-center relative w-full h-[400px]">
              {videos.map((video, index) => {
                const isActive = index === active;
                const isPrev = index === getPrevIndex(active);
                const isNext = index === getNextIndex(active);
                const xOffset = isActive ? 0 : isPrev ? -200 : isNext ? 200 : 1000 * Math.sign(index - active);
                const scaleValue = isActive ? 1 : 0.75;
                const opacityValue = isActive ? 1 : 0.4;
                const blurClass = isActive ? "" : "blur-md";
                if (!isActive && !isPrev && !isNext) return null;

                return (
                  <motion.div
                    key={video.id}
                    className={`absolute transition-all duration-500 cursor-pointer ${isActive ? "z-20" : "z-10"}`}
                    initial={{ x: xOffset }}
                    animate={{ x: xOffset, scale: scaleValue, opacity: opacityValue }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className={`w-[600px] h-[350px] border-2 border-pink-400 shadow-xl overflow-hidden`}>
                      {isActive ? (
                        <video src={video.src} controls className="w-full h-full object-cover" />
                      ) : (
                        <img src={video.thumbnail} alt={video.title} className={`w-full h-full object-cover ${blurClass}`} />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 bg-pink-500 p-3 rounded-full shadow-lg hover:bg-pink-600 transition"
            >
              <ChevronRight className="text-white" />
            </button>
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === active ? "bg-pink-500 scale-110" : "bg-pink-300 hover:bg-pink-400"}`}
                aria-label={`Ir para o slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <div className="border-b border-pink-200 my-10 max-w-6xl mx-auto"></div>

        {/* Comunidades */}
        <section className="max-w-6xl mx-auto py-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Comunidades</h2>
            <Button onClick={() => navigate("/comunidades")} className="rounded-full text-sm">Saiba mais</Button>
          </div>
          <p className="text-gray-700 mb-6">
            Explore comunidades inspiradoras, participe de eventos e compartilhe conhecimento com outras mulheres apaixonadas por tecnologia.
          </p>
          <h3 className="font-semibold text-gray-800 text-lg mb-4">Meninas Digitais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.filter(c => c.group === "Meninas Digitais").map(c => (
              <Card key={c.id} className="border border-pink-200 shadow-lg p-3">
                <img src={c.image} alt={c.group} className="w-full h-40 object-cover rounded-t-xl" />
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">{c.title}</h4>
                  <p className="text-sm text-gray-600">{c.description}</p>
                </div>
              </Card>
            ))}
          </div>
          <h3 className="font-semibold text-gray-800 text-lg mt-8 mb-4">WoMakers Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.filter(c => c.group === "WoMakers Code").map(c => (
              <Card key={c.id} className="border border-pink-200 shadow-lg p-3">
                <img src={c.image} alt={c.group} className="w-full h-40 object-cover rounded-t-xl" />
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">{c.title}</h4>
                  <p className="text-sm text-gray-600">{c.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="border-b border-pink-200 my-10 max-w-6xl mx-auto"></div>

        {/* Eventos */}
        <section className="max-w-6xl mx-auto py-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Eventos</h2>
            <Button onClick={() => navigate("/eventos")} className="rounded-full text-sm">Saiba mais</Button>
          </div>
          <p className="text-gray-700 mb-6">
            Participe de eventos incríveis, conheça novas ideias e conecte-se com outras mulheres na tecnologia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((id) => (
              <Card key={id} className="border border-pink-200 shadow-lg p-3">
                <img src="/imagens/mulher-importante.png" alt={`Evento ${id}`} className="w-full h-40 object-cover rounded-t-xl" />
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">Evento {id} - Tecnologia e Inclusão</h4>
                  <p className="text-sm text-gray-600">Descrição resumida do evento, com destaque para networking, inovação e aprendizado.</p>
                  <p className="mt-2 text-pink-500 font-semibold">Localidade</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="border-b border-pink-200 my-10 max-w-6xl mx-auto"></div>

        {/* Canais */}
        <section className="max-w-6xl mx-auto py-10 text-center">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Canais</h2>
            <Button onClick={() => navigate("/canais")} className="rounded-full text-sm">Saiba mais</Button>
          </div>
          <p className="text-gray-700 mb-6">
            Descubra canais inspiradores, siga criadores de conteúdo incríveis e fique por dentro das novidades da tecnologia.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-44 text-center">
                <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-pink-300 shadow-md">
                  <img src="/imagens/topo-mulher.png" alt="Mulher usando notebook" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-pink-600">
                    60mil Seguidores
                  </div>
                </div>
                <p className="mt-2 font-bold text-gray-800">@LucianaSantos</p>
                <button className="mt-2 text-pink-600 border border-pink-600 rounded-full px-4 py-1 text-sm">
                  Inscrever-se
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="border-b border-pink-200 my-10 max-w-6xl mx-auto"></div>

        {/* História das Mulheres na TI */}
        <section className="max-w-6xl mx-auto py-10 relative bg-pink-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-10 overflow-hidden">
          <div className="md:w-1/2 relative z-10">
            <h2 className="text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
              Mulheres que Transformaram a Tecnologia
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Conheça trajetórias inspiradoras de mulheres que quebraram barreiras, inovaram e impactaram o mundo da tecnologia. Cada história é uma inspiração para o futuro da ciência e da engenharia!
            </p>
            <Button onClick={() => navigate("/historia")} className="rounded-full">Descubra mais</Button>
          </div>
          <div className="md:w-1/2 relative">
            <img src="/imagens/muleresfortes.png" alt="Pioneiras da Tecnologia" className="w-full h-full object-contain" />
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-pink-300 opacity-20 rounded-full"></div>
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-pink-400 opacity-20 rounded-full"></div>
          </div>
        </section>

        <div className="border-b border-pink-200 my-10 max-w-6xl mx-auto"></div>

        {/* Sobre nós */}
        <section className="max-w-6xl mx-auto py-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Sobre nós</h2>
            <Button onClick={() => navigate("/sobre-nos")} className="rounded-full text-sm">Saiba mais</Button>
          </div>
          <p className="text-gray-700 mb-6">
            Conheça nossa equipe apaixonada por tecnologia, diversidade e inclusão. Nosso objetivo é inspirar e empoderar mulheres na área de TI, tornando o mundo mais conectado e inovador.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <Card key={i} className="border border-pink-200 shadow-lg text-center p-4">
                <img src={member.image} alt={member.name} className="w-28 h-28 rounded-full mx-auto mb-3 object-cover border-4 border-pink-300" />
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-pink-500">{member.role}</p>
                <p className="text-xs text-gray-500">{member.title}</p>
              </Card>
            ))}
          </div>

          {/* Card adicional STEM Girls Fatec Ipiranga */}
          <div className="mt-8">
            <Card className="border border-pink-300 shadow-lg p-6 col-span-full">
              <h3 className="font-bold text-xl mb-3 text-pink-600">Equipe STEM Girls Fatec Ipiranga</h3>
              <p className="text-gray-700 mb-2">
                Em março de 2024 foi criada uma Equipe no Microsoft Teams da Fatec Ipiranga e divulgada para as alunas dos cursos de TI da Fatec, nomeada STEM Girls Fatec Ipiranga. Nessa equipe foi apresentado o projeto Equipe STEM Girls.
              </p>
              <p className="text-gray-700 mb-2">
                A partir da criação do comitê gestor foram realizadas as seguintes atividades: cronograma de reuniões semanais ou quinzenais, proposta e escolha de outro nome, criação de um logo, elaboração do planos de trabalho para cada equipe.
              </p>
              <p className="text-gray-700">
                Reunião presencial para o fechamento do semestre e roda de conversa, na qual foram tratados temas importantes e definidas as próximas ações.
              </p>
            </Card>
          </div>
        </section>

{/* Parceiros - Card moderno com borda afinada e texto atualizado */}
<section className="max-w-6xl mx-auto py-10 text-center">
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-3xl font-bold text-gray-800">Parceiros</h2>
    <Button onClick={() => navigate("/parceiros")} className="rounded-full text-sm">Saiba mais</Button>
  </div>

  <div className="relative bg-purple-200 border-2 border-purple-800 text-purple-900 rounded-xl p-12 shadow-lg max-w-4xl mx-auto overflow-hidden">
    {/* Elementos decorativos tecnológicos */}
    <div className="absolute -top-8 -left-8 w-24 h-24 border-2 border-purple-400 rounded-full opacity-30 animate-pulse"></div>
    <div className="absolute -bottom-10 -right-10 w-32 h-32 border-2 border-purple-500 rounded-full opacity-20 rotate-45"></div>
    <div className="absolute top-1/4 right-0 w-2 h-24 bg-purple-400 opacity-40 rounded-lg rotate-12"></div>
    <div className="absolute bottom-1/3 left-0 w-2 h-20 bg-purple-500 opacity-30 rounded-lg -rotate-12"></div>

    <h3 className="text-3xl font-extrabold mb-4">Seja parceiro da STEM Girls!</h3>
    <p className="mb-6 text-lg leading-relaxed">
      Apoie a presença feminina nas áreas STEM e ajude a transformar o futuro da tecnologia!
    </p>
    <h2 className="text-3xl font-bold mb-4">Quem pode ser parceiro?</h2>
    <p className="text-md font-semibold">
      Empresas, instituições de ensino, embaixadoras, ONGs e projetos sociais podem se tornar parceiros.
    </p>
  </div>
</section>

      </div>
    </div>
  );
}
