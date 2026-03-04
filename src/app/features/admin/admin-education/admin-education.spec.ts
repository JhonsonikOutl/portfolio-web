import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEducation } from './admin-education';

describe('AdminEducation', () => {
  let component: AdminEducation;
  let fixture: ComponentFixture<AdminEducation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEducation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEducation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
