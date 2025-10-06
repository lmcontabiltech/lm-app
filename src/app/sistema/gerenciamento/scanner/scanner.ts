export interface ScannerRunResponseDTO {
  corrections: any[];
  createdAt: string;
  descricao: string;
  empresa: { razaoSocial: string };
  errorsCounts: { [key: string]: number };
  id: string;
  reportS3Key: string;
  totalArquivos: number;
  usuario: {
    id: string;
    nome: string;
    foto: { fotoUrl: string; id: number; name: string };
    status: string;
  } | null;
}
