import { TestBed } from '@angular/core/testing';

import { CreatLevel2Service } from './creat-level2.service';

describe('CreatLevel2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreatLevel2Service = TestBed.get(CreatLevel2Service);
    expect(service).toBeTruthy();
  });
});
