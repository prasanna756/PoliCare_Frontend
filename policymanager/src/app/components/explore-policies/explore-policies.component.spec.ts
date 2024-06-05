import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorePoliciesComponent } from './explore-policies.component';

describe('ExplorePoliciesComponent', () => {
  let component: ExplorePoliciesComponent;
  let fixture: ComponentFixture<ExplorePoliciesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExplorePoliciesComponent]
    });
    fixture = TestBed.createComponent(ExplorePoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
