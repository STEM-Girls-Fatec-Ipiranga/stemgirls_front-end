import { Routes, Route, useLocation, BrowserRouter } from "react-router-dom";

import Home from "./componentes/Home.jsx";
import Comunidades from "./componentes/comunidades/Comunidades.tsx";

import Login from "./componentes/Login.jsx";
import ForgotPasswordPage from "./componentes/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./componentes/ResetPasswordPage.jsx";
import Historia from "./componentes/Historia.jsx";
import SobreNos from "./componentes/SobreNos.jsx";
import MiniMentes from "./componentes/minimentes/MiniMentes.jsx";
import Eventos from "./componentes/Eventos.jsx";
import LoginEmpresa from "./componentes/LoginEmpresa.jsx";
import PerfilUsuario from "./componentes/PerfilUsuario.tsx";
import Canais from "./componentes/Canais.jsx";
import CriarCanal from "./componentes/CriarCanal.jsx";

import React from 'react'
//import CadastroEvento from "./componentes/CadastroEvento.jsx";
//import ListaEventos from "./componentes/ListaEventos.jsx";

import MenuSuperior from "./componentes/MenuSuperior.jsx";
import Rodape from "./componentes/Rodape.jsx";

import { GoogleOAuthProvider } from '@react-oauth/google';
import "./App.css";

function App() {
  const location = useLocation();

  const rotasSemMenu = ["/login", "/esqueci-a-senha", "/redefinir-senha", "/perfil"];
  const mostrarMenu = !rotasSemMenu.some(rota => location.pathname.startsWith(rota));

  const rotasSemRodape = ["/login", "/esqueci-a-senha", "/redefinir-senha", "/perfil"];
  const mostrarRodape = !rotasSemRodape.some(rota => location.pathname.startsWith(rota));

  return (
    <GoogleOAuthProvider clientId="179230958964-5hk3dhg87p16157k6im78eu54j5k1bv6.apps.googleusercontent.com">
      {mostrarMenu && <MenuSuperior />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-empresa" element={<LoginEmpresa />} />

        <Route path="/comunidades" element={<Comunidades />} />
        <Route path="/historia" element={<Historia />} />
        <Route path="/sobre-nos" element={<SobreNos />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/minimentes" element={<MiniMentes />} />
        <Route path="/canais" element={<Canais />} />
        <Route path="/criar-canal" element={<CriarCanal />} />

        <Route path="/esqueci-a-senha" element={<ForgotPasswordPage />} />
        <Route path="/redefinir-senha/:token" element={<ResetPasswordPage />} />  
      </Routes>

      {mostrarRodape && <Rodape />}
  </GoogleOAuthProvider>
  );
}

export default App;

