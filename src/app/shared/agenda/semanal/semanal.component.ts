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
  @Output() eventClick = new EventEmitter<Evento>();

  constructor() {}

  ngOnInit(): void {}

  getEventStyle(ev: Evento) {
    const bg = ev?.cor || '#007bff';
    const hoverBg = this.getHoverColor(bg);
    return {
      'background-color': bg,
      color: this.getContrastingTextColor(bg),
      'border-left': `3px solid ${bg}`,
      '--hover-bg': hoverBg,
      '--hover-color': this.getContrastingTextColor(hoverBg),
      cursor: 'pointer',
    } as any;
  }

  getContrastingTextColor(hex: string): string {
    const c = hex?.replace('#', '');
    if (!c || c.length < 6) return '#fff';
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 140 ? '#1f1f1f' : '#ffffff';
  }

  getHoverColor(hex: string): string {
    const c = hex?.replace('#', '');
    if (!c || c.length < 6) return hex || '#007bff';
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const amt = 30 * (lum > 140 ? -1 : 1);
    const clamp = (v: number) => Math.max(0, Math.min(255, v));
    const rr = clamp(r + amt);
    const gg = clamp(g + amt);
    const bb = clamp(b + amt);
    const toHex = (v: number) => v.toString(16).padStart(2, '0');
    return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
  }
}
