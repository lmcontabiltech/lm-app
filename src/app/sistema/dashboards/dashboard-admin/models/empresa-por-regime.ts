export interface EmpresaPorRegime {
  qtdEmpresas: number;
  regimeEmpresa: string;
}

export class GraficoEmpresasPorRegime {
  regimes!: EmpresaPorRegime[];
  total!: number;
}
