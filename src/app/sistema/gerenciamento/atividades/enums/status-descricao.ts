import { Status } from './status';

export const StatusDescricao: Record<Status, string> = {
  [Status.BACKLOG]: 'Backlog',
  [Status.EM_PROGRESSO]: 'Em andamento',
  [Status.REVISAO]: 'Revisão',
  [Status.CONCLUIDO]: 'Concluído',
};
