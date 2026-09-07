import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsPage } from './reports.page';

describe('ReportsPage', () => {
  let fixture: ComponentFixture<ReportsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ReportsPage] }).compileComponents();
    fixture = TestBed.createComponent(ReportsPage);
    fixture.detectChanges();
  });

  it('renders campaign performance content', () => {
    expect(fixture.nativeElement.textContent).toContain('Campaign performance');
    expect(fixture.nativeElement.textContent).toContain('Offers accepted');
  });
});
