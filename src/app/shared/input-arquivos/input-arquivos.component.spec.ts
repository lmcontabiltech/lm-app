import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputArquivosComponent } from './input-arquivos.component';

describe('InputArquivosComponent', () => {
  let component: InputArquivosComponent;
  let fixture: ComponentFixture<InputArquivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputArquivosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputArquivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
