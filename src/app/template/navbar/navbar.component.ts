import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Permissao } from 'src/app/login/permissao';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/login/usuario';
import { NotificacaoService } from 'src/app/services/feedback/notificacao.service';
import { Subscription } from 'rxjs';
import { ModalPadraoService } from 'src/app/services/modal/modalConfirmacao.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('dropdownToggle') dropdownToggle!: ElementRef;

  isSidebarOpen = false;
  isDropdownOpen = false;

  nomeUsuario: string = '';
  permissaoUsuario: string = '';
  fotoUsuario: string = '';

  contadorNaoLidas = 0;
  contadorForumNaoLidas = 0;
  private notificacaoSubscription?: Subscription;
  private tempoRealSubscription?: Subscription;
  private intervalSubscription?: Subscription;
  private forumSubscription?: Subscription;

  private permissaoDescricao: { [key: string]: string } = {
    ADMIN: 'Administrador',
    COORDENADOR: 'Coordenador',
    USER: 'Colaborador',
    SUPORTE_TI: 'Suporte de TI',
  };

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthService,
    private notificacaoService: NotificacaoService,
    private modalConfirmacaoService: ModalPadraoService
  ) {}

  ngOnInit(): void {
    this.carregarPerfilUsuario();
    this.carregarContadorNotificacoes();
    this.conectarNotificacaoTempoReal();
    this.iniciarAtualizacaoPeriodica();
    this.authService.obterPerfilUsuario().subscribe(
      (response: Usuario) => {
        console.log('Perfil do usuário:', response);
        this.nomeUsuario = response.nome;
        const permissao = response.permissao;
        this.fotoUsuario = response.fotoUrl || '';
        this.permissaoUsuario =
          this.permissaoDescricao[permissao] || 'Permissão desconhecida';
      },
      (err: any) => console.error('Erro ao buscar perfil do usuário', err)
    );
  }

  ngAfterViewInit(): void {
    if (!this.sidebar || !this.header || !this.content) {
      console.error('Erro: Elementos da Navbar não foram encontrados');
    }
  }

  ngOnDestroy(): void {
    this.desconectarNotificacoes();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;

    if (this.sidebar && this.header && this.content) {
      if (this.isSidebarOpen) {
        this.renderer.addClass(this.sidebar.nativeElement, 'show-sidebar');
        this.renderer.addClass(this.header.nativeElement, 'left-pd');
        this.renderer.addClass(this.content.nativeElement, 'shifted');
        // 🔹 Ajusta a margem dinamicamente para 280px
        this.renderer.setStyle(
          this.content.nativeElement,
          'margin-left',
          '280px'
        );
      } else {
        this.renderer.removeClass(this.sidebar.nativeElement, 'show-sidebar');
        this.renderer.removeClass(this.header.nativeElement, 'left-pd');
        this.renderer.removeClass(this.content.nativeElement, 'shifted');
        // 🔹 Ajusta a margem dinamicamente para 90px
        this.renderer.setStyle(
          this.content.nativeElement,
          'margin-left',
          '90px'
        );
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

  private carregarPerfilUsuario(): void {
    this.authService.obterPerfilUsuario().subscribe({
      next: (response: Usuario) => {
        console.log('Perfil do usuário:', response);
        this.nomeUsuario = response.nome;
        const permissao = response.permissao;
        this.fotoUsuario = response.fotoUrl || '';
        this.permissaoUsuario =
          this.permissaoDescricao[permissao] || 'Permissão desconhecida';
      },
      error: (err: any) => {
        console.error('Erro ao buscar perfil do usuário', err);
      },
    });
  }

  private carregarContadorNotificacoes(): void {
    this.notificacaoSubscription = this.notificacaoService
      .getContadorNaoLidas()
      .subscribe({
        next: (contador) => {
          this.contadorNaoLidas = contador;
        },
        error: (error) => {},
      });

    this.forumSubscription = this.notificacaoService
      .getContadorNaoLidasForum()
      .subscribe({
        next: (contador) => {
          this.contadorForumNaoLidas = contador;
        },
        error: (error) => {},
      });
  }

  private conectarNotificacaoTempoReal(): void {
    this.tempoRealSubscription = this.notificacaoService
      .getNotificacoesTempoReal()
      .subscribe({
        next: (novaNotificacao) => {
          if (!novaNotificacao.lida) {
            this.contadorNaoLidas++;
            console.log('🔢 Contador atualizado para:', this.contadorNaoLidas);
          }
        },
        error: (error) => {
          // Reconectar após 5 segundos
          setTimeout(() => {
            this.conectarNotificacaoTempoReal();
          }, 5000);
        },
      });
  }

  private iniciarAtualizacaoPeriodica(): void {
    // Atualizar contador a cada 2 minutos como fallback
    this.intervalSubscription = new Subscription();

    const interval = setInterval(() => {
      this.carregarContadorNotificacoes();
    }, 120000); // 2 minutos

    this.intervalSubscription.add(() => clearInterval(interval));
  }

  private desconectarNotificacoes(): void {
    if (this.notificacaoSubscription) {
      this.notificacaoSubscription.unsubscribe();
    }

    if (this.tempoRealSubscription) {
      this.tempoRealSubscription.unsubscribe();
    }

    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }

    if (this.forumSubscription) {
      this.forumSubscription.unsubscribe();
    }
  }

  public atualizarContadorNotificacoes(): void {
    this.carregarContadorNotificacoes();
  }

  public notificacaoLida(): void {
    if (this.contadorNaoLidas > 0) {
      this.contadorNaoLidas--;
    }
  }

  openModalLogout(): void {
    this.modalConfirmacaoService.openModal(
      {
        title: 'Sair da Plataforma',
        description: `Tem certeza que deseja sair da plataforma <strong>LM Gestor</strong>? Você será redirecionado para a tela de login.`,
        confirmTextoBotao: 'Sair',
        size: 'md',
      },
      () => {
        this.logout();
      }
    );
  }
}
