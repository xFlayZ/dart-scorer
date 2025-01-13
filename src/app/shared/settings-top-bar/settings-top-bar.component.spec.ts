import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsTopBarComponent } from './settings-top-bar.component';

describe('SettingsTopBarComponent', () => {
  let component: SettingsTopBarComponent;
  let fixture: ComponentFixture<SettingsTopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsTopBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingsTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
