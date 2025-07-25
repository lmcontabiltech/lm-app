import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPadraoComponent } from './modal-padrao.component';

describe('ModalPadraoComponent', () => {
  let component: ModalPadraoComponent;
  let fixture: ComponentFixture<ModalPadraoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPadraoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPadraoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
