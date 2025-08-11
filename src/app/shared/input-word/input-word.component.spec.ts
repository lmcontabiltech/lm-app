import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputWordComponent } from './input-word.component';

describe('InputWordComponent', () => {
  let component: InputWordComponent;
  let fixture: ComponentFixture<InputWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputWordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
