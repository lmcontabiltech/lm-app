import { Component, OnInit } from '@angular/core';
import { TipoEvento } from './enums/tipo-evento';
import { TipoEventoDescricao } from './enums/tipo-evento-descricao';
import { Evento } from './evento';

type ViewMode = 'week' | 'month' | 'year';

interface CalendarDay {
  date: Date;
  otherMonth: boolean;
}

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
})
export class AgendaComponent implements OnInit {
  diaSemana = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];
  meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  viewMode: ViewMode = 'month';
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();
  selectedDate: Date = new Date();

  monthDays: CalendarDay[] = [];
  weekDays: Date[] = [];
  eventos: Evento[] = [];

  horasDoDia: string[] = Array.from(
    { length: 24 },
    (_, i) => i.toString().padStart(2, '0') + ':00'
  );

  hoje = new Date().toDateString();

  TipoEvento = TipoEvento;
  TipoEventoDescricao = TipoEventoDescricao;

  constructor() {}

  ngOnInit(): void {
    this.applyFilters();
  }

  setView(mode: ViewMode) {
    this.viewMode = mode;
    this.applyFilters();
  }

  prevPeriod() {
    if (this.viewMode === 'month') {
      if (this.selectedMonth === 0) {
        this.selectedMonth = 11;
        this.selectedYear--;
      } else {
        this.selectedMonth--;
      }
    } else if (this.viewMode === 'week') {
      this.selectedDate = new Date(
        this.selectedDate.setDate(this.selectedDate.getDate() - 7)
      );
    } else if (this.viewMode === 'year') {
      this.selectedYear--;
    }
    this.applyFilters();
  }

  nextPeriod() {
    if (this.viewMode === 'month') {
      if (this.selectedMonth === 11) {
        this.selectedMonth = 0;
        this.selectedYear++;
      } else {
        this.selectedMonth++;
      }
    } else if (this.viewMode === 'week') {
      this.selectedDate = new Date(
        this.selectedDate.setDate(this.selectedDate.getDate() + 7)
      );
    } else if (this.viewMode === 'year') {
      this.selectedYear++;
    }
    this.applyFilters();
  }

  goToMonth(month: number) {
    this.selectedMonth = month;
    this.viewMode = 'month';
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.viewMode === 'week') {
      this.generateWeekDays();
    } else if (this.viewMode === 'month') {
      this.generateMonthDays();
    }
  }

  generateMonthDays(): void {
    this.monthDays = [];
    const first = new Date(this.selectedYear, this.selectedMonth, 1);
    const last = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    const startDay = first.getDay();

    // Dias do mês anterior
    for (let i = 0; i < startDay; i++) {
      this.monthDays.push({
        date: new Date(this.selectedYear, this.selectedMonth, 1 - startDay + i),
        otherMonth: true,
      });
    }
    // Dias do mês atual
    for (let d = 1; d <= last.getDate(); d++) {
      this.monthDays.push({
        date: new Date(this.selectedYear, this.selectedMonth, d),
        otherMonth: false,
      });
    }
    // Pós-lacunas
    while (this.monthDays.length % 7 !== 0) {
      const prev = this.monthDays[this.monthDays.length - 1].date.getDate();
      this.monthDays.push({
        date: new Date(this.selectedYear, this.selectedMonth, prev + 1),
        otherMonth: true,
      });
    }
  }

  generateWeekDays(): void {
    this.weekDays = [];
    const d = new Date(this.selectedDate);
    // início da semana (domingo)
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    for (let i = 0; i < 7; i++) {
      const wd = new Date(start);
      wd.setDate(start.getDate() + i);
      this.weekDays.push(wd);
    }
  }

  // Visão anual: retorna array de 12 meses
  get yearMonths(): number[] {
    return Array.from({ length: 12 }, (_, i) => i);
  }

  // Eventos do dia
  getEventosDoDia(date: Date): Evento[] {
    return this.eventos.filter((ev) => {
      const evDate = new Date(ev.data);
      return (
        evDate.getFullYear() === date.getFullYear() &&
        evDate.getMonth() === date.getMonth() &&
        evDate.getDate() === date.getDate()
      );
    });
  }

  // Eventos do mês (usado na visão anual)
  getEventosNoMes(mes: number, ano: number): number {
    return this.eventos.filter((ev) => {
      const evDate = new Date(ev.data);
      return evDate.getFullYear() === ano && evDate.getMonth() === mes;
    }).length;
  }

  // Eventos por hora (usado na visão semanal)
  getEventosNoHorario(date: Date, hora: string): Evento[] {
    return this.eventos.filter((ev) => {
      const [ano, mes, dia] = ev.data.split('-').map(Number);
      const evDate = new Date(ano, mes - 1, dia);

      if (
        evDate.getFullYear() !== date.getFullYear() ||
        evDate.getMonth() !== date.getMonth() ||
        evDate.getDate() !== date.getDate()
      ) {
        return false;
      }

      if (!ev.horaInicio) return false;
      const evHour = ev.horaInicio.split(':')[0];
      return evHour === hora.split(':')[0];
    });
  }

  // Matriz de dias para cada mês do ano (usado na visão anual)
  getMonthMatrix(
    month: number,
    year: number
  ): { date: Date; otherMonth: boolean }[][] {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay();
    const matrix: { date: Date; otherMonth: boolean }[][] = [];
    let week: { date: Date; otherMonth: boolean }[] = [];

    // Dias do mês anterior
    for (let i = 0; i < startDay; i++) {
      week.push({
        date: new Date(year, month, 1 - startDay + i),
        otherMonth: true,
      });
    }
    // Dias do mês atual
    for (let d = 1; d <= last.getDate(); d++) {
      week.push({
        date: new Date(year, month, d),
        otherMonth: false,
      });
      if (week.length === 7) {
        matrix.push(week);
        week = [];
      }
    }
    // Pós-lacunas
    while (week.length && week.length < 7) {
      const prev = week[week.length - 1].date.getDate();
      week.push({
        date: new Date(year, month, prev + 1),
        otherMonth: true,
      });
    }
    if (week.length) matrix.push(week);
    return matrix;
  }

  onAddClick() {}
}
