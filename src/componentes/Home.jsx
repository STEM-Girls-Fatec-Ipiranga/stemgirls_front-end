import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Importe useNavigate

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
    { id: 1, group: "Meninas Digitais", image: "imagens/palestrawomakers.jpeg", title: "Palestras Mulheres na Tecnologia", description: "Encontro dinâmico que reúne mulheres para.." },
    { id: 2, group: "Meninas Digitais", image: "imagens/palestrawomakers.jpeg", title: "Palestras Mulheres na Tecnologia", description: "Encontro dinâmico que reúne mulheres para.." },
    { id: 3, group: "Meninas Digitais", image: "imagens/palestrawomakers.jpeg", title: "Palestras Mulheres na Tecnologia", description: "Encontro dinâmico que reúne mulheres para.." },
    { id: 4, group: "WoMakers Code", image: "imagens/palestrawomakers.jpeg", title: "Palestras Mulheres na Tecnologia", description: "Encontro dinâmico que reúne mulheres para.." },
    { id: 5, group: "WoMakers Code", image: "imagens/palestrawomakers.jpeg", title: "Palestras Mulheres na Tecnologia", description: "Encontro dinâmico que reúne mulheres para.." },
    { id: 6, group: "WoMakers Code", image: "imagens/palestrawomakers.jpeg", title: "Palestras Mulheres na Tecnologia", description: "Encontro dinâmico que reúne mulheres para.." },
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

  return (
    <div className="bg-pink-50 text-gray-800 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto py-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-pink-600">Mulheres na Tecnologia</h1>
          <p className="mt-2 text-gray-600">Conectando, inspirando e empoderando mulheres na área de TI.</p>
        </header>

        {/* Carrossel Novo */}
        <section className="relative w-full max-w-6xl mx-auto overflow-hidden">
          <div className="flex items-center justify-center relative">
            {/* Botão Esquerda */}
            <button
              onClick={prevSlide}
              className="absolute left-2 z-20 bg-pink-500 p-3 rounded-full shadow-lg hover:bg-pink-600 transition"
            >
              <ChevronLeft className="text-white" />
            </button>

            {/* Slides */}
            <div className="flex items-center justify-center relative w-full h-[400px]">
              {videos.map((video, index) => {
                const isActive = index === active;
                const isPrev = index === (active === 0 ? videos.length - 1 : active - 1);
                const isNext = index === (active === videos.length - 1 ? 0 : active + 1);

                return (
                  <motion.div
                    key={video.id}
                    className={`absolute transition-all duration-500 ${
                      isActive ? "z-20 scale-100 opacity-100" : "z-10 scale-90 opacity-50 blur-sm"
                    }`}
                    animate={{
                      x: isActive ? 0 : isPrev ? -250 : isNext ? 250 : 1000,
                      scale: isActive ? 1 : 0.8,
                      opacity: isActive ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    {isActive ? (
                      <video
                        key={active} // 🔥 força recriação a cada slide
                        src={video.src}
                        controls
                        autoPlay
                        className="w-[600px] h-[350px] object-cover rounded-3xl shadow-xl"
                      />
                    ) : (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-[600px] h-[350px] object-cover rounded-3xl shadow-xl"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Botão Direita */}
            <button
              onClick={nextSlide}
              className="absolute right-2 z-20 bg-pink-500 p-3 rounded-full shadow-lg hover:bg-pink-600 transition"
            >
              <ChevronRight className="text-white" />
            </button>
          </div>
        </section>

        <div className="border-b border-pink-200 my-10 max-w-6xl mx-auto"></div>

        {/* Comunidades */}
        <section className="max-w-6xl mx-auto py-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Comunidades</h2>
            <Button onClick={() => navigate("/comunidades")} className="rounded-full text-sm">
              Saiba mais
            </Button>
          </div>
          <p className="text-gray-700 mb-6">
            Você pode navegar pela aba Comunidades e se divertir com a postagem da sua comunidade predileta,
            descobrir novas comunidades e até mesmo criar e publicar na sua própria!
          </p>
          <h3 className="font-semibold text-gray-800 text-lg mb-4">Meninas Digitais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.filter(c => c.group === "Meninas Digitais").map((community) => (
              <Card key={community.id} className="border border-pink-200 shadow-lg p-3">
                <img src={community.image} alt={community.group} className="w-full h-40 object-cover rounded-t-xl" />
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">{community.title}</h4>
                  <p className="text-sm text-gray-600">{community.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <h3 className="font-semibold text-gray-800 text-lg mt-8 mb-4">WoMakers Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.filter(c => c.group === "WoMakers Code").map((community) => (
              <Card key={community.id} className="border border-pink-200 shadow-lg p-3">
                <img src={community.image} alt={community.group} className="w-full h-40 object-cover rounded-t-xl" />
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">{community.title}</h4>
                  <p className="text-sm text-gray-600">{community.description}</p>
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
            {/* Adicionando o botão de saiba mais para Eventos */}
            <Button onClick={() => navigate("/eventos")} className="rounded-full text-sm">
              Saiba mais
            </Button>
          </div>
          <p className="text-gray-700 mb-6">
            Descubra eventos perto de você, assista ao vivo e divulgue o seu! Faça parte desta jornada de espalhar
            conhecimento pelo mundo.
          </p>
          <div className="grid grid-cols-1 gap-6">
            {[1, 2].map((id) => (
              <Card key={id} className="border border-pink-200 shadow-lg p-0">
                <div className="flex flex-col md:flex-row gap-4">
                  <img src= "/imagens/mulher-importante.png" alt="mulher importante" className="w-full md:w-64 h-auto md:h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-r-none" />
                  <div className="flex-1 p-4">
                    <h3 className="font-bold text-lg mb-2">Congregação da Sociedade Brasileira de Computação (CSBC)</h3>
                    <p className="text-sm text-gray-600">
                      CSBC 2024, evento que tem como objetivo fomentar o acesso à informação e cultura por
                      meio da informática, promover a inclusão digital, incentivar a pesquisa e o ensino em
                      computação no Brasil e contribuir para a formação do...
                    </p>
                    <p className="mt-2 text-pink-500 font-semibold">São Paulo</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="border-b border-pink-200 my-10 max-w-6xl mx-auto"></div>

        {/* Canais */}
        <section className="max-w-6xl mx-auto py-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Canais</h2>
            {/* Adicionando o botão de saiba mais para Canais */}
            <Button onClick={() => navigate("/canais")} className="rounded-full text-sm">
              Saiba mais
            </Button>
          </div>
          <p className="text-gray-700 mb-6">
            Você pode navegar pela aba Comunidades e se divertir com a postagem da sua comunidade predileta,
            descobrir novas comunidades e até mesmo criar e publicar na sua própria!
          </p>
          <div className="flex gap-6 overflow-x-auto p-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-44 text-center">
                <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-pink-300 shadow-md">
                  <img  src="/imagens/topo-mulher.png" alt="Mulher usando notebook" className="w-full h-full object-cover" />
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
        <section className="max-w-6xl mx-auto py-10 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-gray-800">
                História<br />das mulheres<br />na TI
              </h2>
            </div>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Você conhece ou já ouviu falar sobre alguma mulher importante na T.I.? As mulheres têm papéis importantes
              no âmbito da tecnologia há muitos anos, mas não ganham o devido destaque por suas ações. É importante que
              as pessoas saibam da trajetória e do papel importante que muitas mulheres têm na história da tecnologia.
            </p>
            <Button onClick={() => navigate("/historia")} className="mt-6 rounded-full">
              Saber mais
            </Button>
          </div>
          <div className="md:w-1/2 relative">
            <img src="/imagens/muleresfortes.png" alt="Pioneiras da Tecnologia" className="w-full h-full object-contain" />
          </div>
        </section>

        <div className="border-b border-pink-200 my-10 max-w-6xl mx-auto"></div>

        {/* Sobre nós */}
        <section className="max-w-6xl mx-auto py-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Sobre nós</h2>
            <Button onClick={() => navigate("/sobre-nos")} className="rounded-full text-sm">
              Saiba mais
            </Button>
          </div>
          <p className="text-gray-700 mb-6">
            Conheça um pouco mais sobre a nossa equipe. Estamos trabalhando duro para tornar o mundo um lugar melhor!
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
        </section>
      </div>
    </div>
  );
}