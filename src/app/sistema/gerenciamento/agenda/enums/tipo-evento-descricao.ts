import { TipoEvento } from './tipo-evento';

export const TipoEventoDescricao: Record<TipoEvento, string> = {
  [TipoEvento.PESSOAL]: 'Pessoal',
  [TipoEvento.TRABALHO]: 'Trabalho',
  [TipoEvento.REUNIAO]: 'Reunião',
  [TipoEvento.VIAGEM]: 'Viagem',
  [TipoEvento.SAUDE]: 'Saúde',
  [TipoEvento.ESTUDO]: 'Estudo',
  [TipoEvento.FERIAS]: 'Férias',
  [TipoEvento.APRESENTACAO]: 'Apresentação',
  [TipoEvento.CONFERENCIA]: 'Conferência',
  [TipoEvento.REUNIAO_INTERNA]: 'Reunião Interna',
  [TipoEvento.EVENTO_EXTERNO]: 'Evento Externo',
  [TipoEvento.LEMBRETE]: 'Lembrete',
};
