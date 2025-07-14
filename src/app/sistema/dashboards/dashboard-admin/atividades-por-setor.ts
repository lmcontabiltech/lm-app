export interface GrupoResumoAtividadesResponseDTO {
  comMultas: number;
  emAtraso: number;
  noPrazo: number;
}

export class DashboardAtividadesPorSetorResponseDTO {
  abertas!: GrupoResumoAtividadesResponseDTO;
  concluidas!: GrupoResumoAtividadesResponseDTO;
}
