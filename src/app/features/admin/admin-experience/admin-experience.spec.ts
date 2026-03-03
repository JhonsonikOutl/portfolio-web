import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExperience } from './admin-experience';

describe('AdminExperience', () => {
  let component: AdminExperience;
  let fixture: ComponentFixture<AdminExperience>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminExperience]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminExperience);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
