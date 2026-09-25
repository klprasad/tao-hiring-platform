import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { TaoPageHeaderComponent } from '@tao/ui';
import { AuthStore } from '@tao/core';
import { HiringStrategyService } from '../../data-access/hiring-strategy.service';
import { HiringStrategyEdit } from '../hiring-strategy-edit/hiring-strategy-edit';
import { HiringStrategyDto } from '../../models/hiring-strategy.models';

@Component({
  imports: [TaoPageHeaderComponent, HiringStrategyEdit],
  selector: 'tao-hiring-strategy-create',
  styleUrl: './hiring-strategy-create.scss',
  templateUrl: './hiring-strategy-create.html',
})
export class HiringStrategyCreate implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(HiringStrategyService);
  private readonly authStore = inject(AuthStore);

  readonly strategy = signal<HiringStrategyDto | undefined>(undefined);
  readonly errorMessage = signal('');

  /**
   * Campaign the hiring strategy belongs to.
   *
   * Comes from `/campaigns/:campaignId/hiring-strategy` (route param), or from
   * the `campaignId` query parameter when the page is opened standalone.
   */
  readonly campaignId = this.resolveCampaignId();

  ngOnInit(): void {
    this.generate();
  }

  generate(): void {
    if (!this.campaignId) {
      this.errorMessage.set('A campaign is required to generate a hiring strategy.');
      return;
    }

    this.errorMessage.set('');

    this.service
      .createHiringStrategy(this.campaignId)
      .pipe(
        catchError(() => {
          this.errorMessage.set('The hiring strategy could not be generated. Please try again.');
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        this.strategy.set(response);
        //this.router.navigate(['/campaigns', this.campaignId, 'hiring-strategy']);
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
