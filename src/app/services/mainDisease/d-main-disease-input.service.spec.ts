import { TestBed } from '@angular/core/testing';

import { DMainDiseaseInputService } from './d-main-disease-input.service';

describe('DMainDiseaseInputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DMainDiseaseInputService = TestBed.get(DMainDiseaseInputService);
    expect(service).toBeTruthy();
  });
});
