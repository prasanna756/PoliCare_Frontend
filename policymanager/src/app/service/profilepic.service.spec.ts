import { TestBed } from '@angular/core/testing';

import { ProfilepicService } from './profilepic.service';

describe('ProfilepicService', () => {
  let service: ProfilepicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilepicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
