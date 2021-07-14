import { TestBed } from '@angular/core/testing';

import { AdmissionKindListService } from './admission-kind-list.service';

describe('AdmissionKindListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdmissionKindListService = TestBed.get(AdmissionKindListService);
    expect(service).toBeTruthy();
  });
});
