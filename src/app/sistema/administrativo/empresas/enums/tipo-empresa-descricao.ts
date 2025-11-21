import { TipoEmpresa } from './tipo-empresa';

export const TipoEmpresaDescricao: Record<TipoEmpresa, string> = {
  [TipoEmpresa.JURIDICA]: 'Jurídica',
  [TipoEmpresa.FISICA]: 'Física',
  [TipoEmpresa.NAO_APLICA]: 'Não Aplica',
};
