import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of } from 'rxjs';

import { TaoButtonComponent, TaoSelectComponent } from '@tao/ui';
import { JobProfileService } from '../../data-access/job-profile.service';
import { mapJobProfileDtoToVm } from '../../data-access/job-profile.mapper';
import { JobProfileTableComponent } from '../../components/job-profile-table/job-profile-table';
import { JobProfileStatus } from '../../models/job-profile.vm';

@Component({
  selector: 'tao-job-profile-list',
  imports: [FormsModule, MatIconModule, TaoButtonComponent, TaoSelectComponent, JobProfileTableComponent],
  templateUrl: './job-profile-list.html',
  styleUrl: './job-profile-list.scss',
})
export class JobProfileListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly service = inject(JobProfileService);

  readonly searchTerm = signal('');
  readonly selectedStatus = signal<JobProfileStatus | 'all'>('all');
  readonly profiles = signal([mapJobProfileDtoToVm({
    id: 'demo-1',
    title: 'Senior Angular Developer',
    department: 'engineering',
    location: 'Bengaluru',
    employmentType: 'full-time',
    experienceLevel: 'senior',
    description: 'Build thoughtful hiring workflows for technical teams.',
    responsibilities: 'Own frontend architecture and mentor engineers.',
    requiredSkills: 'Angular, TypeScript, accessibility',
    status: 'published',
    updatedAt: '2026-09-08',
  })]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly statusOptions = ['all', 'draft', 'published', 'archived'];

  readonly filteredProfiles = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();

    return this.profiles().filter((profile) => {
      const matchesSearch = !search || [profile.title, profile.department, profile.location]
        .some((value) => value.toLowerCase().includes(search));
      const matchesStatus = status === 'all' || profile.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.service.getJobProfiles().pipe(
      catchError(() => {
        this.errorMessage.set('Job profiles could not be loaded. Showing the available local data.');
        return of([]);
      }),
    ).subscribe((profiles) => {
      if (profiles.length > 0) {
        this.profiles.set(profiles.map(mapJobProfileDtoToVm));
      }
      this.isLoading.set(false);
    });
  }

  onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  createProfile(): void {
    this.router.navigate(['/job-profiles/create']);
  }

  editProfile(profile: { id: string }): void {
    this.router.navigate(['/job-profiles', profile.id, 'edit']);
  }
}