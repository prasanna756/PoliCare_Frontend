import { TestBed } from '@angular/core/testing';

import { UserPoliciesService } from './user-policies.service';

describe('UserPolicyService', () => {
  let service: UserPoliciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPoliciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
