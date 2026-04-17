import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GptApiComponent } from './gpt-api.component';

describe('GptApiComponent', () => {
  let component: GptApiComponent;
  let fixture: ComponentFixture<GptApiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GptApiComponent]
    });
    fixture = TestBed.createComponent(GptApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
