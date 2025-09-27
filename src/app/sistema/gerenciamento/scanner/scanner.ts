export interface ScannerRunResponseDTO {
  corrections: any[];
  createdAt: string;
  descricao: string;
  empresa: any;
  errorsCounts: { [key: string]: number };
  id: number;
  reportS3Key: string;
  totalArquivos: number;
  usuario: any;
}
