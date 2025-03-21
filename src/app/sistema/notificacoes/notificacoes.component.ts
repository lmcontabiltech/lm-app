import { Component, OnInit } from '@angular/core';
import { Notificacao } from './notificacao';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.css'],
})
export class NotificacoesComponent implements OnInit {
   notificacoes: Notificacao[] = [
        { usuario: 'Carla Américo', descricao: 'moveu a atividade “Rescisão” de “Em adamento” para “Concluído”.'},
        { usuario: 'Carla Américo', descricao: 'moveu a atividade “Rescisão” de “Em adamento” para “Concluído”.'},
        { usuario: 'Carla Américo', descricao: 'moveu a atividade “Rescisão” de “Em adamento” para “Concluído”.'},
        { usuario: 'Carla Américo', descricao: 'moveu a atividade “Rescisão” de “Em adamento” para “Concluído”.'},
        { usuario: 'Carla Américo', descricao: 'moveu a atividade “Rescisão” de “Em adamento” para “Concluído”.'},
        { usuario: 'Carla Américo', descricao: 'alterou a prioridade da atividade “Rescisão”.'},
        { usuario: 'Carla Américo', descricao: 'alterou a prioridade da atividade “Rescisão”.'},
        { usuario: 'Carla Américo', descricao: 'alterou a prioridade da atividade “Rescisão”.'}
      ];

       itensPorPagina = 5;
       paginaAtual = 1;
       totalPaginas = Math.ceil(this.notificacoes.length / this.itensPorPagina);
       notificacoesPaginadas: Notificacao[] = [];

  constructor() {}

  ngOnInit(): void {
    this.atualizarPaginacao();
  }

  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.notificacoesPaginadas = this.notificacoes.slice(inicio, fim);
  }

  mudarPagina(pagina: number): void {
    this.paginaAtual = pagina;
    this.atualizarPaginacao();
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }
}
