import React, { useState } from 'react';
import { Search, Sun, Moon, Menu, X, CircleUser, LogOut, User} from 'lucide-react';
import LogoSG from '../assets/img/LogoSG.png';
import { Link, useNavigate } from 'react-router-dom';

const MenuSuperior = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // const toggleTheme = () => {
  //   setIsDarkMode(!isDarkMode);
  // };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Agora cada item tem label e path
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

  const user = localStorage.getItem("userData")

  const [userProfile, setUser] = useState({
    data: localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData") || "{}")
      : {
        nomeCompleto: "",
        nomeUsuario: "",
        email: "",
        sobre: "",
        //joinDate: formatDate,
        //profileImage: FotoPerfil
      }
  });

    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
      navigate("/");
    }

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
                placeholder="| No que está pensando?"
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white bg-opacity-40 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200 font-quicksand"
              />
            </div>
          </div>

          {/* Botão Cadastre-se - Desktop */}
          {!user && (<div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <button
                className="px-6 py-2 bg-white text-pink-500 rounded-full font-quicksand font-semibold 
                 hover:bg-opacity-90 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                style={{ color: '#f36ec0' }}
              >
                Cadastre-se
              </button>
            </Link>
          </div>)}

          {/* Botão de perfil */}
          {user && (
            <div className="flex flex-row items-center relative">
              <p className="font-semibold text-white text-right">@{userProfile.data.nomeUsuario}</p>
              {/* <Link to="/perfil"> */}

                <button
                  className="px-6 py-2 text-white font-semibold hover:scale-105 transition-all duration-200"
                  aria-label="Menu do usuário"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <CircleUser size={45} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-4 top-full w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-[#af5fe4] border-opacity-4">
                    <Link to="/perfil" className="flex items-center gap-2 px-4 py-2 text-purple-900 hover:bg-gray-200 transition-colors">
                      <User size={19} /> Perfil 
                    </Link>

                    <button className="flex w-full items-center gap-2 px-4 py-2 text-purple-900 hover:bg-gray-200 transition-colors" onClick={handleLogout}>
                      <LogOut size={19} onClick={handleLogout} /> Sair
                    </button>
                  </div>
                )}


              {/* </Link> */}
            </div>
          )}

          {/* Menu mobile button */}
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

        {/* Barra de pesquisa - Mobile */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="No que está pensando?"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200 font-quicksand"
            />
          </div>
        </div>
      </div>

      {/* Menu Desktop */}
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
                  onClick={toggleTheme}
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
    </header>
  );
};

export default MenuSuperior;
