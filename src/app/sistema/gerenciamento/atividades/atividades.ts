import { Empresa } from '../../administrativo/empresas/empresa';
import { Prioridade } from './enums/prioridade';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';

export interface Atividade {
  title: string;
  description: string;
  date: string;
  prioridade: Prioridade;
  setor: Setor;
}
