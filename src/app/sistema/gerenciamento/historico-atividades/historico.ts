import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';

export class Historico {
  id?: string;
  nome!: string;
  setor!: Setor;
  dataDaExclusao?: string;
  dateDaEntrega!: string;
  usuarios?: { nome: string; fotoUrl: string }[];
}
