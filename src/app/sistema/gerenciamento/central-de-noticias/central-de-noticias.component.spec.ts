import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralDeNoticiasComponent } from './central-de-noticias.component';

describe('CentralDeNoticiasComponent', () => {
  let component: CentralDeNoticiasComponent;
  let fixture: ComponentFixture<CentralDeNoticiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentralDeNoticiasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentralDeNoticiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
