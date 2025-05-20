import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAtividadeComponent } from './modal-atividade.component';

describe('ModalAtividadeComponent', () => {
  let component: ModalAtividadeComponent;
  let fixture: ComponentFixture<ModalAtividadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAtividadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAtividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
