import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPerifericosComponent } from './cadastro-perifericos.component';

describe('CadastroPerifericosComponent', () => {
  let component: CadastroPerifericosComponent;
  let fixture: ComponentFixture<CadastroPerifericosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroPerifericosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroPerifericosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
