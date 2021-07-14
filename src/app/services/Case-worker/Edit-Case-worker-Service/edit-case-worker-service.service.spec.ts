import { TestBed } from '@angular/core/testing';

import { EditCaseWorkerServiceService } from './edit-case-worker-service.service';

describe('EditCaseWorkerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditCaseWorkerServiceService = TestBed.get(EditCaseWorkerServiceService);
    expect(service).toBeTruthy();
  });
});
