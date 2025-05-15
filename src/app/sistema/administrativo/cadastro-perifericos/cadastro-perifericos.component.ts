import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColaboradoresService } from 'src/app/services/colaboradores.service';
import { AuthService } from 'src/app/services/auth.service';
import { Periferico } from '../perifericos/periferico';
import { PerifericoService } from 'src/app/services/administrativo/periferico.service';

@Component({
  selector: 'app-cadastro-perifericos',
  templateUrl: './cadastro-perifericos.component.html',
  styleUrls: ['./cadastro-perifericos.component.css'],
})
export class CadastroPerifericosComponent implements OnInit {
  perifericoForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  permissaoUsuario: string = '';
  isEditMode = false;
  perifericoId: string | null = null;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private colaboradorService: ColaboradoresService,
    private perifericoService: PerifericoService
  ) {
    this.perifericoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao : ['', Validators.required],
      colaborador: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.verificarModoEdicao();

    const usuario = this.authService.getUsuarioAutenticado();
    if (usuario?.permissao) {
      this.permissaoUsuario = this.mapPermissao(usuario.permissao);
    }
  }

  private mapPermissao(permissao: string): string {
    switch (permissao) {
      case 'ROLE_ADMIN':
        return 'Administrador';
      case 'ROLE_COORDENADOR':
        return 'Coordenador';
      case 'ROLE_USER':
        return 'Colaborador';
      default:
        return 'Desconhecido';
    }
  }

  goBack() {
    this.location.back();
  }

  onSubmit(): void {
    if (this.perifericoForm.invalid) {
      this.perifericoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const periferico: Periferico = {
      ...this.perifericoForm.value,
    };

    console.log('Dados do periferico a serem enviados:', periferico);

    if (this.isEditMode && this.perifericoId) {
      this.perifericoService
        .atualizarPeriferico(this.perifericoId, periferico)
        .subscribe(
          (response) => {
            this.isLoading = false;
            this.successMessage = 'Periferico atualizada com sucesso!';
            this.errorMessage = null;
            this.router.navigate(['usuario/perifericos']);
            console.debug('Periferico atualizada com sucesso:', response);
          },
          (error) => {
            this.isLoading = false;
            this.errorMessage = 'Erro ao atualizar periferico.';
            this.successMessage = null;
            console.error('Erro ao atualizar periferico:', error);
          }
        );
    } else {
      this.perifericoService.cadastrarPeriferico(periferico).subscribe(
        (response) => {
          this.isLoading = false;
          this.successMessage = 'Periferico cadastrada com sucesso!';
          this.errorMessage = null;
          this.perifericoForm.reset();
          console.debug('Periferico cadastrada com sucesso:', response);
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erro ao cadastrar periferico.';
          this.successMessage = null;
          console.error('Erro ao cadastrar periferico:', error);
        }
      );
    }
  }

  private verificarModoEdicao(): void {
    this.perifericoId = this.route.snapshot.paramMap.get('id');
    if (this.perifericoId) {
      this.isEditMode = true;
      this.carregarDadosPeriferico(this.perifericoId);
    }
  }

  private carregarDadosPeriferico(perifericoId: string): void {
    this.perifericoService.getPerifericoById(perifericoId).subscribe(
      (periferico: Periferico) => {
        console.log('Dados da periferico recebidos:', periferico);

        this.perifericoForm.patchValue({
          ...periferico,
        });
      },
      (error) => {
        console.error('Erro ao carregar os dados da empresa:', error);
      }
    );
  }
}
