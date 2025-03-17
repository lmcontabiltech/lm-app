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
  colaboradorId: string | null = null;

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

  ngOnInit(): void {}

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
