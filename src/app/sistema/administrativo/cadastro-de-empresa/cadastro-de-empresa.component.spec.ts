import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDeEmpresaComponent } from './cadastro-de-empresa.component';

describe('CadastroDeEmpresaComponent', () => {
  let component: CadastroDeEmpresaComponent;
  let fixture: ComponentFixture<CadastroDeEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroDeEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroDeEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
