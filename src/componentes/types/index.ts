// 📌 types.ts
export interface Comunidade {
  id: string;
  nome: string;
  usuario: string;
  avatar: string;
  souDono: boolean;
  souMembro: boolean;
  postagens: Postagem[];
  criadoEm: Date;
}

export interface Postagem {
  id: string;
  comunidadeId: string;
  comunidadeNome: string;
  comunidadeAvatar: string;
  titulo: string;
  conteudo: string;
  imagem?: string;
  dataCriacao: Date;
}

export interface DadosCriarComunidade {
  nome: string;
  usuario: string;
  avatar: string;
}
