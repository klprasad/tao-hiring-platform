import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoScoreComponent } from './tao-score.component';

describe('TaoScoreComponent', () => {
  let fixture: ComponentFixture<TaoScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoScoreComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoScoreComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoScoreComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });
});
