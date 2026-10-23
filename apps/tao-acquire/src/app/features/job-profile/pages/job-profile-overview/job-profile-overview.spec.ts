import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { JobProfileOverview } from './job-profile-overview';

describe('JobProfileOverview', () => {
  let component: JobProfileOverview;
  let fixture: ComponentFixture<JobProfileOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobProfileOverview],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(JobProfileOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
