export interface ScannerRunResponseDTO {
  corrections: {
    id: number;
    s3Key: string;
    url: string;
    filename: string;
    createdAt: string;
  }[];
  createdAt: string;
  descricao: string;
  empresa: { razaoSocial: string };
  errorsCounts: { [key: string]: [number, number] };
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
