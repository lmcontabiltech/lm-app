import { Empresa } from '../../administrativo/empresas/empresa';

export interface Atividade {
  title: string;
  description: string;
  date: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  setor: string;
}
