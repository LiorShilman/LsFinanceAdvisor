import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaDisplayComponent } from './formula-display.component';

describe('FormulaDisplayComponent', () => {
  let component: FormulaDisplayComponent;
  let fixture: ComponentFixture<FormulaDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormulaDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
