import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidatesPage } from './candidates.page';

describe('CandidatesPage', () => {
  let fixture: ComponentFixture<CandidatesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CandidatesPage] }).compileComponents();
    fixture = TestBed.createComponent(CandidatesPage);
    fixture.detectChanges();
  });

  it('renders candidate activity content', () => {
    expect(fixture.nativeElement.textContent).toContain('Recent candidate activity');
    expect(fixture.nativeElement.textContent).toContain('Jordan Mitchell');
  });
});
