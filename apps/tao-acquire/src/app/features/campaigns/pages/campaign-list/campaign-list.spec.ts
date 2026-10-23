import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CampaignService } from '../../data-access/campaign.service';
import { CampaignListComponent } from './campaign-list';

describe('CampaignListComponent', () => {
  let fixture: ComponentFixture<CampaignListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignListComponent],
      providers: [
        provideRouter([]),
        { provide: CampaignService, useValue: { getAllCampaigns: () => of([]) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CampaignListComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(CampaignListComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
