import { TestBed } from '@angular/core/testing';

import { CaseWorkerListService } from './case-worker-list.service';

describe('CaseWorkerListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaseWorkerListService = TestBed.get(CaseWorkerListService);
    expect(service).toBeTruthy();
  });
});
