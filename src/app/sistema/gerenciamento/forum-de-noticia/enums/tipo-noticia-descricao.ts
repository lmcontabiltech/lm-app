import { TipoNoticia } from './tipo-noticia';

export const TipoNoticiaDescricao: Record<TipoNoticia, string> = {
  [TipoNoticia.COMUNICADO]: 'Comunicado',
  [TipoNoticia.PRONUNCIAMENTO]: 'Pronunciamento',
  [TipoNoticia.FEEDBACK]: 'Feedback',
  [TipoNoticia.ATUALIZACAO]: 'Atualização',
  [TipoNoticia.LANCAMENTO]: 'Lançamento',
  [TipoNoticia.AVISO]: 'Aviso',
  [TipoNoticia.ALERTA]: 'Alerta',
  [TipoNoticia.EVENTO]: 'Evento',
  [TipoNoticia.PARCERIA]: 'Parceria',
  [TipoNoticia.RESULTADO]: 'Resultado',
  [TipoNoticia.PESQUISA]: 'Pesquisa',
};
