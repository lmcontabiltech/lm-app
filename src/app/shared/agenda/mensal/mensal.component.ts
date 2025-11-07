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

  @Input() eventos: Evento[] = [];

  @Output() prevPeriod = new EventEmitter<void>();
  @Output() nextPeriod = new EventEmitter<void>();
  @Output() dayClick = new EventEmitter<Date>();
  @Output() eventClick = new EventEmitter<Evento>();

  constructor() {}

  ngOnInit(): void {}

  private toYMD(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  eventosDoDia(date: Date): Evento[] {
    if (
      date.getFullYear() !== this.selectedYear ||
      date.getMonth() !== this.selectedMonth
    ) {
      return [];
    }

    const target = this.toYMD(date);
    return (this.eventos || []).filter((ev) => {
      if (!ev || !ev.data) return false;
      const evDateStr = String(ev.data).slice(0, 10);
      return evDateStr === target;
    });
  }

  // bloqueia ações para células de outro mês
  onDayClick(day: CalendarDay): void {
    if (day.otherMonth) {
      return;
    }
    this.dayClick.emit(day.date);
  }
}
