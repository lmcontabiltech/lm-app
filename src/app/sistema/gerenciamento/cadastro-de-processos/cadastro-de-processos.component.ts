import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ChecklistItem } from 'src/app/shared/input-plus/input-plus.component';

@Component({
  selector: 'app-cadastro-de-processos',
  templateUrl: './cadastro-de-processos.component.html',
  styleUrls: ['./cadastro-de-processos.component.css'],
})
export class CadastroDeProcessosComponent implements OnInit {
  checklist: ChecklistItem[] = [];

  constructor(private location: Location) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }
}
