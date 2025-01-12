import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DartCountButtonsComponent } from './dart-count-buttons.component';

describe('DartCountButtonsComponent', () => {
  let component: DartCountButtonsComponent;
  let fixture: ComponentFixture<DartCountButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DartCountButtonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DartCountButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
