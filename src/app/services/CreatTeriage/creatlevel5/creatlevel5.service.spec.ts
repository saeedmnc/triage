import { TestBed } from '@angular/core/testing';

import { Creatlevel5Service } from './creatlevel5.service';

describe('Creatlevel5Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Creatlevel5Service = TestBed.get(Creatlevel5Service);
    expect(service).toBeTruthy();
  });
});
