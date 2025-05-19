import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { Atividade } from './atividades';
import { Prioridade } from './enums/prioridade';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';

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
        nome: 'Tarefa 1',
        descricao: 'Descrição da tarefa 1',
        date: '2025-04-08',
        prioridade: Prioridade.ALTA,
        setor: Setor.FINANCEIRO,
      },
      {
        nome: 'Tarefa 2',
        descricao: 'Descrição da tarefa 2',
        date: '2025-04-09',
        prioridade: Prioridade.MEDIA,
        setor: Setor.FISCAL,
      },
      {
        nome: 'Tarefa 3',
        descricao: 'Descrição da tarefa 3',
        date: '2025-04-09',
        prioridade: Prioridade.BAIXA,
        setor: Setor.PESSOAL,
      },
      {
        nome: 'Tarefa 4',
        descricao: 'Descrição da tarefa 4',
        date: '2025-04-09',
        prioridade: Prioridade.MEDIA,
        setor: Setor.PARALEGAL,
      },
    ],
    emProgresso: [
      {
        nome: 'Nome da atividade',
        descricao: 'J. Erivaldo e Cia LTDA',
        date: '2025-05-24',
        prioridade: Prioridade.BAIXA,
        setor: Setor.CONTABIL,
      },
    ],
    revisao: [],
    concluido: [],
  };

  dropListIds: string[] = [];

  constructor(private router: Router) {}

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

  cadastrarAtividade(): void {
    this.router.navigate(['/usuario/cadastro-de-atividade']);
  }
}
