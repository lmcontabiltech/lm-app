import { Empresa } from '../../administrativo/empresas/empresa';
import { Prioridade } from './enums/prioridade';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { Lista } from './listas';

export interface Atividade {
  id?: string;
  title: string;
  description: string;
  empresa?: Empresa;
  setor: Setor;
  processo?: string;
  dataInicio?: string;
  dataFim?: string;
  date: string;
  prioridade: Prioridade;
  status?: string;
  membros?: [];
  listas?: Lista[];
}
