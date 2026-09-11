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
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'profile-1' } } },
        },
        {
          provide: JobProfileService,
          useValue: {
            getJobProfile: () =>
              of({
                value: {
                  id: 'profile-1',
                  campaignId: 'campaign-1',
                  originalJobDescription: 'A useful role description with enough detail.',
                  generatedContent: 'AI-generated job profile content.',
                  structuredProfile: '{"competencies":[],"qualifications":[]}',
                  status: 1,
                  generatedOn: '2026-09-01T00:00:00Z',
                },
                message: 'Job profile retrieved successfully',
              }),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(JobProfileEditComponent);
    fixture.detectChanges();
  });

  it('renders the review page after loading', () =>
    expect(fixture.nativeElement.innerHTML).toContain('Job profile'));
});
