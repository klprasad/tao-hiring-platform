import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Candidates } from './candidates';

describe('Candidates', () => {
  let fixture: ComponentFixture<Candidates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Candidates] }).compileComponents();
    fixture = TestBed.createComponent(Candidates);
    fixture.detectChanges();
  });

  it('renders candidate activity content', () => {
    expect(fixture.nativeElement.textContent).toContain('Recent candidate activity');
    expect(fixture.nativeElement.textContent).toContain('Jordan Mitchell');
  });
});
