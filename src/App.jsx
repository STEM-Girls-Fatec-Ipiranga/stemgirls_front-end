import { Routes, Route, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ArrowUp, Import } from "lucide-react";

import Home from "./componentes/Home.jsx";
import Comunidades from "./componentes/comunidades/Comunidades.tsx";
import Login from "./componentes/Login.jsx";
import ForgotPasswordPage from "./componentes/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./componentes/ResetPasswordPage.jsx";
import Historia from "./componentes/Historia.jsx";
import SobreNos from "./componentes/SobreNos.jsx";
import MiniMentes from "./componentes/minimentes/MiniMentes.jsx";
import Eventos from "./componentes/eventos/Eventos.jsx";
import ImportarVideos from "./componentes/eventos/CadastroEventos.jsx";
import LoginEmpresa from "./componentes/LoginEmpresa.jsx";
import PerfilUsuario from "./componentes/PerfilUsuario.tsx";
import Canais from "./componentes/canais/Canais.jsx";
import Parceiros from "./componentes/Parceiros.tsx";
import Quiz from "./componentes/minimentes/Quiz.jsx";
import TermosDeUso from "./componentes/TermosDeUso.jsx";
import PerfilEmpresa from "./componentes/PerfilEmpresa.tsx";
import Robo from "./componentes/Robo.jsx";

import MenuSuperior from "./componentes/MenuSuperior.jsx";
import Rodape from "./componentes/Rodape.jsx";
import CriarCanais from "./componentes/canais/CriarCanais.jsx";
import PostarVideos from "./componentes/canais/PostarVideos.jsx";


import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";

function AppContent() {
  const location = useLocation();

  // controla se o botão deve aparecer
  const [mostrarBotao, setMostrarBotao] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setMostrarBotao(window.scrollY > 300); // aparece depois de 300px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rotasSemMenu = ["/login", "/esqueci-a-senha", "/redefinir-senha", "/perfil", "/termos-de-uso"];
  const mostrarMenu = !rotasSemMenu.some((rota) => location.pathname.startsWith(rota));

  const rotasSemRodape = ["/login", "/esqueci-a-senha", "/redefinir-senha", "/perfil", "/termos-de-uso"];
  const mostrarRodape = !rotasSemRodape.some((rota) => location.pathname.startsWith(rota));

  return (
    <GoogleOAuthProvider clientId="179230958964-5hk3dhg87p16157k6im78eu54j5k1bv6.apps.googleusercontent.com">
      {mostrarMenu && <MenuSuperior />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
        <Route path="/login-empresa" element={<LoginEmpresa />} />
        <Route path="/comunidades" element={<Comunidades />} />
        <Route path="/historia" element={<Historia />} />
        <Route path="/sobre-nos" element={<SobreNos />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/perfil-empresa" element={<PerfilEmpresa />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/minimentes" element={<MiniMentes />} />
        <Route path="/canais" element={<Canais />} />
        <Route path="/parceiros" element={<Parceiros />} />
        <Route path="/esqueci-a-senha" element={<ForgotPasswordPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/criar-canais" element={<CriarCanais />} />
        <Route path="/postar-videos" element={<PostarVideos />} />
        <Route path="/redefinir-senha/:token" element={<ResetPasswordPage />} />
      </Routes>

      {/* Botão de voltar ao topo */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 bg-pink-500 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg text-2xl hover:bg-pink-600 transition-opacity duration-300 ${
          mostrarBotao ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 9999 }}
      >
        <ArrowUp size={22} strokeWidth={2.5} />
      </button>

      {mostrarRodape && <Rodape />}
    </GoogleOAuthProvider>
  );
}


export default function App() {
  return <AppContent />;
}
