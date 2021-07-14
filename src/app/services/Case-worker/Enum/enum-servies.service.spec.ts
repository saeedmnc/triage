import { TestBed } from '@angular/core/testing';

import { EnumServiesService } from './enum-servies.service';

describe('EnumServiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnumServiesService = TestBed.get(EnumServiesService);
    expect(service).toBeTruthy();
  });
});
