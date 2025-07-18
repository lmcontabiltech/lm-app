import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageService {
  getErrorMessage(
    status: number,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    entity: string
  ): string {
    const action = this.getAction(method);
    const base = `${this.capitalize(entity)}:`;

    const messages: Record<number, string> = {
      400: `${base} requisição inválida ou malformada ao tentar ${action}.`,
      401: `${base} requer autenticação para ${action}.`,
      403: `${base} você não tem permissão para ${action}.`,
      404: `${base} não encontrado(a) ao tentar ${action}.`,
      405: `${base} método HTTP não permitido para ${action}.`,
      406: `${base} formato de resposta não aceitável pelo cliente.`,
      407: `${base} autenticação necessária com o proxy para ${action}.`,
      408: `${base} tempo de solicitação esgotado ao tentar ${action}.`,
      409: `${base} conflito de dados ao tentar ${action}.`,
      410: `${base} recurso foi removido permanentemente.`,
      414: `${base} URI muito longa para processar.`,
      415: `${base} tipo de mídia não suportado.`,
      429: `${base} muitas requisições. Tente novamente mais tarde.`,
      451: `${base} recurso indisponível por razões legais.`,
      500: `${base} erro interno no servidor ao tentar ${action}.`,
      501: `${base} funcionalidade não implementada no servidor.`,
      502: `${base} resposta inválida de um servidor intermediário.`,
    };

    return messages[status] || `${base} erro desconhecido ao tentar ${action}.`;
  }

  private getAction(method: string): string {
    switch (method) {
      case 'GET':
        return 'buscar';
      case 'POST':
        return 'cadastrar';
      case 'PUT':
        return 'atualizar';
      case 'DELETE':
        return 'remover';
      default:
        return 'realizar operação';
    }
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
