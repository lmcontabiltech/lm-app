export interface FuncionarioPorSetor {
  qtdFuncionarios: number;
  setor: string;
}

export class GraficoFuncionariosPorSetor {
  setores!: FuncionarioPorSetor[];
  total!: number;
}
