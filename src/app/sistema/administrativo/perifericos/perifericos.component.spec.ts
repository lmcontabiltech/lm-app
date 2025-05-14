import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerifericosComponent } from './perifericos.component';

describe('PerifericosComponent', () => {
  let component: PerifericosComponent;
  let fixture: ComponentFixture<PerifericosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerifericosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerifericosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
