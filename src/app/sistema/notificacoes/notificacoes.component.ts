import { Component, OnInit } from '@angular/core';
import { Notificacao } from './notificacao';
import { Setor } from '../administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from '../administrativo/cadastro-de-colaborador/setor-descricao';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.css'],
})
export class NotificacoesComponent implements OnInit {
  notificacoes: Notificacao[] = [
    {
      usuario: 'Carla Américo',
      descricao:
        'moveu a atividade “Rescisão” de “Em adamento” para “Concluído”.',
      lida: false,
    },
    {
      usuario: 'Carla Américo',
      descricao:
        'moveu a atividade “Rescisão” de “Em adamento” para “Concluído”.',
      lida: false,
    },
    {
      usuario: 'Carla Américo',
      descricao:
        'moveu a atividade “Rescisão” de “Em adamento” para “Concluído”.',
      lida: false,
    },
    {
      usuario: 'Carla Américo',
      descricao:
        'moveu a atividade “Rescisão” de “Em adamento” para “Concluído”.',
      lida: false,
    },
    {
      usuario: 'Carla Américo',
      descricao:
        'moveu a atividade “Rescisão” de “Em adamento” para “Concluído”.',
      lida: true,
    },
    {
      usuario: 'Carla Américo',
      descricao: 'alterou a prioridade da atividade “Rescisão”.',
      lida: false,
    },
    {
      usuario: 'Carla Américo',
      descricao: 'alterou a prioridade da atividade “Rescisão”.',
      lida: true,
    },
    {
      usuario: 'Carla Américo',
      descricao: 'alterou a prioridade da atividade “Rescisão”.',
      lida: true,
    },
  ];

  itensPorPagina = 5;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.notificacoes.length / this.itensPorPagina);
  notificacoesPaginadas: Notificacao[] = [];

  setores = Object.keys(Setor).map((key) => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]],
  }));

  selectedSetor: string = '';

  constructor() {}

  ngOnInit(): void {
    this.atualizarPaginacao();
  }

  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  marcarComoLida(notificacao: Notificacao) {
    notificacao.lida = true;
    console.log('Notificação marcada como lida:', notificacao);
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.notificacoesPaginadas = this.notificacoes.slice(inicio, fim);
  }

  get totalItens() {
    return this.notificacoes.length;
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  onSetorChange() {}
}
