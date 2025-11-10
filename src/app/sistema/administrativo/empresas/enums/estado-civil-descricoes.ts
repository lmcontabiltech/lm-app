import { EstadoCivil } from './estado-civil';

export const EstadoCivilDescricoes: Record<EstadoCivil, string> = {
  [EstadoCivil.SOLTEIRO]: 'Solteiro (a)',
  [EstadoCivil.CASADO]: 'Casado (a)',
  [EstadoCivil.DIVORCIADO]: 'Divorciado (a)',
  [EstadoCivil.VIUVO]: 'Viúvo (a)',
  [EstadoCivil.UNIAO_ESTAVEL]: 'União Estável',
  [EstadoCivil.SEPARADO_JUDICIALMENTE]: 'Separado (a) Judicialmente',
};
