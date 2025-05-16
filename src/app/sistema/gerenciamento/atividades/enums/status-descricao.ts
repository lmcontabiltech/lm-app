import { Status } from './status';

export const StatusDescricao: Record<Status, string> = {
  [Status.A_FAZER]: 'A fazer',
  [Status.EM_PROGRESSO]: 'Em andamento',
  [Status.REVISAO]: 'Revisão',
  [Status.CONCLUIDO]: 'Concluído',
};
