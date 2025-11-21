import { NaturezaJuridica } from './natureza-juridica';

export const NaturezaJuridicaDescricao: Record<NaturezaJuridica, string> = {
  [NaturezaJuridica.MEI]: 'MEI',
  [NaturezaJuridica.EMPRESARIO_INDIVIDUAL]: 'Empresário Individual',
  [NaturezaJuridica.SOCIEDADE_LIMITADA]: 'Sociedade Limitada',
  [NaturezaJuridica.SOCIEDADE_LIMITADA_UNIPESSOAL]:
    'Sociedade Limitada Unipessoal',
  [NaturezaJuridica.SOCIEDADE_ANONIMA_ABERTA]: 'Sociedade Anônima Aberta',
  [NaturezaJuridica.SOCIEDADE_ANONIMA_FECHADA]: 'Sociedade Anônima Fechada',
  [NaturezaJuridica.COOPERATIVA]: 'Cooperativa',
  [NaturezaJuridica.ASSOCIACAO]: 'Associação',
  [NaturezaJuridica.FUNDACAO]: 'Fundação',
  [NaturezaJuridica.ORGAO_PUBLICO]: 'Órgão Público',
  [NaturezaJuridica.ONG]: 'ONG',
  [NaturezaJuridica.EIRELI]: 'EIRELI',
  [NaturezaJuridica.OUTRA]: 'Outra',
};
