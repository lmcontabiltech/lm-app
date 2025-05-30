import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalhes-fluxo',
  templateUrl: './detalhes-fluxo.component.html',
  styleUrls: ['./detalhes-fluxo.component.css'],
})
export class DetalhesFluxoComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }
}
