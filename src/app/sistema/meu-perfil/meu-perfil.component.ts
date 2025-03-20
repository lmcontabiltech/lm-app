import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/modo-escuro/theme.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.css'],
})
export class MeuPerfilComponent implements OnInit {
  constructor(public themeService: ThemeService, private location: Location) {}

  ngOnInit(): void {}

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  goBack() {
    this.location.back();
  }
}
