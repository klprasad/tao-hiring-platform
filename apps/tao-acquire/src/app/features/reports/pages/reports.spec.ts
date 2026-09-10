import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Reports } from './reports';

describe('Reports', () => {
  let fixture: ComponentFixture<Reports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Reports] }).compileComponents();
    fixture = TestBed.createComponent(Reports);
    fixture.detectChanges();
  });

  it('renders campaign performance content', () => {
    expect(fixture.nativeElement.textContent).toContain('Campaign performance');
    expect(fixture.nativeElement.textContent).toContain('Offers accepted');
  });
});
