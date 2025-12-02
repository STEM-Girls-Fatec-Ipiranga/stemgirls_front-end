import React, { useEffect, useState } from 'react';
import { Search, Sun, Moon, Menu, X, CircleUser, LogOut, User, Bell } from 'lucide-react';
import LogoSG from '../assets/img/LogoSG.png';
import Notificacoes from "../componentes/Notificacoes.jsx";
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

function formatDate(date) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(date).toLocaleDateString("pt-BR", options);
}

const DEFAULT_PROFILE_IMAGE = "https://res.cloudinary.com/dfykqixct/image/upload/v1764633385/wkjfmbhioe1tkd14ivhb.jpg";

const MenuSuperior = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { label: "Início", path: "/" },
    { label: "Sobre nós", path: "/sobre-nos" },
    { label: "História", path: "/historia" },
    { label: "Comunidades", path: "/comunidades" },
    { label: "Eventos", path: "/eventos" },
    { label: "Canais", path: "/canais" },
    { label: "MiniMentes", path: "/minimentes" },
    { label: "Parceiros", path: "/parceiros" },
  ];

  const [user, setUser] = useState({
    data: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {}
  });

  const [empresa, setEmpresa] = useState({
    data: localStorage.getItem("empresa")
      ? JSON.parse(localStorage.getItem("empresa") || "{}")
      : {}
  });

  const [usuarioLogado, setUsuarioLogado] = useState({});

  useEffect(() => {
    if (user.data.nomeUsuario != null) {
      setUsuarioLogado({
        nomeUsuario: user.data.nomeUsuario,
        role: user.data.role
      });
    } else if (empresa.data.nomeEmpresa != null) {
      setUsuarioLogado({
        nomeUsuario: empresa.data.nomeEmpresa,
        role: empresa.data.role
      });
    }
  }, []);

  const navigate = useNavigate();

  const handleClickLogout = () => {
    setIsProfileOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("empresa");
    setUser(null);
    setEmpresa(null);
    setIsLogoutModalOpen(false);
    navigate("/");
  };

  return (
    <header className="w-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg" style={{
      background: 'linear-gradient(90deg, #af5fe4 0%, #f36ec0 100%)'
    }}>
      {/* Primeira linha */}
      <div className="px-4 py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">

          {/* Logo */}
          <div className="flex justify-start">
            <div className="w-[150px]">
              <img src={LogoSG} alt="Logo" className="w-full object-contain" />
            </div>
          </div>

          {/* Barra de pesquisa - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="| No que está pensando?"
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white bg-opacity-40 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200 font-quicksand"
              />

            </div>
          </div>

          {/* Botão Cadastre-se - Desktop */}
          {user == null && empresa == null && (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <button
                  className="px-6 py-2 bg-white text-pink-500 rounded-full font-quicksand font-semibold 
                  hover:bg-opacity-90 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  style={{ color: '#f36ec0' }}
                >
                  Cadastre-se
                </button>
              </Link>
            </div>
          )}

          {user != null && (
            <div className="flex flex-row items-center relative justify-around w-[250px]">

              {user.data.role == "MODERADOR" && (
                <button onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}>
                  <Bell />
                </button>
              )}

              <AnimatePresence>
                {mostrarNotificacoes && (
                  <Notificacoes fechar={() => setMostrarNotificacoes(false)} />
                )}
              </AnimatePresence>


              <div className="flex flex-row items-center">
                <p className="font-semibold text-white text-right">
                  {`@${usuarioLogado.nomeUsuario}`}
                </p>

                <button
                  className="px-4 py-2 text-white font-semibold hover:scale-105 transition-all duration-200"
                  aria-label="Menu do usuário"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  {/* <CircleUser size={45} /> */}
                  <img src={user.data.linkImagemPerfil ? user.data.linkImagemPerfil : DEFAULT_PROFILE_IMAGE} className="w-14 h-14 rounded-[100%] border-[3px] border-pink-400 object-cover group-hover:shadow-xl"/>
                </button>
              </div>


              {isProfileOpen && (
                <div className="absolute right-4 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-[#af5fe4]">
                  <Link
                    to={
                      usuarioLogado.role != "EMPRESA"
                        ? "/perfil"
                        : "/perfil-empresa"
                    }
                    className="flex items-center gap-2 px-4 py-2 text-purple-900 hover:bg-gray-200 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User size={19} /> Perfil
                    
                  </Link>

                  <button
                    className="flex w-full items-center gap-2 px-4 py-2 text-purple-900 hover:bg-gray-200 transition-colors"
                    onClick={handleClickLogout}
                  >
                    <LogOut size={19} /> Sair
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="No que está pensando?"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200 font-quicksand"
            />

          </div>
        </div>
      </div>
      
      <div className="hidden md:block border-t border-white border-opacity-20">
        <div className="px-4 lg:px-8 py-3 max-w-7xl mx-auto">
          <nav className="flex items-center justify-center space-x-12">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="text-white text-[18px] font-quicksand font-medium hover:text-opacity-80 transition-colors duration-200 py-2 px-1 relative group"
              >
                {item.label}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white border-opacity-20 bg-black bg-opacity-10 backdrop-blur-sm">
          <div className="px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="text-white font-quicksand font-medium hover:text-opacity-80 transition-colors duration-200 py-3 px-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Botões mobile */}
              <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-20">
                {/* <button
                  // onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                  aria-label="Alternar tema"
                >
                  {isDarkMode ? (
                    <Sun className="w-6 h-6 text-white" />
                  ) : (
                    <Moon className="w-6 h-6 text-white" />
                  )}
                </button> */}

                <button className="px-6 py-2 bg-white text-pink-500 rounded-full font-quicksand font-semibold hover:bg-opacity-90 transition-all duration-200" style={{
                  color: '#f36ec0'
                }}>
                  Cadastre-se
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE SAÍDA (INLINE) */}
      {(user || empresa) && isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">

          {/* Container do Popup Branco */}
          <div
            className="bg-white rounded-xl p-8 max-w-sm mx-4 shadow-2xl"
            style={{
              border: '1px solid #AF5FE4',
              fontFamily: "Quicksand, sans-serif"
            }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirmar Ação
            </h3>

            <p className="text-gray-600 mb-6">
              Tem certeza de que deseja sair da sua conta?
            </p>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Cancelar ação
              </button>
              <button
                onClick={handleConfirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 shadow-md"
              >
                Tenho certeza
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default MenuSuperior;
