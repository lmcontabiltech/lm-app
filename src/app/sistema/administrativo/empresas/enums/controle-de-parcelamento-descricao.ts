import { ControleDeParcelamento } from "./controle-de-parcelamento";

export const ControleDeParcelamentoDescricao: Record<ControleDeParcelamento, string> = {
  [ControleDeParcelamento.ESTADUAL]: 'Estadual',
  [ControleDeParcelamento.FEDERAL]: 'Federal',
  [ControleDeParcelamento.MUNICIPAL]: 'Municipal',
  [ControleDeParcelamento.NENHUM]: 'Nenhum',
};
