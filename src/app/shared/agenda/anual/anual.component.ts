import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
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
  @Output() eventClick = new EventEmitter<Evento>();

  @ViewChild('yearCalendarContainer') yearCalendarContainer?: ElementRef;

  // Controle do popup
  showDayPopup = false;
  selectedDayEvents: Evento[] = [];
  selectedDayLabel: string = '';
  popupPosition = { top: 0, left: 0 };
  private clickedMonthContainer?: HTMLElement;

  constructor() {}

  ngOnInit(): void {}

  onDayClick(date: Date, event: MouseEvent) {
    this.selectedDayEvents = this.getEventosDoDia(date);
    this.selectedDayLabel = `${
      this.diaSemana[date.getDay()]
    }, ${date.getDate()} de ${
      this.meses[date.getMonth()]
    } de ${date.getFullYear()}`;

    // Encontra o container do mês (.month-calendar-mini)
    const target = event.currentTarget as HTMLElement;
    this.clickedMonthContainer = target.closest(
      '.month-calendar-mini'
    ) as HTMLElement;

    // Calcula posição inicial
    this.updatePopupPosition();
    this.showDayPopup = true;
  }

  private updatePopupPosition() {
    if (!this.clickedMonthContainer) return;

    const rect = this.clickedMonthContainer.getBoundingClientRect();

    // Verifica se o container do mês está visível
    const isVisible =
      rect.bottom > 0 &&
      rect.top < window.innerHeight &&
      rect.right > 0 &&
      rect.left < window.innerWidth;

    if (!isVisible) {
      this.closeDayPopup();
      return;
    }

    const popupWidth = 320;
    const popupHeight = Math.min(400, window.innerHeight - 16);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 8;

    // Posiciona à direita do mês
    let left = rect.right + 12;
    let top = rect.top;

    // Se não couber à direita, coloca à esquerda
    if (left + popupWidth > viewportWidth - margin) {
      left = rect.left - popupWidth - 12;
    }

    // Se não couber à esquerda também, coloca abaixo
    if (left < margin) {
      left = rect.left;
      top = rect.bottom + 8;
    }

    // Ajusta horizontalmente para garantir que fica dentro
    left = Math.max(
      margin,
      Math.min(left, viewportWidth - popupWidth - margin)
    );

    // Ajusta verticalmente
    if (top + popupHeight > viewportHeight - margin) {
      top = Math.max(margin, viewportHeight - popupHeight - margin);
    }
    if (top < margin) {
      top = margin;
    }

    this.popupPosition = { top, left };
  }

  // Listener de scroll no container
  onContainerScroll() {
    if (this.showDayPopup) {
      this.updatePopupPosition();
    }
  }

  // Listener de scroll na janela
  @HostListener('window:scroll')
  onWindowScroll() {
    if (this.showDayPopup) {
      this.updatePopupPosition();
    }
  }

  closeDayPopup() {
    this.showDayPopup = false;
    this.clickedMonthContainer = undefined;
  }

  openEventDetail(ev: Evento) {
    this.eventClick.emit(ev);
  }
}
