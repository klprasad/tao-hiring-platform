import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { JobProfileService } from '../../data-access/job-profile.service';
import { JobProfileCreateComponent } from './job-profile-create';

describe('JobProfileCreateComponent', () => {
  let fixture: ComponentFixture<JobProfileCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobProfileCreateComponent],
      providers: [provideRouter([]), { provide: JobProfileService, useValue: { createJobProfile: () => of({}) } }],
    }).compileComponents();
    fixture = TestBed.createComponent(JobProfileCreateComponent);
    fixture.detectChanges();
  });

  it('renders the create form', () => expect(fixture.nativeElement.innerHTML).toContain('Create job profile'));
});