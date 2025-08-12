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
  qtdVisualizacoes?: number;
  visualizada?: boolean;
  editada?: boolean;
  editor?: { id: string; nome: string };
  usuariosQueVisualizaram?: { id: string; nome: string }[];

  toJson?(): string {
    return JSON.stringify({
      titulo: this.titulo,
      conteudo: this.conteudo,
    });
  }
}
