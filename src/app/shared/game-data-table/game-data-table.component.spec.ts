import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDataTableComponent } from './game-data-table.component';

describe('GameDataTableComponent', () => {
  let component: GameDataTableComponent;
  let fixture: ComponentFixture<GameDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameDataTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
