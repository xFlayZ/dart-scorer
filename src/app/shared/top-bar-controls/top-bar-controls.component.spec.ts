import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarControlsComponent } from './top-bar-controls.component';

describe('TopBarControlsComponent', () => {
  let component: TopBarControlsComponent;
  let fixture: ComponentFixture<TopBarControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopBarControlsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopBarControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
