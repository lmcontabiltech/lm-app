import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAutoCompleteComponent } from './select-auto-complete.component';

describe('SelectAutoCompleteComponent', () => {
  let component: SelectAutoCompleteComponent;
  let fixture: ComponentFixture<SelectAutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectAutoCompleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
