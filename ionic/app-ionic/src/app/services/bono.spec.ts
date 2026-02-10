import { TestBed } from '@angular/core/testing';

import { Bono } from './bono';

describe('Bono', () => {
  let service: Bono;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bono);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
