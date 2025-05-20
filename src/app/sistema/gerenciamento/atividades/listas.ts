import { Tarefa } from '../processos/tarefas';

export interface Lista {
  id?: string;
  nome: string;
  subtarefas: Tarefa[];
}
