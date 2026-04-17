import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleSsoComponent } from './google-sso.component';

describe('GoogleSsoComponent', () => {
  let component: GoogleSsoComponent;
  let fixture: ComponentFixture<GoogleSsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleSsoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoogleSsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
