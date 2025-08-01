import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroFilialEmpresaComponent } from './cadastro-filial-empresa.component';

describe('CadastroFilialEmpresaComponent', () => {
  let component: CadastroFilialEmpresaComponent;
  let fixture: ComponentFixture<CadastroFilialEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroFilialEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroFilialEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
