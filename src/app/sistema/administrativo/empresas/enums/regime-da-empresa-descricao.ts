import { RegimeDaEmpresa } from './regime-da-empresa';

export const RegimeDaEmpresaDescricao: Record<RegimeDaEmpresa, string> = {
  [RegimeDaEmpresa.SIMPLES_NACIONAL]: 'Simples Nacional',
  [RegimeDaEmpresa.LUCRO_PRESUMIDO]: 'Lucro Presumido',
  [RegimeDaEmpresa.LUCRO_REAL]: 'Lucro Real',
  [RegimeDaEmpresa.MEI]: 'MEI',
  [RegimeDaEmpresa.IMUNE]: 'Imune',
  [RegimeDaEmpresa.ISENTA]: 'Isenta',
  [RegimeDaEmpresa.EMPRESARIO_INDIVIDUAL]: 'Empresário Individual',
  [RegimeDaEmpresa.EIRELI]: 'EIRELI',
  [RegimeDaEmpresa.SLU]: 'SLU',
  [RegimeDaEmpresa.LTDA]: 'LTDA',
  [RegimeDaEmpresa.SA_ABERTA]: 'S.A. Aberta',
  [RegimeDaEmpresa.SA_FECHADA]: 'S.A. Fechada',
  [RegimeDaEmpresa.SOCIEDADE_SIMPLES]: 'Sociedade Simples',
  [RegimeDaEmpresa.ASSOCIACAO]: 'Associação',
  [RegimeDaEmpresa.ONG]: 'ONG',
  [RegimeDaEmpresa.COOPERATIVA]: 'Cooperativa',
  [RegimeDaEmpresa.INTITUICAO_RELIGIOSA]: 'Instituição Religiosa',
  [RegimeDaEmpresa.ORG_PUBLICO]: 'Orgão Público',
  [RegimeDaEmpresa.OUTROS]: 'Outros',
};
