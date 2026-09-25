import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { MatChipsModule } from '@angular/material/chips';
import {
  HiringStrategyDto,
  HiringStrategyStatus,
  JobProfileContent,
  JobProfileSkill,
} from '../../models/hiring-strategy.models';
import { TaoButtonComponent, TaoCardComponent } from '@tao/ui';
import { ActivatedRoute, Router } from '@angular/router';
import { HiringStrategyService } from '../../data-access/hiring-strategy.service';
import { catchError, EMPTY } from 'rxjs';
import { AuthStore } from '@tao/core';

@Component({
  selector: 'tao-hiring-strategy-edit',
  styleUrl: './hiring-strategy-edit.scss',
  templateUrl: './hiring-strategy-edit.html',
  imports: [MatChipsModule, TaoCardComponent, TaoButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HiringStrategyEdit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(HiringStrategyService);
  readonly authStore = inject(AuthStore);
  readonly status = HiringStrategyStatus;
  readonly isApproving = signal(false);
  readonly errorMessage = signal('');
  /**
   * Job profile received from the API.
   */
  readonly profile = input.required<HiringStrategyDto>();

  /**
   * Parses the structured JSON content once whenever
   * the profile input changes.
   */
  readonly profileContent = computed<JobProfileContent>(() => {
    const structuredContent = this.profile()?.structuredContent;

    return this.parseStructuredContent(structuredContent.value);
  });

  /**
   * Required skills.
   */
  readonly requiredSkills = computed(() => this.profileContent().requiredSkills ?? []);

  /**
   * Preferred skills.
   */
  readonly preferredSkills = computed(() => this.profileContent().preferredSkills ?? []);

  /**
   * Recruiter guidance.
   */
  readonly recruiterGuidance = computed(() => this.profileContent().recruiterGuidance ?? []);

  /**
   * Minimum experience formatted for display.
   */
  readonly experienceLabel = computed(() => {
    const years = this.profileContent().minimumExperienceYears;

    return `${years} ${years === 1 ? 'Year' : 'Years'}`;
  });

  /**
   * Resume match threshold formatted for display.
   */
  readonly resumeMatchLabel = computed(() => {
    return `${this.profileContent().recommendedResumeMatchThreshold}%`;
  });

  /**
   * Provider/model information.
   */
  readonly generatedByLabel = computed(() => {
    const profile = this.profile();

    if (!profile?.providerName && !profile?.modelName) {
      return '';
    }

    return [profile.providerName, profile.modelName].filter(Boolean).join(' • ');
  });

  /**
   * Parses the API's structuredContent JSON safely.
   *
   * Keeping parsing here prevents JSON.parse() from being
   * executed inside the template.
   */
  private parseStructuredContent(structuredContent: string | null | undefined): JobProfileContent {
    const defaultContent: JobProfileContent = {
      minimumExperienceYears: 0,
      recommendedResumeMatchThreshold: 0,
      requiredSkills: [],
      preferredSkills: [],
      recruiterGuidance: [],
    };

    if (!structuredContent?.trim()) {
      return defaultContent;
    }

    try {
      const parsed = JSON.parse(structuredContent);

      return {
        minimumExperienceYears: Number(parsed?.minimumExperienceYears) || 0,

        recommendedResumeMatchThreshold: Number(parsed?.recommendedResumeMatchThreshold) || 0,

        requiredSkills: this.normalizeSkills(parsed?.requiredSkills),

        preferredSkills: this.normalizeSkills(parsed?.preferredSkills),

        recruiterGuidance: this.normalizeGuidance(parsed?.recruiterGuidance),
      };
    } catch (error) {
      console.error('Failed to parse job profile structured content.', error);

      return defaultContent;
    }
  }

  /**
   * Normalizes skill objects returned by the API.
   */
  private normalizeSkills(value: unknown): JobProfileSkill[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(
        (skill): skill is { name: unknown } =>
          !!skill && typeof skill === 'object' && 'name' in skill,
      )
      .map((skill) => ({
        name: String(skill.name).trim(),
      }))
      .filter((skill) => skill.name.length > 0);
  }

  /**
   * Normalizes recruiter guidance.
   */
  private normalizeGuidance(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter((item) => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  approve(): void {
    const strategy = this.profile();
    const approvedByUserId = this.authStore.user()?.id;

    if (!strategy || this.isApproving()) {
      return;
    }

    if (!approvedByUserId) {
      this.errorMessage.set('You must be signed in to approve a hiring strategy.');
      return;
    }

    this.isApproving.set(true);
    this.errorMessage.set('');

    this.service
      .approveHiringStrategy(strategy.id, { approvedByUserId })
      .pipe(
        catchError(() => {
          this.errorMessage.set('The hiring strategy could not be approved. Please try again.');
          this.isApproving.set(false);
          this.router.navigate(['/campaigns', strategy.campaignId, 'resume-imports']);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.isApproving.set(false);
      });
  }

  cancel(): void {
    const campaignId = this.route.snapshot.paramMap.get('campaignId');
    this.router.navigate(campaignId ? ['/campaigns', campaignId] : ['/job-profiles']);
  }
}
