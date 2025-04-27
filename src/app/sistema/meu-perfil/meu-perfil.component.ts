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
  userId: string = '';
  name: string = '';
  email: string = '';
  setor: string = '';

  defaultImageUrl = 'assets/imagens/default-profile.png';
  selectedImageUrl: string | ArrayBuffer | null = null;

  constructor(
    public themeService: ThemeService,
    private location: Location,
    private colaboradoresService: ColaboradoresService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  toggleDarkMode() {
    console.log('Enviando para o backend:', {
      userId: this.userId,
      darkMode: !this.themeService.isDarkMode(),
    });
    this.themeService.toggleDarkMode(this.userId);
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

  private loadUserData(): void {
    this.colaboradoresService.getUsuarioByToken().subscribe(
      (usuario) => {
        this.userId = usuario.id;
        this.name = usuario.nome;
        this.email = usuario.email;
        this.setor = usuario.setor;
        console.log('Dados do usuário carregados:', {
          id: this.userId,
          nome: this.name,
          email: this.email,
          setor: this.setor,
        });
      },
      (error) => {
        console.error('Erro ao carregar os dados do usuário:', error);
      }
    );
  }
}
