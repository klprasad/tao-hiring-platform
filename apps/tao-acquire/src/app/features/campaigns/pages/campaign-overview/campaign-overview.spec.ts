import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CampaignOverview } from './campaign-overview';

describe('CampaignOverview', () => {
  let fixture: ComponentFixture<CampaignOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignOverview],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CampaignOverview);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(CampaignOverview);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
