import React, { useState } from "react";
import MenuLateral from "./MenuLateral";
import Conteudo from "./Conteudo";
import { Comunidade, Postagem } from "../types"; // Assumindo que você tem seus tipos definidos

// Dados iniciais para simular o uso no frontend
const DADOS_INICIAIS_COMUNIDADES: Comunidade[] = [
  {
    id: "c1",
    nome: "Stem Girls Tech",
    usuario: "@stemgirls",
    avatar: "https://i.ibb.co/6P0wW0X/stemgirls.png",
    souDono: true,
    souMembro: true,
    postagens: [
      {
        id: "p1",
        comunidadeId: "c1",
        comunidadeNome: "Stem Girls Tech",
        comunidadeAvatar: "https://i.ibb.co/6P0wW0X/stemgirls.png",
        titulo: "Boas-vindas ao nosso espaço!",
        conteudo: "Estamos animadas para compartilhar conhecimento e experiências em tecnologia. Use a hashtag #MulheresNaTech!",
        dataCriacao: new Date(Date.now() - 5 * 60000), // Date object (5 minutos atrás)
      },
    ],
    criadoEm: new Date()
  },
  {
    id: "c2",
    nome: "Carreira & Liderança",
    usuario: "@liderancafem",
    avatar: "https://i.ibb.co/QrfjN08/lideranca.png",
    souDono: false,
    souMembro: true,
    postagens: [
      {
        id: "p2",
        comunidadeId: "c2",
        comunidadeNome: "Carreira & Liderança",
        comunidadeAvatar: "https://i.ibb.co/QrfjN08/lideranca.png",
        titulo: "Dicas de Negociação Salarial",
        conteudo: "Compartilhe suas melhores estratégias para negociar salários de forma justa e confiante.",
        dataCriacao: new Date(Date.now() - 120 * 60000), // 2 horas atrás
      },
    ],
    criadoEm: new Date()
  },
  {
    id: "c3",
    nome: "UX Design para Iniciantes",
    usuario: "@uxbrasil",
    avatar: "https://i.ibb.co/6HqXw1b/uxdesign.png",
    souDono: false,
    souMembro: false,
    postagens: [
      {
        id: "p3",
        comunidadeId: "c3",
        comunidadeNome: "UX Design para Iniciantes",
        comunidadeAvatar: "https://i.ibb.co/6HqXw1b/uxdesign.png",
        titulo: "O que é Design Thinking?",
        conteudo: "Uma introdução rápida aos 5 estágios do Design Thinking e como aplicá-los no seu dia a dia.",
        dataCriacao: new Date(Date.now() - 86400 * 1000), // 1 dia atrás
      },
    ],
    criadoEm: new Date()
  },
];


const Comunidades: React.FC = () => {
  const [comunidades, setComunidades] = useState<Comunidade[]>(DADOS_INICIAIS_COMUNIDADES);
  const [comunidadeSelecionada, setComunidadeSelecionada] = useState<Comunidade | null>(null);
  const [barraLateralColapsada, setBarraLateralColapsada] = useState(false);

  // 1. Postagens globais (unindo todas as postagens de todas as comunidades)
  const postagensGerais: Postagem[] = comunidades
    .flatMap(c => c.postagens.map(p => ({
      ...p,
      comunidadeNome: c.nome,
      comunidadeAvatar: c.avatar,
    })))
    // dataCriacao é Date — comparar via getTime()
    .sort((a, b) => (b.dataCriacao as Date).getTime() - (a.dataCriacao as Date).getTime());


  // 2. Lógica para Criar Comunidade
  const aoCriarComunidade = (dados: { nome: string; usuario: string; avatar: string }) => {
    const novaComunidade: Comunidade = {
      id: `c-${Date.now()}`,
      nome: dados.nome,
      usuario: dados.usuario,
      avatar: dados.avatar || "https://i.ibb.co/gST4tJ1/default-group.png", // Avatar padrão
      souDono: true,
      souMembro: true,
      postagens: [],
      criadoEm: new Date(), // <-- adicionado: propriedade obrigatória
    };
    setComunidades(prev => [novaComunidade, ...prev]);
    setComunidadeSelecionada(novaComunidade); // Seleciona a comunidade após a criação
  };

  // 3. Lógica para Entrar em Comunidade
  const aoEntrarNaComunidade = (comunidadeId: string) => {
    setComunidades(prev => prev.map(c =>
      c.id === comunidadeId
        ? { ...c, souMembro: true }
        : c
    ));

    // Atualiza a comunidade selecionada, caso esteja sendo visualizada
    setComunidadeSelecionada(prev => {
        if (prev && prev.id === comunidadeId) {
            return { ...prev, souMembro: true };
        }
        return prev;
    });
  };

  // 4. Lógica para Criar Postagem
  const aoCriarPostagem = (
    comunidadeId: string,
    dadosPostagem: { titulo: string; conteudo: string; imagem?: string }
  ) => {
    const comunidadeAlvo = comunidades.find(c => c.id === comunidadeId);
    if (!comunidadeAlvo) return;

    const novaPostagem: Postagem = {
      id: `p-${Date.now()}`,
      comunidadeId,
      comunidadeNome: comunidadeAlvo.nome,
      comunidadeAvatar: comunidadeAlvo.avatar,
      titulo: dadosPostagem.titulo,
      conteudo: dadosPostagem.conteudo,
      imagem: dadosPostagem.imagem,
      dataCriacao: new Date(), // <-- padronizado como Date
    };

    setComunidades(prev => prev.map(c =>
      c.id === comunidadeId
        ? { ...c, postagens: [novaPostagem, ...c.postagens] }
        : c
    ));

    // Atualiza a comunidade selecionada
    setComunidadeSelecionada(prev => {
        if (prev && prev.id === comunidadeId) {
            return { ...prev, postagens: [novaPostagem, ...prev.postagens] };
        }
        return prev;
    });
  };

  // 5. Lógica para Excluir Postagem
  const aoExcluirPostagem = (postagemId: string) => {
    setComunidades(prev => prev.map(c => ({
      ...c,
      postagens: c.postagens.filter(p => p.id !== postagemId),
    })));

    // Atualiza a comunidade selecionada
    setComunidadeSelecionada(prev => {
        if (!prev) return null;
        return {
            ...prev,
            postagens: prev.postagens.filter(p => p.id !== postagemId),
        };
    });
  };

  // 6. Lógica para Excluir Comunidade
  const aoExcluirComunidade = (comunidadeId: string) => {
    setComunidades(prev => prev.filter(c => c.id !== comunidadeId));
    setComunidadeSelecionada(null); // Volta para o feed geral
  };

  // Lógica para alternar o colapso (descomentada, se desejar usar o botão)
  const aoAlternarColapso = () => setBarraLateralColapsada(!barraLateralColapsada);


  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50"
      style={{ fontFamily: "Quicksand, sans-serif" }}
    >
      <div className="flex">
        <MenuLateral
          comunidades={comunidades}
          aoCriarComunidade={aoCriarComunidade}
          aoEntrarNaComunidade={aoEntrarNaComunidade}
          aoSelecionarComunidade={setComunidadeSelecionada}
          comunidadeSelecionada={comunidadeSelecionada}
          colapsada={barraLateralColapsada}
          // aoAlternarColapso={aoAlternarColapso} // Descomente no MenuLateral para usar
        />

        <Conteudo
          postagens={postagensGerais} // Passa as postagens globais para o feed
          comunidades={comunidades}
          comunidadeSelecionada={comunidadeSelecionada}
          aoEntrarNaComunidade={aoEntrarNaComunidade}
          aoCriarPostagem={aoCriarPostagem}
          aoExcluirPostagem={aoExcluirPostagem}
          aoExcluirComunidade={aoExcluirComunidade}
          aoVoltarParaFeed={() => setComunidadeSelecionada(null)}
          barraLateralColapsada={barraLateralColapsada}
        />
      </div>
    </div>
  );
};

export default Comunidades;