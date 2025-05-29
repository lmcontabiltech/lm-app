import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ColaboradoresService } from '../administrativo/colaboradores.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  apiURL: string = environment.apiURLBase + '/api/usuarios';
  private darkMode: boolean = false;

  constructor(
    private http: HttpClient,
    private colaboradoresService: ColaboradoresService
  ) {
    this.loadDarkModeFromServer();
  }

  public loadDarkModeFromServer(): void {
    this.colaboradoresService.getUsuarioByToken().subscribe(
      (usuario) => {
        this.darkMode = usuario.darkMode;
        console.log('Valor carregado para darkMode:', this.darkMode);
        this.loadTheme(this.darkMode);
      },
      (error) => {
        console.error('Erro ao carregar o modo escuro:', error);
      }
    );
  }

  toggleDarkMode(userId: string): void {
    const newDarkMode = !this.darkMode;
    const url = `${this.apiURL}/darkMode/${userId}`; // Passa o ID do usuário na URL
    this.http.put(url, newDarkMode).subscribe(() => {
      this.darkMode = newDarkMode;
      this.loadTheme(this.darkMode);
    });
  }

  getVariableColors(darkMode: boolean = true) {
    let lmBg: string,
      primaryFont: string,
      secondaryFont: string,
      primaryButton: string,
      sidebar: string,
      formBackground: string,
      containerBG: string,
      inputs: string,
      borda: string,
      modalBG: string,
      tabelaBG: string,
      tabelaChild: string,
      borda02: string,
      borda03: string;

    if (darkMode) {
      // default dark mode
      lmBg = '#010409';
      primaryFont = '#FFFFFF';
      secondaryFont = '#FFFFFF';
      primaryButton = '#5ea828';
      sidebar = '#0D1117';
      formBackground = '#0D1117';
      containerBG = '#0D1117';
      inputs = '#F9F9F9';
      borda = '#37383c';
      borda02 = '#37383c';
      borda03 = '#37383c';
      modalBG = '#151B23';
      tabelaBG = '#151B23';
      tabelaChild = '#212a36';
    } else {
      // light mode
      lmBg = '#e4e5eb';
      primaryFont = '#37383c';
      secondaryFont = '#1a1918';
      primaryButton = '#5ea828';
      sidebar = '#F9F9F9';
      formBackground = '#FFFFFF';
      containerBG = '#FFFFFF';
      inputs = '#37383c';
      borda = '#ced4da';
      borda02 = '#e0e0e0';
      borda03 = '#bfc4de';
      modalBG = '#FFFFFF';
      tabelaBG = '#ffffff';
      tabelaChild = '#fafafa';
    }
    return {
      lmBg: lmBg,
      primaryFont: primaryFont,
      secondaryFont: secondaryFont,
      primaryButton: primaryButton,
      sidebar: sidebar,
      formBackground: formBackground,
      containerBG: containerBG,
      inputs: inputs,
      borda: borda,
      modalBG: modalBG,
      tabelaBG: tabelaBG,
      tabelaChild: tabelaChild,
      borda02: borda02,
      borda03: borda03,
    };
  }

  getTheme(darkMode: boolean) {
    const variableColors = this.getVariableColors(darkMode);

    return {
      variableColors,
    };
  }

  loadTheme(darkMode: boolean = true): void {
    this.darkMode = darkMode;
    let theme = this.getTheme(darkMode);
    const root = document.documentElement;

    // cores variaveis
    root.style.setProperty('--lm-background', theme.variableColors.lmBg);
    root.style.setProperty('--lm-text', theme.variableColors.primaryFont);
    root.style.setProperty('--lm-text02', theme.variableColors.secondaryFont);
    root.style.setProperty(
      '--primary-button',
      theme.variableColors.primaryButton
    );
    root.style.setProperty('--lm-sidebar-bg', theme.variableColors.sidebar);
    root.style.setProperty(
      '--form-background',
      theme.variableColors.formBackground
    );
    root.style.setProperty(
      '--container-background',
      theme.variableColors.containerBG
    );
    root.style.setProperty('--lm-border', theme.variableColors.borda);
    root.style.setProperty('--lm-border02', theme.variableColors.borda02);
    root.style.setProperty('--lm-border03', theme.variableColors.borda03);
    root.style.setProperty('--container-modal', theme.variableColors.modalBG);
    root.style.setProperty('--table', theme.variableColors.tabelaBG);
    root.style.setProperty('--table-child', theme.variableColors.tabelaChild);
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  // toggleDarkMode(): void {
  //   this.loadTheme(!this.darkMode);
  // }
}
