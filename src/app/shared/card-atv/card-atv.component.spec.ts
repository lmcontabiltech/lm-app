import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAtvComponent } from './card-atv.component';

describe('CardAtvComponent', () => {
  let component: CardAtvComponent;
  let fixture: ComponentFixture<CardAtvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardAtvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAtvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
