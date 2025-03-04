import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputImagensComponent } from './input-imagens.component';

describe('InputImagensComponent', () => {
  let component: InputImagensComponent;
  let fixture: ComponentFixture<InputImagensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputImagensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputImagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
