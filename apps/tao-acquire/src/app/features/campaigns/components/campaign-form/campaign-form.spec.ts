import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CampaignService } from '../../data-access/campaign.service';
import { CampaignFormComponent } from './campaign-form';

describe('CampaignFormComponent', () => {
  let fixture: ComponentFixture<CampaignFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignFormComponent],
      providers: [{ provide: CampaignService, useValue: { getUsers: () => of([]) } }],
    }).compileComponents();
    fixture = TestBed.createComponent(CampaignFormComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(CampaignFormComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
