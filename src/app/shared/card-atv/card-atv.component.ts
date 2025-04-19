import { Component, OnInit, Input } from '@angular/core';
import { Atividade } from 'src/app/sistema/gerenciamento/atividades/atividades';

@Component({
  selector: 'app-card-atv',
  templateUrl: './card-atv.component.html',
  styleUrls: ['./card-atv.component.css']
})
export class CardAtvComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() date!: string;
  @Input() priority!: 'Alta' | 'Média' | 'Baixa';
  @Input() sector!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
