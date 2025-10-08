import { Frequencia } from './frequencia';

export const FrequenciaDescricao: Record<Frequencia, string> = {
  [Frequencia.NAO_REPETE]: 'Não se repete',
  [Frequencia.TODO_DIA]: 'Todos os dias',
  [Frequencia.SEMANAL]: 'Semanal',
  [Frequencia.QUINZENAL]: '15 em 15 dias',
  [Frequencia.MENSAL]: 'Mensal',
  [Frequencia.ANUAL]: 'Anual',
};
