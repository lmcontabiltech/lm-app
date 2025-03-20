import { Component } from '@angular/core';
import { ThemeService } from './services/modo-escuro/theme.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lm-app';

  constructor(private themeService: ThemeService) {
    // O serviço será inicializado automaticamente pelo Angular
  }
}
