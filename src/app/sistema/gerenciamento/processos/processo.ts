import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';

export class Processo {
  id!: string;
  nome!: string;
  tipoDeProcesso!: string;
  data!: string;
  setor!: Setor;
  dependeDeOutroSetor!: string;
  setorDeDependencia!: Setor;
  subprocessos!: { tarefa: string; id: number; checked: boolean }[];;
}
