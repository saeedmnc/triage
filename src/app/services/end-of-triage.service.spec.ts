import { TestBed } from '@angular/core/testing';

import { EndOfTriageService } from './end-of-triage.service';

describe('EndOfTriageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EndOfTriageService = TestBed.get(EndOfTriageService);
    expect(service).toBeTruthy();
  });
});
