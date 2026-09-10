import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampaignFormComponent } from './campaign-form';

describe('CampaignFormComponent', () => {
  let fixture: ComponentFixture<CampaignFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CampaignFormComponent] }).compileComponents();
    fixture = TestBed.createComponent(CampaignFormComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(CampaignFormComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
