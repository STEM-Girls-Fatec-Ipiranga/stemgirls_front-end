import React, { useState } from "react";
import MenuLateral from "./MenuLateral";
import Conteudo from "./Feed";
import { Comunidade, Postagem } from "../types";

const Comunidades: React.FC = () => {
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [comunidadeSelecionada, setComunidadeSelecionada] = useState<Comunidade | null>(null);
  const [barraLateralColapsada, setBarraLateralColapsada] = useState(false);

  // 🚧 Aqui futuramente você vai integrar com sua API:
  // - Buscar comunidades
  // - Criar comunidade
  // - Entrar em comunidade
  // - Criar postagem
  // - Excluir comunidade/postagem

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50"
      style={{ fontFamily: "Quicksand, sans-serif" }}
    >
      <div className="flex">
        <MenuLateral
          comunidades={comunidades}
          aoCriarComunidade={() => {}} // depois conecta com backend
          aoEntrarNaComunidade={() => {}} // depois conecta com backend
          aoSelecionarComunidade={setComunidadeSelecionada}
          comunidadeSelecionada={comunidadeSelecionada}
          colapsada={barraLateralColapsada}
          // aoAlternarColapso={() => setBarraLateralColapsada(!barraLateralColapsada)}
        />

        <Conteudo
          postagens={postagens}
          comunidades={comunidades}
          comunidadeSelecionada={comunidadeSelecionada}
          aoEntrarNaComunidade={() => {}} // depois conecta com backend
          aoCriarPostagem={() => {}} // depois conecta com backend
          aoExcluirPostagem={() => {}} // depois conecta com backend
          aoExcluirComunidade={() => {}} // depois conecta com backend
          aoVoltarParaFeed={() => setComunidadeSelecionada(null)}
          barraLateralColapsada={barraLateralColapsada}
        />
      </div>
    </div>
  );
};

export default Comunidades;
