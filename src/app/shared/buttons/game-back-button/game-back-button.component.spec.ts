import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBackButtonComponent } from './game-back-button.component';

describe('GameBackButtonComponent', () => {
  let component: GameBackButtonComponent;
  let fixture: ComponentFixture<GameBackButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameBackButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameBackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
