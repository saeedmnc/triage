import { TestBed } from '@angular/core/testing';

import { Creatlvl3Service } from './creatlvl3.service';

describe('Creatlvl3Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Creatlvl3Service = TestBed.get(Creatlvl3Service);
    expect(service).toBeTruthy();
  });
});
