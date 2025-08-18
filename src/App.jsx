import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./componentes/Home.jsx";
import Comunidades from "./componentes/comunidades/Comunidades.jsx";

import Login from "./componentes/Login.jsx"; // Adicione .jsx
import ForgotPasswordPage from "./componentes/ForgotPasswordPage.jsx"; // Adicione .jsx
import ResetPasswordPage from "./componentes/ResetPasswordPage.jsx"; // Adicione .jsx

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



      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/comunidades" element={<Comunidades />} />
        <Route path="/esqueci-a-senha" element={<ForgotPasswordPage />} />
        <Route path="/redefinir-senha/:token" element={<ResetPasswordPage />} />

      </Routes>


    </GoogleOAuthProvider>
  );
}

export default App;