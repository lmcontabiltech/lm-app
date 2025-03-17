import { Empresa } from '../../administrativo/empresas/empresa';

export interface Atividade {
  descricao: string;
  empresa: Empresa;
  id: number;
  nome: string;
}
