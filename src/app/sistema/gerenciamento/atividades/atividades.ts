import { Empresa } from '../../administrativo/empresas/empresa';
import { Prioridade } from './enums/prioridade';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { Lista } from './listas';
import { Processo } from '../processos/processo';

export class Atividade {
  id?: string;
  nome!: string;
  descricao!: string;
  empresa?: Empresa;
  idEmpresa?: string;
  setor!: Setor;
  processo?: Processo;
  idProcesso?: string;
  dataDeInicio?: string;
  dateDaEntrega!: string;
  prioridade!: Prioridade;
  status?: string;
  usuarios?: { nome: string; fotoUrl: string }[];
  idsUsuario?: [];
  tarefas?: Lista[];
}
