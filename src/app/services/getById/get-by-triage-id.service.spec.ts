import { TestBed } from '@angular/core/testing';

import { GetByTriageIdService } from './get-by-triage-id.service';

describe('GetByTriageIdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetByTriageIdService = TestBed.get(GetByTriageIdService);
    expect(service).toBeTruthy();
  });
});
