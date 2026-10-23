import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CampaignService } from '../../data-access/campaign.service';
import { ToasterService } from '@tao/ui';
import { CampaignCreateComponent } from './campaign-create';

describe('CampaignCreateComponent', () => {
  let fixture: ComponentFixture<CampaignCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignCreateComponent],
      providers: [
        provideRouter([]),
        {
          provide: CampaignService,
          useValue: { createCampaign: () => of('campaign-1'), getUsers: () => of([]) },
        },
        { provide: ToasterService, useValue: { success: vi.fn(), error: vi.fn() } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CampaignCreateComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(CampaignCreateComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
