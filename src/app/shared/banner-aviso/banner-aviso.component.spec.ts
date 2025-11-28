import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerAvisoComponent } from './banner-aviso.component';

describe('BannerAvisoComponent', () => {
  let component: BannerAvisoComponent;
  let fixture: ComponentFixture<BannerAvisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerAvisoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
