import React, { useState } from 'react';
import MenuLateral from "./MenuLateral";
import Conteudo from './Feed';
import { Comunidade, Postagem } from '../types';

const Comunidades: React.FC = () => {
  const [comunidades, setComunidades] = useState<Comunidade[]>([
    {
      id: '1',
      nome: 'TechWoman',
      usuario: '@techwoman123',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      souDono: false,
      souMembro: false,
      postagens: [
        {
          id: '1',
          comunidadeId: '1',
          comunidadeNome: 'TechWoman',
          comunidadeAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
          titulo: 'Congresso da Sociedade Brasileira de Computação (CSBC)',
          conteudo: 'Venham participar do maior evento de computação do Brasil! O CSBC 2024 acontecerá em Brasília e reunirá os principais pesquisadores e profissionais da área.',
          imagem: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
          dataCriacao: new Date(Date.now() - 3600000)
        }
      ],
      criadoEm: new Date()
    },
    {
      id: '2',
      nome: 'CodeGirls Brasil',
      usuario: '@codegirlsbr',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      souDono: false,
      souMembro: false,
      postagens: [],
      criadoEm: new Date()
    },
    {
      id: '3',
      nome: 'Women in AI',
      usuario: '@womenai',
      avatar: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      souDono: false,
      souMembro: false,
      postagens: [
        {
          id: '2',
          comunidadeId: '3',
          comunidadeNome: 'Women in AI',
          comunidadeAvatar: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
          titulo: 'Workshop de Machine Learning para Iniciantes',
          conteudo: 'Aprenda os fundamentos do ML com nossa equipe de especialistas. Workshop gratuito para mulheres interessadas em começar na área de IA.',
          dataCriacao: new Date(Date.now() - 7200000)
        }
      ],
      criadoEm: new Date()
    }
  ]);

  const [postagens, setPostagens] = useState<Postagem[]>([
    {
      id: '1',
      comunidadeId: '1',
      comunidadeNome: 'TechWoman',
      comunidadeAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      titulo: 'Congresso da Sociedade Brasileira de Computação (CSBC)',
      conteudo: 'Venham participar do maior evento de computação do Brasil! O CSBC 2024 acontecerá em Brasília e reunirá os principais pesquisadores e profissionais da área.',
      imagem: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
      dataCriacao: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      comunidadeId: '3',
      comunidadeNome: 'Women in AI',
      comunidadeAvatar: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      titulo: 'Workshop de Machine Learning para Iniciantes',
      conteudo: 'Aprenda os fundamentos do ML com nossa equipe de especialistas. Workshop gratuito para mulheres interessadas em começar na área de IA.',
      dataCriacao: new Date(Date.now() - 7200000)
    }
  ]);

  const [comunidadeSelecionada, setComunidadeSelecionada] = useState<Comunidade | null>(null);
  const [barraLateralColapsada, setBarraLateralColapsada] = useState(false);

  const criarComunidade = (dadosComunidade: { nome: string; usuario: string; avatar: string }) => {
    const novaComunidade: Comunidade = {
      id: Date.now().toString(),
      nome: dadosComunidade.nome,
      usuario: dadosComunidade.usuario,
      avatar: dadosComunidade.avatar,
      souDono: true,
      souMembro: true,
      postagens: [],
      criadoEm: new Date()
    };

    setComunidades(prev => [...prev, novaComunidade]);
  };

  const excluirComunidade = (comunidadeId: string) => {
    setComunidades(prev => prev.filter(c => c.id !== comunidadeId));
    setPostagens(prev => prev.filter(p => p.comunidadeId !== comunidadeId));
    setComunidadeSelecionada(null);
  };

  const entrarNaComunidade = (comunidadeId: string) => {
    setComunidades(prev => 
      prev.map(c => c.id === comunidadeId ? { ...c, souMembro: true } : c)
    );
  };

  const criarPostagem = (comunidadeId: string, dadosPostagem: { titulo: string; conteudo: string; imagem?: string }) => {
    const comunidade = comunidades.find(c => c.id === comunidadeId);
    if (!comunidade) return;

    const novaPostagem: Postagem = {
      id: Date.now().toString(),
      comunidadeId,
      comunidadeNome: comunidade.nome,
      comunidadeAvatar: comunidade.avatar,
      titulo: dadosPostagem.titulo,
      conteudo: dadosPostagem.conteudo,
      imagem: dadosPostagem.imagem,
      dataCriacao: new Date()
    };

    setPostagens(prev => [novaPostagem, ...prev]);
    setComunidades(prev =>
      prev.map(c => c.id === comunidadeId ? { ...c, postagens: [novaPostagem, ...c.postagens] } : c)
    );
  };

  const excluirPostagem = (postagemId: string) => {
    setPostagens(prev => prev.filter(p => p.id !== postagemId));
    setComunidades(prev =>
      prev.map(c => ({
        ...c,
        postagens: c.postagens.filter(p => p.id !== postagemId)
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" style={{ fontFamily: 'Quicksand, sans-serif' }}>
      <div className="flex">
        <MenuLateral
          comunidades={comunidades}
          aoCriarComunidade={criarComunidade}
          aoEntrarNaComunidade={entrarNaComunidade}
          aoSelecionarComunidade={setComunidadeSelecionada}
          comunidadeSelecionada={comunidadeSelecionada}
          colapsada={barraLateralColapsada}
          aoAlternarColapso={() => setBarraLateralColapsada(!barraLateralColapsada)}
        />
        
        <Conteudo
          postagens={postagens}
          comunidades={comunidades}
          comunidadeSelecionada={comunidadeSelecionada}
          aoEntrarNaComunidade={entrarNaComunidade}
          aoCriarPostagem={criarPostagem}
          aoExcluirPostagem={excluirPostagem}
          aoExcluirComunidade={excluirComunidade}
          aoVoltarParaFeed={() => setComunidadeSelecionada(null)}
          barraLateralColapsada={barraLateralColapsada}
        />
      </div>
    </div>
  );
};

export default Comunidades;
