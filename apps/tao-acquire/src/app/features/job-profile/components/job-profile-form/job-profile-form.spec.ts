import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobProfileVm } from '../../models/job-profile.vm';
import { JobProfileFormComponent } from './job-profile-form';

describe('JobProfileFormComponent', () => {
  let fixture: ComponentFixture<JobProfileFormComponent>;
  const profile: JobProfileVm = {
    id: 'profile-1',
    campaignId: 'campaign-1',
    originalJobDescription: 'A'.repeat(40),
    generatedContent: '',
    structuredProfile: '',
    status: 1,
    generatedOn: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobProfileFormComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(JobProfileFormComponent);
    fixture.detectChanges();
  });

  it('requires a valid description before emitting a create request', () => {
    const submitted = vi.fn();
    fixture.componentInstance.submitted.subscribe(submitted);
    fixture.componentInstance.submit();
    expect(submitted).not.toHaveBeenCalled();
    expect(fixture.componentInstance.showValidationErrors()).toBe(true);

    fixture.componentInstance.form.controls.description.setValue(`  ${'A'.repeat(30)}  `);
    fixture.componentInstance.submit();
    expect(submitted).toHaveBeenCalledWith({ description: 'A'.repeat(30) });
  });

  it('loads an existing description and emits a regenerate request', async () => {
    fixture.componentRef.setInput('profile', profile);
    await fixture.whenStable();
    expect(fixture.componentInstance.form.controls.description.value).toBe(
      profile.originalJobDescription,
    );

    const resubmitted = vi.fn();
    fixture.componentInstance.resubmitted.subscribe(resubmitted);
    fixture.componentInstance.submit();
    expect(resubmitted).toHaveBeenCalledWith({ id: 'profile-1', description: 'A'.repeat(40) });
  });

  it('emits cancellation', () => {
    const cancelled = vi.fn();
    fixture.componentInstance.cancelled.subscribe(cancelled);
    fixture.componentInstance.cancel();
    expect(cancelled).toHaveBeenCalledOnce();
  });
});
