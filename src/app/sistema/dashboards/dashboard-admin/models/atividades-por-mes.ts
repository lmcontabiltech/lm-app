export interface AtividadePorMes {
  mes: string;
  quantidade: number;
}

export class GraficoAtividadesPorMes {
  total!: number;
  valoresPorMes!: AtividadePorMes[];
}
