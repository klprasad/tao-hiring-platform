import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampaignsPage } from './campaigns.page';

describe('CampaignsPage', () => {
  let fixture: ComponentFixture<CampaignsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CampaignsPage] }).compileComponents();
    fixture = TestBed.createComponent(CampaignsPage);
    fixture.detectChanges();
  });

  it('renders campaign management content', () => {
    expect(fixture.nativeElement.textContent).toContain('All campaigns');
    expect(fixture.nativeElement.textContent).toContain('Senior Product Designer');
  });
});
