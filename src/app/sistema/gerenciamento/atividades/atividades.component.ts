import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Atividade } from './atividades';

interface Tasks {
  [key: string]: Atividade[];
}

@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.component.html',
  styleUrls: ['./atividades.component.css'],
})
export class AtividadesComponent implements OnInit {
  statuses: string[] = ['backlog', 'emProgresso', 'revisao', 'concluido'];
  // Mapeamento de IDs para títulos exibidos no frontend
  statusLabels: { [key: string]: string } = {
    backlog: 'Backlog',
    emProgresso: 'Em andamento',
    revisao: 'Revisão',
    concluido: 'Concluído',
  };

  atividades: Tasks = {
    backlog: [
      {
        title: 'Tarefa 1',
        description: 'Descrição da tarefa 1',
        date: '2025-04-08',
        prioridade: 'Alta',
        setor: 'Financeiro',
      },
      {
        title: 'Tarefa 2',
        description: 'Descrição da tarefa 2',
        date: '2025-04-09',
        prioridade: 'Média',
        setor: 'RH',
      },
    ],
    emProgresso: [],
    revisao: [],
    concluido: [],
  };

  dropListIds: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.dropListIds = this.statuses.map((status) => status);
  }

  drop(event: CdkDragDrop<Atividade[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log('Tasks after drop:', this.atividades);
  }
}
