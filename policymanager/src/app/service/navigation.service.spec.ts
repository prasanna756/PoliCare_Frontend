import { TestBed } from '@angular/core/testing';

import { BackBackbuttonDisableService } from './navigation.service';

describe('BackBackbuttonDisableService', () => {
  let service: BackBackbuttonDisableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackBackbuttonDisableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
