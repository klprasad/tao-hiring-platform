import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { JobProfileService } from '../../data-access/job-profile.service';
import { JobProfileListComponent } from './job-profile-list';

describe('JobProfileListComponent', () => {
  let fixture: ComponentFixture<JobProfileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobProfileListComponent],
      providers: [
        provideRouter([]),
        { provide: JobProfileService, useValue: { getJobProfiles: () => of([]) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(JobProfileListComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(JobProfileListComponent);
    expect(fixture.nativeElement.innerHTML).toContain('Job profiles');
  });
});