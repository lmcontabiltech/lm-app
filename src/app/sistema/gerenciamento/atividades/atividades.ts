import { Empresa } from '../../administrativo/empresas/empresa';
import { Prioridade } from './enums/prioridade';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { Lista } from './listas';

export class Atividade {
  id?: string;
  nome!: string;
  descricao!: string;
  empresa?: Empresa;
  idEmpresa?: string;
  setor!: Setor;
  processo?: string;
  idProcesso?: string;
  dataDeInicio?: string;
  dateDaEntrega!: string;
  prioridade!: Prioridade;
  status?: string;
  usuarios?: { nome: string; fotoUrl: string }[];
  idsUsuario?: [];
  tarefas?: Lista[];
}
