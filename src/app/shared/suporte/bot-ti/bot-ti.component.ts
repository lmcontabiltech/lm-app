import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-bot-ti',
  templateUrl: './bot-ti.component.html',
  styleUrls: ['./bot-ti.component.css'],
  animations: [
    trigger('chatOpen', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class BotTiComponent implements OnInit {
  isOpen = false;

  constructor() {}

  ngOnInit(): void {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }
}
