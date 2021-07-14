import { TestBed } from '@angular/core/testing';

import { TeriazhListService } from './teriazh-list.service';

describe('TeriazhListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeriazhListService = TestBed.get(TeriazhListService);
    expect(service).toBeTruthy();
  });
});
