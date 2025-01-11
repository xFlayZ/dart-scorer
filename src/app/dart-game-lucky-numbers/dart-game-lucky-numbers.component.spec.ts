import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DartGameLuckyNumbersComponent } from './dart-game-lucky-numbers.component';

describe('DartGameLuckyNumbersComponent', () => {
  let component: DartGameLuckyNumbersComponent;
  let fixture: ComponentFixture<DartGameLuckyNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DartGameLuckyNumbersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DartGameLuckyNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
