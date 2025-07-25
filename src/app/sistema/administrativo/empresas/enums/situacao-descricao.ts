import { Situacao } from "./situacao";

export const SituacaoDescricao: Record<Situacao, string> = {
  [Situacao.COM_MOVIMENTACAO]: 'Com Movimentação',
  [Situacao.SEM_MOVIMENTACAO]: 'Sem Movimentação',
};
