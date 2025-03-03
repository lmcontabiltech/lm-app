import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDeColaboradorComponent } from './cadastro-de-colaborador.component';

describe('CadastroDeColaboradorComponent', () => {
  let component: CadastroDeColaboradorComponent;
  let fixture: ComponentFixture<CadastroDeColaboradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroDeColaboradorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroDeColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
