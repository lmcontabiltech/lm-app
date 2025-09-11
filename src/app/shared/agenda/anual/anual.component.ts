import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Evento } from 'src/app/sistema/gerenciamento/agenda/evento';

@Component({
  selector: 'app-anual',
  templateUrl: './anual.component.html',
  styleUrls: ['./anual.component.css'],
})
export class AnualComponent implements OnInit {
  @Input() selectedYear!: number;
  @Input() meses: string[] = [];
  @Input() diaSemana: string[] = [];
  @Input() yearMonths: number[] = [];
  @Input() getMonthMatrix!: (
    month: number,
    year: number
  ) => { date: Date; otherMonth: boolean }[][];
  @Input() hoje!: string;
  @Input() getEventosDoDia!: (date: Date) => Evento[];

  @Output() prevPeriod = new EventEmitter<void>();
  @Output() nextPeriod = new EventEmitter<void>();
  
  // Controle do popup
  showDayPopup = false;
  selectedDayEvents: Evento[] = [];
  selectedDayLabel: string = '';
  popupPosition = { top: 0, left: 0 };

  onDayClick(date: Date, event: MouseEvent) {
    this.selectedDayEvents = this.getEventosDoDia(date);
    this.selectedDayLabel = `${
      this.diaSemana[date.getDay()]
    }, ${date.getDate()} de ${
      this.meses[date.getMonth()]
    } de ${date.getFullYear()}`;
    // Calcula posição do popup
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    this.popupPosition = {
      top: rect.bottom + scrollTop + 8,
      left: rect.left + scrollLeft,
    };
    this.showDayPopup = true;
  }

  closeDayPopup() {
    this.showDayPopup = false;
  }

  constructor() {}

  ngOnInit(): void {}
}
