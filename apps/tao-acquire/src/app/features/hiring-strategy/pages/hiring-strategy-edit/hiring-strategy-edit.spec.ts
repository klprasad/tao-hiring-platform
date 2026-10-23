import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HiringStrategyEdit } from './hiring-strategy-edit';

describe('HiringStrategyEdit', () => {
  let component: HiringStrategyEdit;
  let fixture: ComponentFixture<HiringStrategyEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiringStrategyEdit],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HiringStrategyEdit);
    fixture.componentRef.setInput('profile', {
      id: 'strategy-1',
      campaignId: 'campaign-1',
      content: { value: '' },
      structuredContent: {
        value:
          '{"minimumExperienceYears":2,"recommendedResumeMatchThreshold":70,"requiredSkills":[],"preferredSkills":[],"recruiterGuidance":[]}',
      },
      status: 'Generated',
      providerName: '',
      modelName: '',
      organizationId: 'org-1',
      promptVersion: 1,
      createdOnUtc: '',
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
