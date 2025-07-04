import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/modo-escuro/theme.service';
import { Location } from '@angular/common';
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';
import { Setor } from '../administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from '../administrativo/cadastro-de-colaborador/setor-descricao';

@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.css'],
})
export class MeuPerfilComponent implements OnInit {
  isEditing = false;
  userId = 0;
  nome: string = '';
  email: string = '';
  setor: string = '';

  defaultImageUrl = '';
  selectedImageFile: File | null = null;
  selectedImageUrl: string | ArrayBuffer | null = null;

  showChangePassword = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  messageTimeout: any;

  constructor(
    public themeService: ThemeService,
    private location: Location,
    private colaboradoresService: ColaboradoresService
  ) {}

  ngOnInit(): void {
    this.carregarPerfilUsuario();
  }

  toggleDarkMode() {
    console.log('Enviando para o backend:', {
      userId: this.userId,
      darkMode: !this.themeService.isDarkMode(),
    });
    this.themeService.toggleDarkMode(String(this.userId));
  }

  goBack() {
    this.location.back();
  }

  toggleEdit() {
    this.isEditing = true;
  }

  saveChanges() {
    this.clearMessage();

    const formData = new FormData();
    const perfil = {
      nome: this.nome,
      email: this.email,
    };

    formData.append('perfil', JSON.stringify(perfil));

    if (this.selectedImageFile) {
      formData.append('foto', this.selectedImageFile);
    }
    console.log('Enviando para atualizarPerfilUsuario:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    this.colaboradoresService
      .atualizarPerfilUsuario(this.userId, formData)
      .subscribe({
        next: (response) => {
          this.isEditing = false;
          this.showMessage('success', 'Perfil atualizado com sucesso!');
        },
        error: (error) => {
          this.showMessage(
            'error',
            error.message || 'Erro ao atualizar o perfil.'
          );
          console.error('Erro ao atualizar perfil:', error);
        },
      });
  }

  cancelEdit() {
    this.isEditing = false;
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.selectedImageUrl = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  carregarPerfilUsuario(): void {
    this.colaboradoresService.getUsuarioByToken().subscribe({
      next: (usuario) => {
        console.log('Usuário retornado pelo token:', usuario);
        this.userId = Number(usuario.id);
        this.nome = usuario.nome || '';
        this.email = usuario.email || '';
        this.setor = usuario.setor || '';
        this.selectedImageUrl =
          usuario.fotoUrl && usuario.fotoUrl !== ''
            ? usuario.fotoUrl
            : this.defaultImageUrl;
      },
      error: (error) => {
        console.error('Erro ao carregar perfil do usuário:', error);
      },
    });
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getRandomColor(seed: string): string {
    const colors = [
      '#FFB3BA', // Rosa pastel
      '#FFDFBA', // Laranja pastel
      '#BAFFC9', // Verde pastel
      '#BAE1FF', // Azul pastel
      '#D5BAFF', // Roxo pastel
    ];
    const index = seed ? seed.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }

  showMessage(type: 'success' | 'error', msg: string) {
    this.clearMessage();
    if (type === 'success') this.successMessage = msg;
    if (type === 'error') this.errorMessage = msg;
    this.messageTimeout = setTimeout(() => this.clearMessage(), 3000);
  }

  clearMessage() {
    this.successMessage = null;
    this.errorMessage = null;
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
  }

  toggleChangePassword() {
    this.showChangePassword = !this.showChangePassword;
  }

  changePassword() {
    this.showChangePassword = false;
  }

  getDescricaoSetor(setor: string): string {
    return SetorDescricao[setor as keyof typeof SetorDescricao] || setor || '-';
  }
}
