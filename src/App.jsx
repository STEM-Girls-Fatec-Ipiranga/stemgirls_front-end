import { Routes, Route } from "react-router-dom";

import Home from "./componentes/Home.jsx";
import Login from "./componentes/Login.jsx"; // Adicione .jsx
import ForgotPasswordPage from "./componentes/ForgotPasswordPage.jsx"; // Adicione .jsx
import ResetPasswordPage from "./componentes/ResetPasswordPage.jsx"; // Adicione .jsx

import MenuSuperior from "./componentes/MenuSuperior.jsx"; // Adicione .jsx

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import "./App.css";

// ... resto do seu componente App

function App() {
  return (
    <GoogleOAuthProvider clientId="179230958964-5hk3dhg87p16157k6im78eu54j5k1bv6.apps.googleusercontent.com">
      <MenuSuperior />

    {/* O componente <Routes> funciona como um contêiner para todas as suas rotas. */}
    <Routes>
      
      {/* Rota para a página de Login. Será exibida na raiz "/" e em "/login" */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

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