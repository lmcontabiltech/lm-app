import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoEmpresasInativasComponent } from './historico-empresas-inativas.component';

describe('HistoricoEmpresasInativasComponent', () => {
  let component: HistoricoEmpresasInativasComponent;
  let fixture: ComponentFixture<HistoricoEmpresasInativasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoEmpresasInativasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoEmpresasInativasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
