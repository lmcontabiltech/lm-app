import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { Atividade } from '../atividades/atividades';
import { Colaborador } from '../../administrativo/colaboradores/colaborador';

export class HistoricoAtividade {
  id?: string;
  setor!: Setor;
  data?: string;
  usuario?: Colaborador;
  atividade!: Atividade;
}
