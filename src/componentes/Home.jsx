import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Tumb1 from "../assets/img/minha-historia-thumb.png";
import Tumb2 from "../assets/img/mulheres-tecnologia-thumb.png";
import Thumb3 from "../assets/img/super-dicas-thumb.png";
import Robo from "./Robo.jsx";

function Card({ children, className = "" }) {
  return <div className={`bg-white text-black shadow-md p-6 rounded-lg ${className}`}>{children}</div>;
}

function Button({ children, onClick, className = "" }) {
  // Botão que chama a função recebida e garante um scrollTo(0) após navegação
  const handleClick = (e) => {
    if (typeof onClick === "function") onClick(e);
    // pequeno delay para garantir que a rota foi trocada em SPA antes de rolar ao topo
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 60);
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-[#F36EC0] text-white font-bold px-8 py-2 rounded-full text-[16px] hover:bg-pink-500 transition ${className}`}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();

  // ----------------------- CARROSSEL -----------------------
  const slides = [
    { id: 1, type: "video", src: "imagens/mulheres-tecnologia.mp4", alt: "Evolução" },
    { id: 2, type: "video", src: "imagens/super-dicas.mp4", poster: Thumb3, alt: "Super Dicas" },
    { id: 3, type: "video", src: "imagens/mulheres-tecnologia.mp4", poster: Tumb2, alt: "Mulheres na Tecnologia" },
    { id: 4, type: "video", src: "imagens/minha-historia.mp4", poster: Tumb1, alt: "Minha História" },
    { id: 5, type: "video", src: "imagens/super-dicas.mp4", poster: Thumb3, alt: "Estudos" },
  ];

  const centerIndex = Math.floor(slides.length / 2);
  const [active, setActive] = useState(centerIndex);

  // Não reatribuir itemRefs.current em cada render (bug). Use ref e callback push único.
  const itemRefs = useRef([]);
  const videoRefs = useRef([]);

  // callback ref para evitar duplicação
  const addToRefs = (el) => {
    if (!el) return;
    if (!itemRefs.current.includes(el)) {
      itemRefs.current.push(el);
    }
  };

  const addVideoRef = (el) => {
    if (!el) return;
    if (!videoRefs.current.includes(el)) {
      videoRefs.current.push(el);
    }
  };

  const scrollToActive = (index, behavior = "smooth") => {
    const el = itemRefs.current[index];
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({
        inline: "center",
        behavior,
        block: "nearest",
      });
    }
  };

  useEffect(() => {
    // centraliza o slide ativo na primeira vez sem animação
    const t = setTimeout(() => scrollToActive(active, "auto"), 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToActive(active, "smooth");
  }, [active]);

  // Pausa todos os vídeos exceto o ativo
  const pauseAllVideos = () => {
    videoRefs.current.forEach((video) => {
      if (video && !video.paused) video.pause();
    });
  };

  // Pausa os outros vídeos quando um começa a tocar
  const handlePlay = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (i !== index && video && !video.paused) video.pause();
    });
  };

  const prev = () => {
    pauseAllVideos();
    setActive((p) => (p === 0 ? slides.length - 1 : p - 1));
  };

  const next = () => {
    pauseAllVideos();
    setActive((p) => (p === slides.length - 1 ? 0 : p + 1));
  };

  // Estiliza scrollbar apenas localmente criando estilo uma vez
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .custom-scroll::-webkit-scrollbar { height: 8px; }
      .custom-scroll::-webkit-scrollbar-track { background: #ffe6ef; border-radius: 10px; }
      .custom-scroll::-webkit-scrollbar-thumb { background: #ff66b2; border-radius: 10px; }
      .custom-scroll::-webkit-scrollbar-thumb:hover { background: #ff3399; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Dados das seções
  const communities = [
    { id: 1, group: "Meninas Digitais", image: "imagens/evolucao.png", title: "Palestras Mulheres na Tecnologia", description: "Encontro dinâmico que conecta mulheres apaixonadas por tecnologia." },
    { id: 2, group: "Meninas Digitais", image: "imagens/palestrawomakers.jpeg", title: "Workshop de Programação", description: "Aprenda técnicas de programação com especialistas do setor." },
    { id: 3, group: "Meninas Digitais", image: "imagens/meninasdigitaisreuniao.jpeg", title: "Mentoria STEM", description: "Receba orientação de profissionais para sua carreira em tecnologia." },
    { id: 4, group: "WoMakers Code", image: "imagens/techwoman.jpeg", title: "Hackathons Criativos", description: "Desafios para desenvolver soluções tecnológicas inovadoras." },
    { id: 5, group: "WoMakers Code", image: "imagens/muleresTI.webp", title: "Café com Devs", description: "Encontros informais para troca de experiências e networking." },
    { id: 6, group: "WoMakers Code", image: "imagens/meninas-digitais.jpeg", title: "Bootcamp Full Stack", description: "Intensivo de desenvolvimento de software completo para iniciantes." },
  ];

  const team = [
    { name: "Talita Vitória", role: "Product Owner", title: "Designer UX e Dev Full Stack", image: "/imagens/Foto_Talita.jpg" },
    { name: "Kauane Martins", role: "Scrum Master", title: "Designer UX e Dev Full Stack", image: "/imagens/Foto_kauane.jpg" },
    { name: "Ana Clara", role: "Product Maker", title: "Analista de Qualidade", image: "/imagens/Foto_Ana.jpeg" },
    { name: "Lethicia Ribeiro", role: "Analista de Documentação", title: "Analista de Qualidade", image: "/imagens/Foto_lelet.jpg" },
  ];

  const canais = [
    { nome: "@KauaneDev", seguidores: "60mil Seguidores", img: "/imagens/Foto_kauane.jpg" },
    { nome: "@LethiciaTech", seguidores: "59mil Seguidores", img: "/imagens/Foto_lelet.jpg" },
    { nome: "@TalitaCode", seguidores: "60mil Seguidores", img: "/imagens/Foto_Talita.jpg" },
    { nome: "@AnaTech", seguidores: "39mil Seguidores", img: "/imagens/Foto_Ana.jpeg" },
  ];

  return (
    <div className="bg-pink-50 text-gray-800 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4">
        {/* ====== CARROSSEL ====== */}
        <section className="relative w-full max-w-6xl mx-auto overflow-hidden">
          <div className="flex items-center justify-center relative">
            {/* Botão anterior */}
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30 bg-pink-500 p-3 rounded-full shadow-lg hover:bg-pink-600 transition"
            >
              <ChevronLeft className="text-white" />
            </button>

            {/* Container do carrossel */}
            <div className="w-full flex items-center justify-center overflow-x-hidden">
              <div className="flex items-center gap-6 py-6 px-4">
                {slides.map((s, i) => {
                  const dist = Math.abs(i - active);

                  // Aplica borda somente no slide central (ativo)
                  const borderClass = dist === 0 ? "border-4 border-pink-400 " : "border-0";

                  // escala/opacity para efeito visual
                  let scaleStyle = dist === 0 ? "scale-105 opacity-100" : dist === 1 ? "scale-90 opacity-70 blur-sm" : "scale-75 opacity-30 blur-sm pointer-events-none";

                  return (
                    <div
                      key={s.id}
                      ref={addToRefs}
                      onClick={() => {
                        pauseAllVideos();
                        setActive(i);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Slide ${i + 1}`}
                      className={`snap-center flex-shrink-0 w-[600px] h-[350px] transform transition-all duration-500 overflow-hidden shadow-xl ${borderClass} ${scaleStyle}`}
                      style={{
                        transform: dist === 0 ? "translateY(-10px) scale(1.05)" : "translateY(0) scale(1)",
                      }}
                    >
                      <div className={`w-full h-full transition-all duration-500 transform origin-center`}>
                        <video
                          ref={addVideoRef}
                          src={s.src}
                          poster={s.poster}
                          muted
                          loop
                          playsInline
                          controls
                          onPlay={() => handlePlay(i)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={next}
              aria-label="Próximo"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 bg-pink-500 p-3 rounded-full shadow-lg hover:bg-pink-600 transition"
            >
              <ChevronRight className="text-white" />
            </button>
          </div>
        </section>
        {/* ====== FIM CARROSSEL ====== */}

        {/* Comunidades */}
        <section className="max-w-6xl mx-auto py-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Comunidades</h2>
            <Button onClick={() => navigate("/comunidades")} className="rounded-full text-sm bg-[#F36EC0]">
              Saiba mais
            </Button>
          </div>
          <p className="text-gray-700 mb-6">
            Explore comunidades inspiradoras, participe de eventos e compartilhe conhecimento com outras mulheres apaixonadas por tecnologia.
          </p>

          <h3 className="font-semibold text-gray-800 text-lg mb-4">Meninas Digitais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.filter(c => c.group === "Meninas Digitais").map(c => (
              <Card
                key={c.id}
                className="border border-pink-200 shadow-lg hover:shadow-pink-200 hover:-translate-y-1 hover:scale-105 transition-all duration-300 p-0 o"
              >
                <img src={c.image} alt={c.group} className="w-full h-40 object-cover rounded" />
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
              <Card
                key={c.id}
                className="border border-pink-200 shadow-lg hover:shadow-pink-200 hover:-translate-y-1 hover:scale-105 transition-all duration-300 p-0 overflow-hidden"
              >
                <img src={c.image} alt={c.group} className="w-full h-40 object-cover rounded-t-2xl" />
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
            <Button onClick={() => navigate("/eventos")} className="rounded-full text-sm bg-[#F36EC0]">
              Saiba mais
            </Button>
          </div>

          <p className="text-gray-700 mb-6">
            Participe de eventos incríveis, conheça novas ideias e conecte-se com outras mulheres na tecnologia.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: "/imagens/meninas-digitais.jpeg", titulo: "Tecnologia e Inclusão", local: "São Paulo - SP" },
              { img: "/imagens/mulher-importante.png", titulo: "Programação", local: "Belo Horizonte - MG" },
              { img: "/imagens/mulheres-tecnologia.jpg", titulo: "Conferência", local: "Porto Alegre - RS" },
              { img: "/imagens/techwoman.jpeg", titulo: "Hackathon para Elas", local: "Recife - PE" },
            ].map((evento, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.07 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="cursor-pointer"
              >
                <Card className="border border-pink-200 shadow-lg p-3 hover:shadow-xl transition-shadow duration-300 h-[380px] flex flex-col justify-between ">
                  <div>
                    <motion.img
                      src={evento.img}
                      alt={evento.titulo}
                      className="w-full h-40 object-cover rounded"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2">{evento.titulo}</h4>
                      <p className="text-sm text-gray-600">
                        resumo do evento, com destaque para networking, inovação e aprendizado.
                      </p>
                    </div>
                  </div>
                  <div className="px-4 pb-3">
                    <p className="text-pink-500 font-semibold">{evento.local}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="border-b border-pink-200 my-10 max-w-6xl mx-auto"></div>

       {/* Canais */}
<section className="w-full bg-[#FFEFF7] py-12">
  <div className="max-w-6xl mx-auto">

    {/* Título */}
   <div className="flex justify-between items-center mb-4 w-full">
  <h2 className="text-3xl font-bold text-gray-800">Canais</h2>

  <Button
    onClick={() => navigate("/canais")}
    className="rounded-full text-sm bg-[#F36EC0]"
  >
    Saiba mais
  </Button>
</div>


    {/* Texto */}
    <p className="text-gray-800 max-w-3xl mb-10">
      Você pode navegar pela aba Comunidades e se divertir com a postagem da sua comunidade predileta,
      descobrir novas comunidades e até mesmo criar e publicar na sua própria!
    </p>

    {/* Lista de Canais */}
    <div className="flex flex-wrap gap-6 justify-start">

      {canais.map((canal, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
          className="w-60 bg-[#fff6ff] rounded-xl p-4 shadow-sm cursor-pointer border border-pink-300"
        >
          {/* Card interno */}
          <div className="flex items-center gap-3">

            {/* Foto */}
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-300">
              <img
                src={canal.img}
                alt={canal.nome}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Texto */}
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">{canal.nome}</p>
              <p className="text-xs text-gray-700">{canal.seguidores}</p>
            </div>

          </div>

          {/* Botão */}
          <button
            className="mt-3 w-full bg-pink-400 text-white text-sm py-1 rounded-full hover:bg-pink-700 transition"
          >
            Inscrever-se
          </button>
        </motion.div>
      ))}

    </div>
  </div>
</section>

        <div className="border-b border-pink-200 my-10 max-w-6xl mx-auto"></div>

        {/* MiniMentes (nova sessão conforme imagem) */}
        <section className="max-w-6xl mx-auto py-10">
         <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold ">MiniMentes</h2>
           </div>
           <p className="text-gray-700 mb-6"> O MiniMentes é uma sessão desenvolvida para apoiar quem está dando os primeiros 
            passos no mundo da tecnologia.</p>
          <div className="bg-white rounded-3xl shadow-xl border border-pink-300 p-10 relative flex flex-col md:flex-row items-center gap-6">
           
            <div className="md:w-2/3">
              <h2 className="text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                Venha conhecer o <span className="text-purple-600">MiniMentes</span>
              </h2>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                Aqui você tem atividades interativas, quizzes, vídeos educativos, e uma experiência de aprendizado incrível!!
              </p>
              <Button onClick={() => navigate("/minimentes")} className="rounded-full text-sm bg-[#F36EC0]">Saiba mais</Button>
            </div>
            <div className="md:w-1/3 flex justify-center">

              
                 <div className="">
                     <Robo/>
                 </div>
              
              
            </div>
          </div>
        </section>

        <div className="border-b border-pink-200 my-10 max-w-6xl mx-auto"></div>

        {/* Sobre nós */}
        <section className="max-w-6xl mx-auto py-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Sobre nós</h2>
            <Button onClick={() => navigate("/sobre-nos")} className="rounded-full text-sm bg-[#F36EC0]">Saiba mais</Button>
          </div>
          <p className="text-gray-700 mb-6">
            Conheça nossa equipe apaixonada por tecnologia, diversidade e inclusão. Nosso objetivo é inspirar e empoderar mulheres na área de TI.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <Card
                key={i}
                className="border border-pink-200 shadow-lg text-center p-4 hover:-translate-y-1 hover:scale-105 hover:shadow-pink-200 transition-all duration-300"
              >
                <img src={member.image} alt={member.name} className="w-28 h-28 rounded-full mx-auto mb-3 object-cover border-4 border-pink-300" />
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-pink-500">{member.role}</p>
                <p className="text-xs text-gray-500">{member.title}</p>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Card adicional STEM Girls Fatec Ipiranga */}
<div className="mt-8 flex justify-center">
  <Card
    className="
      border border-pink-300 shadow-lg p-6
      hover:-translate-y-1 hover:scale-105 hover:shadow-pink-200
      transition-all duration-300
      w-[1150px]">

    <h3 className="font-bold text-xl mb-3 text-pink-600">
      Equipe STEM Girls Fatec Ipiranga
    </h3>

    <p className="text-gray-700 mb-2">
      Em março de 2024 foi criada uma Equipe no Microsoft Teams da Fatec
      Ipiranga e divulgada para as alunas dos cursos de TI da Fatec, nomeada
      STEM Girls Fatec Ipiranga. Nessa equipe foi apresentado o projeto
      Equipe STEM Girls.
    </p>

    <p className="text-gray-700 mb-2">
      A partir da criação do comitê gestor foram realizadas as seguintes
      atividades: cronograma de reuniões semanais ou quinzenais, proposta
      e escolha de outro nome, criação de um logo, elaboração de um plano
      de trabalho para cada equipe.
    </p>

    <p className="text-gray-700">
      Reunião presencial para o fechamento do semestre e roda de conversa,
      na qual foram tratados temas importantes e definidas as próximas ações.
    </p>
  </Card>
</div>

<div className="border-b border-pink-200 my-10 max-w-6xl mx-auto"></div>

{/* História das Mulheres na TI */}
<section className="max-w-6xl mx-auto py-10 relative bg-pink-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-10 overflow-hidden">

  <div className="md:w-1/2 relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
    <h2 className="text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
      Mulheres que Transformaram a Tecnologia
    </h2>

    <p className="text-gray-700 mb-6 leading-relaxed">
      Conheça trajetórias inspiradoras de mulheres que quebraram barreiras,
      inovaram e impactaram o mundo da tecnologia. Cada história é uma
      inspiração para o futuro da ciência e da engenharia!
    </p>

    <Button onClick={() => navigate("/historia")} className="rounded-full px-6 py-3 bg-[#F36EC0]">
      Saiba mais
    </Button>
  </div>

  <div className="md:w-1/2 relative flex justify-center">
    <img
      src="/imagens/muleresfortes.png"
      alt="Pioneiras da Tecnologia"
      className="w-full h-full object-contain relative z-10"
    />

    {/* Elementos de fundo restritos à div da imagem */}
    <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 opacity-20 rounded-full overflow-hidden"></div>
    <div className="absolute top-0 left-0 w-64 h-64 bg-pink-400 opacity-20 rounded-full overflow-hidden"></div>
  </div>

</section>





        <div className="border-b border-pink-200 my-10 max-w-6xl mx-auto"></div>

        {/* Parceiros */}
        <section className="max-w-6xl mx-auto py-10 text-center">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold ">Parceiros</h2>
            <Button onClick={() => navigate("/parceiros")} className="rounded-full text-sm bg-[#F36EC0] text-white hover:bg-pink-700">
              Saiba mais
            </Button>
          </div>

          <div className="relative bg-pink-100 border border-pink-400 rounded-xl p-12 shadow-lg max-w-4xl mx-auto overflow-hidden">
            <h3 className="text-3xl font-bold text-pink-600 mb-4 leading-tight">Seja parceiro da STEM Girls!</h3>
            <p className="mb-6 text-lg text-black leading-relaxed">
              Apoie a presença feminina nas áreas STEM e ajude a transformar o futuro da tecnologia!
            </p>
            <h2 className="text-2xl font-bold text-pink-600 mb-4 leading-tight">Quem pode ser parceiro?</h2>
            <p className="text-md text-black leading-relaxed">
              Empresas, instituições de ensino, embaixadoras, ONGs e projetos sociais podem se tornar parceiros.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
