import { PorteEmpresa } from './porte-empresa';

export const PorteEmpresaDescricao: Record<PorteEmpresa, string> = {
  [PorteEmpresa.MEI]: 'MEI',
  [PorteEmpresa.MICRO_EMPRESA]: 'Micro Empresa',
  [PorteEmpresa.EMPRESA_PEQUENO_PORTE]: 'Empresa de Pequeno Porte',
  [PorteEmpresa.EMPRESA_MEDIO_PORTE]: 'Empresa de Médio Porte',
  [PorteEmpresa.EMPRESA_GRANDE_PORTE]: 'Empresa de Grande Porte',
};
