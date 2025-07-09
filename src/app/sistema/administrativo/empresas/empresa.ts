import { Atividade } from '../../gerenciamento/atividades/atividades';

export class Empresa {
  id!: string;
  razaoSocial!: string;
  cnpj!: string;
  codQuestor!: string;
  codEmpDominio!: string;
  regimeEmpresa!: string;
  identificadorContabil!: string;
  contabil!: { id: string; nome: string; email: string } | null;
  identificadorFiscal!: string;
  fiscal!: { id: string; nome: string; email: string } | null;
  identificadorFinanceiro!: string;
  financeiro!: { id: string; nome: string; email: string } | null;
  identificadorParalegal!: string;
  paralegal!: { id: string; nome: string; email: string } | null;
  identificadorPessoal!: string;
  pessoal!: { id: string; nome: string; email: string } | null;
  atividades!: Atividade[];
}
