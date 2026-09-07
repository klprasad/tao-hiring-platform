import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DashboardPage] }).compileComponents();
    fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
  });

  it('renders the recruiter dashboard metrics', () => {
    expect(fixture.nativeElement.textContent).toContain('Open campaigns');
    expect(fixture.nativeElement.textContent).toContain('Candidates in review');
    expect(fixture.nativeElement.textContent).toContain('Active assessments');
  });
});
