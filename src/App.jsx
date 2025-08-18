import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./componentes/Home.jsx";
import Comunidades from "./componentes/comunidades/Comunidades.jsx";

import Login from "./componentes/Login.jsx"; // Adicione .jsx
import ForgotPasswordPage from "./componentes/ForgotPasswordPage.jsx"; // Adicione .jsx
import ResetPasswordPage from "./componentes/ResetPasswordPage.jsx"; // Adicione .jsx
import Historia from "./componentes/Historia.jsx"; // Corrigido: primeira letra maiúscula
import Eventos from "./componentes/Eventos.jsx";
import SobreNos from "./componentes/SobreNos.jsx";

import MenuSuperior from "./componentes/MenuSuperior.jsx"; // Adicione .jsx

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import "./App.css";


function App() {
  const location = useLocation();

  const rotasSemMenu = ["/login", "/esqueci-a-senha", "/redefinir-senha"];
  const mostrarMenu = !rotasSemMenu.some(rota => location.pathname.startsWith(rota));

  return (
    <GoogleOAuthProvider clientId="179230958964-5hk3dhg87p16157k6im78eu54j5k1bv6.apps.googleusercontent.com">
      {mostrarMenu && <MenuSuperior />}



      {/* <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-a-senha" element={<ForgotPasswordPage />} />
        <Route path="/redefinir-senha/:token" element={<ResetPasswordPage />} />

      </Routes> */}


      {/* O componente <Routes> funciona como um contêiner para todas as suas rotas. */}
      <Routes>
        
        {/* Rota para a página de Login. Será exibida na raiz "/" e em "/login" */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/comunidades" element={<Comunidades />} />

        {/* Rota para a página de História */}
        <Route path="/Historia" element={<Historia />} />

        {/* Rota para a página de Eventos */}
        <Route path="/Eventos" element={<Eventos />} />

        {/* Rota para a página de Sobre Nós */}
        <Route path="/SobreNos" element={<SobreNos />} />

        {/* Rota para a página "Esqueci a Senha". É esta que vai corrigir o seu problema! */}
        <Route path="/esqueci-a-senha" element={<ForgotPasswordPage />} />

        {/* Rota para a página de redefinir a senha (já deixando pronta para o futuro) */}
        <Route path="/redefinir-senha/:token" element={<ResetPasswordPage />} />

        {/* Você pode adicionar outras rotas do seu aplicativo aqui */}

      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
