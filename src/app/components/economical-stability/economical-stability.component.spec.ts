import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicalStabilityComponent } from './economical-stability.component';

describe('EconomicalStabilityComponent', () => {
  let component: EconomicalStabilityComponent;
  let fixture: ComponentFixture<EconomicalStabilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EconomicalStabilityComponent]
    });
    fixture = TestBed.createComponent(EconomicalStabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
