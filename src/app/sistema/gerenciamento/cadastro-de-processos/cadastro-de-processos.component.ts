import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChecklistItem } from 'src/app/shared/input-plus/input-plus.component';

@Component({
  selector: 'app-cadastro-de-processos',
  templateUrl: './cadastro-de-processos.component.html',
  styleUrls: ['./cadastro-de-processos.component.css'],
})
export class CadastroDeProcessosComponent implements OnInit {
  checklist: ChecklistItem[] = [];
  processoForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode = false;
  processoId: string | null = null;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.processoForm = this.formBuilder.group({
      nome: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  onSubmit(): void {}
}
