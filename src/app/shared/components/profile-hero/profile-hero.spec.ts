import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHero } from './profile-hero';

describe('ProfileHero', () => {
  let component: ProfileHero;
  let fixture: ComponentFixture<ProfileHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileHero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
