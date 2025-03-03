import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDeAtividadeComponent } from './cadastro-de-atividade.component';

describe('CadastroDeAtividadeComponent', () => {
  let component: CadastroDeAtividadeComponent;
  let fixture: ComponentFixture<CadastroDeAtividadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroDeAtividadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroDeAtividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
