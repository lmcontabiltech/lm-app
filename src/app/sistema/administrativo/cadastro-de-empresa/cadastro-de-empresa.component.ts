import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from '../empresas/empresa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresasService } from '../../../services/empresas.service';

@Component({
  selector: 'app-cadastro-de-empresa',
  templateUrl: './cadastro-de-empresa.component.html',
  styleUrls: ['./cadastro-de-empresa.component.css'],
})
export class CadastroDeEmpresaComponent implements OnInit {
  empresaForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode = false;
  empresaId: string | null = null;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private empresasService: EmpresasService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.empresaForm = this.formBuilder.group({
      atividades: [''],
      razaoSocial: ['', Validators.required],
      cnpj: ['', Validators.required],
      regimeEmpresa: ['', Validators.required],
      codQuestor: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.empresaId = this.route.snapshot.paramMap.get('id');
    if (this.empresaId) {
      this.isEditMode = true;
      this.empresasService.getEmpresaById(this.empresaId).subscribe(
        (empresa: Empresa) => {
          console.log('Dados da empresa recebidos:', empresa);
          this.empresaForm.patchValue(empresa);
        },
        (error) => {
          console.error('Erro ao carregar os dados da empresa:', error);
        }
      );
    }
  }

  goBack() {
    this.location.back();
  }

  onSubmit(): void {
    if (this.empresaForm.invalid) {
      this.empresaForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const empresa: Empresa = {
      ...this.empresaForm.value,
      atividades: null,
    };

    console.log('Dados da empresa a serem enviados:', empresa);

    if (this.isEditMode && this.empresaId) {
      this.empresasService.atualizarEmpresa(this.empresaId, empresa).subscribe(
        (response) => {
          this.isLoading = false;
          this.successMessage = 'Empresa atualizada com sucesso!';
          this.errorMessage = null;
          this.router.navigate(['/sistema/administrativo/empresas']);
          console.debug('Empresa atualizada com sucesso:', response);
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erro ao atualizar empresa.';
          this.successMessage = null;
          console.error('Erro ao atualizar empresa:', error);
        }
      );
    } else {
      this.empresasService.cadastrarEmpresa(empresa).subscribe(
        (response) => {
          this.isLoading = false;
          this.successMessage = 'Empresa cadastrada com sucesso!';
          this.errorMessage = null;
          this.empresaForm.reset();
          console.debug('Empresa cadastrada com sucesso:', response);
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erro ao cadastrar empresa.';
          this.successMessage = null;
          console.error('Erro ao cadastrar empresa:', error);
        }
      );
    }
  }
}
