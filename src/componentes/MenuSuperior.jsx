import React, { useState } from 'react';
import { Search, Sun, Moon, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const MenuSuperior = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    'Início',
    'Sobre nós', 
    'História',
    'Comunidades',
    'Eventos',
    'Canais',
    'MiniMentes'
  ];

  return (
    <header className="w-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg" style={{
      background: 'linear-gradient(90deg, #af5fe4 0%, #f36ec0 100%)'
    }}>
      {/* Primeira linha: Logo, Barra de pesquisa, Ícone de tema, Botão */}
      <div className="px-4 py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-white font-quicksand font-bold text-xl lg:text-2xl tracking-wide">
              STEM GIRLS
            </h1>
          </div>

          {/* Barra de pesquisa - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <div className="relative w-full">
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

          {/* Ícones e botão - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Toggle de tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200 group"
              aria-label="Alternar tema"
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <Moon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>

            {/* Botão Cadastre-se */}
            <button className="px-6 py-2 bg-white text-pink-500 rounded-full font-quicksand font-semibold hover:bg-opacity-90 hover:shadow-lg transform hover:scale-105 transition-all duration-200" style={{
              color: '#f36ec0'
            }}>
              Cadastre-se
            </button>
          </div>

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

      {/* Segunda linha: Menu de navegação - Desktop */}
      <div className="hidden md:block border-t border-white border-opacity-20">
        <div className="px-4 lg:px-8 py-3 max-w-7xl mx-auto">
          <nav className="flex items-center justify-center space-x-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-white font-quicksand font-medium hover:text-opacity-80 transition-colors duration-200 py-2 px-1 relative group"
              >
                {item}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </a>
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
                <a
                  key={index}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-white font-quicksand font-medium hover:text-opacity-80 transition-colors duration-200 py-3 px-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              
              {/* Botões mobile */}
              <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-20">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                  aria-label="Alternar tema"
                >
                  {isDarkMode ? (
                    <Sun className="w-6 h-6 text-white" />
                  ) : (
                    <Moon className="w-6 h-6 text-white" />
                  )}
                </button>
                
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