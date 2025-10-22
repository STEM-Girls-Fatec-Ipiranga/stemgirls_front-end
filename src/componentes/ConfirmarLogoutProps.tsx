import React from 'react';

interface ConfirmarLogoutProps {
  estaAberto: boolean;
  aoConfirmar: () => void;
  aoCancelar: () => void;
}

const ConfirmarLogout: React.FC<ConfirmarLogoutProps> = ({
  estaAberto,
  aoConfirmar,
  aoCancelar,
}) => {
  if (!estaAberto) return null;

  return (
    // Fundo escuro que cobre toda a tela (Overlay)
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">
      
      {/* Container do Popup Branco */}
      <div 
        className="bg-white rounded-xl p-8 max-w-sm mx-4 shadow-2xl"
        style={{
          border: '1px solid #AF5FE4', // Borda fina roxa
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
            onClick={aoCancelar}
            className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Cancelar ação
          </button>
          <button
            onClick={aoConfirmar}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 shadow-md"
          >
            Tenho certeza
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarLogout;
