import { TestBed } from '@angular/core/testing';

import { CreatNewTeriageService } from './creat-new-teriage.service';

describe('CreatNewTeriageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreatNewTeriageService = TestBed.get(CreatNewTeriageService);
    expect(service).toBeTruthy();
  });
});
