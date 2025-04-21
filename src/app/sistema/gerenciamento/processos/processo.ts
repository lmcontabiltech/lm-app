import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';

export class Processo {
  id!: string;
  nome!: string;
  tipoDeProcesso!: string;
  dataCadastro!: string;
  setor!: Setor;
  dependeDeOutroSetor!: string;
  setorDeDependencia!: Setor | null;
  subprocessos!: { tarefa: string; id: number; checked: boolean }[];;
}
