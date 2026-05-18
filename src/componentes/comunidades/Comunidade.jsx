import React, { useState } from "react";
import MenuLateral from "./MenuLateralComunidades";
import Conteudo from "./Conteudo";
import Postagem from "./Postagem";
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function Comunidade({ comunidade, postagens, voltarFeed }) {

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center mb-6">
          <button
            onClick={() => voltarFeed()}
            className="flex text-pink-600 hover:text-pink-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Voltar ao feed
          </button>
        </div>

        <div className="flex flex-col bg-white rounded-lg shadow-sm border border-pink-100 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="flex items-center flex-1">
              <img
                src={comunidade.imagem}
                alt={comunidade.nome}
                className="w-[150px] h-[150px] rounded-full mr-6 border-4 border-pink-100"
              />
              <div classame="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-800">{comunidade.nome}</h1>
                <p className="text-gray-600">{comunidade.nomeUsuario}</p>
                <p className="text-sm text-gray-500">{postagens.length} postagens</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 text-md rounded-xl font-medium transition-all duration-200 tranform hover:scale-105"
              >
                Entrar
              </button>

              <button
                className="flex items-center justify-center bg-white text-pink-500 text-md border border-2 border-pink-500 rounded-xl px-4 py-2 font-medium transition-all durantion-200 transform hover:bg-pink-500 hover:text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Publicar
              </button> 

              {/* <button 
                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all durantion-200 transform hover:scale-105"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir comunidade
              </button> */}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-col gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Postagens da comunidade</h2>
              
            </div>
            {postagens.length == 0 ? (
              <div clasName="text-center py-12 bg-white rounded-xl border border-pink-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Você ainda não tem nenhuma postagem</h3>
              </div>
            ) : (
              <div className="space-y-6">
                {postagens.map(postagem => (
                  <Postagem
                    key={postagem.id}
                    comunidade={comunidade}
                    postagem={postagem}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};