import { Atividade } from '../../gerenciamento/atividades/atividades';

export class Empresa {
  razaoSocial!: string;
  cnpj!: string;
  codQuestor!: string;
  regimeEmpresa!: string;
  atividades: Atividade[] | null;

  constructor() {
    this.atividades = null;
  }
}
