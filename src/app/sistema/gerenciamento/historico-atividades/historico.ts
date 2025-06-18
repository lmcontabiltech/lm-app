import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { Atividade } from '../atividades/atividades';

export class HistoricoAtividade {
  id?: string;
  setor!: Setor;
  data?: string;
  usuario?: { nome: string; fotoUrl: string }[];
  atividade!: Atividade;
}
