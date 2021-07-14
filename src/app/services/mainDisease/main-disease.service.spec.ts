import { TestBed } from '@angular/core/testing';

import { MainDiseaseService } from './main-disease.service';

describe('MainDiseaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainDiseaseService = TestBed.get(MainDiseaseService);
    expect(service).toBeTruthy();
  });
});
