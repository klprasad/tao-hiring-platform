import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JobProfileService } from '../../data-access/job-profile.service';
import { JobProfileEditComponent } from './job-profile-edit';

describe('JobProfileEditComponent', () => {
  let fixture: ComponentFixture<JobProfileEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobProfileEditComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'profile-1' } } } },
        { provide: JobProfileService, useValue: { getJobProfile: () => of({
          id: 'profile-1', title: 'Engineer', department: 'engineering', location: 'Remote', employmentType: 'full-time', experienceLevel: 'senior', description: 'A useful role description with enough detail.', responsibilities: 'Build and improve the product experience.', requiredSkills: 'Angular', status: 'draft', updatedAt: '2026-09-01',
        }) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(JobProfileEditComponent);
    fixture.detectChanges();
  });

  it('renders the edit form after loading', () => expect(fixture.nativeElement.innerHTML).toContain('Edit job profile'));
});