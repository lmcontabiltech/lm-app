import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnualComponent } from './anual.component';

describe('AnualComponent', () => {
  let component: AnualComponent;
  let fixture: ComponentFixture<AnualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
