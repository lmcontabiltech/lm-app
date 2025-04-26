import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/modo-escuro/theme.service';
import { Location } from '@angular/common';
import { ColaboradoresService } from 'src/app/services/colaboradores.service';

@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.css'],
})
export class MeuPerfilComponent implements OnInit {
  isEditing = false;
  user = {
    name: 'Haroldo Andrade',
    email: 'haroldo@gmail.com',
    setor: 'Diretoria'
  };

  defaultImageUrl = 'assets/imagens/default-profile.png';
  selectedImageUrl: string | ArrayBuffer | null = null;

  constructor(public themeService: ThemeService, private location: Location) {}

  ngOnInit(): void {}

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  goBack() {
    this.location.back();
  }

  toggleEdit() {
    this.isEditing = true;
  }

  saveChanges() {
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.selectedImageUrl = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
