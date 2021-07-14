import { TestBed } from '@angular/core/testing';

import { TeriajItemsService } from './teriaj-items.service';

describe('TeriajItemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeriajItemsService = TestBed.get(TeriajItemsService);
    expect(service).toBeTruthy();
  });
});
