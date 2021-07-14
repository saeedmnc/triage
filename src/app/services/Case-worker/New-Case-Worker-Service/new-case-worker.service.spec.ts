import { TestBed } from '@angular/core/testing';

import { NewCaseWorkerService } from './new-case-worker.service';

describe('NewCaseWorkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewCaseWorkerService = TestBed.get(NewCaseWorkerService);
    expect(service).toBeTruthy();
  });
});
