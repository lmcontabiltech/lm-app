import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputParticipantesComponent } from './input-participantes.component';

describe('InputParticipantesComponent', () => {
  let component: InputParticipantesComponent;
  let fixture: ComponentFixture<InputParticipantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputParticipantesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputParticipantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
