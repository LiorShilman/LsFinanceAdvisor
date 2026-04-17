import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumerologyComponent } from './numerology.component';

describe('NumerologyComponent', () => {
  let component: NumerologyComponent;
  let fixture: ComponentFixture<NumerologyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NumerologyComponent]
    });
    fixture = TestBed.createComponent(NumerologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
