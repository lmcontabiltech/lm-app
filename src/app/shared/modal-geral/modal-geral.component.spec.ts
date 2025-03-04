import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGeralComponent } from './modal-geral.component';

describe('ModalGeralComponent', () => {
  let component: ModalGeralComponent;
  let fixture: ComponentFixture<ModalGeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalGeralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
