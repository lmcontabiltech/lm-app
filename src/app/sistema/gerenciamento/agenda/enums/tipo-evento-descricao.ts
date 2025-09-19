import { TipoEvento } from './tipo-evento';

export const TipoEventoDescricao: Record<TipoEvento, string> = {
    [TipoEvento.PESSOAL]: 'Pessoal',
    [TipoEvento.TRABALHO]: 'Trabalho',
    [TipoEvento.VIAGEM]: 'Viagem',
    [TipoEvento.SAUDE]: 'Saúde',
    [TipoEvento.ESTUDO]: 'Estudo',
    [TipoEvento.FERIAS]: 'Férias',
}