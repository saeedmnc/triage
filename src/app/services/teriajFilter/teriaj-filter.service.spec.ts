import { TestBed } from '@angular/core/testing';

import { TeriajFilterService } from './teriaj-filter.service';

describe('TeriajFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeriajFilterService = TestBed.get(TeriajFilterService);
    expect(service).toBeTruthy();
  });
});
