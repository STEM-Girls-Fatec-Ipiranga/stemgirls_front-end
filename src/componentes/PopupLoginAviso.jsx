import React from "react";
import { useNavigate } from "react-router-dom";

const PopupLoginAviso = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">
      <div
        className="bg-white rounded-xl p-8 max-w-sm mx-4 shadow-2xl text-center"
        style={{
          border: "1px solid #AF5FE4",
          fontFamily: "Quicksand, sans-serif",
        }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Ops! ✋
        </h3>
        <p className="text-gray-600 mb-6">
          Parece que você ainda não tem uma conta.
          <br />
          Para interagir de outras formas no site, clique em{" "}
          <span className="font-semibold text-purple-600">Cadastrar-se</span>!
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
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-colors duration-200 shadow-md"
          >
            Cadastrar-se
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupLoginAviso;
