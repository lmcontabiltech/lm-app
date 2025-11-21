import { TipoIdentificacao } from './tipo-identificacao';

export const TipoIdentificacaoDescricao: {
  [key in TipoIdentificacao]: string;
} = {
  [TipoIdentificacao.CNPJ]: 'CNPJ',
  [TipoIdentificacao.CPF]: 'CPF',
};
