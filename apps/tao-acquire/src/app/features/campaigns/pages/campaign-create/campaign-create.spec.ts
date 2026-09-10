import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CampaignCreateComponent } from './campaign-create';

describe('CampaignCreateComponent', () => {
  let fixture: ComponentFixture<CampaignCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignCreateComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CampaignCreateComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(CampaignCreateComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
