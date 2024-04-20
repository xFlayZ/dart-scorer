import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePlayerCardComponent } from './game-player-card.component';

describe('GamePlayerCardComponent', () => {
  let component: GamePlayerCardComponent;
  let fixture: ComponentFixture<GamePlayerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamePlayerCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamePlayerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
