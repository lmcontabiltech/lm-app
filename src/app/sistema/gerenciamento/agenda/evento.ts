import { TipoEvento } from './enums/tipo-evento';

export interface Evento {
  id?: number;
  data: string;
  horaInicio?: string;
  horaFim?: string;
  titulo: string;
  descricao?: string;
  cor: string;
  link?: string;
  tipoEvento?: TipoEvento;
}
