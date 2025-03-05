import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetorTagComponent } from './setor-tag.component';

describe('SetorTagComponent', () => {
  let component: SetorTagComponent;
  let fixture: ComponentFixture<SetorTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetorTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetorTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
