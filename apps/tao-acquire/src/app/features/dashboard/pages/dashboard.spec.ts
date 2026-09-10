import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Dashboard] }).compileComponents();
    fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
  });

  it('renders the recruiter dashboard metrics', () => {
    expect(fixture.nativeElement.textContent).toContain('Open campaigns');
    expect(fixture.nativeElement.textContent).toContain('Candidates in review');
    expect(fixture.nativeElement.textContent).toContain('Active assessments');
  });
});
