import { TestBed } from '@angular/core/testing';

import { SetConfigeService } from './set-confige.service';

describe('SetConfigeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetConfigeService = TestBed.get(SetConfigeService);
    expect(service).toBeTruthy();
  });
});
