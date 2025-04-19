import { Empresa } from '../../administrativo/empresas/empresa';
import { Prioridade } from './prioridade';

export interface Atividade {
  title: string;
  description: string;
  date: string;
  prioridade: Prioridade;
  setor: string;
}
