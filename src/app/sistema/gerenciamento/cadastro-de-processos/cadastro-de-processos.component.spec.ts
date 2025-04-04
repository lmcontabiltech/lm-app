import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDeProcessosComponent } from './cadastro-de-processos.component';

describe('CadastroDeProcessosComponent', () => {
  let component: CadastroDeProcessosComponent;
  let fixture: ComponentFixture<CadastroDeProcessosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroDeProcessosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroDeProcessosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
