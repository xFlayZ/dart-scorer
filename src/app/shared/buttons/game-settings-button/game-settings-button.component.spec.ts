import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSettingsButtonComponent } from './game-settings-button.component';

describe('GameSettingsButtonComponent', () => {
  let component: GameSettingsButtonComponent;
  let fixture: ComponentFixture<GameSettingsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameSettingsButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameSettingsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
