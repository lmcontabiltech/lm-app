import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputMidiasComponent } from './input-midias.component';

describe('InputMidiasComponent', () => {
  let component: InputMidiasComponent;
  let fixture: ComponentFixture<InputMidiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputMidiasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputMidiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
