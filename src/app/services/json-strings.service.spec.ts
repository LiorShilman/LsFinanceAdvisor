import { TestBed } from '@angular/core/testing';

import { JsonStringsService } from './json-strings.service';

describe('JsonStringsService', () => {
  let service: JsonStringsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonStringsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
