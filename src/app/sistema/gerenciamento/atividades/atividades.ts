import { Empresa } from '../../administrativo/empresas/empresa';
import { Prioridade } from './prioridade';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';

export interface Atividade {
  title: string;
  description: string;
  date: string;
  prioridade: Prioridade;
  setor: Setor;
}
