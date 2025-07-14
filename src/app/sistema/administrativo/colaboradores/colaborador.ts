import { Setor } from '../cadastro-de-colaborador/setor';

export class Colaborador {
  id!: string;
  foto?: { documentoUrl: string; id: number; name: string } | null;
  fotoUrl?: any;
  nome!: string;
  setor!: Setor;
  email!: string;
  status?: string;
}
