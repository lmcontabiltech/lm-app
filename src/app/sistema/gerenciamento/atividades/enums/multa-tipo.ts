import { Setor } from 'src/app/sistema/administrativo/cadastro-de-colaborador/setor';

export interface MultaTipo {
  key: string;
  setor: Setor | string;
  descricao: string;
}

export const MULTAS_TIPO: MultaTipo[] = [
  // CONTÁBIL
  {
    key: 'OMISSAO_ESCRITURACAO_CONTABIL',
    setor: Setor.CONTABIL,
    descricao: 'Omissão de escrituração contábil',
  },
  {
    key: 'FALTA_APRESENTACAO_LIVROS',
    setor: Setor.CONTABIL,
    descricao: 'Falta de apresentação de livros',
  },
  {
    key: 'ENTREGA_EM_ATRASO_ECD',
    setor: Setor.CONTABIL,
    descricao: 'Entrega em atraso da ECD',
  },
  {
    key: 'INCONSISTENCIA_BALANCO_PATRIMONIAL',
    setor: Setor.CONTABIL,
    descricao: 'Inconsistência no balanço patrimonial',
  },

  // PESSOAL
  {
    key: 'ATRASO_PAGAMENTO_SALARIO',
    setor: Setor.PESSOAL,
    descricao: 'Atraso no pagamento do salário',
  },
  {
    key: 'ATRASO_RECOLHIMENTO_FGTS',
    setor: Setor.PESSOAL,
    descricao: 'Atraso no recolhimento do FGTS',
  },
  {
    key: 'EMPREGADO_NAO_REGISTRADO',
    setor: Setor.PESSOAL,
    descricao: 'Empregado não registrado',
  },
  {
    key: 'ATRASO_ENVIO_ESOCIAL',
    setor: Setor.PESSOAL,
    descricao: 'Atraso no envio do eSocial',
  },
  {
    key: 'ATRASO_ENVIO_CAGED',
    setor: Setor.PESSOAL,
    descricao: 'Atraso no envio do CAGED',
  },

  // PARALEGAL
  {
    key: 'ATOS_SOCIETARIOS_NAO_ARQUIVADOS',
    setor: Setor.PARALEGAL,
    descricao: 'Atos societários não arquivados',
  },
  {
    key: 'LICENCAS_ALVARAS_VENCIDOS',
    setor: Setor.PARALEGAL,
    descricao: 'Licenças/Alvarás vencidos',
  },
  {
    key: 'EMPRESA_INATIVA_NAO_COMUNICADA',
    setor: Setor.PARALEGAL,
    descricao: 'Empresa inativa não comunicada',
  },

  // FINANCEIRO
  {
    key: 'ATRASO_OBRIGACOES_FINANCEIRAS',
    setor: Setor.FINANCEIRO,
    descricao: 'Atraso no cumprimento de obrigações financeiras',
  },
  {
    key: 'FALHA_RETENCAO_TRIBUTOS',
    setor: Setor.FINANCEIRO,
    descricao: 'Falha na retenção de tributos',
  },
  {
    key: 'AUSENCIA_CONTROLE_FLUXO_CAIXA',
    setor: Setor.FINANCEIRO,
    descricao: 'Ausência de controle de fluxo de caixa',
  },

  // FISCAL
  {
    key: 'ENTREGA_EM_ATRASO_DCTF',
    setor: Setor.FISCAL,
    descricao: 'Entrega em atraso da DCTF',
  },
  {
    key: 'ENTREGA_EM_ATRASO_EFD_CONTRIBUICOES',
    setor: Setor.FISCAL,
    descricao: 'Entrega em atraso da EFD Contribuições',
  },
  {
    key: 'OMISSAO_OU_ERRO_NOTA_FISCAL',
    setor: Setor.FISCAL,
    descricao: 'Omissão ou erro em nota fiscal',
  },
  {
    key: 'FALTA_RECOLHIMENTO_TRIBUTOS',
    setor: Setor.FISCAL,
    descricao: 'Falta de recolhimento de tributos',
  },
  {
    key: 'ATRASO_PAGAMENTO_SIMPLES_NACIONAL',
    setor: Setor.FISCAL,
    descricao: 'Atraso no pagamento do Simples Nacional',
  },
];

// Filtrando por setor
export function getMultasBySetor(setor: Setor | string): MultaTipo[] {
  return MULTAS_TIPO.filter((multa) => multa.setor === setor);
}
