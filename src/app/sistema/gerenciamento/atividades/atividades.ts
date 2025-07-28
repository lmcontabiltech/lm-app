import { Empresa } from '../../administrativo/empresas/empresa';
import { Prioridade } from './enums/prioridade';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { Lista } from './listas';
import { Processo } from '../processos/processo';
import { multaAplicada } from './multaAplicada';

export class Atividade {
  id?: string;
  nome!: string;
  descricao!: string;
  empresa?: Empresa;
  empresas?: { id: string; razaoSocial: string }[];
  idEmpresas?: string[];
  setor!: Setor;
  processo?: Processo;
  idProcesso?: string;
  dataDeInicio?: string;
  dateDaEntrega!: string;
  prioridade!: Prioridade;
  status?: string;
  usuarios?: { id: string; nome: string; fotoUrl: string }[];
  idsUsuario?: [];
  subtarefas!: { tarefa: string; id: number; checked: boolean }[];
  multas?: { id: number; tipo: string }[];
}
