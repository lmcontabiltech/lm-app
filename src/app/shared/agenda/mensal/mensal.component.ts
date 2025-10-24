import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Evento } from 'src/app/sistema/gerenciamento/agenda/evento';

interface CalendarDay {
  date: Date;
  otherMonth: boolean;
}

@Component({
  selector: 'app-mensal',
  templateUrl: './mensal.component.html',
  styleUrls: ['./mensal.component.css'],
})
export class MensalComponent implements OnInit {
  @Input() meses: string[] = [];
  @Input() diaSemana: string[] = [];
  @Input() selectedMonth!: number;
  @Input() selectedYear!: number;
  @Input() monthDays: CalendarDay[] = [];
  @Input() hoje!: string;
  @Input() getEventosDoDia!: (date: Date) => Evento[];

  @Output() prevPeriod = new EventEmitter<void>();
  @Output() nextPeriod = new EventEmitter<void>();
  @Output() dayClick = new EventEmitter<Date>();
  @Output() eventClick = new EventEmitter<Evento>();

  constructor() {}

  ngOnInit(): void {}
}
