import { TipoEvento } from './enums/tipo-evento';
import { Frequencia } from './enums/frequencia';

export class Evento {
  id?: number;
  data!: string;
  horaInicio?: string;
  horaFim?: string;
  titulo!: string;
  descricao?: string;
  cor?: string;
  link?: string;
  tipoEvento?: TipoEvento;
  frequencia?: Frequencia | string;
  agenda!: string;
  participanteIds?: [];
  participantes?: { id: number; nome: string; fotoUrl?: string }[];
}
