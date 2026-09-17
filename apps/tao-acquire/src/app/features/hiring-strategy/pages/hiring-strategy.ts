import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { TaoButtonComponent, TaoPageHeaderComponent } from 'tao-ui';
import { AuthStore } from 'tao-core';
import { HiringStrategyService } from '../data-access/hiring-strategy.service';
import { HiringStrategyDto, HiringStrategyStatus } from '../models/hiring-strategy.models';
import { HiringStrategyEdit } from './hiring-strategy-edit/hiring-strategy-edit';

@Component({
  selector: 'tao-hiring-strategy',
  imports: [TaoButtonComponent, TaoPageHeaderComponent, HiringStrategyEdit],
  templateUrl: './hiring-strategy.html',
  styleUrl: './hiring-strategy.scss',
})
export class HiringStrategy implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(HiringStrategyService);
  private readonly authStore = inject(AuthStore);

  readonly strategy = signal<HiringStrategyDto | undefined>(undefined);
  readonly errorMessage = signal('');
  readonly isLoading = signal(false);

  /**
   * Campaign the hiring strategy belongs to.
   *
   * Comes from `/campaigns/:campaignId/hiring-strategy` (route param), or from
   * the `campaignId` query parameter when the page is opened standalone.
   */
  readonly campaignId = this.resolveCampaignId();

  ngOnInit(): void {
    if (this.campaignId) {
      this.loadStrategy();
    }
  }

  generate(): void {
    if (!this.campaignId) {
      this.errorMessage.set('A campaign is required to generate a hiring strategy.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.service
      .createHiringStrategy(this.campaignId)
      .pipe(
        catchError(() => {
          this.errorMessage.set('The hiring strategy could not be generated. Please try again.');
          this.isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        this.isLoading.set(false);
        this.strategy.set(response);
      });
  }

  private loadStrategy(): void {
    this.service
      .getHiringStrategy(this.campaignId)
      .pipe(
        catchError(() => {
          this.isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        this.strategy.set(response);
        this.isLoading.set(false);
      });
  }

  private resolveCampaignId(): string {
    return (
      this.route.snapshot.paramMap.get('campaignId') ??
      this.route.parent?.snapshot.paramMap.get('campaignId') ??
      this.route.snapshot.queryParamMap.get('campaignId') ??
      ''
    );
  }
}
