import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoConfidenceComponent } from './tao-confidence.component';

describe('TaoConfidenceComponent', () => {
  let fixture: ComponentFixture<TaoConfidenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoConfidenceComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoConfidenceComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoConfidenceComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
