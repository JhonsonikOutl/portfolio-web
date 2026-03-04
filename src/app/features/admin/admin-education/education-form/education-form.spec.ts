import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationForm } from './education-form';

describe('EducationForm', () => {
  let component: EducationForm;
  let fixture: ComponentFixture<EducationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
