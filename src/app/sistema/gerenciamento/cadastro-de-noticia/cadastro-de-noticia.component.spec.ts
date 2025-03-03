import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDeNoticiaComponent } from './cadastro-de-noticia.component';

describe('CadastroDeNoticiaComponent', () => {
  let component: CadastroDeNoticiaComponent;
  let fixture: ComponentFixture<CadastroDeNoticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroDeNoticiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroDeNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
