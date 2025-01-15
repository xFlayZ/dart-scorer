import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDartWinnerModalComponent } from './simple-dart-winner-modal.component';

describe('SimpleDartWinnerModalComponent', () => {
  let component: SimpleDartWinnerModalComponent;
  let fixture: ComponentFixture<SimpleDartWinnerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleDartWinnerModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimpleDartWinnerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
