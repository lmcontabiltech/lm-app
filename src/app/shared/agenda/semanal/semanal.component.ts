import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Evento } from 'src/app/sistema/gerenciamento/agenda/evento';

@Component({
  selector: 'app-semanal',
  templateUrl: './semanal.component.html',
  styleUrls: ['./semanal.component.css'],
})
export class SemanalComponent implements OnInit {
  @Input() weekDays: Date[] = [];
  @Input() diaSemana: string[] = [];
  @Input() horasDoDia: string[] = [];
  @Input() hoje: string = '';
  @Input() getEventosNoHorario!: (date: Date, hora: string) => Evento[];

  @Output() prevPeriod = new EventEmitter<void>();
  @Output() nextPeriod = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
