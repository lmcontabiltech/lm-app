import { Atividade } from '../../gerenciamento/atividades/atividades';
import { Endereco } from './endereco';
import { Socio } from './socio';

export class Empresa {
  id!: string;
  razaoSocial!: string;
  cnpj!: string;
  codQuestor!: string;
  codEmpDominio!: string;
  regimeEmpresa!: string;
  identificadorContabil!: string;
  contabil!: {
    id: string;
    nome: string;
    email: string;
    fotoUrl: string;
  } | null;
  identificadorFiscal!: string;
  fiscal!: { id: string; nome: string; email: string; fotoUrl: string } | null;
  identificadorFinanceiro!: string;
  financeiro!: {
    id: string;
    nome: string;
    email: string;
    fotoUrl: string;
  } | null;
  identificadorParalegal!: string;
  paralegal!: {
    id: string;
    nome: string;
    email: string;
    fotoUrl: string;
  } | null;
  identificadorPessoal!: string;
  pessoal!: { id: string; nome: string; email: string; fotoUrl: string } | null;
  atividades!: Atividade[];
  status!: string;
  controleParcelamento!: string;
  situacao!: string;
  tipo!: string;
  estado!: string;
  cidade!: string;
  unidadeEmpresa!: string;
  identificadorEmpresaMatriz!: string;
  matriz!: { id: string; razaoSocial: string; cnpj: string } | null;
  endereco!: Endereco;
  tipoIdentificacao!: string;
  cpf!: string;
  porteEmpresa!: string;
  naturezaJuridica!: string;
  documentos!: { url: string; id: number; fileName: string }[];
  socios!: Socio[];

  toJson(): string {
    return JSON.stringify({
      id: this.id,
      razaoSocial: this.razaoSocial,
      cnpj: this.cnpj,
      cpf: this.cpf,
      codQuestor: this.codQuestor,
      codEmpDominio: this.codEmpDominio,
      regimeEmpresa: this.regimeEmpresa,
      identificadorContabil: this.identificadorContabil,
      identificadorFiscal: this.identificadorFiscal,
      identificadorFinanceiro: this.identificadorFinanceiro,
      identificadorParalegal: this.identificadorParalegal,
      identificadorPessoal: this.identificadorPessoal,
      status: this.status,
      controleParcelamento: this.controleParcelamento,
      situacao: this.situacao,
      tipo: this.tipo,
      unidadeEmpresa: this.unidadeEmpresa,
      identificadorEmpresaMatriz: this.identificadorEmpresaMatriz,
      tipoIdentificacao: this.tipoIdentificacao,
      porteEmpresa: this.porteEmpresa,
      naturezaJuridica: this.naturezaJuridica,
      endereco: this.endereco ? JSON.parse(this.endereco.toJson()) : null
    });
  }
}
