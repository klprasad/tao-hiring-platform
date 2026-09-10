import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CampaignProcessing } from './campaign-processing';

describe('CampaignProcessing', () => {
  let fixture: ComponentFixture<CampaignProcessing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignProcessing],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CampaignProcessing);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(CampaignProcessing);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
