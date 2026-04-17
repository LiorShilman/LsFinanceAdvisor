import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentFlowComponent } from './current-flow.component';

describe('CurrentFlowComponent', () => {
  let component: CurrentFlowComponent;
  let fixture: ComponentFixture<CurrentFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentFlowComponent]
    });
    fixture = TestBed.createComponent(CurrentFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
