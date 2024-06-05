import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AdminAuthGuard } from './admin-auth.guard';

describe('adminAuthGuard', () => {
  let guard: AdminAuthGuard;
  const executeGuard: CanActivateFn =  (route, state) => {
    guard = TestBed.inject(AdminAuthGuard);
    return guard.canActivate(route, state);
  };


  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});


