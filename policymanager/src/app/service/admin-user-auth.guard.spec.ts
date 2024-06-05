import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminUserAuthGuard } from './admin-user-auth.guard';

describe('adminUserAuthGuard', () => {
  let guard: adminUserAuthGuard;
  const executeGuard: CanActivateFn = (route, state) => {
  guard = TestBed.inject(adminUserAuthGuard);
  return guard.canActivate(route, state);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});