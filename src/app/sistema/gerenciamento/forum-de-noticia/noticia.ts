import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';

export class Noticia {
  id!: string;
  titulo!: string;
  conteudo!: string;
  autor!: { id: string; nome: string };
  publicadaEm!: number;
  arquivo?: {
    documentoUrl: string;
    id: number;
    name: string;
  };
  destinatario!: Setor;
  tipo!: string;
  visualizacoes?: number;
  visualizada?: boolean;

  toJson?(): string {
    return JSON.stringify({
      titulo: this.titulo,
      conteudo: this.conteudo,
    });
  }
}
