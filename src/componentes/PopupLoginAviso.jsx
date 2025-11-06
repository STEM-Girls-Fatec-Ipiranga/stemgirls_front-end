import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from 'lucide-react';

export const PopupLoginAviso = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">
      <div
        className="bg-white rounded-xl p-8 w-[600px] h-[450px] mb-4 shadow-2xl text-center items-center flex flex-col justify-center"
        style={{
          border: "1px solid #AF5FE4",
          fontFamily: "Quicksand, sans-serif",
        }}
      >
        <div className="mb-12">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="grad" x1=" 0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <UserPlus stroke="url(#grad)" />
          </svg>
        </div>


        <p className="text-black text-[19px] mb-6">
          Parece que você ainda não tem uma conta ou não entrou na sua. Para interagir de outras formas no site, clique em{" "}
          <span className="font-semibold text-purple-600">Cadastrar-se </span>
          ou faça seu
          <span className="font-semibold text-purple-600"> Login</span>!
        </p>

        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Fechar
          </button>

        
          <button
            onClick={() => navigate("/login")}
            className="bg-transparent bg-gradient-to-r from-pink-600 to-purple-400 text-transparent bg-clip-text font-bold px-4 py-2 rounded-[40px] hover:opacity-90 transition-colors duration-200 shadow-md"
          >
            Cadastrar-se
          </button>
        
          

        </div>
      </div>
    </div>
  );
};

export default PopupLoginAviso;
