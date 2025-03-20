import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/modo-escuro/theme.service';

@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.css'],
})
export class MeuPerfilComponent implements OnInit {

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {}

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
