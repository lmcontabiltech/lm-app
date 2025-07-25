import { TipoEmpresa } from './tipo-empresa';

export const TipoEmpresaDescricao: Record<TipoEmpresa, string> = {
  [TipoEmpresa.JURIDICA]: 'Jurídica',
  [TipoEmpresa.NAO_APLICA]: 'Não Aplica',
};
