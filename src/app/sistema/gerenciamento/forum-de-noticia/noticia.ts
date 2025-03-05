import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';

export class Noticia {
  titulo!: string;
  data!: string;
  setor!: Setor | 'ALL';
}
