import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotTiComponent } from './bot-ti.component';

describe('BotTiComponent', () => {
  let component: BotTiComponent;
  let fixture: ComponentFixture<BotTiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotTiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotTiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
