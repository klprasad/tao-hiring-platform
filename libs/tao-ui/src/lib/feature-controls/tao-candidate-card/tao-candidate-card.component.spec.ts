import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoCandidateCardComponent } from './tao-candidate-card.component';

describe('TaoCandidateCardComponent', () => {
  let fixture: ComponentFixture<TaoCandidateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoCandidateCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TaoCandidateCardComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoCandidateCardComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
