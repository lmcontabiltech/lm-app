import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';

export class Noticia {
  id!: string;
  titulo!: string;
  conteudo!: string;
  autor!: { id: string; username: string };
  publicadaEm!: number;
  arquivo?: {
    documentoUrl: string;
    id: number;
    name: string;
  };
  destinatario!: Setor;

  toJson?(): string {
    return JSON.stringify({
      titulo: this.titulo,
      conteudo: this.conteudo,
    });
  }
}
