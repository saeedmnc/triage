import { TestBed } from '@angular/core/testing';

import { AVPUService } from './avpu.service';

describe('AVPUService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AVPUService = TestBed.get(AVPUService);
    expect(service).toBeTruthy();
  });
});
