import { TestBed } from '@angular/core/testing';

import { Creatlvl4TriageService } from './creatlvl4-triage.service';

describe('Creatlvl4TriageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Creatlvl4TriageService = TestBed.get(Creatlvl4TriageService);
    expect(service).toBeTruthy();
  });
});
