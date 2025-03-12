import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('dropdownToggle') dropdownToggle!: ElementRef;

  isSidebarOpen = false;
  isDropdownOpen = false;

  nomeUsuario: string = 'Haroldo Andrade';

  constructor(
    private router: Router, 
    private renderer: Renderer2,
    private authService: AuthService,) {}

  ngOnInit(): void {
    this.authService.obterNomeUsuario().subscribe(
      nome => this.nomeUsuario = nome,
      err => console.error('Erro ao buscar nome do usuário', err)
    );
  }

  ngAfterViewInit(): void {
    if (!this.sidebar || !this.header || !this.content) {
      console.error('Erro: Elementos da Navbar não foram encontrados');
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;

    if (this.sidebar && this.header && this.content) {
      if (this.isSidebarOpen) {
        this.renderer.addClass(this.sidebar.nativeElement, 'show-sidebar');
        this.renderer.addClass(this.header.nativeElement, 'left-pd');
        this.renderer.addClass(this.content.nativeElement, 'shifted');
        // 🔹 Ajusta a margem dinamicamente para 280px
        this.renderer.setStyle(this.content.nativeElement, 'margin-left', '280px');
      } else {
        this.renderer.removeClass(this.sidebar.nativeElement, 'show-sidebar');
        this.renderer.removeClass(this.header.nativeElement, 'left-pd');
        this.renderer.removeClass(this.content.nativeElement, 'shifted');
        // 🔹 Ajusta a margem dinamicamente para 90px
        this.renderer.setStyle(this.content.nativeElement, 'margin-left', '90px');
      }
    }
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;

    if (this.sidebar && this.header && this.content) {
      this.renderer.removeClass(this.sidebar.nativeElement, 'show-sidebar');
      this.renderer.removeClass(this.header.nativeElement, 'left-pd');
      this.renderer.removeClass(this.content.nativeElement, 'shifted');
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    const dropdownToggle = document.getElementById('dropdown-toggle');
    if (dropdownToggle) {
      if (this.isDropdownOpen) {
        dropdownToggle.classList.add('active');
      } else {
        dropdownToggle.classList.remove('active');
      }
    }
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  logout() {
    this.authService.encerrarSessao();
    this.router.navigate(['/login']);
  }
}
